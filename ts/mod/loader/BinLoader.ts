import LoaderManager = laya.net.LoaderManager;
import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;
import Sprite = laya.display.Sprite;
import Browser = laya.utils.Browser;
import Conf from "../../data/Conf";
import Byte = laya.utils.Byte;
import DH from "../../data/DH";
/**
 * Created by ShanFeng on 4/24/2017.
 */
export class BinLoader {
    single: boolean;
    private bufArr: any[] = [];

    constructor() {
        let url: string = Conf.domain.cdn + "web/" +
            Conf.info.gid + "/" + Conf.info.ver + "/Map" +
            (Conf.info.qlty != "0" ? "_" + Conf.info.qlty : "") + ".bin";
        this.load(url);


        if (Conf.info.miniPath) {
            url = Conf.domain.cdn + Conf.info.miniPath;
            this.load(url);
        }
    }

    private load(url: string) {
        let idx: number = this.bufArr.push(url);

        Laya.loader.load(url,
            Handler.create(this, this.completeHandler, [idx], true),
            Handler.create(this, this.progressHandler, [idx], true),
            Loader.BUFFER, 0, true, "bin", false);
    }

    private progressHandler(p: number) {
        p;
    }

    private completeHandler(idx: number) {
        let resUrl: string = this.bufArr[idx - 1];
        this.bufArr[idx - 1] = new Byte(laya.net.Loader.getRes(resUrl));
        laya.net.Loader.clearRes(resUrl);

        if (this.bufArr.every(fullyLoadedTester)) {
            for (let i: number = 0; i < this.bufArr.length; i++) {
                let byte: Byte = this.bufArr[i];
                let len: number = byte.getInt32();
                for (let i: number = 0; i < len; i++) {
                    DH.instance.resMap.set(byte.getUTFBytes(byte.getInt32()),
                        {size: byte.getInt32(), md5: byte.getUTFBytes(byte.getInt32())});
                }
                console.log(byte.bytesAvailable == 0 ? "assMap done!" : "something left in assets bin");
                byte.clear();
            }
            this.single = this.bufArr.length == 1;
            this.loadStory(this.single ? Conf.starName.single : Conf.starName.multiple);
        }

        function fullyLoadedTester(ele: any, idx: number, arr: any[]): boolean {
            return ele instanceof Byte;
        }
    }

    /**
     * 故事分包情况下缓存分包数据
     * 单包情况下解析后销毁
     * @param s
     */
    loadStory(s: string | number) {
        if (typeof s == "number") {
            s = `game${s}.bin`;
        }
        Laya.loader.load(DH.instance.getResLink(s),
            Handler.create(this, this.sCompleteHandler, null, this.single),
            Handler.create(this, this.sProgressHandler, null, this.single),
            Loader.BUFFER, 0, !this.single, "bin", false);
    }

    private sProgressHandler() {

    }

    private sCompleteHandler(ab:ArrayBuffer) {
        let byte: Byte = new Byte(ab);
        DataView
        byte.readUTFBytes(6);
        byte.getUTFBytes(6);
    }
}
