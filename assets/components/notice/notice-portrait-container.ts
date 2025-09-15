import gc from "@sg/game-client-base";
import { _decorator } from "cc";
import { GameGuideUtils } from "db://shared-components/game/game-guide/scripts/utils/game-guide-utils";
import { NoticeContainer } from "db://shared-components/shared/common-components/notice/scripts/notice-container";
import Observer from "observer";
import { NoticePortraitCmp } from "./notice-portrait-cmp";

const { ccclass } = _decorator;

const { render } = Observer;

const { Auth } = gc;

@ccclass("NoticePortraitContainer")
export class NoticePortraitContainer extends NoticeContainer {
    noticeCmp: NoticePortraitCmp = null;

    private appType = 0;

    @render(Auth.AuthStore, (store) => store.system)
    storeAppType(appType: number) {
        this.appType = appType;
    }

    protected override async showNoticeComponent(notice: gc.Notices.Notice) {
        await GameGuideUtils.hideWebViewGuide();
        const node = this.createNode();
        this.noticeCmp = node.getComponent<NoticePortraitCmp>(NoticePortraitCmp);
        this.noticeCmp.setAppType(this.appType);
        this.noticeCmp.setData(notice);
    }
}
