import {Cmd, ILinkage} from "../../data/sotry/DStory";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class Scene implements ILinkage {
    link: number;
    cmdArr: Cmd[];
}