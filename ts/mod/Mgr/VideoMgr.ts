import {Cmd} from "../../data/sotry/Story";
import {Mgr} from "./Mgr";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class VideoMgr extends Mgr{

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 600://play
            case 601://operate
        }
    }
}