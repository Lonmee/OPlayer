import Dictionary = laya.utils.Dictionary;
/**
 * Created by ShanFeng on 6/13/2017.
 */
export class DigitalDic extends Dictionary {

    get(key: any): any {
        return super.get(parseInt(key) + 1);
    }

    set(key: any, value: any): void {
        super.set(parseInt(key) + 1, parseInt(value));
    }
}

export class StringDic extends Dictionary {
    get(key: any): any {
        return super.get(parseInt(key) + 1);
    }

    set(key: any, value: any): void {
        super.set(parseInt(key) + 1, value);
    }
}