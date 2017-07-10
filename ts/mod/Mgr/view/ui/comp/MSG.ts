import {Cmd, TalkWin} from "../../../../../data/sotry/Story";
import DH from "../../../../../data/DH";
import {UIImg} from "./Comp";
import Layouter from "./Layouter";
import Conf from "../../../../../data/Conf";
import Sprite = laya.display.Sprite;
import Text = laya.display.Text;
import Color = laya.utils.Color;
import Event = laya.events.Event;
import Handler = laya.utils.Handler;
import Texture = laya.resource.Texture;
/**
 * Created by ShanFeng on 6/5/2017.
 */
export enum SpeedEnum {Slow, Normal, Fast}

export class MSG extends Sprite {
    bgImg: UIImg;
    txt: Text = new Text();
    dur = [60, 90, 120];

    constructor(private cmd: Cmd) {
        super();
        this.initView();
    }

    private initView() {
        this.autoSize = true;
        this.zOrder = 0;
        DH.instance.story.sys.MessageBox.name;
        DH.instance.story.sys.MessageBox.faceStyle;
        this.constructTalk(DH.instance.story.sys.MessageBox.talk);
    }

    constructTalk(tw: TalkWin) {
        //bg
        if (tw.bgImg) {
            this.bgImg = new UIImg(tw.bgImg.path);
            this.addChild(this.bgImg);

            //text
            this.txt = new Text();
            this.txt.fontSize = 22;
            this.txt.color = "#";
            let vArr: string[] = this.cmd.para[1].split(',');
            while (vArr.length > 0) {
                this.txt.color += parseInt(vArr.shift()).toString(16);
            }
            this.txt.text = this.formatContent(this.cmd.para[2]);
            switch (this.cmd.para[5]) {
                case "0":
                    Layouter.top(this);
                    break;
                case "1":
                    Layouter.center(this);
                    break;
                case "2":
                    Layouter.bottom(this);
            }
            this.txt.x = tw.textX;
            this.txt.y = tw.textY;
            this.addChild(this.txt);
            this.once(Event.CLICK, this, this.clickHandler);
        }
    }

    protected clickHandler(e: Event) {
        //todo:对话关闭条件需修改
        // if (!this.contains(e.target))
        //     return;
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME, true);
        if (this.parent)
            this.parent.removeChild(this);
    }

    /**
     * 0：角色名称
     * 1：角色名称的颜色
     * 2：文本内容
     * 3：头像
     * 4：头像位置 0左 1右
     * 5：文本位置(0上,1中,2下)
     * 6：语速(0"极快", 1"很快", 2"一般", 3"较慢", 4"极慢")
     * 7：是否显示对话框 0不显示 1显示
     * 8：头像来源(网盘还是本地
     * 9：对齐方式(0"居左", 1"居中", 2"居右")
     * 10：描边大小(0"无", 1"细,1像素", 2"中,3像素", 3"粗,5像素")
     * 11：描边颜色
     * 12：投影大小(0到5像素)
     * 13：投影角度(0到360)
     * 14：投影距离(0到5像素)
     * 15：投影颜色(RGB)
     * 16：额外内容（0关闭1开启，多项间|分隔，每项间，分隔）背景图更换开关，背景图 | 是否自定义XY，X，Y | 强调说话人开关，图层编号，类型 | 双重对话，上或下，点后是否消失
     * 17：电影字幕效果 (0关闭1开启，多项间|分隔，每项间，分隔)是否开启 |帧数|起始相对位置类型X,Y(0左(上) 1中 2右(下))|终止相对位置类型X,Y(同前)|起始位置X,Y|终点位置X,Y
     * @param cmd
     * @returns {MSG}
     */
    update(cmd: Cmd) {
        this.once(Event.CLICK, this, this.clickHandler);
        this.txt.text = this.formatContent(cmd.para[2]);
        this.updateZOrder();
        // this.bgImg.visible = cmd.para[7] == "1";
        return this;
    }

    private formatContent(s: string) {
        // \c \v \ x \t  \w \ s \| \. \> \=
        s.replace('\\n', '\\n');
        return s
    }

    extractStr(s: string) {
        let ss = s.split('\\t');
        if (ss.length == 1)
            return ss[0];
        else {
            ss.shift();
            let rs = "";
            for (let ele of ss) {
                rs += DH.instance.sDic.get(parseInt(ele.substr(1, -2)) - 1);
            }
            return rs;
        }
    }
}

// 0:""
// 1:"255,255,255"
// 2:"\c[0,0,0]\t[4]"
// 3:""
// 4:"1"
// 5:"2"
// 6:"0"
// 7:"0"
// 8:"2"
// 9:"0"
// 10:"0"
// 11:"0,0,0"
// 12:"0"
// 13:"0"
// 14:"0"
// 15:"0,0,0"
// 16:"0,0|1,170,190|0,无,0|0,0,0"
// 17:"0|"