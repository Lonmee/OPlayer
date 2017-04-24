import Sprite = laya.display.Sprite;
import Settings from "../data/Conf";
import Stat = laya.utils.Stat;
/**
 * Created by Lonmee on 4/23/2017.
 */

export class ViewMgr extends Sprite {

    constructor() {
        super();
        let fwSettings = Settings.frameworks;
        if (fwSettings.bgColor) {
            Laya.stage.bgColor = fwSettings.bgColor;
        }

        if (fwSettings.showStatus) {
            Stat.show();
        }
    }
}