import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./ValueMgr";
import VideoMgr from "./VideoMgr";
import AudioMgr from "./AudioMgr";
import Chapter from "./cmd/Chapter";
import {Cmd, DChapter} from "../data/sotry/Story";
import Scene from "./cmd/Scene";
import {AutoState, FFState, IState} from "./state/State";
import CmdList from "./cmd/CmdList";
import AssMgr from "./AssMgr";
/**
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    appending: boolean = false;
    chapters: [number, Chapter][] = [];

    assMgr: AssMgr = new AssMgr();
    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: AudioMgr = new AudioMgr();
    videoMgr: VideoMgr = new VideoMgr();

    states: IState[] = [new AutoState(), new FFState()];

    chapter: Chapter;
    cmdList: CmdList = new CmdList();
    curSid: number = 0;
    pause: boolean = true;

    dh: DH = DH.instance;

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        //呼叫子剧情时缓存当前剧情及播放进度
        if (this.appending) {
            this.chapters.push([this.curSid, this.chapter]);
        }
        this.chapter = new Chapter(c);
        this.curSid = 0;
        this.pause = false;
    }

    changeState(state: number) {
        //this.nextScene = StateNo.Auto;
    }

    /**
     * 过滤逻辑跳转
     * @param sid
     * @returns {Scene}
     */
    nextScene(sid: number): Scene {
        if (this.curSid < 0) {
            this.curSid = 0;
        }
        console.log("No.", isNaN(sid) ? this.curSid : sid);
        let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : sid)
        this.curSid = s.link;
        if (this.curSid < 0) {
            this.pause = true;
            //todo:cmlLine complete
            console.log("chapter completed");
            return s;
        }
        let keyCmd: Cmd = s.cmdArr[s.cmdArr.length - 1];
        switch (keyCmd.code) {
            case 100 : {//显示文章
                this.pause = true;
                break;
            }
            case 101://剧情分歧
            case 1010:
            case 1011:
            case 204://按钮分歧
            case 200://条件分歧
            case 217: {//高级条件分歧
                break;
            }
            case 210: {//等待
                this.pause = true;
                Laya.timer.once(parseInt(keyCmd.para[0]) / 60 * 1000, null, () => {
                    this.pause = false
                });
                break;
            }

            case 209: {

                break;
            }

            case 206 : {//跳转剧情
                this.pause = true;
                console.log("       ", keyCmd.para[0]);
                this.dh.story.gotoChapter(parseInt(keyCmd.para[0]));
                break;
            }

            case 251: {//呼叫子剧情
                this.appending = this.pause = true;
                console.log("       ", keyCmd.para[0]);
                this.dh.story.gotoChapter(parseInt(keyCmd.para[0]));
                break;
            }
        }
        return s;
    }
}