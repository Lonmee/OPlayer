import Sprite = laya.display.Sprite;
import Stat = laya.utils.Stat;
import WebGL = laya.webgl.WebGL;
import Conf from "../data/Conf";
import Event = laya.events.Event;
import DH from "../data/DH";
import CmdLine from "./CmdLine";
import Scene from "./cmd/Scene";
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
    update(sid: number = NaN) {
        let s: Scene = this.cmdLine.nextScene(sid);
        if (s == null) {
            return;
        }
        for (let cmd of s.cmdArr) {
            switch (cmd.code) {
                case 100 : {//"显示文章"
                    console.log("                   ", cmd.para[2]);
                    this.cmdLine.pause = true;
                    break;
                }

                case 101: {//剧情分歧
                    let choise: string = window.prompt("input your choise below   option[" + cmd.para.slice(cmd.para.length / 2).toString() + "]");
                    while (choise == "") {
                        choise = window.prompt("input your choise below   option[" + cmd.para.slice(cmd.para.length / 2).toString() + "]");
                    }
                    // break;
                    return this.update(parseInt(cmd.para[cmd.para.length / 2 + parseInt(choise) - 1]));
                }

                case 1010: {//剧情分歧EX

                }

                case 1011: {//剧情分歧EX2

                }


                case 106://"提示消息框"
                case 107://"注释"
                case 109://"消失对话框"
                case 204: {//按钮分歧

                }
                case 219://"气泡式效果"
                case 301://"天气"
                case 302://"震动"
                case 303://"画面闪烁"
                case 304://"准备转场"
                case 305://"转场开始"
                case 306://"更改场景色调"
                case 307://"插入到BGM鉴赏"
                case 308://"插入到CG鉴赏"
                case 400://"显示图片"
                case 401://"淡出图片"
                case 402://"移动图片"
                case 403://"显示心情"
                case 404://"旋转图片"
                case 406://"显示动态图片"
                case 407://"变色"
            }
        }
    }

    /**
     * 交互事件分发器
     * @param e
     */
    clickHandler(e: Event) {
        // console.log(e.currentTarget);
        this.cmdLine.pause = false;
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