import {Cmd, DChapter} from "../../data/sotry/DStory";
import DH, {IBinloader} from "../../data/DH";
import Conf from "../../data/Conf";
import Byte = laya.utils.Byte;
import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;
/**
 * Created by ShanFeng on 5/2/2017.
 * alias "ChapterLoader"
 */
export default class StepLoader implements IBinloader {
    dh: DH = DH.instance;

    constructor(id: number) {
        this.loadChapter(id);
    }

    loadChapter(id: number) {
        let fn: string = `game${id}.bin`;
        Laya.loader.load(this.dh.getResLink(fn),
            Handler.create(this, this.completeHandler, null, false),
            Handler.create(this, this.progressHandler, [fn], false),
            Loader.BUFFER, 0, true, "bin", false);
    }

    private progressHandler(fn: string, p: number) {
        DH.instance.eventPoxy.event(Conf.LOADING_PROGRESS, [fn, p]);
    }

    private completeHandler(ab: ArrayBuffer) {
        let byte: Byte = new Byte(ab);
        byte.pos += 4;
        let c: DChapter = this.dh.story.dChapter = {
            name: parseUTF(),
            id: byte.getInt32(),
            cmdArr: parseCmdArr()
        };
        DH.instance.eventPoxy.event(Conf.PLAY_CHAPTER, c);

        function parseCmdArr(): Cmd[] {
            let arr: Cmd[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseCmd());
            }
            return arr;
        }

        function parseCmd(): Cmd {
            byte.pos += 4;
            return {code: byte.getInt32(), idt: byte.getInt32(), para: parsePara()};
        }

        function parsePara(): string[] {
            let arr: string[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseUTF());
            }
            return arr;
        }

        function parseUTF(): string {
            return byte.getUTFBytes(byte.getInt32());
        }
    }
}