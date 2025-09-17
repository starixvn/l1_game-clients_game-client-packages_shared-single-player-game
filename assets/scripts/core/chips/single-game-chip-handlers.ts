import gc, { GameServiceMessage } from "@sg/game-client-base";
import inversify from "inversify";
import { SingleGameChipStore } from "./single-game-chip-store";

const { injectable, inject } = inversify;

@injectable()
export class SingleGameChipHandlers implements gc.Shared.IHandler<GameServiceMessage.OwnChip> {
    constructor() {}
    @inject(SingleGameChipStore) protected readonly store: SingleGameChipStore;

    handle(ownChip: GameServiceMessage.OwnChip) {
        this.store.ownChip = ownChip;
    }

    handleClearAllChips() {
        this.store.resetChips();
    }
}
