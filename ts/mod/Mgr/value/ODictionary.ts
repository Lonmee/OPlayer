import Dictionary = laya.utils.Dictionary;
/**
 * Created by ShanFeng on 6/13/2017.
 */

export interface IBindable {
    watcher: Dictionary;
    bind(key, fun);
    update();
}

class ODic extends Dictionary implements IBindable {
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
    }

    update() {
        for (let w of this.watcher)
            for (let fun of w)
                fun.call(null, this.get(w));
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