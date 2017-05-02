import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import CmdLine from "./CmdLine";
/**
 * Created by Lonmee on 4/23/2017.
 */

export class ViewMgr extends Sprite {

    constructor(private cl: CmdLine) {
        super();

        if (Conf.frameworks.bgColor) {
            Laya.stage.bgColor = Conf.frameworks.bgColor;
        }

        if (Conf.frameworks.showStatus) {
            Stat.show();
        }

    }
}