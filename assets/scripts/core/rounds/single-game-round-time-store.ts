import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { SingleGameSetting } from "../game-configs/single-game-setting";
const { injectable, inject } = inversify;

export const SINGLE_GAME_ROUND_STATE = {
    START_GAME_LOOP: "startGameLoop",
    PLACING_BET: "placingBet",
    LOCKING_BET: "lockingBet",
    WAITING: "waiting",
    PLAYING_VIDEO: "playingVideo",
    SHOW_RESULT: "showResult",
    STOP_GAME_LOOP: "stopGameLoop",

    NONE: "none",
};

@injectable()
export class SingleGameRoundTimeStore {
    @inject(gc.GameConfigs.GameSetting) readonly gameSetting: SingleGameSetting;

    private _roundState = SINGLE_GAME_ROUND_STATE.NONE;
    private readonly _countdownTimer = 0;
    startNewRound = false;
    endRound = false;
    startPlacingBet = false;
    endPlacingBet = false;
    durationShowPromptMessage = 2;

    constructor() {
        mobx.makeAutoObservable(this);
        this.setDurationShowPromptMessage(this.gameSetting?.durationShowPromptMessage);
    }

    // temporary: remove this method after service is updated, do not return remainingTime
    resetRoundTime() {}

    setDurationShowPromptMessage(durationShowPromptMessage?: number) {
        durationShowPromptMessage && (this.durationShowPromptMessage = durationShowPromptMessage);
    }

    get roundState() {
        return this._roundState;
    }

    set roundState(value: string) {
        this._roundState = value;
    }

    // temporary: remove this method after service is updated, do not return remainingTime
    get countdownTimer() {
        return this._countdownTimer;
    }

    getCurrentRoundState() {
        return this.roundState;
    }

    // temporary: remove this method after service is updated, do not return remainingTime
    resetRoundTimeStore() {}

    // temporary: remove this method after service is updated, do not return remainingTime
    countdown() {}
}
