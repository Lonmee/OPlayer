var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "../data/Settings"], function (require, exports, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sprite = laya.display.Sprite;
    var Stat = laya.utils.Stat;
    /**
     * Created by Lonmee on 4/23/2017.
     */
    var ViewMgr = (function (_super) {
        __extends(ViewMgr, _super);
        function ViewMgr() {
            var _this = _super.call(this) || this;
            var fwSettings = Settings_1.default.frameworks;
            if (fwSettings.bgColor) {
                Laya.stage.bgColor = fwSettings.bgColor;
            }
            if (fwSettings.showStatus) {
                Stat.show();
            }
            return _this;
        }
        return ViewMgr;
    }(Sprite));
    exports.ViewMgr = ViewMgr;
});
//# sourceMappingURL=ViewMgr.js.map