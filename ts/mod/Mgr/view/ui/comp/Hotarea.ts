/**
 * Created by ShanFeng on 6/20/2017.
 */
import DH from "../../../../../data/DH";
import {Cmd} from "../../../../../data/sotry/Story";
import Sprite = laya.display.Sprite;
import Rectangle = laya.maths.Rectangle;
import Event = laya.events.Event;

export class HotareaSelector {
    refresh: boolean;
    private hotRec: Rectangle;
    private hit: [number, number, string];

    constructor() {
        this.initView();
    }

    initView() {
        this.hotRec = new Rectangle();
        Laya.stage.on(Event.MOUSE_MOVE, this, this.mHandler);
        Laya.stage.on(Event.MOUSE_DOWN, this, this.mHandler);
    }

    protected mHandler(e: Event) {
        // if (this.refresh)
        this.hit = [e.stageX, e.stageY, e.type];
    }

    reset(cmd: Cmd = null) {
        // if (!this.refresh) {
        //     this.refresh = true;
        // this.hit = null;
        // }
        return this;
    }

    check(cmd: Cmd) {
        let rec = cmd.para[2].split(",");
        if (rec.length > 1) {
            this.hotRec.x = parseInt(rec[0]);
            this.hotRec.y = parseInt(rec[1]);
            this.hotRec.width = parseInt(rec[2]);
            this.hotRec.height = parseInt(rec[3]);
        } else {
            let img = DH.instance.imgDic.get(rec[0]);
            if (img) {
                this.hotRec.x = img.x;
                this.hotRec.y = img.y;
                this.hotRec.width = img.width;
                this.hotRec.height = img.height;
            } else {
                this.hotRec.width = this.hotRec.height = 0;
            }
        }
        let bingo = this.hotRec && this.hit && this.hotRec.contains(this.hit[0], this.hit[1]);
        if (bingo) {
            if (cmd.para[3] == "0")
                bingo = this.hit[2] == Event.MOUSE_MOVE;
            else
                bingo = this.hit[2] == Event.MOUSE_DOWN;
        }
        if (bingo)
            this.refresh = this.hit = null;
        return bingo;
    }
}