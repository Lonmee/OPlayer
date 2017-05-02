import {Chapter, Cmd, Scene} from "../data/sotry/Story";
import Conf from "../data/Conf";
import DH from "../data/DH";
/**
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    dh: DH = DH.instance;
    chapter: Chapter;
    len: number;
    idx: number = 0;
    end: boolean = true;
    private cmdArr: Cmd[];

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    playHandler(c: Chapter) {
        this.chapter = c;
        this.cmdArr = c.cmdArr;
        this.len = c.cmdArr.length;
        this.idx = 0;
        this.end = false;
    }

    nextCmd(): Cmd {
        this.end = this.idx == this.len - 1;
        return this.cmdArr[this.idx++];
    }

    nextScene(): Scene {
        return {link: 50};
    }
}