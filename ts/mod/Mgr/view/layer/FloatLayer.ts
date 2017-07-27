import Sprite = laya.display.Sprite;
import {Cmd} from "../../../../data/sotry/Story";
import {Layer} from "./Layer";

/**
 * Created by ShanFeng on 5/29/2017.
 */
export default class FloatLayer extends Layer {

    constructor() {
        super();
    }

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 112: {//"悬浮组件开关";
                if (cmd.para[0] == "1")
                    this.addChild(this.uiFac.getFLayer());
                else
                    this.removeChild(this.uiFac.getFLayer())
                break;
            }
        }
    }

    reset() {

    }
}