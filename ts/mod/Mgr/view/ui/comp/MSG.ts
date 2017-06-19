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
export class MSG extends Sprite {
    bgImg: UIImg;
    txt: Text = new Text();

    constructor(private cmd: Cmd) {
        super();
        this.initView();
    }

    private initView() {
        this.autoSize = true;
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
            this.txt.text = this.cmd.para[2];
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
            this.txt.x = this.width - this.txt.width >> 1;
            this.txt.y = (this.height - this.txt.height >> 1) + 10;
            this.addChild(this.txt);
            Laya.stage.once(Event.CLICK, this, this.clickHandler);
        }
    }

    protected clickHandler(e: Event) {
        //todo:对话关闭条件需修改
        // if (!this.contains(e.target))
        //     return;
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
        if (this.parent)
            this.parent.removeChild(this);
    }

    update(cmd: Cmd) {
        Laya.stage.once(Event.CLICK, this, this.clickHandler);
        this.txt.text = cmd.para[2];
        return this;
    }
}
