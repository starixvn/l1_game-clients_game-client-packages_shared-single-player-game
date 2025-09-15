import { _decorator, instantiate } from "cc";
import { BetDetailTable, BetDetailTableType } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-table";

import { BetDetailBalancedBettingSummary } from "./bet-detail-balanced-betting-summary";
import { BalancedBetLogTable } from "./balanced-bet-log-table";

const { ccclass, property } = _decorator;

export interface BetDetailBalancedBettingType extends BetDetailTableType {
    roundBettingInfo: any;
}

@ccclass
export class BetDetailBalancedBettingTable extends BetDetailTable {
    showBetDetail(data: BetDetailBalancedBettingType) {
        this.clearBetDetail();

        const { roundBettingInfo, betDetailSummaryPrefab, logDetailItemPrefab, betDetailLogTablePrefab } = data;
        const betDetailLogTable = instantiate(betDetailLogTablePrefab);
        const logTableComponent = betDetailLogTable.getComponent(BalancedBetLogTable);

        logTableComponent?.showBetDetail(logDetailItemPrefab, roundBettingInfo);
        this.nodeBetDetailLogTablePrefab.addChild(betDetailLogTable);

        const betDetailSummaryTable = instantiate(betDetailSummaryPrefab);
        betDetailSummaryTable?.getComponent(BetDetailBalancedBettingSummary).renderResult(roundBettingInfo);
        this.nodeBetDetailSummaryTable?.addChild(betDetailSummaryTable);
    }

    clearBetDetail() {
        this.nodeBetDetailLogTablePrefab.removeAllChildren();
        this.nodeBetDetailSummaryTable?.removeAllChildren();
    }
}
