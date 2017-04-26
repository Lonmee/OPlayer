define(["require", "exports", "./view/ViewMgr", "./mod/loader/BinLoader", "./data/Conf", "./data/DH"], function (require, exports, ViewMgr_1, BinLoader_1, Conf_1, DH_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Browser = laya.utils.Browser;
    var WebGL = laya.webgl.WebGL;
    var OPlayer = (function () {
        function OPlayer() {
        }
        OPlayer.prototype.init = function (gid, ver, m, s, qlty, path, gs, gi, pf) {
            Conf_1.default.info.gid = gid;
            Conf_1.default.info.ver = ver;
            Conf_1.default.info.qlty = qlty;
            Conf_1.default.info.miniPath = path;
            Laya.init(Laya.Browser.width, Laya.Browser.height, WebGL);
            DH_1.default.instance.viewMgr = new ViewMgr_1.ViewMgr();
            DH_1.default.instance.binLoader = new BinLoader_1.BinLoader();
        };
        return OPlayer;
    }());
    exports.OPlayer = OPlayer;
    Browser.window.conf = Conf_1.default;
    Browser.window.dh = DH_1.default.instance;
    Browser.window.oplayer = new OPlayer();
});
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
//# sourceMappingURL=OPlayer.js.map