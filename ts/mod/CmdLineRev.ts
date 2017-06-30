import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./Mgr/ValueMgr";
import VideoMgr from "./Mgr/VideoMgr";
import AudioMgr from "./Mgr/AudioMgr";
import Chapter from "./cmd/Chapter";
import {Cmd, DChapter} from "../data/sotry/Story";
import {AutoState, FFState, IState, NormalState, StateEnum} from "./state/State";
import AssMgr from "./Mgr/AssMgr";
import {ViewMgr} from "./Mgr/ViewMgr";
import Scene from "./cmd/Scene";
import {IMgr} from "./Mgr/Mgr";
import Event = laya.events.Event;
import Browser = laya.utils.Browser;
import Label = laya.ui.Label;

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
    soundMgr: AudioMgr;
    videoMgr: VideoMgr;

    mgrArr: IMgr[] = [
        this.assMgr = new AssMgr(),
        this.viewMgr = new ViewMgr(),
        this.valueMgr = new ValueMgr(),
        this.soundMgr = new AudioMgr(),
        this.videoMgr = new VideoMgr()
    ]

    private states: IState[] = [new NormalState(), new AutoState(), new FFState()];
    private state: IState;
    private lock: boolean = true;
    private pause: boolean = true;
    chapter: Chapter;
    private curSid: number = 0;
    private curCid: number = 0;

    private dh: DH = DH.instance;
    private reportor = DH.instance.reportor;
    private cmdArr: Cmd[] = [];

    constructor() {
        // this.changeState(StateEnum.FF);
        this.changeState(StateEnum.Normal);
        this.dh.mgrArr = this.mgrArr;

        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Conf.CMD_LINE_RESUME, this, this.resume);
        this.dh.eventPoxy.on(Conf.ITEM_CHOOSEN, this, this.resume);
        this.dh.eventPoxy.on(Conf.CHANGE_STATE, this, this.changeState);
        this.dh.eventPoxy.on(Conf.STAGE_BLUR, this, this.resetState);

        //region test only
        this.dh.eventPoxy.on(Event.CLICK, this, this.resume);
        this.dh.eventPoxy.on(Event.KEY_DOWN, this, this.resume);
        //endregion

        Laya.timer.frameLoop(1, this, this.tick);
        // this.reportor.showProcess = true;
        // this.reportor.showCode = true;
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        if (this.snap)
            this.curSid = this.snap[1];
        else
            this.curSid = 0;
        this.curCid = 0;
        this.chapter = new Chapter(c);
        this.cmdArr = [];
        this.lock = this.pause = false;
    }

    /**
     * 舞台失焦等意外
     * 仅重置快进
     */
    resetState() {
        if (this.state.id == StateEnum.FF)
            this.changeState(StateEnum.Normal);
    }

    changeState(cmd: Cmd | number) {
        let ind;
        if (typeof cmd == "number") {
            this.state = this.states[ind = cmd];
        } else {
            this.state = cmd.code == 103 ? //自动播放剧情
                this.states[parseInt(cmd.para[0]) ? ind = StateEnum.Auto : ind = StateEnum.Normal] :
                this.states[parseInt(cmd.para[0]) ? ind = StateEnum.FF : ind = StateEnum.Normal];
        }
        if (ind == 2 && !this.lock) {
            this.resume();
        }
        return StateEnum[ind];
    }

    resume(e: Event | number = null) {
        if (!this.lock)
            this.pause = false;
        if (typeof e == "number") {
            this.lock = this.pause = false;
            this.update(e);
        }
    }

    complete() {
        //todo:chapter complete
        this.curCid = this.curSid = 0;
        console.log("chapter complete");
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
        } else
            this.snap = this.appending.pop();
        console.log("restore to chapter:", this.snap);
        if (this.chapter.id == this.snap[2]) {
            this.curCid = 0;
            this.update(this.snap[1])
        } else
            this.dh.story.gotoChapter(this.snap[2]);
    }

    tick(s) {
        this.update();
    }

    update(sid = NaN) {
        this.reportor.callCount++;
        if (this.pause) {
            this.reportor.logPause();
        } else {
            this.exe(this.nextCmd(sid));
        }
    }

    nextCmd(sid = NaN): Cmd {
        if (this.curCid == this.cmdArr.length) {
            let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);
            //检查Scene结束
            if (s == null) {
                this.pause = true;
                if (this.appending.length > 0)
                    this.restoreChapter();
                else
                    this.complete();
                return;
            }
            this.cmdArr = s.cmdArr;
            this.restoreSid = this.curSid;
            this.curSid = s.link;

            //检查是否有剧情还原
            if (!this.snap) {
                this.curCid = 0;
            } else {
                this.curCid = this.snap[0]
                this.snap = null;
            }
        }
        return this.cmdArr[this.curCid++];
    }

    exe(cmd: Cmd) {
        if (!cmd)
            return;
        this.reportor.logProcess(cmd);
        switch (cmd.code) {
            //需暂停等待
            // case 150: //"刷新UI画面"
            case 208: //"返回标题画面"
            case 214: //"呼叫游戏界面"
            case 218: //"强制存档读档"
                if (cmd.para[0] != "10008" && cmd.para[0] != "10009")
                    this.lock = this.pause = true;
                this.viewMgr.exe(cmd);
                return;
            case 110: //"打开指定网页";
            // case 111: //"禁用开启菜单功能";

            case 100 : { //"显示文章"
                this.pause = true;
                this.state.pause();
                this.viewMgr.exe(cmd);
                return;
            }
            case 101: //剧情分歧
            case 1010: //剧情分歧EX
            case 1011: //剧情分歧EX2
            case 204: { //按钮分歧
                this.lock = this.pause = true;
                this.state.pause();
                this.viewMgr.exe(cmd);
                return;
            }
            case 151: {//"返回游戏界面"
                this.pause = false;
                this.viewMgr.exe(cmd);
                return;
            }
            //状态指令
            case 210: {//等待
                this.reportor.pauseCound = 1;
                let dur = parseInt(cmd.para[0]);
                this.reportor.logWait(dur);
                this.pause = true;
                return this.state.wait(--dur);//当前帧算入等待中故减掉1
            }
            case 103://"自动播放剧情"
            case 104: {//"快进剧情"
                this.changeState(cmd);
                break;
            }

            case 202: {
                break;
            }
            //repeat end
            case 203:
            //repeat interrupt
            case 209: {
                this.curSid = cmd.links[0];
                break;
            }

            //跳转剧情
            case 206 : {
                this.pause = true;
                console.log("gotoChapter:", parseInt(cmd.para[0]));
                this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                return;
            }
            //呼叫子剧情
            case 251: {
                this.pause = true;
                this.appending.push([this.curCid, this.restoreSid, this.chapter.id]);
                console.log("insert chapter:", this.curCid, this.restoreSid, this.chapter.id);
                this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                return;
            }

            //条件分歧
            case 200:
                let choice;
                if (cmd.para[0].split("|")[0] == "MO") {
                    this.viewMgr.exe(cmd);
                    choice = this.viewMgr.ul.checkHotarea(cmd) ? 1 : 2;
                } else {
                    choice = this.valueMgr.judge(cmd.para) ? 1 : 2;
                }

                //兼容条件结构特例
                this.curSid = choice == 1 || choice == 2 && cmd.links.length == 2 ? cmd.links[choice - 1] : this.curSid;
                break;

            case 217: {//高级条件分歧
                let len = parseInt(cmd.para[3]);
                let moCmd;
                let pass;
                for (let i = 4; i < 4 + len; i++) {
                    let p = cmd.para[i].split("&");

                    if (p[0].split("|")[0] == "MO") {
                        moCmd = cmd;
                    }

                    if (cmd.para[0] == "0") {// cmd.para[0] || : &&;
                        if (pass = this.valueMgr.judge(p))
                            break;
                    } else {
                        if (!(pass = this.valueMgr.judge(p)))
                            break;
                    }
                    pass = cmd.para[0] == "0" ? false : true;
                }

                if (pass && moCmd) {//如果其他条件都满足，就把通过权交给异步的交互操作
                    this.viewMgr.exe(cmd);
                    pass = this.viewMgr.ul.checkHotarea(cmd);
                }

                let choice = pass ? 1 : 2;
                //兼容条件结构特例
                this.curSid = choice == 1 || choice == 2 && cmd.links.length == 2 ? cmd.links[choice - 1] : this.curSid;
                break;
            }

            default: {//非逻辑命令分发
                for (let mgr of this.mgrArr)
                    mgr.exe(cmd);
                break;
            }
        }
        return this.update();
    }
};