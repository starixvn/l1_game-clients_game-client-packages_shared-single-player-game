import gc from "@sg/game-client-base";
import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;
const { makeAutoObservable } = mobx;
@injectable()
export class BetControlStore {
    @inject(gc.Notices.NoticeStore) protected readonly noticeStore: gc.Notices.NoticeStore;

    constructor() {
        makeAutoObservable(this);
    }
}