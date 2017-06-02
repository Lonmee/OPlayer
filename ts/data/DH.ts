import Dictionary = laya.utils.Dictionary;
import Conf from "./Conf";
import {ViewMgr} from "../mod/view/Mgr/ViewMgr";
import CmdLine from "../mod/CmdLine";
import EventDispatcher = laya.events.EventDispatcher;
import Story from "./sotry/Story";
import UIFac from "../mod/view/ui/UIFac";
import {IMgr} from "../mod/view/Mgr/Mgr";
import AssMgr from "../mod/view/Mgr/AssMgr";
import ValueMgr from "../mod/view/Mgr/ValueMgr";
import AudioMgr from "../mod/view/Mgr/AudioMgr";
import VideoMgr from "../mod/view/Mgr/VideoMgr";
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
    mgrArr: IMgr[];

    static get instance(): DH {
        return this._instance ? this._instance : this._instance = new DH();
    }

    getResLink(key: string): string {
        //todo:resource link for local mode
        let md5 = this.resMap.get(key.replace(/\\/g, '/').toLowerCase()).md5;
        return Conf.domain.resCdn + md5.substring(0, 2) + "/" + md5;
    }
}

/*
 * dispatchEvent(new CustomEvent(Conf.EVN_READY, {"detail": this.bufArr.length == 1}));
 * addEventListener(Conf.EVN_READY, this.init)
 */
