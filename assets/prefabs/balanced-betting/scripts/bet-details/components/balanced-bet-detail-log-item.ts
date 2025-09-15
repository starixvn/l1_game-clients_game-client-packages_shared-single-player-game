import gc from "@sg/game-client-base";
import { _decorator, Label, Node } from "cc";
import { BetDetailLogItemType } from "db://shared-components/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";
import Observer from "observer";
import { BetRecord } from "../types/balanced-betting.types";
import { shortenName } from "../../../../../../shared-components/assets/shared/utils/utils";
import { BaseBetDetailLogItem } from "../../../../../../shared-components/assets/game/bet-history/scripts/components/bet-detail/bet-detail-log-item";
const { ccclass, property } = _decorator;
const { render } = Observer;
const { DateTimeUtils, Player, FormatUtils, Shared } = gc;

@ccclass()
export class BalancedBetDetailLogItem extends BaseBetDetailLogItem {
    @property({ type: Label, override: true, visible: false })
    lblWin: Label = null;

    @property(Label)
    lblUser: Label = null;

    @property(Label)
    lblStake: Label = null;

    @property(Label)
    lblRefund: Label = null;

    @property(Node)
    nodeHighlight: Node = null;

    private betLog: BetRecord;
    private mainPlayerRate = 1;
    private mainPlayerName = "";

    @render(Player.MainPlayerStore, (store) => store.rate)
    private updateMainPlayerRate(rate: number) {
        this.mainPlayerRate = rate;
        this.convertCurrencyValues();
    }

    @render(Player.MainPlayerStore, (store) => store.name)
    private checkMainPlayer(mainPlayerName: string) {
        this.mainPlayerName = mainPlayerName;
        this.updateMainPlayerInfo();
    }

    override setData(data: BetDetailLogItemType) {
        const { betDetailsLog, index } = data;
        const { time } = betDetailsLog;

        this.betLog = betDetailsLog as BetRecord;

        this.nodeBackground.active = +index % 2 > 0;

        this.lblTime && (this.lblTime.string = DateTimeUtils.getStringHourByTime(`${time}`));

        this.updateMainPlayerInfo();
        this.convertCurrencyValues();
    }

    private updateMainPlayerInfo() {
        if (!this.betLog) {
            return;
        }

        const { name } = this.betLog;
        const isLoginUser = name === this.mainPlayerName;

        this.nodeHighlight.active = isLoginUser;
        this.lblUser && (this.lblUser.string = isLoginUser ? this.mainPlayerName : shortenName(name));
    }

    private convertCurrencyValues() {
        if (!this.betLog) {
            return;
        }

        const { refund, rate, amount } = this.betLog;

        const convertRefund = Shared.utils.NumberUtils.getValueByCurrency(refund, this.mainPlayerRate, rate);
        this.lblRefund && (this.lblRefund.string = FormatUtils.numberWithCommas(convertRefund, 2));

        const convertStake = Shared.utils.NumberUtils.getValueByCurrency(amount, this.mainPlayerRate, rate);
        this.lblStake && (this.lblStake.string = FormatUtils.numberWithCommas(convertStake, 2));
    }
}
