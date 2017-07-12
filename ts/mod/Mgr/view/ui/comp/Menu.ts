import Sprite = laya.display.Sprite;
import Graphics = laya.display.Graphics;
import {BGImg, Button, Label, OtherImg, Slider, UIImg} from "./Comp";
import DH from "../../../../../data/DH";
import {CusUI, IdxBtn, Path} from "../../../../../data/sotry/Story";
import {MgrEnum} from "../../../../CmdLineRev";
import {MenuEnum} from "../UIFac";
import Conf from "../../../../../data/Conf";
import {StateEnum} from "../../../../state/State";
import Chapter from "../../../../cmd/Chapter";
import Event = laya.events.Event;
import Handler = laya.utils.Handler;
/**
 * Created by ShanFeng on 5/29/2017.
 */
export class Menu extends Sprite {
    protected btnArr: Button[];

    constructor(protected idx: number, protected data: any) {
        super();
        this.initView();
        this.initAudio();
        this.initListener();
    }

    protected close() {
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
                        MenuEnum.save
                    case 1:
                        MenuEnum.restore
                    case 2:
                        MenuEnum.replay
                    case 3:
                        DH.instance.eventPoxy.event(Conf.CHANGE_STATE, StateEnum.Auto);
                    case 4:
                        MenuEnum.setting
                    case 5:
                        this.close();
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

export class CUI extends Menu {
    private afterChapter: Chapter;
    private loadChapter: Chapter;

    constructor(ind: number, data: CusUI) {
        if (data.loadEvent.length)
            DH.instance.cmdLine.insertTempChapter(new Chapter({id: NaN, name: "load", cmdArr: data.loadEvent}));
        super(ind, data);
        data.showEffect;//todo:dcui.showEffect
    }

    protected close(): any {
        return super.close();
    }

    protected initView() {
        if (this.data.loadEvent.length)
            this.loadChapter = new Chapter({id: NaN, name: "load", cmdArr: this.data.loadEvent});
        if (this.data.afterEvent.length)
            DH.instance.cmdLine.insertTempChapter(this.afterChapter = new Chapter({
                id: NaN,
                name: "after",
                cmdArr: this.data.afterEvent
            }));
        for (let ctl of this.data.controls) {
            switch (ctl.type) {
                case 0://按钮
                    let b;
                    this.addChild(b = new Button(ctl.useIdx ? DH.instance.vDic.get(ctl.index) : ctl.index).pos(ctl.x, ctl.y));
                    if (ctl.cmdArr.length)
                        b.on(Event.CLICK, this, this.exe, [new Chapter({id: NaN, name: "cui", cmdArr: ctl.cmdArr})]);
                    break;
                case 1://字符串
                case 2://变量
                    let l: Label;
                    if (ctl.type == 1) {
                        this.addChild(l = new Label(DH.instance.sDic.get(ctl.index)));
                        DH.instance.sDic.bind(ctl.index, l.update.bind(l));
                    } else {
                        this.addChild(l = new Label(DH.instance.vDic.get(ctl.index)));
                        DH.instance.vDic.bind(ctl.index, l.update.bind(l));
                    }
                    l.pos(ctl.x, ctl.y);
                    break;
                case 3://图片
                    let i = new OtherImg(ctl.useStr ? DH.instance.sDic.get(ctl.strIdx) : ctl.image1).pos(ctl.x, ctl.y);//todo:数值指定坐标
                    this.addChild(i);
                    break;
                case 4://滚动条
                    break;
            }
        }
    }

    exe(c: Chapter) {
        DH.instance.cmdLine.insertTempChapter(c);
        return this;
    }

    exeLoadChapter() {
        if (this.loadChapter)
            this.exe(this.loadChapter);
        return this
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
            DH.instance.eventPoxy.on(Event.RIGHT_CLICK, this, this.close);
        if (this.data.isKeyExit)
            DH.instance.eventPoxy.on("Escape", this, this.close);
    }
}