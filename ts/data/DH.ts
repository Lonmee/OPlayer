import Dictionary = laya.utils.Dictionary;
import Conf from "./Conf";
import CmdLine from "../mod/CmdLine";
import Story from "./sotry/Story";
import {IMgr} from "../mod/Mgr/Mgr";
import Preloader from "../mod/loader/Preloader";
import {DigitalDic, StringDic} from "../mod/Mgr/value/ODictionary";
import Reportor from "../mod/reportor/Reportor";
import EventDispatcher = laya.events.EventDispatcher;
import {IState} from "../mod/state/State";
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
    preloader: Preloader;
    //region 运行时共享数据组
    imgDic: laya.utils.Dictionary;
    vDic: DigitalDic;
    sDic: StringDic;
    exVDic: DigitalDic;
    //endregion
    reportor: Reportor;
    state: IState;

    static get instance(): DH {
        return this._instance ? this._instance : this._instance = new DH();
    }

    getResLink(key: string): string {
        //todo:resource link for local mode
        let md5 = this.resMap.get(key.replace(/\\/g, '/').toLowerCase()).md5;
        return Conf.domain.resCdn + md5.substring(0, 2) + "/" + md5;
    }

    get help() {
        return console.log(
            "@ DH:58 static debug: boolean = [boolean] on //调试模式开关 ps.发布时关掉",
            "\ndh.cmdLine.showCode = [boolean] on //开关命令码log",
            "\ndh.cmdLine.showProcess = [boolean] on //开关执行过程log",
            "\ndh.cmdLine.chapter.printSceneArr() //打印当前scene详情",
            "\ndh.cmdLine.switchState([number] state) //设置播放状态，0：正常、1：自动、2：快进",
            "\nshortcut:\"s\"//开关state面板; \"n\"//单步步进; \"z\"//快进",
            "\n@ OPlayer:26 new BinLoader([boolean] local?) //开启本地数据模式，文件置于oplayer/local，默认不开启"
        );
    }
};

/*
 * dispatchEvent(new CustomEvent(Conf.EVN_READY, {"detail": this.bufArr.length == 1}));
 * addEventListener(Conf.EVN_READY, this.init)
 */
