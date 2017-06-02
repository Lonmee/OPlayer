import Sprite = laya.display.Sprite;
import DH from "../../../../data/DH";
import {Button} from "./Comp";
import Conf from "../../../../data/Conf";
import {Cmd} from "../../../../data/sotry/Story";
import Event = laya.events.Event;
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
        this.initView();
    }

    protected initView() {
        let idx: number = 0;
        let db = DH.instance.story.sys.Buttons[DH.instance.story.sys.MessageBox.choiceButtonIndex];
        if (db.image1.path != "" || db.image1.path != "") {
            let btnV: Button = new Button(parseInt(DH.instance.story.sys.MessageBox.choiceButtonIndex), (e: Event) => this.clickHandler(e));
            btnV.idx = idx++;
            this.addChild(btnV);
        }
    }

    protected clickHandler(e: Event) {
        DH.instance.eventPoxy.event(Conf.ITEM_CHOOSEN, this.links[e.target['idx']]);
        this.destroy(true);
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
    }
}