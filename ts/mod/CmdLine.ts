import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./ValueMgr";
import VideoMgr from "./VideoMgr";
import AudioMgr from "./AudioMgr";
import Chapter from "./cmd/Chapter";
import {Cmd, DChapter} from "../data/sotry/Story";
import {AutoState, FFState, IState} from "./state/State";
import AssMgr from "./AssMgr";
import {ViewMgr} from "./ViewMgr";
import CmdList from "./cmd/CmdList";
import Scene from "./cmd/Scene";
import Event = laya.events.Event;
/**
 * 逻辑控制器
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    appending: [number, number, Chapter][] = [];
    assMgr: AssMgr = new AssMgr();
    viewMgr: ViewMgr = new ViewMgr();
    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: AudioMgr = new AudioMgr();
    videoMgr: VideoMgr = new VideoMgr();

    states: IState[] = [new AutoState(), new FFState()];

    pause: boolean = true;
    chapter: Chapter;
    curSid: number = 0;
    curCid: number = 0;

    dh: DH = DH.instance;
    private cmdArr: Cmd[] = [];

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Event.CLICK, this, this.resume);
        this.dh.eventPoxy.on(Conf.ITEM_CHOOSEN, this, this.resume);
        Laya.timer.frameLoop(1, this, this.update);
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        //呼叫子剧情时缓存当前剧情及播放进度
        this.curCid = 0;
        this.curSid = 0;
        this.chapter = new Chapter(c);
        this.cmdArr = [];
        this.pause = false;
    }

    /**
     * 恢复父剧情
     */
    restoreChapter() {
        let snap: [number, number, Chapter] = this.appending.pop();
        this.curCid = snap[0];
        this.curSid = snap[1];
        this.chapter = snap[2];
        this.cmdArr = [];
        this.pause = false;
    }

    changeState(state: number) {
        //this.nextScene = StateNo.Auto;
    }

    resume(e: Event | number) {
        if (typeof e == "number") {
            this.curSid = e;
        }
        this.pause = false;
    }

    cmdList: CmdList = new CmdList();

    update(sid = NaN) {
        if (this.pause) {
            return;
        }
        if (this.curCid == this.cmdArr.length && this.curSid != -1) {
            let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);

            this.cmdArr = s.cmdArr;
            this.curSid = s.link;
            this.curCid = 0;
        } else if (this.curSid == -1) {
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
            switch (cmd.code) {
                case 101: //剧情分歧
                case 1010: //剧情分歧EX
                case 1011: //剧情分歧EX2
                case 204:  //按钮分歧
                case 214 ://呼叫游戏界面
                case 100 : { //"显示文章"
                    this.pause = true;
                    this.viewMgr.exe(cmd);
                    return;
                }
                //等待
                case 210: {
                    this.pause = true;
                    Laya.timer.once(parseInt(cmd.para[0]) / 60 * 1000, this, this.resume);
                    return;
                }
                //repeat end
                case 203:
                //repeat interrupt
                case 209: {
                    this.curSid = cmd.links[0];
                    return
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
                    this.appending.push([this.curCid, this.curSid, this.chapter]);
                    console.log("insertChapter:", parseInt(cmd.para[0]));
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return;
                }

                case 200://条件分歧
                case 217: {//高级条件分歧
                    let choice: string = window.prompt(cmd.para.toString() + "\n input your choice below   option [yes, no]");
                    while (choice == "") {
                        choice = window.prompt(cmd.para.toString() + "\n input your choice below   option [yes, no]");
                    }
                    //兼容条件结构特例
                    if (parseInt(choice) == 1 || parseInt(choice) == 2 && cmd.links.length == 2)
                        this.curSid = cmd.links[parseInt(choice) - 1];
                    return;
                }

                default: {
                    this.viewMgr.exe(cmd);
                }
            }
        }
    }
};