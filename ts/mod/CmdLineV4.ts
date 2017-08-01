import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./Mgr/ValueMgr";
import VideoMgr from "./Mgr/VideoMgr";
import AudioMgr from "./Mgr/AudioMgr";
import Chapter from "./cmd/Chapter";
import {Cmd, DChapter} from "../data/sotry/Story";
import {AutoState, FFState, IState, PlayState, StateEnum} from "./state/State";
import AssMgr from "./Mgr/AssMgr";
import {ViewMgr} from "./Mgr/ViewMgr";
import Scene from "./cmd/Scene";
import {IMgr} from "./Mgr/Mgr";

export enum MgrEnum {ass, view, value, audio, video}

/**
 * 逻辑控制器
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    restoreSid: number;
    appending: [number, number, number][] = [];
    snap: [number, number, number];

    assMgr: AssMgr;
    viewMgr: ViewMgr;
    valueMgr: ValueMgr;
    audioMgr: AudioMgr;
    videoMgr: VideoMgr;

    mgrArr: IMgr[] = [
        this.assMgr = new AssMgr(),
        this.viewMgr = new ViewMgr(),
        this.valueMgr = new ValueMgr(),
        this.audioMgr = new AudioMgr(),
        this.videoMgr = new VideoMgr()
    ];

    private states: IState[] = [new PlayState(), new AutoState(), new FFState()];
    private state: IState;
    private frozen: boolean = false;
    private lock: boolean = false;
    private pause: boolean = true;
    chapter: Chapter;
    private curSid: number = 0;
    private curCid: number = 0;

    private dh: DH = DH.instance;
    private reportor = DH.instance.reportor;
    private cmdArr: Cmd[] = [];
    private cc: number = 0;
    private cachePause: boolean;
    private cacheLock: boolean;
    private cacheChapter: [number, number, number, Cmd[], Chapter][] = [];

    constructor() {
        this.switchState(StateEnum.Play);
        this.dh.mgrArr = this.mgrArr;

        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Conf.CMD_LINE_RESUME, this, this.resume);
        this.dh.eventPoxy.on(Conf.ITEM_CHOOSEN, this, this.resume);
        this.dh.eventPoxy.on(Conf.CHANGE_STATE, this, this.switchState);
        this.dh.eventPoxy.on(Conf.STAGE_BLUR, this, this.resetStateAndLock);

        Laya.timer.frameLoop(1, this, this.tick);
        // this.reportor.showProcess = true;
        // this.reportor.showCode = true;
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        this.chapter = new Chapter(c);
        this.curCid = 0;
        this.curSid = this.snap ? this.snap[1] : 0;
        this.cmdArr = [];
        this.lock = this.pause = false;
        // this.viewMgr.reset();
    }

    /**
     * 舞台失焦等意外
     * 仅重置快进
     */
    resetStateAndLock(lock: boolean = false) {
        if (this.state.id == StateEnum.FF)
            this.switchState(StateEnum.Play);
        if (lock)
            this.lock = this.pause = true;
    }

    switchState(cmd: Cmd | number) {
        if (this.lock)
            return;
        let ind;
        if (typeof cmd == "number") {
            this.dh.state = this.state = this.states[ind = cmd];
        } else {
            this.dh.state = this.state = cmd.code == 103 ? //自动播放剧情
                this.states[parseInt(cmd.para[0]) ? ind = StateEnum.Auto : ind = StateEnum.Play] :
                this.states[parseInt(cmd.para[0]) ? ind = StateEnum.FF : ind = StateEnum.Play];
        }
        if (ind == 2 && !this.lock) {
            this.states[StateEnum.Play].wait(0);
            this.states[StateEnum.Auto].wait(0);
            this.resume();
        }
        return StateEnum[ind];
    }

    /**
     *
     * @param e Event|null为普通激活，number为强制并指定sid激活，boolean=true，为强制不指定sid激活
     */
    resume(e: any | number | boolean = null) {
        if (typeof e == "boolean" && e) {
            this.frozen = this.lock = this.pause = false;
        }
        else if (typeof e == "number") {
            this.frozen = this.lock = this.pause = false;
            this.update(e);
        } else if (!this.lock)
            this.pause = false;
    }

    complete() {
        //todo:chapter complete
        this.curCid = this.curSid = 0;
        console.log("chapter complete");
    }


    /**
     * 浮层及高级UI临时命令行插入（待测）
     * @param chapter
     * @returns {number}
     */
    insertTempChapter(chapter: Chapter) {
        this.cacheChapter.push([this.curCid, this.restoreSid, this.curSid, this.cmdArr, this.chapter]);
        // console.log("insert temp chapter name:" + chapter.name + " At:", this.cacheChapter[this.cacheChapter.length - 1]);
        this.chapter = chapter;
        this.curSid = this.curCid = 0;
        if (this.cacheLock == null)
            this.markState();
        this.lock = this.pause = false;
        return this.update(0);
    }

    /**
     * 恢复剧情
     * 缺省参数时恢复父剧情，外部入参用例用于恢复存盘，将自动抹去已存父剧情
     * @param snap [number, number, number]:[cmdId, sceneId, storyId]
     */
    restoreChapter(snap: [number, number, number] = null) {
        if (snap) {
            this.snap = snap;
            this.appending = [];
            console.log("restore to chapter:", this.snap);
        } else if (this.cacheChapter.length) {
            let cch = this.cacheChapter.pop();
            this.chapter = cch[4];
            this.cmdArr = cch[3];
            this.curSid = cch[2];
            this.restoreSid = cch[1];
            this.curCid = cch[0];
            // console.log("restore from temp to chapter:", cch[4].name, "with:", cch);
        } else {
            this.snap = this.appending.pop();
            this.dh.story.gotoChapter(this.snap[2]);
            // console.log("restore to chapter id:", this.snap[2], "with:", this.snap);
        }
    }

    markState() {
        this.cacheLock = this.lock;
        this.cachePause = this.pause;
        // console.log("mark:", this.lock, this.pause);
    }

    restoreState() {
        this.lock = this.cacheLock;
        this.pause = this.cachePause;
        this.cacheLock = this.cachePause = null;
        // console.log("remark:", this.lock, this.pause);
    }

    tick() {
        if (!this.frozen)
            this.state.update(this.viewMgr);
        if (!this.pause)
            this.update();
        else {
            this.reportor.logPause();
            this.cc = 0;
        }
    }

    update(sid = NaN) {
        this.reportor.callCount++;//test only
        if (!isNaN(sid) || this.curCid >= this.cmdArr.length) {
            let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);
            if (s == null) {
                this.resetStateAndLock(true);
                if (this.cacheChapter.length || this.appending.length) {
                    let isCache = this.cacheChapter.length;
                    this.restoreChapter();
                    if (isCache && !this.frozen)
                        this.restoreState();
                    return;
                } else
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
            this.reportor.logProcess(cmd);//test only
            switch (cmd.code) {
                //需暂停等待
                // case 150: //"刷新UI画面"
                case 208: //"返回标题画面"
                case 214: //"呼叫游戏界面"
                    if (this.cacheChapter.length)
                        this.restoreChapter();
                    else
                        this.markState();
                    if (parseInt(cmd.para[0]) == 10008)
                        this.dh.eventPoxy.event(Conf.QUITE_GAME);
                    else if (parseInt(cmd.para[0]) == 10009)
                        this.switchState(StateEnum.Auto);
                    else {
                        this.resetStateAndLock(true);
                        this.frozen = true;
                        this.viewMgr.exe(cmd);
                    }
                    return this.cc = 0;
                case 110: //"打开指定网页";
                // case 111: //"禁用开启菜单功能";

                case 100 : { //"显示文章"
                    this.pause = true;
                    this.state.pause();
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                case 101: //剧情分歧
                case 1010: //剧情分歧EX
                case 1011: //剧情分歧EX2
                case 204: { //按钮分歧
                    this.resetStateAndLock(true);
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                case 151: {//"返回游戏界面"
                    this.frozen = false;
                    this.viewMgr.exe(cmd);
                    if (this.cacheChapter.length == 0)
                        this.restoreState();
                    return this.cc = 0;
                }
                //状态指令
                case 210: {//等待
                    this.pause = true;
                    this.reportor.pauseCound = 1;
                    let dur = parseInt(cmd.para[0]);
                    this.reportor.logWait(dur);
                    return this.frozen ? this.update() : this.state.wait(dur);
                }
                case 103: //"自动播放剧情"
                case 104: {//"快进剧情"
                    this.switchState(cmd);
                    return this.update();
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
                    //设置链接目标等待刷新
                    // this.curSid = cmd.links[0];
                    //return
                    //强制刷新不等待时沿
                    if (this.cc > 5000) {
                        this.cc = 0;
                        return this.curSid = cmd.links[0];
                    } else
                        return this.update(this.curSid = cmd.links[0]);
                }

                //跳转剧情
                case 206 : {
                    this.resetStateAndLock(true);
                    // console.log("gotoChapter:", parseInt(cmd.para[0]));
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    this.appending = [];
                    return this.cc = 0;
                }
                //呼叫子剧情
                case 251: {
                    this.resetStateAndLock(true);
                    this.appending.push([this.curCid, this.restoreSid, this.chapter.id]);
                    // console.log("insert chapter At:", this.curCid, this.restoreSid, this.chapter.id);
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
                        return bingo && cmd.para[3] == '1' ? this.cc = 0 : this.update(this.curSid);
                    } else {
                        bingo = this.valueMgr.judge(cmd.para);
                    }
                    return this.update(this.curSid = cmd.links[bingo ? 0 : 1]);

                case 217: {//高级条件分歧
                    let len = parseInt(cmd.para[3]);
                    let moCmd;
                    let bingo;
                    for (let i = 4; i < 4 + len; i++) {
                        let p = cmd.para[i].split("&");

                        if (p[0].split("|")[0] == "MO") {
                            moCmd = cmd;
                        }

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
                    }
                    return this.update(this.curSid = cmd.links[bingo ? 0 : 1]);
                }

                default: {//非逻辑命令分发
                    for (let mgr of this.mgrArr)
                        mgr.exe(cmd);
                    if (this.state.id == StateEnum.FF)//刷掉快进中的tween
                        this.state.update(this.viewMgr);
                }
            }
        }
        return this.update();
    }
};