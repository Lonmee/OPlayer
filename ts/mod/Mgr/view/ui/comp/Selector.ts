import Sprite = laya.display.Sprite;
import DH from "../../../../../data/DH";
import {Button} from "./Comp";
import Conf from "../../../../../data/Conf";
import {Cmd} from "../../../../../data/sotry/Story";
import Event = laya.events.Event;
import Label = laya.ui.Label;
import Text = laya.display.Text;
import Layouter from "./Layouter";
/**
 * Created by ShanFeng on 6/2/2017.
 */
export interface ISelectable {
    links: number[]
    para: string[]
}

export class Selector extends Sprite implements ISelectable {
    links: number[];
    para: string[];

    constructor(cmd: Cmd) {
        super();
        this.links = cmd.links;
        this.para = cmd.para;
        this.autoSize = true;
        this.initView();
    }

    protected initView() {
        for (let i = 0; i < this.para.length; i++) {
            let db = DH.instance.story.sys.Buttons[DH.instance.story.sys.MessageBox.choiceButtonIndex];
            if (db.image1.path != "" || db.image1.path != "") {
                let btnV: Button = new Button(parseInt(DH.instance.story.sys.MessageBox.choiceButtonIndex), (e: Event) => this.clickHandler(e), () => Layouter.center(this));
                btnV.idx = i;
                btnV.y = i * btnV.height;
                let txt: Text = new Text();
                txt.fontSize = 22;
                txt.color = "#FFFFFF";
                txt.text = this.para[i];
                txt.x = btnV.width - txt.width >> 1;
                txt.y = btnV.height - txt.height >> 1;
                btnV.addChild(txt);
                this.addChild(btnV);
            }
        }
    }

    protected clickHandler(e: Event) {
        DH.instance.eventPoxy.event(Conf.ITEM_CHOOSEN, this.links[e.target['idx']]);
        this.destroy(true);
    }
}

export class SelectorEx extends Selector {
    constructor(cmd: Cmd) {
        super(cmd);
    }

    protected initView(): any {
        for (let i = 0; i < this.links.length; i++) {
            let db = DH.instance.story.sys.Buttons[DH.instance.story.sys.MessageBox.choiceButtonIndex];
            if (db.image1.path != "" || db.image1.path != "") {
                let btnV: Button = new Button(parseInt(DH.instance.story.sys.MessageBox.choiceButtonIndex), (e: Event) => this.clickHandler(e), () => Layouter.center(this));
                btnV.idx = i;
                btnV.y = i * btnV.height;
                let txt: Text = new Text();
                txt.fontSize = 22;
                txt.color = "#FFFFFF";
                txt.text = this.para[9 + i * 2];
                txt.pos(btnV.width - txt.width >> 1, btnV.height - txt.height >> 1);
                btnV.addChild(txt);
                this.addChild(btnV);
            }
        }
    }
}

export class SelectorEx2 extends Selector {
    constructor(cmd: Cmd) {
        super(cmd);
    }

    protected initView(): any {
        for (let i = 0; i < this.links.length; i++) {
            let db = DH.instance.story.sys.Buttons[DH.instance.story.sys.MessageBox.choiceButtonIndex];
            if (db.image1.path != "" || db.image1.path != "") {
                let btnV: Button = new Button(parseInt(DH.instance.story.sys.MessageBox.choiceButtonIndex), (e: Event) => this.clickHandler(e), () => Layouter.center(this));
                btnV.idx = i;
                btnV.y = i * btnV.height;
                let txt: Text = new Text();
                txt.fontSize = 22;
                txt.color = "#FFFFFF";
                txt.text = this.para[15 + i * 3];
                txt.pos(btnV.width - txt.width >> 1, btnV.height - txt.height >> 1);
                btnV.addChild(txt);
                this.addChild(btnV);
            }
        }
    }
}

export class BtnSelector extends Selector {
    constructor(cmd: Cmd) {
        super(cmd);
    }

    protected initView() {
        let idx: number = 0;
        for (let bStr of this.para) {
            let para: string[] = bStr.split(',');
            let db: any = DH.instance.story.sys.Buttons[para[0]];
            if (db.image1.path == "" && db.image1.path == "")
                continue;
            let btnV: Button = new Button(parseInt(para[0]), (e: Event) => this.clickHandler(e));//按钮分歧使用绝对坐标
            btnV.idx = idx++;
            btnV.x = parseInt(para[1]);
            btnV.y = parseInt(para[2]);
            this.addChild(btnV);
        }
    }
}