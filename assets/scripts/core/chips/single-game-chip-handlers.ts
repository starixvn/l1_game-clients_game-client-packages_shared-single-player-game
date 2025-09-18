import gc, { GameServiceMessage } from "@sg/game-client-base";
import inversify from "inversify";
import { SingleGameChipStore } from "./single-game-chip-store";

const { injectable, inject } = inversify;

@injectable()
export class SingleGameChipHandlers implements gc.Shared.IHandler<GameServiceMessage.OwnChip> {
    constructor() {}
    @inject(SingleGameChipStore) protected readonly singleGameChipStore: SingleGameChipStore;
    @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore;

    handle(ownChip: GameServiceMessage.OwnChip): boolean {
        const result = this.singleGameChipStore.addBet(ownChip.betChoice, ownChip.amount);
        
        if (!result.success) {
            this.showBetRejectedNotice(result.reason || "");
            return false;
        }
        
        return true;
    }

    private showBetRejectedNotice(reason: string) {
        this.noticeStore.warning = {
            message: reason
        };
    }

    handleClearAllChips() {
        this.singleGameChipStore.resetChips();
    }
}
