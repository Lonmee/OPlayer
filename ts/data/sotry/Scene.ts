import {Cmd, ILinkage} from "./Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export interface IScene extends ILinkage {
    cmdArr?: Cmd[]
}

export default class Scene implements IScene {
    link: number;
    cmdArr: Cmd[];
}