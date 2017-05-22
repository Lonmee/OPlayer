import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import DH from "../data/DH";
import UILayer from "./view/UILayer";
import GameLayer from "./view/GameLayer";
import CmdList from "./cmd/CmdList";
import {Cmd} from "../data/sotry/Story";
import {IMgr} from "./Mgr";
import Event = laya.events.Event;
/**
 * Created by Lonmee on 4/23/2017.
 */
enum layers {ui, float, game}
export class ViewMgr extends Sprite implements IMgr {
    cmdList: CmdList = new CmdList();
    gameLayer: GameLayer = new GameLayer();
    uiLayer: UILayer = new UILayer();
    dh: DH = DH.instance;

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
        this.dh.eventPoxy.on(Conf.LOADING_PROGRESS, this, this.progress);
        Laya.stage.on(Event.CLICK, this, this.clickHandler);
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
     * 渲染句柄，视图更新唯一频刷器
     */
    exe(cmd: Cmd) {
        switch (cmd.code) {
            //视图交互类
            case 100 : {//"显示文章"
                console.log(cmd.para[2]);
                break;
            }
            case 101: //剧情分歧
            case 1010: //剧情分歧EX
            case 1011: //剧情分歧EX2
            case 204: { //按钮分歧
                console.log(cmd.code, this.cmdList.get(cmd.code));
                let choise: string = window.prompt(cmd.para.toString() + "\n input your choise below   option [" + cmd.links + "]");
                while (choise == "") {
                    choise = window.prompt("input your choise below   option [" + cmd.links + "]");
                }
                this.dh.eventPoxy.event(Conf.ITEM_CHOOSEN, cmd.links[parseInt(choise) - 1]);
                return;
            }
            //视图操作命令
            case 106: //"提示消息框"
            case 107: //"注释"
            case 109: //"消失对话框"
            case 219: //"气泡式效果"
            case 301: //"天气"
            case 302: //"震动"
            case 303: //"画面闪烁"
            case 304: //"准备转场"
            case 305: //"转场开始"
            case 306: //"更改场景色调"
            case 307: //"插入到BGM鉴赏"
            case 308: //"插入到CG鉴赏"
            case 400: //"显示图片"
            case 401: //"淡出图片"
            case 402: //"移动图片"
            case 403: //"显示心情"
            case 404: //"旋转图片"
            case 406: //"显示动态图片"
            case 407: //"变色"
            //显示控制指令
            case 150: //"刷新UI画面"
            case 151: //"返回游戏界面"
            case 208: //"返回标题画面"
            case 214: //"呼叫游戏界面"
            case 218: //"强制存档读档"
            case 110: //"打开指定网页";
            case 111: //"禁用开启菜单功能";
            case 112: {//"悬浮组件开关";
                console.log(cmd.code, this.cmdList.get(cmd.code));
            }
        }
    }

    /**
     * 交互事件分发器
     * @param e
     */
    clickHandler(e: Event) {
        this.dh.eventPoxy.event(e.type, e);
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