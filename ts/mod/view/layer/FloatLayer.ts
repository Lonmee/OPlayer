import Sprite = laya.display.Sprite;
import {Cmd} from "../../../data/sotry/Story";
import {Layer} from "./Layer";
/**
 * Created by ShanFeng on 5/29/2017.
 */
export default class FloatLayer extends Layer{

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 112: {//"悬浮组件开关";
                break;
            }
        }
    }
}