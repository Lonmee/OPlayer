/**
 * Created by ShanFeng on 4/1/2017.
 */
namespace gnk.data {
    interface IIterator<T> {
        next(): T;
        pre(): T;
        reset(): number;
    }

    export class Iterator<T> implements IIterator<T> {
        protected idx: number;

        /**
         * 依据数组生成迭代器，使用数组引用进行管理修饰；
         * 迭代器可动态同步数组变化；
         * @param arr
         */
        constructor(protected arr: T[]) {
            this.idx = -1;
        }

        next(): T {
            if (this.idx < this.arr.length - 1) {
                return this.arr[++this.idx];
            } else {
                return null;
            }
        }

        pre(): T {
            if (this.idx < 0) {
                this.idx = 0;
            }
            if (this.idx != 0) {
                return this.arr[--this.idx];
            } else {
                return null;
            }
        }

        /**
         * 复位游标
         * @param idx [可指定游标位置, 缺省-1：起始位置]
         * @returns {number}
         */
        reset(idx: number = -1): number {
            if (idx < this.arr.length && idx > -2) {
                this.idx = idx;
            } else if (idx >= this.arr.length) {
                this.idx = this.arr.length - 1;
            } else {
                this.idx = -1;
            }
            return this.idx;
        }
    }

    export class LoopIterator<T> extends Iterator<T> implements IIterator<T> {
        constructor(arr: T[]) {
            super(arr);
        }

        next(): T {
            if (this.idx < this.arr.length - 1) {
                return this.arr[++this.idx];
            } else {
                return this.arr[this.idx = 0];
            }
        }

        pre(): T {
            if (this.idx < 0) {
                this.idx = 0;
            }
            if (this.idx != 0) {
                return this.arr[--this.idx];
            } else {
                return this.arr[this.idx = this.arr.length - 1];
            }
        }
    }
}