import Sprite = laya.display.Sprite;
import Event = laya.events.Event;
import {BGImg, Button, Label, OtherImg, Slider, UIImg} from "./Comp";
import DH from "../../../../../data/DH";
import {CusUI, IdxBtn, Path} from "../../../../../data/sotry/Story";
import {MgrEnum} from "../../../../CmdLine";
import {MenuEnum} from "../UIFac";
import Conf from "../../../../../data/Conf";
import {StateEnum} from "../../../../state/State";
import Chapter from "../../../../cmd/chapter/Chapter";

/**
 * Created by ShanFeng on 5/29/2017.
 */
export class Menu extends Sprite {
    protected btnArr: Button[];

    constructor(public idx: number, protected data: any) {
        super();
        this.initView();
        this.initAudio();
        this.initListener();
    }

    close() {
        this.event(Event.CLOSE, this.idx);
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
            // if (db.image1.path == "" && db.image1.path == "")
            //     continue;
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
    constructor(ind: number, data: any) {
        super(ind, data);
    }

    protected initView() {
        //logo & titleBG
        if (this.data.showLog)
            this.addChild(new UIImg(this.data.logoImage.path));
        if (this.data.drawTitle)
            this.addChild(new BGImg(this.data.titleImage.path));

        //btns
        this.initBGImgAndBtns(null, this.data.buttons)[0].on(Event.CLICK, this, this.clickHandler);
    }

    protected initListener() {
        this.on(Event.ADDED, this, this.addHandler);
        this.on(Event.REMOVED, this, this.removeHandler);
        this.on(Event.CLICK, this, this.clickHandler);
    }

    private clickHandler(e: Event) {
        DH.instance.story.gotoChapter(DH.instance.story.sys.startStoryId);
        this.close();
    }

    private addHandler(e: Event) {
        if (this.data.bgm) {
            //todo:待定界面背景音实现位置
            //<AudioMgr>DH.instance.mgrArr[MgrEnum.audio]
        }
    }

    private removeHandler(e: Event) {

    }

    protected initAudio() {
        if (this.data.bgm) {
            //todo:load audio file
        }
    }
}

export class Game extends Menu {
    btnArr: Button[];

    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.btnArr = this.initBGImgAndBtns(this.data.bgImg.path, this.data.buttons);
    }

    initListener() {
        for (let i = 0; i < this.btnArr.length; i++) {
            this.btnArr[i].idx = i;
            this.btnArr[i].on(Event.CLICK, null, (e: Event) => {
                switch ((<Button>e.target).idx) {
                    case 0:
                        MenuEnum.save;
                        break;
                    case 1:
                        MenuEnum.restore;
                        break;
                    case 2:
                        MenuEnum.replay;
                        break;
                    case 3:
                        DH.instance.eventPoxy.event(Conf.STATE_AUTO, StateEnum.Auto);
                        break;
                    case 4:
                        MenuEnum.setting;
                        break;
                    case 5:
                        this.close();
                        break;
                }
            })
        }
    }
}

export class Replay extends Menu {
    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.initBGImgAndBtns(this.data.bgImg, [this.data.closeButton]);

        //vpRect
        this.data.vpRect;
    }
}

export class CG extends Menu {
    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.btnArr = this.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton]);

        //noPic
        this.data.noPic;

        //vpRect
        this.data.vpRect;

        //CGList
        this.data.CGList;
    }

    initListener() {
        for (let i = 0; i < this.btnArr.length; i++) {
            this.btnArr[i].idx = i;
            this.btnArr[i].on(Event.CLICK, null, (e: Event) => {
                switch ((<Button>e.target).idx) {
                    case 0:
                        this.close();
                        break;
                    default:

                }
            });
        }
    }
}

export class BGM extends Menu {
    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton, this.data.selectButton]);

        //noPic
        this.data.noPic;

        //vpRect
        this.data.vpRect;

        //BGMList
        this.data.bgmList;
    }
}

export class Save extends Menu {
    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.btnArr = this.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton]);
    }

    initListener() {
        for (let i = 0; i < this.btnArr.length; i++) {
            this.btnArr[i].idx = i;
            this.btnArr[i].on(Event.CLICK, null, (e: Event) => {
                switch ((<Button>e.target).idx) {
                    case 0:
                    case 1:
                        this.close();
                        break;
                    default:

                }
            });
        }
    }
}

export class Restore extends Menu {
    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.btnArr = this.initBGImgAndBtns(this.data.bgImg.path, [this.data.closeButton, this.data.backButton]);
    }

    initListener() {
        for (let i = 0; i < this.btnArr.length; i++) {
            this.btnArr[i].idx = i;
            this.btnArr[i].on(Event.CLICK, null, (e: Event) => {
                switch ((<Button>e.target).idx) {
                    case 0:
                    case 1:
                        this.close();
                        break;
                    default:

                }
            });
        }
    }
}

export class Setting extends Menu {
    idxArr: number[];
    btnArr: Button[];
    sliders: Array<[Slider, number]>;

    constructor(ind: number, data: any) {
        super(ind, data);
    }

    initView() {
        this.idxArr = [];
        this.btnArr = this.initBGImgAndBtns(this.data.bgImg.path, this.data.ShowTitle ? [this.data.closeButton, this.data.TitleButton] : [this.data.closeButton]);
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
                        this.close();
                        // DH.instance.mgrArr[MgrEnum.view].exe({code: 151, para: [], idt: 0});//so crazy
                        break;
                    case 1:
                        DH.instance.mgrArr[MgrEnum.view].exe({code: 208, para: []});//so crazy
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

export class CUI extends Menu {
    bounds: any;
    private afterChapter: Chapter;
    private loadChapter: Chapter;
    private controlSpr: Sprite;

    constructor(ind: number, data: CusUI) {
        super(ind, data);
        data.showEffect;//todo:dcui.showEffect
    }

    close() {
        while (this.bounds && this.bounds.length) {
            let ba = this.bounds.pop();
            ba[0].unbind(ba[1], ba[2]);
        }
        while (this.controlSpr.numChildren)
            this.controlSpr.removeChildAt(0).destroy(true);
        if (this.data.isMouseExit)
            DH.instance.eventPoxy.off(Event.RIGHT_CLICK, this, super.close);
        if (this.data.isKeyExit)
            DH.instance.eventPoxy.off("Escape", this, super.close);
    }

    protected initView() {
        this.addChild(this.controlSpr = new Sprite());
        if (this.data.loadEvent.length) {
            this.loadChapter = new Chapter({id: NaN, name: "CUI_load", cmdArr: this.data.loadEvent});
        }
        if (this.data.afterEvent.length)
            this.afterChapter = new Chapter({id: NaN, name: "after", cmdArr: this.data.afterEvent});
        this.exeLoadChapter();
    }

    updateControls() {
        this.bounds = [];
        for (let ctl of this.data.controls) {
            switch (ctl.type) {
                case 0://按钮
                    let b;
                    this.controlSpr.addChild(b = new Button(ctl.useIdx ? DH.instance.vDic.get(ctl.index) - 1 : ctl.index)
                        .pos(ctl.useVar ? DH.instance.vDic.get(ctl.x) : ctl.x, ctl.useVar ? DH.instance.vDic.get(ctl.y) : ctl.y));
                    if (ctl.cmdArr.length)
                        b.on(Event.CLICK, this, this.exe, [new Chapter({
                            id: NaN,
                            name: "cui",
                            cmdArr: ctl.cmdArr.concat()
                        })]);
                    if (ctl.useIdx) {
                        DH.instance.vDic.bind(ctl.index, b.update.bind(b));
                        this.bounds.push([DH.instance.vDic, ctl.index, b.update]);
                    }
                    break;
                case 1://字符串
                case 2://变量
                    let l: Label;
                    if (ctl.type == 1) {
                        this.controlSpr.addChild(l = new Label(DH.instance.replaceVTX(DH.instance.sDic.get(ctl.index))));
                        DH.instance.sDic.bind(ctl.index, l.update.bind(l));
                        this.bounds.push([DH.instance.sDic, ctl.index, l.update]);
                    } else {
                        this.controlSpr.addChild(l = new Label(DH.instance.vDic.get(ctl.index)));
                        DH.instance.vDic.bind(ctl.index, l.update.bind(l));
                        this.bounds.push([DH.instance.vDic, ctl.index, l.update]);
                    }
                    l.pos(ctl.useVar ? DH.instance.vDic.get(ctl.x) : ctl.x, ctl.useVar ? DH.instance.vDic.get(ctl.y) : ctl.y);
                    break;
                case 3://图片
                    let i = new OtherImg(ctl.useStr ? DH.instance.replaceVTX(DH.instance.sDic.get(ctl.strIdx)) : ctl.image1)
                        .pos(ctl.useVar ? DH.instance.vDic.get(ctl.x) : ctl.x, ctl.useVar ? DH.instance.vDic.get(ctl.y) : ctl.y);
                    this.controlSpr.addChild(i);
                    break;
                case 4://滚动条
                    break;
            }
        }
        this.initListener();
        this.exeAfterChapter();
        return this;
    }

    exe(c: Chapter) {
        DH.instance.cmdLine.insertChapter(c);
    }

    exeLoadChapter() {
        if (this.loadChapter) {
            DH.instance.eventPoxy.once(Conf.CUI_LOAD_READY, this, this.updateControls);
            this.exe(this.loadChapter);
        } else {
            this.updateControls()
        }
        return this;
    }

    exeAfterChapter() {
        if (this.afterChapter)
            this.exe(this.afterChapter);
    }

    protected initAudio() {
        return super.initAudio();
    }

    protected initListener() {
        if (this.data.isMouseExit)
            DH.instance.eventPoxy.on(Event.RIGHT_CLICK, this, super.close);
        if (this.data.isKeyExit)
            DH.instance.eventPoxy.on("Escape", this, super.close);
    }
}