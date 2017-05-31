import {IMgr} from "./Mgr";
import {Cmd} from "../../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class ValueMgr implements IMgr {

    constructor() {
    }

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 105://"数值输入"
            case 207://"数值操作"
            case 213://"二周目变量"
            case 215://"字符串"
            case 216://"高级数值操作"
        }
    }
}