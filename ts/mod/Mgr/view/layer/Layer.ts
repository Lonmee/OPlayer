import {IMgr} from "../../Mgr";
import {Cmd} from "../../../../data/sotry/Story";
import Sprite = laya.display.Sprite;
import DH from "../../../../data/DH";
import UIFac from "../ui/UIFac";

/**
 * Created by ShanFeng on 5/31/2017.
 */
export class Layer extends Sprite implements IMgr {
    protected uiFac: UIFac = new UIFac();
    protected dh: DH = DH.instance;

    exe(cmd: Cmd) {
    }

    update(delay: number = 1) {
    }


    reset() {
        while (this.numChildren) {
            this.removeChildAt(0);
        }
    }
}