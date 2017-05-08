define(["require", "exports", "./Scene"], function (require, exports, Scene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Chapter = (function () {
        function Chapter() {
        }
        Chapter.prototype.getScene = function (link) {
            var s = new Scene_1.default();
            var cmd = this.cmdArr[link];
            switch (cmd.code) {
                case 204:
            }
            return null;
        };
        return Chapter;
    }());
    exports.Chapter = Chapter;
});
//# sourceMappingURL=Chapter.js.map