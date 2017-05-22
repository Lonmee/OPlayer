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
import Event = laya.events.Event;
import Scene from "./cmd/Scene";
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
        if (this.appending.length > 0) {
            let snap: [number, number, Chapter] = this.appending.pop();
            this.curCid = snap[0];
            this.curSid = snap[1];
            this.chapter = snap[2];
        } else {
            this.curCid = 0;
            this.curSid = 0;
            this.chapter = new Chapter(c);
        }
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
            this.cmdList.printChater(s, this.chapter.sceneArr);
        } else if (this.curSid == -1) {
            //恢复父剧情
            if (this.appending.length > 0) {
                let snap: [number, number, Chapter] = this.appending.pop();
                this.curCid = snap[0];
                this.curSid = snap[1];
                this.chapter = snap[2];
            } else {
                this.pause = true;
                //todo:chater complete
                this.curSid = this.curSid = 0;
                console.log("chater complete");
            }
        }

        while (this.curCid < this.cmdArr.length) {
            let cmd = this.cmdArr[this.curCid++];
            switch (cmd.code) {
                //"显示文章"
                case 100 : {
                    this.viewMgr.exe(cmd);
                    this.pause = true;
                    return;
                }
                //等待
                case 210: {
                    this.pause = true;
                    Laya.timer.once(parseInt(cmd.para[0]) / 60 * 1000, null, () => {
                        this.pause = false
                    });
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
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return;
                }
                //呼叫子剧情
                case 251: {
                    this.pause = true;
                    this.appending.push([this.curSid, this.curSid, this.chapter]);
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return;
                }

                // case 101: //剧情分歧
                // case 1010: //剧情分歧EX
                // case 1011: //剧情分歧EX2
                // case 204: //按钮分歧
                case 200://条件分歧
                case 217: {//高级条件分歧
                    let choise: string = window.prompt(cmd.para.toString() + "\n input your choise below   option [" + cmd.links + "]");
                    while (choise == "") {
                        choise = window.prompt("input your choise below   option [" + cmd.links + "]");
                    }
                    this.curSid = cmd.links[parseInt(choise) - 1];
                    return;
                }

                default: {
                    this.viewMgr.exe(cmd);
                }
            }
        }
    }
};