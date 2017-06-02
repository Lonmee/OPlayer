import Graphics = laya.display.Graphics;
import DH from "../../../../data/DH";
import Sprite = laya.display.Sprite;
import Event = laya.events.Event;
/**
 * Created by ShanFeng on 5/31/2017.
 */
const GRAPHICS_BG_PATH_SHIFTER = "graphics/background/";
function getBGLink(key: string) {
    return DH.instance.getResLink(GRAPHICS_BG_PATH_SHIFTER + key);
}

const UI_PATH_SHIFTER = "graphics/ui/";
function getUILink(key: string) {
    return DH.instance.getResLink(UI_PATH_SHIFTER + key);
}

const BUTTON_PATH_SHIFTER = "graphics/button/";
function getBtnLink(key: string) {
    return DH.instance.getResLink(BUTTON_PATH_SHIFTER + key);
}

const GRAPHICS_PATH_SHIFTER = "graphics/";
function getGameImgLink(key: string) {
    return DH.instance.getResLink(GRAPHICS_PATH_SHIFTER + key);
}

const AUDIO_BG_PATH_SHIFTER = "audio/bgm/";
function getBGAudioLink(key: string) {
    return DH.instance.getResLink(AUDIO_BG_PATH_SHIFTER + key);
}

//todo:移植到GameLayer范畴内
export class GameImg extends Sprite {
    constructor(path: string) {
        super();
        this.loadImage(getGameImgLink(path));
    }
}

function getBtnData(idx: number) {
    return DH.instance.story.sys.Buttons[idx];
}

export class UIImg extends Sprite {
    constructor(path: string) {
        super();
        this.loadImage(getUILink(path));
    }
}

export class BGImg extends Sprite {
    constructor(path: string) {
        super();
        this.loadImage(getBGLink(path));
    }
}

export class Button extends Sprite {
    i1: Graphics;
    i2: Graphics;
    idx: number;

    constructor(idx: number, private cHandler = null) {
        super();
        this.init(getBtnData(idx));
    }

    init({name, image1, image2, x, y}) {
        this.name = name;
        this.autoSize = true;
        this.graphics = this.i1 = new Graphics();
        if (image1.path.length) {
            this.i1.loadImage(getBtnLink(image1.path));
        }
        this.i2 = new Graphics();
        if (image2.path.length) {
            this.i2.loadImage(getBtnLink(image2.path));
        }
        this.x = x;
        this.y = y;
        this.on(Event.CLICK, this, this.click);
        this.on(Event.MOUSE_OVER, this, this.switchImg);
        this.on(Event.MOUSE_OUT, this, this.restoreImg);
    }

    private click(e: Event) {
        if (this.cHandler)
            this.cHandler.call(null, e);
        else
            console.log(this.name, "clicked");
    }

    private switchImg(e: Event) {
        this.graphics = this.i2;
    }

    private restoreImg(e: Event) {
        this.graphics = this.i1;
    }
}