import gc from "@sg/game-client-base";

export type GameRoundBetDetailsLog = gc.BetHistory.DynamicObject<object> & {
    time: string;
    name: string;
    refund: number;
    amount: number;
    rate: number;
};

export interface BetRecord extends gc.BetHistory.DynamicObject<object> {
    refund: number;
    baseRefund: number;
    win: boolean;
    betwin: number;
    baseBetWin: number;
    totalWin: number;
    baseTotalWin: number;
    paid: boolean;
    uid: string;
    name: string;
    time: string;
    choice: string;
    amount: number;
    baseAmount: number;
    roundId: number;
    siteId: string;
    currency: string;
    rate: number;
    operatorId: string;
    playerId: string;
    [key: string]: any;
}
