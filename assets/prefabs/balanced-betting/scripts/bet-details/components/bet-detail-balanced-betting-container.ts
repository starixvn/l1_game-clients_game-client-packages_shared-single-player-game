import { _decorator, Node, Prefab } from "cc";
import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import Observer from "observer";

import { RoundBalancedBettingStore } from "../round-balanced-betting-store";
import { BetDetailBalancedBettingTable } from "./bet-detail-balanced-betting-table";

const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass
export class BetDetailBalancedBettingContainer extends NodeContainer {
    @property(Prefab)
    betDetailSummaryTablePrefab: Prefab = null;

    @property(Prefab)
    betDetailLogTablePrefab: Prefab = null;

    @property
    supportChoices = "big,small";

    @property(Prefab)
    logDetailItemPrefab: Prefab = null;

    wrapperNode: Node = null;
    table: BetDetailBalancedBettingTable = null;

    private betChoices: string[];

    protected onEnable(): void {
        this.generateOriginalChoices();
    }

    @render(RoundBalancedBettingStore, (store) => store.roundBettingInfo, { fireImmediately: false })
    renderRoundInfo(roundBettingInfo: any) {
        const { time, result, settlementResult, id, total, playerRate } = roundBettingInfo;
        const info = {
            betLogsChoice: [],
            total: [],
            time: time,
            result: result,
            settlementResult: settlementResult,
            id: id,
            playerRate: playerRate,
        };
        this.betChoices.forEach((choice) => {
            info.betLogsChoice.push(roundBettingInfo[choice]);
            info.total.push(total[choice]);
        });
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
            this.table = this.wrapperNode.getComponent(BetDetailBalancedBettingTable);
        }

        this.table.showBetDetail({
            roundBettingInfo: info,
            resultContentPrefab: null,
            betDetailSummaryPrefab: this.betDetailSummaryTablePrefab,
            betDetailLogTablePrefab: this.betDetailLogTablePrefab,
            logDetailItemPrefab: this.logDetailItemPrefab,
            model: null,
        });
    }

    generateOriginalChoices() {
        this.betChoices = this.supportChoices.split(",");
    }
}
