/**
 * Created by ShanFeng on 4/24/2017.
 * means DataHolder 数据总管
 */
export default class DH {
    private static _instance:DH;
    static get instance(): DH {
        return this._instance ? this._instance : this._instance = new DH();
    }
}