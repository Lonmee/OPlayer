import Sprite = laya.display.Sprite;
import Graphics = laya.display.Graphics;
import {BGImg, Button} from "./CompFac";
/**
 * Created by ShanFeng on 5/29/2017.
 */
export class Menu extends Sprite {
    constructor(protected data: any) {
        super();
        this.initView();
    }

    initView() {
    }
}

export class Game extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        //bg
        if (this.data.bgImg.path)
            this.addChild(new BGImg(this.data.bgImg.path));
        //btns
        for (let btn of this.data.buttons) {
            let btnV: Button = new Button(btn.idx);
            btnV.x = btn.x;
            btnV.y = btn.y;
            this.addChild(btnV);
        }
    }
}

export class Title extends Menu {

}

export class Replay extends Menu {

}

export class Setting extends Menu {

}

export class Save extends Menu {

}

export class Store extends Menu {

}