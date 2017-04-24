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
/**
 * Created by ShanFeng on 4/1/2017.
 */
var gnk;
(function (gnk) {
    var data;
    (function (data) {
        var Iterator = (function () {
            /**
             * 依据数组生成迭代器，使用数组引用进行管理修饰；
             * 迭代器可动态同步数组变化；
             * @param arr
             */
            function Iterator(arr) {
                this.arr = arr;
                this.idx = -1;
            }
            Iterator.prototype.next = function () {
                if (this.idx < this.arr.length - 1) {
                    return this.arr[++this.idx];
                }
                else {
                    return null;
                }
            };
            Iterator.prototype.pre = function () {
                if (this.idx < 0) {
                    this.idx = 0;
                }
                if (this.idx != 0) {
                    return this.arr[--this.idx];
                }
                else {
                    return null;
                }
            };
            /**
             * 复位游标
             * @param idx [可指定游标位置, 缺省-1：起始位置]
             * @returns {number}
             */
            Iterator.prototype.reset = function (idx) {
                if (idx === void 0) { idx = -1; }
                if (idx < this.arr.length && idx > -2) {
                    this.idx = idx;
                }
                else if (idx >= this.arr.length) {
                    this.idx = this.arr.length - 1;
                }
                else {
                    this.idx = -1;
                }
                return this.idx;
            };
            return Iterator;
        }());
        data.Iterator = Iterator;
        var LoopIterator = (function (_super) {
            __extends(LoopIterator, _super);
            function LoopIterator(arr) {
                return _super.call(this, arr) || this;
            }
            LoopIterator.prototype.next = function () {
                if (this.idx < this.arr.length - 1) {
                    return this.arr[++this.idx];
                }
                else {
                    return this.arr[this.idx = 0];
                }
            };
            LoopIterator.prototype.pre = function () {
                if (this.idx < 0) {
                    this.idx = 0;
                }
                if (this.idx != 0) {
                    return this.arr[--this.idx];
                }
                else {
                    return this.arr[this.idx = this.arr.length - 1];
                }
            };
            return LoopIterator;
        }(Iterator));
        data.LoopIterator = LoopIterator;
    })(data = gnk.data || (gnk.data = {}));
})(gnk || (gnk = {}));
//# sourceMappingURL=Iterator.js.map