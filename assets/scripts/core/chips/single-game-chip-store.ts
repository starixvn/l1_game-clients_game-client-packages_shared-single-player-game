import * as gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;
const { makeAutoObservable } = mobx;

interface MainPlayerChips {
    [choiceName: string]: gc.Chips.IChipGroup;
}

@injectable()
export class SingleGameChipStore {
    // inject store
    constructor() {
        makeAutoObservable(this);
    }

    private _ownChip: gc.GameServiceMessage.OwnChip = { betChoice: "", amount: 0 };

    clearAllChips = null;

    get ownChip() {
        return this._ownChip;
    }

    set ownChip(data: gc.GameServiceMessage.OwnChip) {
        this._ownChip = data;
    }

    resetChips() {
        this.ownChip = { betChoice: "", amount: 0 };
        this.clearAllChips = {};
    }
}
