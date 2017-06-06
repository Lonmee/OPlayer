import {Cmd, TalkWin} from "../../../../data/sotry/Story";
import Sprite = laya.display.Sprite;
import DH from "../../../../data/DH";
import {Button, UIImg} from "./Comp";
import Text = laya.display.Text;
import Color = laya.utils.Color;
import Conf from "../../../../data/Conf";
import Event = laya.events.Event;
/**
 * Created by ShanFeng on 6/5/2017.
 */
export class MSG extends Sprite {
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
            let bgImg: UIImg = new UIImg(tw.bgImg.path);
            bgImg.x = Laya.stage.width - bgImg.width >> 1;
            this.addChild(bgImg);
        }
        //btns
        // for (let btn of tw.buttons) {
        //     let db: any = DH.instance.story.sys.Buttons[btn.idx];
        //     if (db.image1.path == "" && db.image1.path == "")
        //         continue;
        //     let btnV: Button = new Button(btn.idx);
        //     btnV.x = btn.x;
        //     btnV.y = btn.y;
        //     this.addChild(btnV);
        // }

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
                break;
            case "1":
                break;
            case "2":
                this.y = Laya.stage.height - this.height;
        }
        this.txt.x = this.width - this.txt.width >> 1;
        this.txt.y = this.height - this.txt.height >> 1;
        this.addChild(this.txt);
        Laya.stage.once(Event.CLICK, this, this.clickHandler);
    }

    protected clickHandler(e: Event) {
        DH.instance.eventPoxy.event(e.type, e);
        // this.destroy(true);
        if (this.parent)
            this.parent.removeChild(this);
    }

    update(cmd: Cmd) {
        Laya.stage.once(Event.CLICK, this, this.clickHandler);
        this.txt.text = cmd.para[2];
        return this;
    }
}
