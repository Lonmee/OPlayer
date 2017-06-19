import Sprite = laya.display.Sprite;
import Texture = laya.resource.Texture;
/**
 * Created by ShanFeng on 6/6/2017.
 */
export default class Layouter {
    static top(s: Sprite, t: Texture = null) {
        Layouter.align(s, 2, t);
    }

    static center(s: Sprite, t: Texture = null) {
        Layouter.align(s, 5, t);
    }

    static bottom(s: Sprite) {
        Layouter.align(s, 8);
    }

    static align(s: Sprite, no: number, t: any = null) {
        if (t == null)
            t = s;
        switch (no) {
            case 1:
                s.pos(0, 0);
                break;
            case 2:
                s.pos(Laya.stage.width - t.width >> 1, 0);
                break;
            case 3:
                s.pos(Laya.stage.width - t.width, 0);
                break;
            case 4:
                s.pos(0, Laya.stage.height - t.height >> 1);
                break;
            case 5:
                s.pos(Laya.stage.width - t.width >> 1, Laya.stage.height - t.height >> 1);
                break;
            case 6:
                s.pos(Laya.stage.width - t.width, Laya.stage.height - t.height >> 1);
                break;
            case 7:
                s.pos(0, Laya.stage.height - t.height);
                break;
            case 8:
                s.pos(Laya.stage.width - t.width >> 1, Laya.stage.height - t.height);
                break;
            case 9:
                s.pos(Laya.stage.width - t.width, Laya.stage.height - t.height);
        }
    }
}