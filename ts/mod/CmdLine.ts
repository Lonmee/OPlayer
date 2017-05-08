import {Cmd} from "../data/sotry/Story";
import Conf from "../data/Conf";
import DH from "../data/DH";
import {Chapter} from "../data/sotry/Chapter";
import ValueMgr from "./ValueMgr";
import {ViewMgr} from "./ViewMgr";
import VideoMgr from "./VideoMgr";
import SoundManager = laya.media.SoundManager;
/**
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    viewMgr: ViewMgr = DH.instance.viewMgr
    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: SoundManager = new SoundManager();
    videoMgr: VideoMgr = new VideoMgr();

    dh: DH = DH.instance;
    chapter: Chapter;
    len: number;
    idx: number = 0;
    pause: boolean = true;
    private cmdArr: Cmd[];

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    playHandler(c: Chapter) {
        this.chapter = c;
        this.cmdArr = c.cmdArr;
        this.len = c.cmdArr.length;
        this.idx = 0;
        this.pause = false;
    }

    nextCmd(): Cmd {
        this.pause = this.idx == this.len - 1;
        return this.cmdArr[this.idx++];
    }
}