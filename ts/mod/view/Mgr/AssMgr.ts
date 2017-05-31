import {IMgr} from "./Mgr";
import {Cmd} from "../../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/15/2017.
 */
export default class AssMgr implements IMgr {
    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 405://"资源预加载(仅web用)";
        }
    }
}

