import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./Mgr/ValueMgr";
import VideoMgr from "./Mgr/VideoMgr";
import AudioMgr from "./Mgr/AudioMgr";
import Chapter from "./cmd/Chapter";
import {Cmd, DChapter} from "../data/sotry/Story";
import {AutoState, FFState, IState, NormalState, SleepState, StateEnum, TempState} from "./state/State";
import AssMgr from "./Mgr/AssMgr";
import {ViewMgr} from "./Mgr/ViewMgr";
import Scene from "./cmd/Scene";
import {IMgr} from "./Mgr/Mgr";
import Reportor from "./reporter/Reporter";
import Event = laya.events.Event;
import Browser = laya.utils.Browser;
import Label = laya.ui.Label;
/**
 * 逻辑控制器
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    private assMgr: AssMgr;
    private viewMgr: ViewMgr;
    private valueMgr: ValueMgr;
    private audioMgr: AudioMgr;
    private videoMgr: VideoMgr;

    private mgrArr: IMgr[] = [
        this.assMgr = new AssMgr(),
        this.viewMgr = new ViewMgr(),
        this.valueMgr = new ValueMgr(),
        this.audioMgr = new AudioMgr(),
        this.videoMgr = new VideoMgr()
    ]

    chapter: Chapter;
    private states: IState[] = [new NormalState(), new AutoState(), new FFState(), new TempState(), new SleepState()];
    private state: IState;
    private cc: number = 0;
    private restoreSid: number;
    private appending: [number, number, number][] = [];
    private cacheChapter: [number, number, Cmd[], Chapter][] = [];
    private snap: [number, number, number];
    private curSid: number = 0;
    private curCid: number = 0;
    private cmdArr: Cmd[] = [];

    private dh: DH = DH.instance;
    private reporter = this.dh.reporter = new Reportor();

    constructor() {
        this.switchState(StateEnum.Sleep);
        this.dh.mgrArr = this.mgrArr;

        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Conf.CMD_LINE_RESUME, this, this.switchState);
        this.dh.eventPoxy.on(Conf.ITEM_CHOOSEN, this, this.switchState);
        this.dh.eventPoxy.on(Conf.CHANGE_STATE, this, this.switchState);
        this.dh.eventPoxy.on(Conf.STAGE_BLUR, this, this.switchState);

        Laya.timer.frameLoop(1, this, this.tick);
        // this.reporter.showProcess = true;
        // this.reporter.showCode = true;
    }

    tick() {
        this.state.update(this.viewMgr, this.audioMgr);
        this.update();
    }

    playHandler(c: DChapter) {
        this.chapter = new Chapter(c);
        this.curCid = 0;
        this.curSid = this.snap ? this.snap[1] : 0;
        this.cmdArr = [];
    }

    switchState(sId: number) {
        this.state = this.states[sId];
    }

    complete() {
        this.curCid = this.curSid = 0;
        console.log("chapter complete");
    }

    insertTempChapter(chapter: Chapter) {
        this.cacheChapter.push([this.curCid, this.restoreSid, this.cmdArr, this.chapter]);
        console.log("insert temp chapter name:" + chapter.name + " At:", [this.curCid, this.restoreSid, this.cmdArr, this.chapter]);
        this.chapter = chapter;
        this.curSid = this.curCid = 0;
        this.switchState(StateEnum.Temp);
        return this.update(0);
    }

    restoreChapter(snap: [number, number, number] = null) {
        if (snap) {
            this.snap = snap;
            this.appending = [];
            this.cacheChapter = [];
            console.log("restore to chapter:", this.snap);
        } else if (this.cacheChapter.length) {
            let cch = this.cacheChapter.pop();
            this.chapter = cch[3];
            this.cmdArr = cch[2];
            this.restoreSid = this.curSid = cch[1];
            this.curCid = cch[0];
            console.log("restore from temp to chapter:", cch[3].name, "with:", cch);
        } else {
            this.snap = this.appending.pop();
            this.dh.story.gotoChapter(this.snap[2]);
            console.log("restore to chapter id:", this.snap[2], "with:", this.snap);
        }
        this.switchState(StateEnum.Normal);
    }

    update(sid = NaN) {
        if (this.state.id == StateEnum.Sleep)
            return this.reporter.callCount++;//test only;
        if (!isNaN(sid) || this.curCid >= this.cmdArr.length) {
            let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);
            if (s == null) {
                if (this.cacheChapter.length || this.appending.length)
                    return this.restoreChapter();
                else
                    return this.complete();
            }
            this.cmdArr = s.cmdArr;
            this.restoreSid = this.curSid;
            this.curSid = s.link;
            if (!this.snap) {
                this.curCid = 0;
            } else {
                this.curCid = this.snap[0];
                this.snap = null;
            }
        }

        while (this.curCid < this.cmdArr.length) {
            this.cc++;
            let cmd = this.cmdArr[this.curCid++];
            this.reporter.logProcess(cmd);//test only
            switch (cmd.code) {
                //需暂停等待
                // case 150: //"刷新UI画面"
                case 208: //"返回标题画面"
                case 214: //"呼叫游戏界面"
                    if (this.cacheChapter.length)
                        this.restoreChapter();
                    if (parseInt(cmd.para[0]) == 10008)
                        this.dh.eventPoxy.event(Conf.QUITE_GAME);
                    else if (parseInt(cmd.para[0]) == 10009)
                        this.switchState(StateEnum.Auto);
                    else {
                        this.switchState(StateEnum.Temp);
                        this.viewMgr.exe(cmd);
                    }
                    return this.cc = 0;
                case 110: //"打开指定网页";
                // case 111: //"禁用开启菜单功能";
                case 100 : { //"显示文章"
                    this.state.pause();
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                case 101: //剧情分歧
                case 1010: //剧情分歧EX
                case 1011: //剧情分歧EX2
                case 204: { //按钮分歧
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                case 151: {//"返回游戏界面"
                    this.switchState(StateEnum.Normal);
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                //状态指令
                case 210: {//等待
                    this.reporter.sleepCount = 1;
                    let dur = parseInt(cmd.para[0]);
                    this.reporter.logWait(dur);
                    this.state.wait(dur);
                    return this.cc = 0;
                }
                case 103: { //"自动播放剧情"
                    this.switchState(parseInt(cmd.para[0]) ? StateEnum.Auto : StateEnum.Normal);
                    return this.cc = 0;
                }
                case 104: {//"快进剧情"
                    this.switchState(parseInt(cmd.para[0]) ? StateEnum.FF : StateEnum.Normal);
                    return this.cc = 0;
                }
                case 108 :
                case 212 :
                case 211 :
                case 102 :
                case 205 :
                case 201 :
                    return this.update(this.curSid = cmd.links[0]);
                //repeat end
                case 203:
                //repeat interrupt
                case 209: {
                    //调用栈不足5000次强制刷新不等待时沿
                    this.curSid = cmd.links[0];
                    return this.cc > 5000 ? this.cc = 0 : this.update(this.curSid);
                }
                //跳转剧情
                case 206 : {
                    console.log("gotoChapter:", parseInt(cmd.para[0]));
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    this.appending = [];
                    return this.cc = 0;
                }
                //呼叫子剧情
                case 251: {
                    this.appending.push([this.curCid, this.restoreSid, this.chapter.id]);
                    console.log("insert chapter At:", this.curCid, this.restoreSid, this.chapter.id);
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return this.cc = 0;
                }

                //条件分歧
                case 200:
                    let bingo;
                    if (cmd.para[0].split("|")[0] == "MO") {
                        this.viewMgr.exe(cmd);
                        bingo = this.viewMgr.ul.checkHotarea(cmd);
                        this.curSid = cmd.links[bingo ? 0 : 1];
                        return bingo ? this.cc = 0 : this.update(this.curSid);
                    } else {
                        bingo = this.valueMgr.judge(cmd.para);
                        return this.update(this.curSid = cmd.links[bingo ? 0 : 1]);
                    }

                case 217: {//高级条件分歧
                    let len = parseInt(cmd.para[3]);
                    let moCmd;
                    let bingo;
                    for (let i = 4; i < 4 + len; i++) {
                        let p = cmd.para[i].split("&");
                        if (p[0].split("|")[0] == "MO")
                            moCmd = cmd;
                        if (cmd.para[0] == "0") {// cmd.para[0] || : &&;
                            if (bingo = this.valueMgr.judge(p))
                                break;
                        } else {
                            if (!(bingo = this.valueMgr.judge(p)))
                                break;
                        }
                        bingo = cmd.para[0] == "0" ? false : true;
                    }

                    if (bingo && moCmd) {//如果其他条件都满足，就把通过权交给异步的交互操作
                        this.viewMgr.exe(cmd);
                        bingo = this.viewMgr.ul.checkHotarea(cmd);
                        this.curSid = cmd.links[bingo ? 0 : 1]
                        return bingo ? this.cc = 0 : this.update(this.curSid);
                    }
                    return this.update(this.curSid = cmd.links[bingo ? 0 : 1]);
                }

                default: {//非逻辑命令分发
                    for (let mgr of this.mgrArr)
                        mgr.exe(cmd);
                }
            }
        }
        return this.update();
    }
};