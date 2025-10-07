import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
import { SingleGameRoundStore } from "../rounds/single-game-round-store";

const { injectable, inject } = inversify;
const { makeAutoObservable } = mobx;

export type SingleGameOwnChip = gc.GameServiceMessage.OwnChip & { totalAmount: number };

@injectable()
export class SingleGameChipStore {
    @inject(SingleGameRoundStore) protected readonly roundStore: SingleGameRoundStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;

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

    private isBetChoiceValid(betChoice: string): { isValid: boolean; reason?: string } {
        if (!this._ownChip.betChoice || this._ownChip.totalAmount === 0) {
            return { isValid: true };
        }
        if (this._ownChip.betChoice === betChoice) {
            return { isValid: true };
        }
        return { 
            isValid: false, 
            reason: gc.Translator.gameTranslate(`message_chosen_bet`, { betChoice: gc.Translator.gameTranslate(`glossary_${this._ownChip.betChoice}`) })
        };
    }

    private calculateNewTotal(amount: number): number {
        return (this._ownChip.totalAmount || 0) + amount;
    }

    private isExceedingMaxBet(newTotal: number): boolean {
        const maxBet = this.roundStore?.maxBet;
        return maxBet && newTotal > maxBet;
    }

    private getMaxBetExceededReason(): string {
        const maxBet = this.roundStore?.maxBet;
        return gc.Translator.commonTranslate(`message_round_maxbet`, { 
            maxBet: gc.FormatUtils.numberWithCommas(maxBet) 
        });
    }

    private isInsufficientBalance(newTotal: number): boolean {
        const currentBalance = this.mainPlayerStore?.balance || 0;
        return newTotal > currentBalance;
    }

    private getInsufficientBalanceReason(): string {
        return gc.Translator.commonTranslate(`not_enough_money`);
    }

    addBet(betChoice: string, amount: number): { success: boolean; reason?: string } {
        const validation = this.isBetChoiceValid(betChoice);
        if (!validation.isValid) {
            return { success: false, reason: validation.reason };
        }

        const newTotal = this.calculateNewTotal(amount);
        if (this.isExceedingMaxBet(newTotal)) {
            return { success: false, reason: this.getMaxBetExceededReason() };
        }

        if (this.isInsufficientBalance(newTotal)) {
            return { success: false, reason: this.getInsufficientBalanceReason() };
        }

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
