import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import CmdLine from "./CmdLine";
import DH from "../data/DH";
import {Cmd} from "../data/sotry/Story";
/**
 * Created by Lonmee on 4/23/2017.
 */

export class ViewMgr extends Sprite {
    constructor(private cl: CmdLine) {
        super();
        this.initStage();
        Laya.timer.frameLoop(1, this, this.update);
    }

    initStage() {
        if (Conf.frameworks.bgColor) {
            Laya.stage.bgColor = Conf.frameworks.bgColor;
        }

        if (Conf.frameworks.showStatus) {
            Stat.show();
        }
    }

    update() {
        if (this.cl.end)
            return;
        let cmd:Cmd = this.cl.nextCmd();
        console.log(cmd.code);
    }
}