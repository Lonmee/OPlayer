import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import CmdLine from "../mod/CmdLine";
import {Cmd} from "../data/sotry/Story";
import CmdList from "../mod/cmd/CmdList";
import Event = laya.events.Event;
/**
 * Created by Lonmee on 4/23/2017.
 */

export class ViewMgr extends Sprite {
    cmdlist: CmdList;

    constructor(private cl: CmdLine) {
        super();
        this.initStage();
        this.initListener();

        this.cmdlist = new CmdList();
        Laya.stage.addChild(this);
    }

    initStage() {
        if (Conf.frameworks.bgColor) {
            Laya.stage.bgColor = Conf.frameworks.bgColor;
        }

        if (Conf.frameworks.showStatus) {
            Stat.show();
        }
    }

    initListener() {
        Laya.timer.frameLoop(1, this, this.update);
        Laya.stage.on(Event.CLICK, this, this.clickHandler);
    }

    update() {
        if (this.cl.end)
            return;
        let cmd: Cmd = this.cl.nextCmd();
        console.log(cmd.code, this.cmdlist.get(cmd.code));
    }

    clickHandler(e: Event) {
        e;
    }
}