define(["require", "exports", "./Conf"], function (require, exports, Conf_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dictionary = laya.utils.Dictionary;
    /**
     * Created by ShanFeng on 4/24/2017.
     * means DataHolder
     */
    var DH = (function () {
        function DH() {
            this.resMap = new Dictionary();
        }
        Object.defineProperty(DH, "instance", {
            get: function () {
                return this._instance ? this._instance : this._instance = new DH();
            },
            enumerable: true,
            configurable: true
        });
        DH.prototype.getResLink = function (key) {
            var md5 = this.resMap.get(key).md5;
            return Conf_1.default.domain.resCdn + md5.substring(0, 2) + "/" + md5;
        };
        return DH;
    }());
    exports.default = DH;
});
//# sourceMappingURL=DH.js.map