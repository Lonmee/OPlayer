define(["require", "exports", "./view/ViewMgr"], function (require, exports, ViewMgr_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebGL = laya.webgl.WebGL;
    var OPlayer = (function () {
        function OPlayer() {
            var canvas = Laya.init(Laya.Browser.width, Laya.Browser.height, WebGL);
            document.body.appendChild(canvas);
            Laya.stage.addChild(new ViewMgr_1.ViewMgr());
        }
        return OPlayer;
    }());
    new OPlayer();
});
//# sourceMappingURL=OPlayer.js.map