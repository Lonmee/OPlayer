import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import Event = laya.events.Event;
/**
 * Created by Lonmee on 4/23/2017.
 */

export class ViewMgr extends Sprite {
    constructor() {
        super();
        this.initStage();
        this.initListener();

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

    /**
     * 渲染句柄，视图更新唯一频刷器
     */
    update() {

    }

    /**
     * 交互事件分发器
     * @param e
     */
    clickHandler(e: Event) {
        e;
    }
}