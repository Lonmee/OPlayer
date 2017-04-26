/**
 * Created by Lonmee on 4/19/2017.
 */
import {ViewMgr} from "./view/ViewMgr";
import {BinLoader} from "./mod/loader/BinLoader";
import Conf from "./data/Conf";
import Browser = laya.utils.Browser;
import WebGL = laya.webgl.WebGL;
import DH from "./data/DH";
export class OPlayer {
    constructor() {

    }

    init(gid: string, ver: string, m: string, s: string,
         qlty: string, path: string, gs: string, gi: string, pf: string) {
        Conf.info.gid = gid;
        Conf.info.ver = ver;
        Conf.info.qlty = qlty;
        Conf.info.miniPath = path;

        Laya.init(Laya.Browser.width, Laya.Browser.height, WebGL);

        DH.instance.viewMgr = new ViewMgr();
        DH.instance.binLoader = new BinLoader();
    }

}

Browser.window.conf = Conf;
Browser.window.dh = DH.instance;
Browser.window.oplayer = new OPlayer();

/*
 this.spr = new Sprite();
 this.spr.graphics.drawTexture(e);
 this.spr.x = this.spr.y = 400;
 Laya.stage.addChild(this.spr);

 Laya.timer.loop(10, this, this.animateTimeBased);
 Laya.timer.frameLoop(1, this, this.animateFrameRateBased);

 private animateTimeBased(): void {
 if (this.spr.x >= Browser.width)
 this.spr.x = -this.spr.width;
 this.spr.x -= 1;
 }

 private animateFrameRateBased(): void {
 if (this.spr.x >= Browser.width)
 this.spr.x = -this.spr.width;
 this.spr.x += Laya.timer.delta;
 }*/

/*
 * dispatchEvent(new CustomEvent(Conf.EVN_READY, {"detail": this.bufArr.length == 1}));
 * addEventListener(Conf.EVN_READY, this.init)
 */