import Dictionary = laya.utils.Dictionary;
/**
 * Created by ShanFeng on 6/13/2017.
 */

export interface IBindable {
    watcher: [Function[]];
    bind(key, fun);
    update();
}

class ODic extends Dictionary implements IBindable {
    watcher: [Function[]];

    bind(key, fun) {
        if (this.watcher[key])
            this.watcher[key].push(fun);
        else
            this.watcher[key] = [fun];
    }

    get(key: any): any {
        return super.get(parseInt(key) + 1);
    }

    set(key: any, value: any): void {
        super.set(parseInt(key) + 1, value);
    }

    update() {
        for (let w in this.watcher)
            for (let fun of this.watcher[w])
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