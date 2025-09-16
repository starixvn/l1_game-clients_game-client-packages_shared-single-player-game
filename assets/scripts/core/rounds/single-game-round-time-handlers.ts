import gc from "@sg/game-client-base";
import inversify from "inversify";
import { SingleGameRoundTimeStore } from "./single-game-round-time-store";

const { injectable, inject } = inversify;

@injectable()
export class SingleGameRoundTimeHandlers implements gc.Shared.IHandler<string> {
    constructor() {}
    @inject(SingleGameRoundTimeStore) protected readonly store: SingleGameRoundTimeStore;

    handle(state: string) {
        this.store.roundState = state;
    }
}
