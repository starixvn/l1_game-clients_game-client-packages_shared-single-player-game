import { _decorator, Label, Node, Prefab, Sprite, SpriteFrame } from "cc";
import { BetDetailLogTable } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-table";
import gc from "@sg/game-client-base";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { observer, render } = Observer;
const { FormatUtils, Shared, Player } = gc;

interface TotalData {
    betAmount?: number;
    refund?: number;
}

interface BetLogsChoice {
    [key: string]: any[];
}

interface BetTotal {
    [key: string]: TotalData;
}

interface RoundBettingInfo extends gc.BetHistory.BetDetailModel {
    betLogsChoice: BetLogsChoice;
    total: BetTotal;
    playerRate: number;
    time: string;
    result: gc.BetHistory.DynamicObject<object>;
    settlementResult: gc.BetHistory.DynamicObject<boolean>;
    id: number;
}

@ccclass()
export class BalancedBetLogTable extends BetDetailLogTable {
    @property({ override: true, visible: false })
    refundChoices = "";

    @property(SpriteFrame)
    activeSpriteFrame: SpriteFrame = null;

    @property(SpriteFrame)
    inactiveSpriteFrame: SpriteFrame = null;

    @property(Node)
    nodeChoiceContainer: Node = null;

    @property(Label)
    lblStakeTotal: Label = null;

    @property(Label)
    lblRefundTotal: Label = null;

    protected defaultBetChoice = "big";
    private bodyItemPrefab: Prefab;
    private roundBettingInfo: RoundBettingInfo;

    private onClickBetChoice(event: Event, customEventData: string) {
        // Update button visuals
        this.nodeChoiceContainer.children.forEach((child) => {
            child.getComponent(Sprite).spriteFrame = this.inactiveSpriteFrame;
        });

        const activeNode = this.nodeChoiceContainer.getChildByName(`btn-${customEventData}`);
        activeNode.getComponent(Sprite).spriteFrame = this.activeSpriteFrame;

        // Load bet logs for selected choice
        this.loadBetLogsChoice(this.bodyItemPrefab, this.roundBettingInfo, customEventData);
    }

    override showBetDetail(bodyItemPrefab: Prefab, model: gc.BetHistory.BetDetailModel) {
        this.bodyItemPrefab = bodyItemPrefab;
        this.roundBettingInfo = model as RoundBettingInfo;
        this.loadBetLogsChoice(this.bodyItemPrefab, this.roundBettingInfo, this.defaultBetChoice);
    }

    private loadBetLogsChoice(bodyItemPrefab: Prefab, model: RoundBettingInfo, choice: string) {
        this.body.removeAllChildren();

        const { betLogsChoice, total, playerRate } = model;
        const choiceIndex = this.getChoiceData(choice);
        const betLogsChoiceData = betLogsChoice[choiceIndex] || [];

        // Update total labels with player rate
        this.updateTotalLabel(this.lblStakeTotal, total, choice, "betAmount", playerRate);
        this.updateTotalLabel(this.lblRefundTotal, total, choice, "refund", playerRate);

        // Create bet log rows
        betLogsChoiceData.forEach((betDetailsLog, index) => {
            this.body.addChild(
                this.buildBodyRow(bodyItemPrefab, {
                    betDetailsLog,
                    index,
                    odds: {},
                    settlementResult: {},
                    result: {},
                    freeBet: false,
                    fractionalOddsFormat: false,
                })
            );
        });
    }

    protected getChoiceData(choice: string): number {
        return 0; // Override in child class to map choice to index
    }

    private updateTotalLabel(label: Label, total: BetTotal, choice: string, field: keyof TotalData, playerRate: number) {
        if (!label) {
            return;
        }

        const choiceIndex = this.getChoiceData(choice);
        const totalData = total[choiceIndex];
        const value = totalData?.[field] || 0;

        // Convert value using player rate
        const displayValue = Shared.utils.NumberUtils.getValueByCurrency(value, playerRate);

        label.string = FormatUtils.numberWithCommas(displayValue, 2);
    }
}
