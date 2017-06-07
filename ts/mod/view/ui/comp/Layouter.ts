import Sprite = laya.display.Sprite;
/**
 * Created by ShanFeng on 6/6/2017.
 */
export default class Layouter {
    static top(s: Sprite) {
        s.pos(Laya.stage.width - s.width >> 1, 0);
    }

    static center(s: Sprite) {
        Layouter.align(s, 5);
    }

    static bottom(s: Sprite) {
        Layouter.align(s, 8);
    }

    static align(s: Sprite, no: number) {
        switch (no) {
            case 1:
                s.pos(0, 0);
                break;
            case 2:
                s.pos(Laya.stage.width - s.width >> 1, 0);
                break;
            case 3:
                s.pos(Laya.stage.width - s.width, 0);
                break;
            case 4:
                s.pos(0, Laya.stage.height - s.height >> 1);
                break;
            case 5:
                s.pos(Laya.stage.width - s.width >> 1, Laya.stage.height - s.height >> 1);
                break;
            case 6:
                s.pos(Laya.stage.width - s.width, Laya.stage.height - s.height >> 1);
                break;
            case 7:
                s.pos(0, Laya.stage.height - s.height);
                break;
            case 8:
                s.pos(Laya.stage.width - s.width >> 1, Laya.stage.height - s.height);
                break;
            case 9:
                s.pos(Laya.stage.width - s.width, Laya.stage.height - s.height);
        }
    }
}