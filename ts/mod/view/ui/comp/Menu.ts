import Sprite = laya.display.Sprite;
import Graphics = laya.display.Graphics;
import {BGImg, Button, Slider, UIImg} from "./Comp";
import DH from "../../../../data/DH";
import {IdxBtn, Path} from "../../../../data/sotry/Story";
import Event = laya.events.Event;
import {MenuEnum} from "../UIFac";
import {MgrEnum} from "../../../CmdLine";
/**
 * Created by ShanFeng on 5/29/2017.
 */
export class Menu extends Sprite {
    constructor(protected data: any) {
        super();
        this.initView();
        this.initAudio();
        this.initListener();
    }

    protected initView() {

    }

    protected initBGImgAndBtns(bgImg: Path, btnArr: IdxBtn[]) {
        let bArr: Button[] = [];
        //bgImg
        if (this.data.bgImg)
            this.addChild(new UIImg(this.data.bgImg.path));

        //btns
        for (let btn of btnArr) {
            let db: any = DH.instance.story.sys.Buttons[btn.idx];
            if (db.image1.path == "" && db.image1.path == "")
                continue;
            bArr.push(<Button>this.addChild(new Button(btn.idx).pos(btn.x, btn.y)));
        }
        return bArr;
    }

    protected initAudio() {
    }

    protected initListener() {
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

    protected initView() {
        //logo & titleBG
        if (this.data.showLog)
            this.addChild(new UIImg(this.data.logoImage.path));
        if (this.data.drawTitle)
            this.addChild(new BGImg(this.data.titleImage.path));

        //btns
        super.initBGImgAndBtns(null, this.data.buttons);
    }

    protected initAudio() {
        if (this.data.bgm) {
            //todo:load audio file
        }
    }
}

export class Game extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initBGImgAndBtns(this.data.bgImg.path, this.data.buttons);
    }
}

export class Replay extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initBGImgAndBtns(this.data.bgImg, [this.data.closeButton]);

        //vpRect
        this.data.vpRect;
    }
}

export class CG extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton]);

        //noPic
        this.data.noPic;

        //vpRect
        this.data.vpRect;

        //CGList
        this.data.CGList;
    }
}

export class BGM extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton, this.data.selectButton]);

        //noPic
        this.data.noPic;

        //vpRect
        this.data.vpRect;

        //BGMList
        this.data.bgmList;
    }
}

export class Save extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton]);
    }
}

export class Restore extends Menu {
    constructor(data: any) {
        super(data);
    }

    initView() {
        super.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton]);
    }
}

export class Setting extends Menu {
    idxArr: number[];
    btnArr: Button[];
    sliders: Array<[Slider, number]>;

    constructor(data: any) {
        super(data);
    }

    initView() {
        this.idxArr = [];
        this.btnArr = super.initBGImgAndBtns(this.data.bgImg.path, this.data.ShowTitle ? [this.data.closeButton, this.data.TitleButton] : [this.data.closeButton]);
        (<Sprite>this.getChildAt(0)).mouseEnabled = true;
        this.idxArr.push(0);
        if (this.data.ShowTitle)
            this.idxArr.push(1);
        //切开初始化用来加toggle
        let btnArr: IdxBtn[] = [];
        if (this.data.ShowFull) {
            btnArr = btnArr.concat([this.data.fullButton, this.data.winButton]);
            this.idxArr = this.idxArr.concat([2, 3]);
        }
        if (this.data.ShowAuto) {
            btnArr = btnArr.concat([this.data.AutoOn, this.data.AutoOff]);
            this.idxArr = this.idxArr.concat([4, 5]);
        }
        for (let btn of btnArr) {
            let db: any = DH.instance.story.sys.Buttons[btn.idx];
            if (db.image1.path == "" && db.image1.path == "")
                continue;
            this.btnArr.push(<Button>this.addChild(new Button(btn.idx, null, null, true).pos(btn.x, btn.y)));
        }

        this.sliders = [];
        if (this.data.ShowBGM)
            this.sliders.push([<Slider>this.addChild(new Slider(this.data.barNone, this.data.barMove).pos(this.data.BgmX, this.data.BgmY)), 0]);
        if (this.data.ShowSE)
            this.sliders.push([<Slider>this.addChild(new Slider(this.data.barNone, this.data.barMove).pos(this.data.SeX, this.data.SeY)), 1]);
        if (this.data.ShowVoice)
            this.sliders.push([<Slider>this.addChild(new Slider(this.data.barNone, this.data.barMove).pos(this.data.VoiceX, this.data.VoiceY)), 2]);
    }

    initListener() {
        for (let i = 0; i < this.btnArr.length; i++) {
            this.btnArr[i].idx = this.idxArr[i];
            this.btnArr[i].on(Event.CLICK, null, (e: Event) => {
                switch ((<Button>e.target).idx) {
                    case 0:
                        if (this.parent) {
                            this.parent.removeChild(this);
                        }
                        // DH.instance.mgrArr[MgrEnum.view].exe({code: 151, para: [], idt: 0});//so crazy
                        break;
                    case 1:
                        DH.instance.mgrArr[MgrEnum.view].exe({code: 208, para: [], idt: 0});//so crazy
                        break;
                    case 2:
                        this.btnArr[2].toggled = false;
                        this.btnArr[3].toggled = true;
                        //todo:全屏模式
                        break;
                    case 3:
                        this.btnArr[2].toggled = true;
                        this.btnArr[3].toggled = false;
                        //todo:窗口模式
                        break;
                    case 4:
                        this.btnArr[4].toggled = false;
                        this.btnArr[5].toggled = true;
                        //todo:手动播放
                        break;
                    case 5:
                        this.btnArr[4].toggled = true;
                        this.btnArr[5].toggled = false;
                        //todo:自动播放
                        break;
                }
            });
        }

        for (let i = 0; i < this.sliders.length; i++) {
            this.sliders[i][0].on(Event.CHANGE, null, (v: number) => {
                switch (this.sliders[i][1]) {
                    case 0:
                        //todo:设置乐音音量
                        v;
                        break;
                    case 1:
                        //todo:设置音效音量
                        v;
                        break;
                    case 2:
                        //todo:设置语音音量
                        v;
                }
            });
        }
    }

    switchFullscreen(on: boolean) {
        if (this.data.ShowFull) {
            this.btnArr[2].toggled = on;
            this.btnArr[3].toggled = !on;
        }
    }

    switchAutoplay(on: boolean) {
        if (this.data.ShowFull) {
            this.btnArr[4].toggled = on;
            this.btnArr[5].toggled = !on;
        }
    }

    setVolume(n: number, v: number) {
        this.sliders[n][0].setValue(v);
    }
}