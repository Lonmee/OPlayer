define(["require", "exports", "../../data/Conf", "../../data/DH"], function (require, exports, Conf_1, DH_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Handler = laya.utils.Handler;
    var Loader = laya.net.Loader;
    var Byte = laya.utils.Byte;
    /**
     * Created by ShanFeng on 4/24/2017.
     */
    var BinLoader = (function () {
        function BinLoader() {
            this.bufArr = [];
            var url = Conf_1.default.domain.cdn + "web/" +
                Conf_1.default.info.gid + "/" + Conf_1.default.info.ver + "/Map" +
                (Conf_1.default.info.qlty != "0" ? "_" + Conf_1.default.info.qlty : "") + ".bin";
            this.load(url);
            if (Conf_1.default.info.miniPath) {
                url = Conf_1.default.domain.cdn + Conf_1.default.info.miniPath;
                this.load(url);
            }
        }
        BinLoader.prototype.load = function (url) {
            var idx = this.bufArr.push(url);
            Laya.loader.load(url, Handler.create(this, this.completeHandler, [idx], true), Handler.create(this, this.progressHandler, [idx], true), Loader.BUFFER, 0, true, "bin", false);
        };
        BinLoader.prototype.progressHandler = function (p) {
            p;
        };
        BinLoader.prototype.completeHandler = function (idx) {
            var resUrl = this.bufArr[idx - 1];
            this.bufArr[idx - 1] = new Byte(laya.net.Loader.getRes(resUrl));
            laya.net.Loader.clearRes(resUrl);
            if (this.bufArr.every(fullyLoadedTester)) {
                for (var i = 0; i < this.bufArr.length; i++) {
                    var byte = this.bufArr[i];
                    var len = byte.getInt32();
                    for (var i_1 = 0; i_1 < len; i_1++) {
                        DH_1.default.instance.resMap.set(byte.getUTFBytes(byte.getInt32()), { size: byte.getInt32(), md5: byte.getUTFBytes(byte.getInt32()) });
                    }
                    console.log(byte.bytesAvailable == 0 ? "assMap done!" : "something left in assets bin");
                    byte.clear();
                }
                this.single = this.bufArr.length == 1;
                this.loadStory(this.single ? Conf_1.default.starName.single : Conf_1.default.starName.multiple);
            }
            function fullyLoadedTester(ele, idx, arr) {
                return ele instanceof Byte;
            }
        };
        /**
         * 故事分包情况下缓存分包数据
         * 单包情况下解析后销毁
         * @param s
         */
        BinLoader.prototype.loadStory = function (s) {
            if (typeof s == "number") {
                s = "game" + s + ".bin";
            }
            Laya.loader.load(DH_1.default.instance.getResLink(s), Handler.create(this, this.sCompleteHandler, null, this.single), Handler.create(this, this.sProgressHandler, null, this.single), Loader.BUFFER, 0, !this.single, "bin", false);
        };
        BinLoader.prototype.sProgressHandler = function () {
        };
        BinLoader.prototype.sCompleteHandler = function (ab) {
            var byte = new Byte(ab);
            DataView;
            byte.readUTFBytes(6);
            byte.getUTFBytes(6);
        };
        return BinLoader;
    }());
    exports.BinLoader = BinLoader;
});
//# sourceMappingURL=BinLoader.js.map