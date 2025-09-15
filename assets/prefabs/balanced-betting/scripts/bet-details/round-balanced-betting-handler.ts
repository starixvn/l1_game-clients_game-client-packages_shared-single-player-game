import gc from "@sg/game-client-base";
import inversify from "inversify";
import { GameClientEmitMessage, GameServiceMessage } from "../game-message";
import { RoundBalancedBettingStore } from "./round-balanced-betting-store";
const { injectable, inject } = inversify;

@injectable()
export class RoundBalancedBettingHandler implements gc.Shared.IMultipleHandlers {
    @inject(RoundBalancedBettingStore) protected readonly roundBettingStore: RoundBalancedBettingStore;
    @inject(gc.Connection.ConnectionStore)
    protected readonly connectionStore: gc.Connection.ConnectionStore;
    handleBetLogs(data: any) {
        this.roundBettingStore.roundBettingInfo = data;
    }

    handle(roundId: number) {
        this.roundBettingStore.roundId = roundId;
        this.connectionStore.send(GameClientEmitMessage.RoundBetDetails.eventName, { roundId });
    }

    eventHandleList = [
        {
            name: GameServiceMessage.RoundBetDetails.eventName,
            handle: this.handleBetLogs,
        },
    ];
}
