import {DFLayer} from "../../../../../data/sotry/Story";
import {OtherImg} from "./Comp";
import Sprite = laya.display.Sprite;
import Event = laya.events.Event;
import DH from "../../../../../data/DH";
import Chapter from "../../../../cmd/Chapter";
/**
 * Created by ShanFeng on 6/9/2017.
 */
export default class FLayer extends Sprite {

    constructor(data: DFLayer[]) {
        super();
        this.autoSize = true;
        this.initView(data);
    }

    initView(data) {
        for (let fd of data) {
            this.addChild(new FloatElement(fd));
        }
    }
}

export class FloatElement extends Sprite {
    chapter: Chapter;

    constructor(private eleData) {
        super();
        this.chapter = eleData.cmdArr == 0 ? null : new Chapter({id: NaN, name: eleData.name, cmdArr: eleData.cmdArr});
        this.autoSize = true;
        this.initView();
    }

    initView() {
        for (let e of this.eleData.itemArr) {
            let i;
            switch (e.type) {
                case 0://todo:字符串加载图片
                    i = new OtherImg(e.isUserString ? e.varIndex : e.image);
                    i.autoSize = true;
                    this.pos(e.x, e.y);
                    this.addChild(i);
                    this.on(Event.CLICK, this, this.exe);
                    break;
                case 1:
                case 2:
            }
        }
    }

    exe() {
        DH.instance.cmdLine.insertTempChapter(this.chapter);
    }

}