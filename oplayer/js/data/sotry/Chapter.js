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
define(["require", "exports", "./Story", "./Scene"], function (require, exports, Story_1, Scene_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Created by ShanFeng on 5/8/2017.
     */
    var Chapter = (function (_super) {
        __extends(Chapter, _super);
        function Chapter(dc) {
            return _super.call(this, dc) || this;
        }
        Chapter.prototype.getScene = function () {
            var s = new Scene_1.default();
            // let cmd: Cmd = this.cmdArr[link];
            // switch (cmd.code) {
            //     case 204:
            // }
            return s;
        };
        return Chapter;
    }(Story_1.DChapter));
    exports.Chapter = Chapter;
});
//# sourceMappingURL=Chapter.js.map