import gc from "@sg/game-client-base";

import inversify from "inversify";
import { SingleGameChipHandlers, SingleGameChipStore } from "../chips";

const { injectable, inject } = inversify;

@injectable()
export class SingleGameBetHandler extends gc.Bet.BetHandler {
    @inject(gc.Bet.BetStore) protected readonly betStore: gc.Bet.BetStore;
    @inject(SingleGameChipStore) protected readonly chipStore: SingleGameChipStore;
    @inject(SingleGameChipHandlers) protected readonly singleGameChipHandlers: SingleGameChipHandlers;

    handle(betChoice: string) {
        const betData = this.createBetData({ betChoice });
        this.handleBetData(betData);

        // TODO: override add chip on single game chip store
    }

    override isValidBet(amount: number) {
        // TODO: write logic current single game bet handler
        // TODO: check min
        return true;
    }

    override handleBetData(data: any) {
        console.log("handleBetData", data);
        const amount = data.amount;
        if (this.isValidBet(amount)) {
            this.singleGameChipHandlers.handle({ betChoice: data.betChoice, amount: data.amount });
        }
    }

    handleStartBet() {
        // TODO: override send data to server after click start
        // this.connectionStore.send(GameClientEmitMessage.Bet.eventName, data);
        //this.retryGameHandler.handleClearAllChips();
    }
}
