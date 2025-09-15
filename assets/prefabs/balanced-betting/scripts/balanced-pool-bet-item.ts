import { _decorator } from "cc";
import gc from "@sg/game-client-base";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { AnimationUtils } from "db://shared-components/shared/utils";

const { ccclass, property } = _decorator;

@ccclass
export class BalancedPoolBetItem extends BetItem {
    private readonly DURATION_BALANCED_BET = 1.5;

    public balanceBet(bet: number, hasAnimation = true) {
        if (this.lblTotalBet.string === "") {
            return;
        }

        if (hasAnimation) {
            AnimationUtils.floatToNumber({ label: this.lblTotalBet, amount: bet, duration: this.DURATION_BALANCED_BET });
        } else {
            this.lblTotalBet.string = gc.FormatUtils.numberWithCommas(bet, 2);
        }
    }
}
