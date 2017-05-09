import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import Event = laya.events.Event;
import DH from "../data/DH";
import CmdLine from "./CmdLine";
/**
 * Created by Lonmee on 4/23/2017.
 */
enum layers {ui, float, game}

export class ViewMgr extends Sprite {
    constructor(private cmdLine: CmdLine) {
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
        DH.instance.eventPoxy.on(Conf.LOADING_PROGRESS, this, this.progress);
        Laya.timer.frameLoop(1, this, this.update);
        Laya.stage.on(Event.CLICK, this, this.clickHandler);
    }

    progress(f: string, p: number) {
        // f = f.replace(/(.*\/){0,}([^\.]+).*/ig, "$2");
        // console.log(`loading ${f} ${Math.floor(p * 100)}`);
    }

    /**
     * 渲染句柄，视图更新唯一频刷器
     */
    update() {
        if (this.cmdLine.pause)
            return;
        this.cmdLine.nextScene();
    }

    /**
     * 交互事件分发器
     * @param e
     */
    clickHandler(e: Event) {
        e;
    }
}

/*
 this.spr = new Sprite();
 this.spr.graphics.drawTexture(e);
 this.spr.x = this.spr.y = 400;
 Laya.stage.addChild(this.spr);

 Laya.timer.loop(10, this, this.animateTimeBased);
 Laya.timer.frameLoop(1, this, this.animateFrameRateBased);
 */