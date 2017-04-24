define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by ShanFeng on 4/24/2017.
     * means DataHolder 数据总管
     */
    var DH = (function () {
        function DH() {
        }
        Object.defineProperty(DH, "instance", {
            get: function () {
                return this._instance ? this._instance : this._instance = new DH();
            },
            enumerable: true,
            configurable: true
        });
        return DH;
    }());
    exports.default = DH;
});
//# sourceMappingURL=DH.js.map