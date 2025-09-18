import gc from "@sg/game-client-base";

import inversify from "inversify";
import { SingleGameChipHandlers, SingleGameChipStore } from "../chips";

const { injectable, inject } = inversify;

@injectable()
export class SingleGameBetHandler extends gc.Bet.BetHandler {
    @inject(gc.Bet.BetStore) protected readonly betStore: gc.Bet.BetStore;
    @inject(SingleGameChipStore) protected readonly chipStore: SingleGameChipStore;
    @inject(SingleGameChipHandlers) protected readonly singleGameChipHandlers: SingleGameChipHandlers;

    // override add chip on single game chip store
    handle(betChoice: string) {
        const betData = this.createBetData({ betChoice });
        this.handleBetData(betData);
    }

    // write logic current single game bet handler
    // check min or max bet per round
    override isValidBet(amount: number) {
        return true;
    }

    override handleBetData(data: any) {
        const amount = data.amount;
        if (this.isValidBet(amount)) {
            this.singleGameChipHandlers.handle({ betChoice: data.betChoice, amount: data.amount });
        }
    }

    handleStartBet() {
        this.betStore.isProcessingBet = true;
        const { betChoice, totalAmount } = this.chipStore.ownChip
        const data = { betChoice, amount: totalAmount, redTunnel: 1, blueTunnel: 6 };
        this.connectionStore.send(gc.GameClientEmitMessage.Bet.eventName, data);
        this.retryGameHandler.handle();
    }
}
