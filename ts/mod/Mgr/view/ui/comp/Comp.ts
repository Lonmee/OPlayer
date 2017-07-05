import Graphics = laya.display.Graphics;
import DH from "../../../../../data/DH";
import {Path} from "../../../../../data/sotry/Story";
import Sprite = laya.display.Sprite;
import Event = laya.events.Event;
import Point = laya.maths.Point;
import Handler = laya.utils.Handler;
/**
 * Created by ShanFeng on 5/31/2017.
 */
const GRAPHICS_BG_PATH_SHIFTER = "graphics/background/";
function getBGLink(key: string) {
    return DH.instance.getResLink(GRAPHICS_BG_PATH_SHIFTER + key);
}

const UI_PATH_SHIFTER = "graphics/ui/";
export function getUILink(key: string) {
    return DH.instance.getResLink(UI_PATH_SHIFTER + key);
}

const BUTTON_PATH_SHIFTER = "graphics/button/";
export function getBtnLink(key: string) {
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
    tween: [string, number, number, number, number][] = [];

    constructor(path: string) {
        super();
        this.loadImage(getGameImgLink(path));
    }

    reload(path: string) {
        this.graphics.clear();
        this.loadImage(getGameImgLink(path));
        return this;
    }

    moveTo(property: string, value: number, duration: number, passed: number = 0) {
        if (duration <= 1)
            this[property] = value;
        else
            this.tween.push([property, value, duration, passed, this[property]]);
        return this;
    }

    update() {
        if (this.tween.length)
            for (let t of this.tween) {
                this[t[0]] = t[4] + (t[1] - t[4]) * ++t[3] / t[2];
                if (t[3] == t[2])
                    this.tween.splice(this.tween.indexOf(t), 1);
            }
    }
}

export function getBtnData(idx: number) {
    return DH.instance.story.sys.Buttons[idx];
}

export class UIImg extends Sprite {
    constructor(path: string, repos = null) {
        super();
        this.loadImage(getUILink(path), 0, 0, 0, 0, repos);
    }
}

export class BGImg extends Sprite {
    constructor(path: string) {
        super();
        this.loadImage(getBGLink(path));
    }
}

export class Button extends Sprite {
    private _toggled: boolean;

    i1: Graphics;
    i2: Graphics;
    idx: number;

    constructor(idx: number, private cHandler = null, private repos = null, private toggle: boolean = false) {
        super();
        this.init(getBtnData(idx));
        //todo:体验纠结
        this.mouseThrough = true;
    }

    init({name, image1, image2, x, y}) {
        this.name = name;
        //如果图一为空则互换图一图二
        if (image1.path.length == 0) {
            image1 = image2;
            image2.path = '';
        }
        if (image1.path.length) {
            this.graphics = this.i1 = new Graphics();
            this.i1.loadImage(getBtnLink(image1.path), 0, 0, 0, 0, this.completeHandler);
        }
        if (image2.path.length) {
            this.i2 = new Graphics();
            this.i2.loadImage(getBtnLink(image2.path));
        }
        this.x = x;
        this.y = y;
        this.on(Event.CLICK, this, this.click);
        if (!this.toggle) {
            this.on(Event.MOUSE_OVER, this, this.switchImg);
            this.on(Event.MOUSE_OUT, this, this.restoreImg);
        }
    }

    completeHandler(e) {
        this.size(e.width, e.height);
        if (this.repos)
            this.repos(e);
    }

    get toggled(): boolean {
        return this._toggled;
    }

    set toggled(value: boolean) {
        this._toggled = value;
        this.alpha = value ? .2 : 1;
    }

    private click(e: Event) {
        if (this.toggle) {
            this.toggled = !this._toggled;
        }
        if (this.cHandler)
            this.cHandler.call(null, e);
        else
            console.log(this.name, "clicked");
    }

    private switchImg(e: Event) {
        if (this.i2)
            this.graphics = this.i2;
        else {
            this.alpha = .2;
        }
    }

    private restoreImg(e: Event) {
        if (this.i2)
            this.graphics = this.i1;
        else {
            this.alpha = 1;
        }
    }
}

export class Slider extends Sprite {
    private bar: UIImg;
    private barMask: Sprite;

    constructor(bg: Path, fg: Path) {
        super();
        this.constructView(bg, fg);
    }

    private constructView(bg: Path, fg: Path) {
        this.addChild(new UIImg(bg.path));
        this.barMask = new Sprite();
        this.bar = new UIImg(fg.path, Handler.create(this, this.initMask, null, true));
        this.bar.on(Event.MOUSE_DOWN, this, this.mdHandler);
        this.bar.on(Event.MOUSE_UP, this, this.muHandler);
        this.stage.on(Event.MOUSE_UP, this, this.muHandler);
        this.stage.on(Event.MOUSE_OUT, this, this.muHandler);
    }

    private initMask(tex) {
        this.barMask.graphics.drawRect(0, 0, tex.width, tex.height, 0xFFFFFF);
        this.barMask.x = -50;
        this.barMask.width = tex.width;
        this.bar.mask = this.barMask;
        this.addChild(this.bar);
    }

    private mdHandler(e: Event) {
        // this.on(Event.MOUSE_MOVE, this, this.changeHandler);
        this.stage.on(Event.MOUSE_MOVE, this, this.changeHandler);
        this.changeHandler(e);
    }

    private muHandler(e: Event) {
        // this.off(Event.MOUSE_MOVE, this, this.changeHandler);
        this.stage.off(Event.MOUSE_MOVE, this, this.changeHandler);
    }

    private changeHandler(e: Event): void {
        let v: number;
        let mX: number = this.globalToLocal(new Point(e.stageX, e.stageY)).x;
        //取值的最大范围
        let max: number = this.bar.x + this.bar.width;
        //取值的最小范围
        let min: number = this.bar.x;
        if (mX > min && mX < max) {
            this.barMask.x = mX - this.barMask.width;
            v = (this.barMask.x + this.barMask.width) / (this.bar.width);
        } else if (mX <= min) {
            this.barMask.x = -this.barMask.width;
            v = 0;
        } else if (mX >= max) {
            this.barMask.x = this.bar.x;
            v = 1;
        }
        this.event(Event.CHANGE, v);
    }

    /**
     * 设置位置，0~1
     * @param v
     */
    public setValue(v: number) {
        this.barMask.x = this.bar.width * v - this.barMask.width;
    }
}