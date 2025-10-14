import { _decorator, Sprite } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import MainPlayerProfile from "db://shared-components/game/main-player-profile/scripts/components/main-player-profile";
import {
    SINGLE_GAME_ROUND_STATE,
    SingleGameRoundTimeStore,
} from "db://shared-single-player-game/scripts/core/rounds/single-game-round-time-store";
import { BalanceEffectHandlers } from "db://shared-components/game/balance-effect/scripts/handlers/balance-effect-handlers";

const { Auth } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class MainPlayerProfileSingleGame extends MainPlayerProfile {
    @property(Sprite)
    bgDollar: Sprite = null;

    private enableFreeBet = false;
    private scoin = 0;
    private settlementStatus: gc.GameServiceMessage.Status;
    private currentRoundState: string = SINGLE_GAME_ROUND_STATE.NONE;
    private cachedBalance = 0;

    activeUserScoinWallet(enableFreeBet: boolean) {
        super.activeUserScoinWallet(enableFreeBet);
        this.enableFreeBet = enableFreeBet;
        this.updateScoinWalletVisibility();
    }

    setScoin(scoin: number) {
        this.scoin = scoin;
        super.setScoin(scoin);
        this.updateScoinWalletVisibility();
    }

    @render(gc.Settlements.SettlementStatusStore, (store) => store.settlementStatus, { fireImmediately: false })
    handleSettlementStatus(settlementStatus: gc.GameServiceMessage.Status) {
        this.settlementStatus = settlementStatus;
        this.updateWinBalanceDisplay();
    }

    @render(SingleGameRoundTimeStore, (store) => store.roundState)
    handleRoundStateChange(roundState: string) {
        this.currentRoundState = roundState;
        this.updateWinBalanceDisplay();
    }

    @render(gc.Player.MainPlayerStore, (store) => store.balance)
    setBalance(value: number) {
        if (this.currentRoundState === SINGLE_GAME_ROUND_STATE.PLAYING_VIDEO) {
            this.cachedBalance = value;
            return;
        }
        super.setBalance(value);
    }

    private updateScoinWalletVisibility() {
        const shouldShow = this.shouldShowScoinWallet();
        this.userScoinWallet.active = shouldShow;
        this.bgDollar.enabled = shouldShow;
    }

    private shouldShowScoinWallet(): boolean {
        return this.scoin > 0 && this.enableFreeBet;
    }

    private updateWinBalanceDisplay() {
        if (this.shouldShowWinBalance()) {
            this.displayWinBalance();
        }
    }

    private shouldShowWinBalance(): boolean {
        return this.currentRoundState === SINGLE_GAME_ROUND_STATE.SHOW_RESULT && this.settlementStatus?.win === true;
    }

    private async displayWinBalance() {
        this.mainPlayerIncreaseBalance(this.settlementStatus.bet);
        this.getBalance();
        this.renderCachedBalance();
    }

    @handle(BalanceEffectHandlers.MainPlayerIncreaseBalance)
    mainPlayerIncreaseBalance(balance: number) {
        return balance;
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}

    renderCachedBalance() {
        if (this.cachedBalance !== 0) {
            const balance = this.cachedBalance;

            this.cachedBalance = 0;
            this.setBalance(balance);
        }
    }
}
