import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

export type DynamicObject<T> = {
    [key: string]: T;
};

export type RoundBettingInfo = {
    time: string;
    result: DynamicObject<object>;
    settlementResult: DynamicObject<boolean>;
    id: number;
    betLogsChoice: Array<DynamicObject<object>>;
    total: Array<DynamicObject<object>>;
};

@injectable()
export class RoundBalancedBettingStore {
    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _roundBettingInfo = null;
    private _roundId = 0;

    set roundBettingInfo(roundBettingInfo: any) {
        this._roundBettingInfo = roundBettingInfo;
    }

    get roundBettingInfo() {
        return this._roundBettingInfo;
    }

    set roundId(roundId: number) {
        this._roundId = roundId;
    }

    get roundId() {
        return this._roundId;
    }
}
