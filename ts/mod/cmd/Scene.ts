import {ILinkage} from "./CmdList";
import {Cmd} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class Scene implements ILinkage {
    link: number;
    cmdArr: Cmd[] = [];
    private idx: number = 0;

    constructor(link: number = -1) {
        this.link = link;
    }

    nextCmd(): Cmd | number {
        if (this.idx == this.cmdArr.length) {
            return this.link;
        }
        return this.cmdArr[this.idx++];
    }
};