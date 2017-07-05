import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../../data/Conf";
import DH from "../../data/DH";
import UILayer from "./view/layer/UILayer";
import GameLayer from "./view/layer/GameLayer";
import {Cmd} from "../../data/sotry/Story";
import FloatLayer from "./view/layer/FloatLayer";
import {Layer} from "./view/layer/Layer";
import {IMgr} from "./Mgr";
import {StateEnum} from "../state/State";
import Event = laya.events.Event;
import Browser = laya.utils.Browser;
import Stage = laya.display.Stage;
/**
 * Created by Lonmee on 4/23/2017.
 */
export class ViewMgr extends Sprite implements IMgr {
    gl: GameLayer;
    fl: FloatLayer;
    ul: UILayer;
    layerArr: Layer[] = [
        this.gl = new GameLayer(),
        this.fl = new FloatLayer(),
        this.ul = new UILayer()
    ];
    dh: DH = DH.instance;

    constructor() {
        super();

        this.initStage();
        this.initListener();
    }

    initStage() {
        if (Conf.frameworks.bgColor) {
            Laya.stage.bgColor = Conf.frameworks.bgColor;
        }

        if (Conf.frameworks.showStatus) {
            Stat.show();
        }

        Laya.stage.scaleMode = Stage.SCALE_SHOWALL;
        Laya.stage.alignH = Stage.ALIGN_CENTER;
        Laya.stage.alignV = Stage.ALIGN_MIDDLE;
        Laya.stage.addChild(this);

        for (let layer of this.layerArr)
            this.addChild(layer);

    }

    initListener() {//系统用交互事件总代
        this.stage.on(Event.KEY_DOWN, this, this.kdHandler);
        this.stage.on(Event.KEY_UP, this, this.kuHandler);
        this.stage.on(Event.BLUR, this, this.blurHandler);
        this.dh.eventPoxy.on(Conf.LOADING_PROGRESS, this, this.progress);
    }

    kdHandler(e: Event) {
        switch (e.nativeEvent.code) {
            case "KeyS":
                Conf.frameworks.showStatus ? Stat.hide() : Stat.show();
                Conf.frameworks.showStatus = !Conf.frameworks.showStatus;
                break;
            case "KeyN":
                this.dh.eventPoxy.event(Conf.CMD_LINE_RESUME);
                break;
            case "KeyZ":
                this.dh.eventPoxy.event(Conf.CHANGE_STATE, StateEnum.FF);
                break;
        }
    }

    kuHandler(e: Event) {
        switch (e.nativeEvent.code) {
            case "KeyZ":
                this.dh.eventPoxy.event(Conf.CHANGE_STATE, StateEnum.Normal);
                break;
        }
    }

    blurHandler(e: Event) {
        this.dh.eventPoxy.event(Conf.STAGE_BLUR);
    }

    /**
     * 加载进度回调
     * @param f
     * @param p
     */
    progress(f: string, p: number) {
        // f = f.replace(/(.*\/){0,}([^\.]+).*/ig, "$2");
        // console.log(`loading ${f} ${Math.floor(p * 100)}`);
    }

    /**
     * 对cmd进行分流，ui、浮层、游戏
     * @param cmd
     */
    exe(cmd: Cmd) {
        // UI交互类 & UI控制指令:this.ul.exe(cmd);
        // 悬浮组件:this.fl.exe(cmd);
        // 视图操作命令:this.gl.exe(cmd);
        for (let i = this.layerArr.length; i > 0;) {
            this.layerArr[--i].exe(cmd);
        }
    }

    update(delay: number) {
        for (let i = this.layerArr.length; i > 0;) {
            this.layerArr[--i].update(delay);
        }
    }
}