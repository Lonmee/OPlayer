import Dictionary = laya.utils.Dictionary;

/**
 * Created by ShanFeng on 6/13/2017.
 */

export interface IBindable {
    watcher: Function[][];

    bind(key, fun);

    unbind(key, fun);
}

class ODic extends Dictionary implements IBindable {
    watcher: Function[][] = [];

    bind(key, fun) {
        if (this.watcher[key])
            this.watcher[key].push(fun);
        else
            this.watcher[key] = [fun];
    }

    unbind(key, fun = null) {
        let wk;
        if (wk = this.watcher[key])
            if (fun == null || wk.length == 1)
                this.watcher[key] = null;
            else
                wk.splice(wk.indexOf(fun), 1);
    }

    get(key: any): any {
        return super.get(parseInt(key) + 1);
    }

    set(key: any, value: any): void {
        super.set(parseInt(key) + 1, value);
        if (this.watcher[key])
            for (let fun of this.watcher[key])
                fun.call(null, value);
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
    get(key: any): any {
        let t = super.get(key);
        return t ? t : "";
    }
}