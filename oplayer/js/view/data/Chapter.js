/**
 * Created by ShanFeng on 4/10/2017.
 */
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
var org;
(function (org) {
    var data;
    (function (data) {
        var Iterator = gnk.data.Iterator;
        var Chapter = (function (_super) {
            __extends(Chapter, _super);
            function Chapter(id, parent, arr) {
                var _this = _super.call(this, arr) || this;
                _this.id = id;
                _this.parent = parent;
                return _this;
            }
            return Chapter;
        }(Iterator));
        data.Chapter = Chapter;
    })(data = org.data || (org.data = {}));
})(org || (org = {}));
//# sourceMappingURL=Chapter.js.map