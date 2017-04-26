import Dictionary = laya.utils.Dictionary;
import Conf from "./Conf";
import {BinLoader} from "../mod/loader/BinLoader";
import {ViewMgr} from "../view/ViewMgr";
/**
 * Created by ShanFeng on 4/24/2017.
 * means DataHolder
 */
export default class DH {
    private static _instance: DH;
    resMap: Dictionary = new Dictionary();
    binLoader: BinLoader;
    viewMgr: ViewMgr;

    static get instance(): DH {
        return this._instance ? this._instance : this._instance = new DH();
    }

    getResLink(key: string): string {
        let md5 = this.resMap.get(key).md5;
        return Conf.domain.resCdn + md5.substring(0, 2) + "/" + md5;
    }
}