import {IMgr} from "./Mgr";
import {Cmd} from "../../../data/sotry/Story";
import DH from "../../../data/DH";
import Conf from "../../../data/Conf";
/**
 * Created by ShanFeng on 5/15/2017.
 */
export default class AssMgr implements IMgr {
    dh: DH = DH.instance;

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 405://"资源预加载(仅web用)";
        }
    }
}

