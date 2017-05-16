import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    sceneArr: Scene[] = [];

    constructor(dc: DChapter) {
        super(dc);
    }

    getScene(idx: number): Scene {
        return this.sceneArr[idx] || this.formScene(idx);
    }

    private formScene(idx: number): Scene {
        let s: Scene = new Scene(this.sceneArr.length);
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.pop();
            switch (cmd.code) {
                case 100 : {
                    s.cmdArr.push(cmd);
                    this.sceneArr.push(s)
                    return s;
                }

                default : {
                    s.cmdArr.push(cmd);
                }
            }
        }
    }
}