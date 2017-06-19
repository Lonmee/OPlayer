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
import CmdList from "./cmd/CmdList";
import Scene from "./cmd/Scene";
import Event = laya.events.Event;
import {IMgr} from "./Mgr/Mgr";
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

    states: IState[] = [new NormalState(), new AutoState(), new FFState()];
    state: IState;
    pause: boolean = true;
    chapter: Chapter;
    curSid: number = 0;
    curCid: number = 0;

    private dh: DH = DH.instance;
    private cmdArr: Cmd[] = [];

    constructor() {
        this.dh.mgrArr = this.mgrArr;

        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Event.CLICK, this, this.resume);
        this.dh.eventPoxy.on(Event.KEY_DOWN, this, this.resume);
        this.dh.eventPoxy.on(Conf.CMD_LINE_RESUME, this, this.resume);
        this.dh.eventPoxy.on(Conf.ITEM_CHOOSEN, this, this.resume);
        Laya.timer.frameLoop(1, this, this.update);
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
        this.chapter = new Chapter(c);
        this.cmdArr = [];
        this.pause = false;
    }

    /**
     * 恢复父剧情
     */
    restoreChapter() {
        this.snap = this.appending.pop();
        console.log("restore to chapter:", this.snap);
        this.dh.story.gotoChapter(this.snap[2]);
    }

    changeState(cmd: Cmd | number) {
        if (typeof cmd == "number") {
            this.states[cmd];
        } else {
            this.state = cmd.code == 103 ?
                this.states[parseInt(cmd.para[0]) ? StateEnum.Auto : StateEnum.Normal] :
                this.states[parseInt(cmd.para[0]) ? StateEnum.FF : StateEnum.Normal];
        }
    }

    resume(e: Event | number) {
        this.pause = false;
        if (typeof e == "number") {
            this.update(e);
        }
    }

    cmdList: CmdList = new CmdList();

    update(sid = NaN) {
        if (this.pause) {
            return;
        }
        // if (this.curCid == this.cmdArr.length && this.curSid != -1)
        // if (this.curSid != -1 && sid != this.curSid)
        if (sid > 0 || this.curCid >= this.cmdArr.length) {
            let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);
            this.cmdArr = s.cmdArr;
            this.restoreSid = this.curSid;
            this.curSid = s.link;
            if (!this.snap) {
                this.curCid = 0;
            } else {
                this.curCid = this.snap[0]
                this.snap = null;
            }
        }
        if (this.curSid == -1) {
            if (this.appending.length > 0) {
                this.restoreChapter();
            } else {
                this.pause = true;
                //todo:chapter complete
                this.curCid = this.curSid = 0;
                console.log("chapter complete");
            }
        }

        while (this.curCid < this.cmdArr.length) {
            let cmd = this.cmdArr[this.curCid++];
            console.log(cmd.code, this.cmdList.get(cmd.code));
            switch (cmd.code) {
                //需暂停等待
                case 150: //"刷新UI画面"
                case 208: //"返回标题画面"
                case 214: //"呼叫游戏界面"
                case 218: //"强制存档读档"
                case 110: //"打开指定网页";
                case 111: //"禁用开启菜单功能";

                case 101: //剧情分歧
                case 1010: //剧情分歧EX
                case 1011: //剧情分歧EX2
                case 204:  //按钮分歧
                case 100 : { //"显示文章"
                    this.pause = true;
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
                    this.pause = true;
                    Laya.timer.once(Math.round(parseInt(cmd.para[0]) / 60 * 1000), this, this.resume);
                    console.log("waiting for", Math.round(parseInt(cmd.para[0]) / 60 * 1000) + " ms");
                    return;
                }
                case 103://"自动播放剧情"
                case 104: {//"快进剧情"
                    return this.changeState(cmd);
                }
                //repeat end
                case 203:
                //repeat interrupt
                case 209: {
                    //设置链接目标等待刷新
                    // this.curSid = cmd.links[0];
                    //return
                    //强制刷新不等待时沿
                    return this.update(cmd.links[0]);
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

                case 200://条件分歧
                    if (cmd.para[0].split("|")[0] == "MO") {
                        this.pause = true;
                        this.viewMgr.exe(cmd);
                        return;
                    }

                    let choice = this.valueMgr.judge(cmd.para) ? 1 : 2;
                    //兼容条件结构特例
                    if (choice == 1 || choice == 2 && cmd.links.length == 2)
                        this.curSid = cmd.links[choice - 1];
                    return this.update();

                case 217: {//高级条件分歧
                    let len = parseInt(cmd.para[3]);
                    let pass;
                    for (let i = 4; i < 4 + len; i++) {
                        let p = cmd.para[i].split("&");

                        //新版工具已不支持高级条件分歧中的鼠标事件
                        // if (p.split("|")[0] == "MO") {
                        //     this.pause = true;
                        //     this.viewMgr.exe(cmd);
                        //     return;
                        // }

                        if (cmd.para[0] == "0") {// cmd.para[0] || : &&;
                            if (pass = this.valueMgr.judge(p))
                                break;
                        } else {
                            if (!(pass = this.valueMgr.judge(p)))
                                break;
                        }
                        pass = cmd.para[0] == "0" ? false : true;
                    }

                    let choice = pass ? 1 : 2;
                    //兼容条件结构特例
                    if (choice == 1 || choice == 2 && cmd.links.length == 2)
                        this.curSid = cmd.links[choice - 1];
                    return this.update();

                    // let choice: string = window.prompt(cmd.para.toString() + "\n input your choice below   option [yes, no]");
                    // while (choice == "") {
                    //     choice = window.prompt(cmd.para.toString() + "\n input your choice below   option [yes, no]");
                    // }
                }

                default: {
                    for (let mgr of this.mgrArr)
                        mgr.exe(cmd);
                }
            }
        }
    }
};