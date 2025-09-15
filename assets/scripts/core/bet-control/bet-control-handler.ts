import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetControlStore } from "./bet-control-store";
const { injectable, inject } = inversify;

@injectable()
export class BetControlHandler extends gc.Bet.BetHandler {
    @inject(BetControlStore) protected betControlStore: BetControlStore;

    confirmBet() {
    }
}