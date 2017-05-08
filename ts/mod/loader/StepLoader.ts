import {Chapter, Cmd} from "../../data/sotry/Story";
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
    dh:DH = DH.instance;
    constructor(id: number) {
        this.loadChapter(id);
    }

    loadChapter(id: number) {
        Laya.loader.load(this.dh.getResLink(`game${id}.bin`),
            Handler.create(this, this.completeHandler, null, false),
            Handler.create(this, this.progressHandler, null, false),
            Loader.BUFFER, 0, true, "bin", false);
    }

    private progressHandler(p: number) {
        p;
    }

    private completeHandler(ab: ArrayBuffer) {
        let byte: Byte = new Byte(ab);
        byte.pos += 4;
        let chapter: Chapter = this.dh.story.chapter = {
            name: parseUTF(),
            id: byte.getInt32(),
            cmdArr: parseCmdArr()
        };
        DH.instance.eventPoxy.event(Conf.PLAY_CHAPTER, chapter);

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