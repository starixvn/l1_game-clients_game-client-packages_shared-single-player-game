import gc from "@sg/game-client-base";
import { _decorator, Node, tween, v3 } from "cc";
import BetItem from "db://shared-components/game/bets/scripts/components/bet-item";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { values } from "lodash-es";
import Observer from "observer";
import { BalancedPoolBetItem } from "./balanced-pool-bet-item";
const { ccclass, property } = _decorator;
const { observer, render } = Observer;

@ccclass
export class BalancedBetting extends ObserverComponent {
    @property(Node)
    noticeBalancedBetting: Node = null;

    @property(Node)
    nodeBetItems: Node = null;

    private totalBets: { [choice: string]: number };
    private readonly betItems: BetItem[] = [];

    onLoad() {
        super.onLoad();
        this.noticeBalancedBetting.scale = v3(0, 0, 0);
        this.nodeBetItems?.children.forEach((choice) => {
            this.betItems.push(choice.getComponent(BetItem));
        });
    }

    showNotice() {
        this.noticeBalancedBetting.scale = v3(2, 2, 2);
        tween(this.noticeBalancedBetting)
            .to(0.3, { scale: v3(1, 1, 1) }, { easing: "sineOut" })
            .start();
        this.balanceBet(true);
    }

    hideNotice() {
        tween(this.noticeBalancedBetting)
            .to(0.3, { scale: v3(0, 0, 0) }, { easing: "sineOut" })
            .start();
    }

    @render(gc.Rounds.RoundStore, (store) => store.totalBets)
    assignTotalBets(totalBets: gc.GameServiceMessage.TotalBets) {
        this.totalBets = totalBets;
    }

    balanceBet(hasAnimation = true) {
        this.assignTotalBets(this.totalBets);
        const totalBets = values(this.totalBets);
        const balancedBetAmount = Math.min(...[totalBets[0] ?? 0, totalBets[1] ?? 0]);
        this.betItems.forEach((item) => (item as BalancedPoolBetItem).balanceBet(balancedBetAmount, hasAnimation));
    }
}
