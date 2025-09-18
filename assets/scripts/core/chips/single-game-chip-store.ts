import * as gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";

const { injectable, inject } = inversify;
const { makeAutoObservable } = mobx;

export type SingleGameOwnChip = gc.GameServiceMessage.OwnChip & { totalAmount: number };

@injectable()
export class SingleGameChipStore {
    // inject store
    constructor() {
        makeAutoObservable(this);
    }

    private _ownChip: SingleGameOwnChip = { betChoice: "", amount: 0, totalAmount: 0 };

    clearAllChips = null;

    get ownChip(): SingleGameOwnChip {
        return this._ownChip;
    }

    set ownChip(data: gc.GameServiceMessage.OwnChip) {
        this._ownChip = { ...data, totalAmount: this._ownChip.totalAmount || 0 };
    }

    canAddBet(betChoice: string): { canAdd: boolean; reason?: string } {
        if (!this._ownChip.betChoice || this._ownChip.totalAmount === 0) {
            return { canAdd: true };
        }
        
        if (this._ownChip.betChoice === betChoice) {
            return { canAdd: true };
        }
        
        return { 
            canAdd: false, 
            reason: `Already chosen "${this._ownChip.betChoice}". Please clear first.`
        };
    }

    addBet(betChoice: string, amount: number): { success: boolean; reason?: string } {
        const validation = this.canAddBet(betChoice);
        if (!validation.canAdd) {
            return { success: false, reason: validation.reason };
        }

        const currentTotal = this._ownChip.totalAmount || 0;
        const newTotal = currentTotal + amount;
        
        this._ownChip = { 
            betChoice, 
            amount,
            totalAmount: newTotal
        };

        return { success: true };
    }

    resetChips() {
        this._ownChip = { betChoice: "", amount: 0, totalAmount: 0 };
        this.clearAllChips = {};
    }
}
