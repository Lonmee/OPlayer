import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    sceneArr: Scene[];

    constructor(dc: DChapter) {
        super(dc);
        this.formScene();
    }

    getScene(idx: number): Scene {
        return null;
    }

    private formScene() {
        let repeatLog: Cmd[] = [];
        let ifLog: Cmd[] = [];
        for (let cmd of this.cmdArr) {
            console.log(cmd.code);
        }
    }
}