import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./ValueMgr";
import VideoMgr from "./VideoMgr";
import AudioMgr from "./AudioMgr";
import Chapter from "./cmd/Chapter";
import {DChapter} from "../data/sotry/Story";
import Scene from "./cmd/Scene";
import {IState} from "./state/State";
/**
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {

    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: AudioMgr = new AudioMgr();
    videoMgr: VideoMgr = new VideoMgr();

    state: IState;

    dh: DH = DH.instance;
    chapter: Chapter;
    pause: boolean = true;

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        this.chapter = new Chapter(c);
        this.pause = false;
    }

    gotoScene(sid: number): Scene {
        return this.chapter.getScene(sid);
    }
}