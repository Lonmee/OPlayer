import {Cmd} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/22/2017.
 */

export enum MgrEnum {ass, view, value, audio, video}

export interface IMgr {
    exe(cmd: Cmd)
    update(speed: number): void;
}

export class Mgr implements IMgr {

    exe(cmd: Cmd) {
    }

    update(speed: number): void {
    }
}