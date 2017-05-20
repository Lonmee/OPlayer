import {ILinkage} from "./CmdList";
import {Cmd} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class Scene implements ILinkage {
    link: number;
    cmdArr: Cmd[] = [];

    constructor(link: number = -1) {
        this.link = link;
    }
};