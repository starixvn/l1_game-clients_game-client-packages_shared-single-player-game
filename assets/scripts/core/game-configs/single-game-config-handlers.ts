import gc from "@sg/game-client-base";
import inversify from "inversify";
import { SINGLE_GAME_ROUND_STATE, SingleGameRoundTimeStore } from "../rounds/single-game-round-time-store";

const { injectable, inject } = inversify;

@injectable()
export class SingleGameConfigHandlers implements gc.Shared.IMultipleHandlers {
    @inject(SingleGameRoundTimeStore) protected readonly store: SingleGameRoundTimeStore;

    handleGameConfigs(gameConfigs: gc.GameServiceMessage.GameConfigs) {
        if (gameConfigs) {
            this.store.roundState = SINGLE_GAME_ROUND_STATE.PLACING_BET;
        }
    }

    eventHandleList = [
        {
            name: gc.GameServiceMessage.GameConfigs.eventName,
            handle: this.handleGameConfigs,
        },
    ];
}
