import Sprite = laya.display.Sprite;
import Graphics = laya.display.Graphics;
import {BGImg, Button, UIImg} from "./CompFac";
import DH from "../../../../data/DH";
import Event = laya.events.Event;
/**
 * Created by ShanFeng on 5/29/2017.
 */
export class Menu extends Sprite {
    constructor(protected data: any) {
        super();
        this.initListener();
        this.initView();
        this.initAudio();
    }

    protected initView() {
        //bg
        if (this.data.bgImg)
            this.addChild(new UIImg(this.data.bgImg.path));
        //btns
        for (let btn of this.data.buttons) {
            let db: any = DH.instance.story.sys.Buttons[btn.idx];
            if (db.image1.path == "" && db.image1.path == "")
                continue;
            let btnV: Button = new Button(btn.idx);
            btnV.x = btn.x;
            btnV.y = btn.y;
            this.addChild(btnV);
        }
    }

    protected initAudio() {
    }

    protected initListener() {
    }
}

export class Game extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initView();
    }
}

export class Title extends Menu {
    constructor(data: any) {
        super(data);
    }

    protected initListener() {
        this.on(Event.ADDED, this, this.addHandler);
        this.on(Event.REMOVED, this, this.removeHandler);
    }

    private addHandler(e: Event) {
        if (this.data.bgm) {
            //todo:待定界面背景音实现位置
            //<AudioMgr>DH.instance.mgrArr[MgrEnum.audio]
        }
    }

    private removeHandler(e: Event) {

    }

    initView() {
        if (this.data.showLog)
            this.addChild(new UIImg(this.data.logoImage.path));
        if (this.data.drawTitle)
            this.addChild(new BGImg(this.data.titleImage.path));
        super.initView();
    }

    protected initAudio() {
        if (this.data.bgm) {
            //todo:load audio file
        }
    }
}

export class Replay extends Menu {

}

export class Setting extends Menu {

}

export class Save extends Menu {

}

export class Store extends Menu {

}