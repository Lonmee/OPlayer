import {Chapter} from "../data/sotry/Story";
import Conf from "../data/Conf";
import DH from "../data/DH";
/**
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    dh: DH = DH.instance;
    chapter: Chapter;

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    playHandler(c: Chapter) {
        this.chapter = c;
        for (let cmd of c.cmdArr) {
            console.log(`${cmd.code} : ${cmd.para}`);
        }

    }
}