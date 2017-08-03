import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import Event = laya.events.Event;
import Stage = laya.display.Stage;
import Conf from "../../data/Conf";
import DH from "../../data/DH";
import UILayer from "./view/layer/UILayer";
import GameLayer from "./view/layer/GameLayer";
import {Cmd} from "../../data/sotry/Story";
import FloatLayer from "./view/layer/FloatLayer";
import {Layer} from "./view/layer/Layer";
import {IMgr} from "./Mgr";
import {StateEnum} from "../state/State";

/**
 * Created by Lonmee on 4/23/2017.
 */
export class ViewMgr extends Sprite implements IMgr {
    gl: GameLayer;
    ul: UILayer;
    fl: FloatLayer;
    layerArr: Layer[] = [
        this.gl = new GameLayer(),
        this.ul = new UILayer(),
        this.fl = new FloatLayer()
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
        this.stage.on(Event.RIGHT_CLICK, this, this.rcHandler);
        this.dh.eventPoxy.on(Conf.LOADING_PROGRESS, this, this.progress);
    }

    rcHandler(e: Event) {
        this.dh.eventPoxy.event(e.type);
    }

    kdHandler(e: Event) {
        switch (e.nativeEvent.code) {
            case "KeyS":
                Conf.frameworks.showStatus ? Stat.hide() : Stat.show();
                Conf.frameworks.showStatus = !Conf.frameworks.showStatus;
                break;
            case "KeyN":
                this.dh.eventPoxy.event(Conf.ITEM_CHOSEN);
                break;
            case "KeyZ":
                this.dh.eventPoxy.event(Conf.STATE_FF);
                break;
            case "Escape":
                this.dh.eventPoxy.event(e.type);
                break;
        }
    }

    kuHandler(e: Event) {
        switch (e.nativeEvent.code) {
            case "KeyZ":
                this.dh.eventPoxy.event(Conf.STATE_CANCEL);
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
        switch (cmd.code) {
            //UI控制指令
            case 150: //"刷新UI画面"
                break;
            case 151: //"返回游戏界面"
                this.swapUlFl();
                break;
            case 208: //"返回标题画面"
            case 214:  //"呼叫游戏界面"
                this.swapUlFl("u");
                break;
            case 218: //"强制存档读档"
                break;
            case 110: //"打开指定网页";
                break;
            case 111: //"禁用开启菜单功能";
            // UI交互类 & UI控制指令:this.ul.exe(cmd);
            // 悬浮组件:this.fl.exe(cmd);
            // 视图操作命令:this.gl.exe(cmd);
        }
        for (let i = this.layerArr.length; i > 0;) {
            this.layerArr[--i].exe(cmd);
        }
    }

    update(speed: number) {
        for (let i = this.layerArr.length; i > 0;) {
            this.layerArr[--i].update(speed);
        }
    }

    swapUlFl(layer: string = "") {
        this.addChild(layer == "u" ? this.ul : this.fl);
    }

    reset() {
        for (let i = this.layerArr.length; i > 0;) {
            this.layerArr[--i].reset();
        }
    }
}