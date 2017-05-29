import Sprite = laya.display.Sprite;
import DH from "../../../../data/DH";
import Graphics = laya.display.Graphics;
import Event = laya.events.Event;
/**
 * Created by ShanFeng on 5/29/2017.
 */
export class Menu extends Sprite {
    protected dh: DH = DH.instance;

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
            this.addChild(new Sprite().loadImage(getBGLink(this.data.bgImg.path)));
        //btns
        for (let btn of this.data.buttons) {
            let btnV: Button = new Button(getBtnData(btn.idx))
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

const UI_PATH_SHIFTER = "graphics/ui/";

function getBGLink(key: string) {
    return DH.instance.getResLink(UI_PATH_SHIFTER + key);

}

const BUTTON_PATH_SHIFTER = "graphics/button/";

function getBtnLink(key: string) {
    return DH.instance.getResLink(BUTTON_PATH_SHIFTER + key);

}

function getBtnData(idx: number) {
    return DH.instance.story.sys.Buttons[idx];
}

class Button extends Sprite {
    name: string;
    i1: Graphics;
    i2: Graphics;

    constructor({name, image1, image2, x, y}) {
        super();
        this.name = name;
        this.autoSize = true;
        this.graphics = this.i1 = new Graphics();
        this.i1.loadImage(getBtnLink(image1.path));
        this.i2 = new Graphics();
        this.i2.loadImage(getBtnLink(image2.path));
        this.x = x;
        this.y = y;
        this.on(Event.CLICK, this, this.click);
        this.on(Event.MOUSE_OVER, this, this.switchImg);
        this.on(Event.MOUSE_OUT, this, this.restoreImg);
    }

    private click(e: Event) {
        this.name;
    }

    private switchImg(e: Event) {
        this.graphics = this.i2;
    }

    private restoreImg(e: Event) {
        this.graphics = this.i1;
    }
}