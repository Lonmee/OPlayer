import Sprite = laya.display.Sprite;
import Dictionary = laya.utils.Dictionary;
import {Cmd} from "../../../../data/sotry/Story";
import {Layer} from "./Layer";
import {GameImg} from "../ui/comp/Comp";
/**
 * Created by ShanFeng on 5/16/2017.
 */

export default class GameLayer extends Layer {
    imgDir: Dictionary = new Dictionary();

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 106: //"提示消息框"
            case 107: //"注释"
            case 219: //"气泡式效果"
            case 301: //"天气"
            case 302: //"震动"
            case 303: //"画面闪烁"
            case 304: //"准备转场"
            case 305: //"转场开始"
            case 306: //"更改场景色调"
            case 307: //"插入到BGM鉴赏"
            case 308: //"插入到CG鉴赏"
                break;
            case 400: //"显示图片"
                let gi: GameImg;
                this.imgDir.set(cmd.para[0], gi = new GameImg(cmd.para[1]));
                gi.pos(parseInt(cmd.para[3]), parseInt(cmd.para[4]));
                this.addChild(gi);
                break;
            /*
             0：图片ID
             1:图片相对路径
             2:坐标为常量或数值(0,1)
             3:x坐标
             4:y坐标
             5:x缩放率
             6:y缩放率
             7:不透明度
             8:是否镜像(1,0)
             9:显示信息
             10 网盘还是本地
             【11 是否为字符串指定(1,0)  12 字符串索引】*/
            case 401: //"淡出图片"
                this.removeChild(this.imgDir.get(cmd.para[0]));
                this.imgDir.remove(cmd.para[0]);
                break;
            case 402: //"移动图片"
                // 0：图片ID
                // 1:图片相对路径
                // 2:坐标为常量或数值(0,1)
                // 3:x坐标
                // 4:y坐标
                // 5:x缩放率
                // 6:y缩放率
                // 7:不透明度
                // 8:是否镜像(1,0)
                // 9:时间
                // 10:显示信息
                let x = cmd.para[2] == "0" ? parseInt(cmd.para[3]) : this.dh.cmdLine.valueMgr.vDic.get(cmd.para[3]);
                let y = cmd.para[2] == "0" ? parseInt(cmd.para[4]) : this.dh.cmdLine.valueMgr.vDic.get(cmd.para[4]);
                this.imgDir.get(cmd.para[0]).pos(x, y);
                this.dh.cmdLine.update();
                break;
            case 403: //"显示心情"
            case 404: //"旋转图片"
            case 406: //"显示动态图片"
            case 407: //"变色"
        }
    }
};
/*
 this.spr = new Sprite();
 this.spr.graphics.drawTexture(e);
 this.spr.x = this.spr.y = 400;
 Laya.stage.addChild(this.spr);

 Laya.timer.loop(10, this, this.animateTimeBased);
 Laya.timer.frameLoop(1, this, this.animateFrameRateBased);
 */