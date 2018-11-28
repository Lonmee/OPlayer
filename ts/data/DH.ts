import Dictionary = laya.utils.Dictionary;
import EventDispatcher = laya.events.EventDispatcher;
import Conf from "./Conf";
import CmdLine from "../mod/CmdLine";
import Story from "./sotry/Story";
import {IMgr} from "../mod/Mgr/Mgr";
import Preloader from "../mod/loader/Preloader";
import {DigitalDic, StringDic} from "../mod/Mgr/value/ODictionary";
import {IState} from "../mod/state/State";
import Reporter from "../mod/reporter/Reporter";

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
    reporter: Reporter;
    state: IState;

    static get instance(): DH {
        return this._instance ? this._instance : this._instance = new DH();
    }

    getResLink(key: string): string {
        //todo:resource link for local mode
        let md5 = this.resMap.get(key.replace(/\\/g, '/').toLowerCase()).md5;
        return Conf.domain.resCdn + md5.substring(0, 2) + "/" + md5;
    }

    replaceVTX(_str: string): string {
        let str: string = _str;
        //TODO:工具转义有错误,问问工具改还是不改，做了容错。
        let regV = /(\\|\/)[Vv]\[([0-9]+)]/;
        let regT = /(\\|\/)[Tt]\[([0-9]+)]/;
        let regX = /(\\|\/)[Xx]\[([0-9]+)]/;
        let reg_val = /(\d+)/;

        let regv_val: Array<any> = str.match(regV);
        let regt_val: Array<any> = str.match(regT);
        let regx_val: Array<any> = str.match(regX);
        let val: Array<any>;
        if (regv_val) {//替换所有数值
            val = regv_val[0].match(reg_val);
            if (val) {
                _str = _str.replace(regV, this.vDic.get(val[0] - 1));
            }
        } else if (regt_val) {//替换所有字符串
            val = regt_val[0].match(reg_val);
            if (val) {
                _str = _str.replace(regT, this.sDic.get(val[0] - 1));
            }
        } else if (regx_val) {//替换所有二周目
            val = regx_val[0].match(reg_val);
            _str = _str.replace(regX, this.exVDic.get(val[0] - 1));
        }
        if (str != _str) {
            str = this.replaceVTX(_str);
        }
        regV = null;
        regT = null;
        regX = null;
        reg_val = null;

        regv_val = null;
        regt_val = null;
        regx_val = null;
        return str;
    }

    get help() {
        return console.log(
            "conf.debug: boolean = [boolean] on //调试模式开关 ps.发布时关掉",
            "\ndh.cmdLine.reporter.showState = [boolean] on //状态机log",
            "\ndh.cmdLine.reporter.showProcess = [boolean] on //开关执行过程log",
            "\ndh.cmdLine.printCmdArr() //打印当前scene详情, 相关事件(206:跳转剧情 / 251:呼叫子剧情)",
            "\ndh.story.gotoChapter([chapterId]) //跟据剧情ID跳转到scene",
            "\ndh.cmdLine.state.switchState([number] state) //设置播放状态，0：正常、1：自动、2：快进",
            "\nshortcut:\"s\"//开关state面板; \"n\"//单步步进; \"z\"//快进",
            "\n@ OPlayer:26 new BinLoader([boolean] local?) //开启本地数据模式，文件置于oplayer/local，默认不开启"
        );
    }
};

/*
 * dispatchEvent(new CustomEvent(Conf.EVN_READY, {"detail": this.bufArr.length == 1}));
 * addEventListener(Conf.EVN_READY, this.init)
 */
