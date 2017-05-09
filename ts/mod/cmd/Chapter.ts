import Scene from "./Scene";
import {DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    constructor(dc: DChapter) {
        super(dc);
    }

    getScene(): Scene {
        let s: Scene = new Scene();
        // let cmd: Cmd = this.cmdArr[link];
        // switch (cmd.code) {
        //     case 204:
        // }
        return s;
    }
}