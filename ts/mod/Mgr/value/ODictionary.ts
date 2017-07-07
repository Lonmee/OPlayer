import Dictionary = laya.utils.Dictionary;
/**
 * Created by ShanFeng on 6/13/2017.
 */
class ODic extends Dictionary {
    watcher: Dictionary = new Dictionary();

    bind(key, fun) {
        this.watcher.set(parseInt(key) + 1, fun);
    }

    get(key: any): any {
        return super.get(parseInt(key) + 1);
    }

    set(key: any, value: any): void {
        let k;
        super.set(k = parseInt(key) + 1, value);
        if (this.watcher.keys.indexOf(k) > -1)
            this.watcher.get(k).call(null, value);
        // (value, k) => this.watcher.get(k);
    }
}

export class DigitalDic extends ODic {

    get(key: any): any {
        if (super.get(parseInt(key)) == null)
            this.set(key, 0);
        return super.get(key);
    }

    set(key: any, value: any): void {
        super.set(key, parseInt(value));
    }
}

export class StringDic extends ODic {

}