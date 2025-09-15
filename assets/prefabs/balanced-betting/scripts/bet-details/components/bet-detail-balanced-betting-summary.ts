import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import Observer from "observer";

import { RoundBalancedBettingHandler } from "../round-balanced-betting-handler";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;
const { handle } = Observer;
const { DateTimeUtils } = gc;

@ccclass
export class BetDetailBalancedBettingSummary extends ObserverComponent {
    @property(Label)
    lblRound: Label = null;

    @property(Label)
    lblDate: Label = null;

    private roundId: number;

    renderResult(roundBettingInfo) {
        if (!roundBettingInfo) {
            return;
        }
        const { id, time } = roundBettingInfo;

        this.roundId = id;
        this.lblRound.string = id;
        this.lblDate && (this.lblDate.string = DateTimeUtils.getStringDateByTime(time));
    }

    @handle(RoundBalancedBettingHandler)
    handleNextRound(roundId: number) {
        return roundId;
    }

    onClickNextRound(event: Event) {
        this.roundId++;
        this.handleNextRound(this.roundId);
    }

    onClickPreviousRound(event: Event) {
        this.roundId--;
        this.handleNextRound(this.roundId);
    }
}
