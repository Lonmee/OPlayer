import {Cmd, ILinkage} from "./Story";
import Scene, {IScene} from "./Scene";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export interface IChapter extends ILinkage {
    name?: string
    id?: number
    cmdArr?: Cmd[]
    getScent(link: number): IScene
}

export class Chapter implements IChapter {
    link: number;
    name: string;
    id: number;
    cmdArr: Cmd[];

    getScent(link: number): IScene {
        let s: Scene = new Scene();
        let cmd: Cmd = this.cmdArr[link];
        switch (cmd.code) {
            case 204:

        }
        return null;
    }
}