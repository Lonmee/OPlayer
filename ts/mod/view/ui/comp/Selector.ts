import Sprite = laya.display.Sprite;
import DH from "../../../../data/DH";
import {Button} from "./Comp";
import Conf from "../../../../data/Conf";
import {Cmd} from "../../../../data/sotry/Story";
import Event = laya.events.Event;
import Label = laya.ui.Label;
import Text = laya.display.Text;
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
                let btnV: Button = new Button(parseInt(DH.instance.story.sys.MessageBox.choiceButtonIndex), (e: Event) => this.clickHandler(e));
                btnV.idx = i;
                btnV.y = i * btnV.height + 10;
                let txt: Text = new Text();
                txt.fontSize = 22;
                txt.color = "#FFFFFF";
                txt.text = this.para[i];
                txt.x = btnV.width - txt.width >> 1;
                txt.y = btnV.height - txt.height >> 1;
                btnV.addChild(txt);
                this.addChild(btnV);
            }
            this.x = Laya.stage.width - this.width >> 1;
            this.y = Laya.stage.height - this.height >> 1;
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
                let btnV: Button = new Button(parseInt(DH.instance.story.sys.MessageBox.choiceButtonIndex), (e: Event) => this.clickHandler(e));
                btnV.idx = i;
                btnV.y = i * btnV.height + 10;
                let txt: Text = new Text();
                txt.fontSize = 22;
                txt.color = "#FFFFFF";
                txt.text = this.para[9 + i * 2];
                txt.x = btnV.width - txt.width >> 1;
                txt.y = btnV.height - txt.height >> 1;
                btnV.addChild(txt);
                this.addChild(btnV);
            }
            this.x = Laya.stage.width - this.width >> 1;
            this.y = Laya.stage.height - this.height >> 1;
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
            let btnV: Button = new Button(parseInt(para[0]), (e: Event) => this.clickHandler(e));
            btnV.idx = idx++;
            btnV.x = parseInt(para[1]);
            btnV.y = parseInt(para[2]);
            this.addChild(btnV);
        }
        // this.x = Laya.stage.width - this.width >> 1;
        // this.y = Laya.stage.height - this.height >> 1;
    }
}