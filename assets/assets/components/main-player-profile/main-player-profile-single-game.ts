import { _decorator, Animation, Label, Node, Sprite } from "cc";
import gc from "@sg/game-client-base";
import Observer from "observer";
import MainPlayerProfile from "db://shared-components/game/main-player-profile/scripts/components/main-player-profile";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "db://shared-single-player-game/scripts/core/rounds/single-game-round-time-store";
import { AnimationUtils } from "db://shared-components/shared/utils/utils";

const { FormatUtils, Auth } = gc;
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export default class MainPlayerProfileSingleGame extends MainPlayerProfile {
    @property(Sprite)
    bgDollar: Sprite = null;

    @property(Node)
    nodeWinBalance: Node = null;

    @property(Label)
    labelWinBet: Label = null;

    private enableFreeBet = false;
    private scoin = 0;
    private settlementStatus: gc.GameServiceMessage.Status;
    private currentRoundState: string = SINGLE_GAME_ROUND_STATE.NONE;

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
        return (
            this.currentRoundState === SINGLE_GAME_ROUND_STATE.SHOW_RESULT &&
            this.settlementStatus?.win === true
        );
    }

    private async displayWinBalance() {
        if (!this.nodeWinBalance || !this.labelWinBet) {
            return;
        }

        const formattedBet = FormatUtils.truncateFixedDecimals(this.settlementStatus.bet, 2);
        this.labelWinBet.string = formattedBet.toString();
        
        this.nodeWinBalance.active = true;
        this.playWinBalanceAnimation();
        await AnimationUtils.delayTime(1.2);
        this.getBalance();
    }

    private playWinBalanceAnimation() {
        const animation = this.nodeWinBalance.getComponent(Animation);
        animation?.play();
    }

    @handle(Auth.AuthHandlers.GetBalance)
    getBalance() {}
}
