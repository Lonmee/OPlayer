define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Conf = (function () {
        function Conf() {
        }
        return Conf;
    }());
    //Event
    Conf.EVN_READY = "evn_ready";
    //static
    Conf.domain = {
        cdn: "http://dlcdn1.cgyouxi.com/",
        resCdn: "http://dlcdn1.cgyouxi.com/shareres/"
    };
    Conf.domain4Test = {
        cdn: "http://testcdn.66rpg.com/",
        resCdn: "http://testcdn.66rpg.com/shareres/"
    };
    Conf.loader = {};
    Conf.starName = { single: "data/game.bin", multiple: "game00.bin" };
    //dynamic
    Conf.frameworks = { bgColor: "#AAAAAA", showStatus: true };
    Conf.info = {};
    exports.default = Conf;
});
//# sourceMappingURL=Conf.js.map