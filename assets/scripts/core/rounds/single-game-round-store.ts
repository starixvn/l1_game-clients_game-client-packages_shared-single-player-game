import gc, { GameServiceMessage } from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { SingleGameRoundTimeStore } from "./single-game-round-time-store";
const { injectable, inject } = inversify;

@injectable()
export class SingleGameRoundStore {
    @inject(gc.RoundHistories.RoundHistoryStore) protected readonly roundHistoryStore: gc.RoundHistories.RoundHistoryStore;
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: SingleGameRoundTimeStore;
    @inject(gc.Settlements.SettlementStore) protected readonly settlementStore: gc.Settlements.SettlementStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.GameConfigs.GameConfigStore) protected readonly gameConfigStore: gc.GameConfigs.GameConfigStore;

    constructor() {
        mobx.makeAutoObservable(this);
    }

    roundId = 0;
    private _ownBets: GameServiceMessage.OwnBets = {};
    private _totalBets: GameServiceMessage.TotalBets = {};
    resultHash: GameServiceMessage.ResultHash = null;
    private _userBetPercentage: GameServiceMessage.UserBetPercentage = null;
    private _betPercentage: GameServiceMessage.UserBetPercentage = {};

    _clientRoundId = 0;

    set clientRoundId(roundId: number) {
        this._clientRoundId = roundId;
    }

    get clientRoundId() {
        const currentFinish = this.settlementStore.currentFinish;
        if (!currentFinish || this.historyRoundId >= currentFinish.roundId) {
            return this.historyRoundId;
        }
        return currentFinish.roundId;
    }

    get historyRoundId() {
        return this._clientRoundId;
    }

    get minBet() {
        return Math.max(this.gameConfigStore.minBet, this.mainPlayerStore.stakeLevel.minBet);
    }

    get maxBet() {
        return Math.min(this.gameConfigStore.maxBet, this.mainPlayerStore.stakeLevel.maxBet);
    }

    get roundOdds() {
        return {
            odds: this.gameConfigStore.odds,
            fractional: this.mainPlayerStore.fractionalOddsFormat,
        };
    }

    set totalBets(totalBets: GameServiceMessage.TotalBets) {
        this._totalBets = totalBets;
    }

    get totalBets() {
        return Object.keys(this._totalBets).reduce((total, betChoice) => {
            total[betChoice] = this._totalBets[betChoice] / this.mainPlayerStore.rate;
            return total;
        }, {});
    }

    get ownBets() {
        return this._ownBets;
    }

    set ownBets(ownBets: GameServiceMessage.OwnBets) {
        this._ownBets = ownBets;
    }

    set userBetPercentage(betPercent: GameServiceMessage.UserBetPercentage) {
        this._userBetPercentage = betPercent;
    }

    get userBetPercentage() {
        return this._userBetPercentage;
    }

    set betPercentage(betPercent: GameServiceMessage.BetPercentage) {
        this._betPercentage = betPercent;
    }

    get betPercentage() {
        return this._betPercentage;
    }

    get isResetHighlight(): boolean {
        return false;
    }

    get highLightAnim(): gc.Rounds.THighlightAnim {
        const isAnim = this.settlementStore.isFinishedShowResult;
        const settlementResult = this.roundHistoryStore?.getLastRound()?.settlementResult;

        return {
            isAnim,
            settlementResult,
        };
    }

    get highlightStatic(): gc.Rounds.THighlightStatic {
        return { settlementResult: null, result: null };
    }

    resetForNewRound() {
        this.ownBets = {};
        this._totalBets = {};
        this._userBetPercentage = null;
        this._betPercentage = {};
    }

    resetRoundStore() {
        this.resetForNewRound();
        this.resultHash = null;
    }
}
