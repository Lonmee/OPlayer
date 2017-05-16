import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./ValueMgr";
import VideoMgr from "./VideoMgr";
import AudioMgr from "./AudioMgr";
import Chapter from "./cmd/Chapter";
import {DChapter} from "../data/sotry/Story";
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
    chapters: [[number, Chapter]] = [[0, null]];
    assMgr: AssMgr = new AssMgr();
    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: AudioMgr = new AudioMgr();
    videoMgr: VideoMgr = new VideoMgr();
    states: IState[] = [new AutoState(), new FFState()];

    dh: DH = DH.instance;

    chapter: Chapter;
    cmdList: CmdList = new CmdList();
    curSid: number = 0;
    pause: boolean = true;

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

    nextScene(sid: number): Scene {
        return this.chapter.getScene(isNaN(sid) ? this.curSid : sid);
    }
}