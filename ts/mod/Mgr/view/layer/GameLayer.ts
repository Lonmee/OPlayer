import Dictionary = laya.utils.Dictionary;
import {Cmd} from "../../../../data/sotry/Story";
import {Layer} from "./Layer";
import {GameImg} from "../ui/comp/Comp";

/**
 * Created by ShanFeng on 5/16/2017.
 */

export default class GameLayer extends Layer {
    imgDic: Dictionary = new Dictionary();

    constructor() {
        super();
        this.dh.imgDic = this.imgDic;
    }

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
                let imgId = parseInt(cmd.para[0]);
                let x = cmd.para[2] == "0" ? parseInt(cmd.para[3]) : this.getValue(cmd.para[3]);
                let y = cmd.para[2] == "0" ? parseInt(cmd.para[4]) : this.getValue(cmd.para[4]);
                let other = cmd.para.length > 11 && cmd.para[11] == "1";
                let url = other ? this.dh.replaceVTX(this.dh.sDic.get(cmd.para[12])) : cmd.para[1];
                if (this.imgDic.indexOf(imgId) > -1) {
                    gi = this.imgDic.get(imgId);
                    gi.reload(url, other).pos(x, y);
                }
                else {
                    this.imgDic.set(imgId, gi = new GameImg(url, other));
                    this.addChild(gi.pos(x, y));
                    gi.zOrder = imgId;
                }
                gi.alpha = parseInt(cmd.para[7]) / 255;
                gi.scaleX = cmd.para[8] == "1" ? -parseInt(cmd.para[5]) / 100 : parseInt(cmd.para[5]) / 100;
                gi.scaleY = parseInt(cmd.para[6]) / 100;
                break;
            /*
             0:图片ID 1/2/23 远景 背景 前景 3~22 立绘
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
                if (this.imgDic.indexOf(cmd.para[0]) > -1) {
                    this.imgDic.get(cmd.para[0]).destroy(true);
                    this.imgDic.remove(cmd.para[0]);
                }
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
                let i = this.getImg(cmd.para[0]);
                if (i) {
                    let t = parseInt(cmd.para[9]);//time
                    // i.moveTo("x", cmd.para[2] == "0" ? parseInt(cmd.para[3]) : this.getValue(cmd.para[3]), t);
                    // i.moveTo("y", cmd.para[2] == "0" ? parseInt(cmd.para[4]) : this.getValue(cmd.para[4]), t);
                    // i.moveTo("alpha", parseInt(cmd.para[7]) / 255, t);
                    // i.moveTo("scaleX", cmd.para[8] == "1" ? -parseInt(cmd.para[5]) / 100 : parseInt(cmd.para[5]) / 100, t);
                    // i.moveTo("scaleY", parseInt(cmd.para[6]) / 100, t);
                    let tx = cmd.para[2] == "0" ? parseInt(cmd.para[3]) : this.getValue(cmd.para[3]);//x
                    if (i.x != tx)
                        i.moveTo("x", tx, t);
                    let ty = cmd.para[2] == "0" ? parseInt(cmd.para[4]) : this.getValue(cmd.para[4]);//y
                    if (i.y != ty)
                        i.moveTo("y", ty, t);
                    let a = parseInt(cmd.para[7]) / 255;//alpha
                    if (i.alpha != a)
                        i.moveTo("alpha", a, t);
                    let tsX = cmd.para[8] == "1" ? -parseInt(cmd.para[5]) / 100 : parseInt(cmd.para[5]) / 100;//scaleX
                    if (i.scaleX != tsX)
                        i.moveTo("scaleX", tsX, t);
                    let tsY = parseInt(cmd.para[6]) / 100;//scaleY
                    if (i.scaleY != tsY)
                        i.moveTo("scaleY", tsY, t);
                }
                break;
            case 403: //"显示心情"
            case 404: //"旋转图片"
            case 406: //"显示动态图片"
            case 407: //"变色"
        }
    }

    getImg(key) {
        return this.imgDic.get(key);
    }

    getValue(key) {
        return this.dh.vDic.get(key);
    }

    update(speed: number) {
        for (let c of this._childs)
            c.update(speed);
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