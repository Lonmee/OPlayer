import Dictionary = laya.utils.Dictionary;
import Conf from "./Conf";
import {ViewMgr} from "../mod/ViewMgr";
import CmdLine from "../mod/CmdLine";
import EventDispatcher = laya.events.EventDispatcher;
import Story from "./sotry/Story";
import UIFac from "../mod/view/ui/UIFac";
/**
 * Created by ShanFeng on 4/24/2017.
 * means DataHolder
 */
export interface IBinloader {
    loadChapter(id: number);
}

export default class DH {
    private static _instance: DH;
    eventPoxy: EventDispatcher = new EventDispatcher();
    resMap: Dictionary = new Dictionary();
    binLoader: IBinloader;
    story: Story;
    cmdLine: CmdLine;

    static get instance(): DH {
        return this._instance ? this._instance : this._instance = new DH();
    }

    getResLink(key: string): string {
        let md5 = this.resMap.get(key.replace(/\\/g, '/')).md5;
        return Conf.domain.resCdn + md5.substring(0, 2) + "/" + md5;
    }
}

/*
 * dispatchEvent(new CustomEvent(Conf.EVN_READY, {"detail": this.bufArr.length == 1}));
 * addEventListener(Conf.EVN_READY, this.init)
 */
