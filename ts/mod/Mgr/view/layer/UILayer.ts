/**
 * Created by ShanFeng on 5/8/2017.
 */
import Sprite = laya.display.Sprite;
import {MenuEnum} from "../ui/UIFac";
import {Cmd} from "../../../../data/sotry/Story";
import {Layer} from "./Layer";
import Conf from "../../../../data/Conf";
import {StateEnum} from "../../../state/State";
import {Menu} from "../ui/comp/Menu";
import {MSG} from "../ui/comp/MSG";
import Browser = laya.utils.Browser;
import Label = laya.ui.Label;
import Event = laya.events.Event;
import Chapter from "../../../cmd/Chapter";

export default class UILayer extends Layer {
    ml: Sprite;
    msg: MSG;

    constructor() {
        super();
        this.ml = new Sprite();
        this.ml.zOrder = 100;
        this.addChild(this.ml);
    }

    exe(cmd: Cmd) {
        switch (cmd.code) {
            //UI交互类
            case 100 : {//"显示文章"
                this.showMSG(cmd);
                break;
            }
            case 109: //"消失对话框"
                this.showMSG();
                break;
            case 101: //剧情分歧
            case 1010: //剧情分歧EX
            case 1011: //剧情分歧EX2
            case 204: { //按钮分歧
                this.showSelector(cmd);
                return;
            }
            case 200: {//条件分歧之鼠标条件
                this.showHotarea(cmd);
                return;
            }

            //UI控制指令
            case 151: //"返回游戏界面"
                this.closeMenu();
                break;
            case 208: //"返回标题画面"
                this.showMenu(MenuEnum.title);
                break;
            case 214: //"呼叫游戏界面"
                this.showMenu(parseInt(cmd.para[0]));
                break;
            case 218: //"强制存档读档"
                this.showMenu(MenuEnum.save);
                break;
            case 110: //"打开指定网页";
                break;
            case 111: //"禁用开启菜单功能";
        }
    }

    private showMSG(cmd: Cmd = null) {
        if (!cmd) {
            if (this.msg && this.msg.parent)
                this.removeChild(this.msg);
        } else
            this.addChildAt(this.msg = this.uiFac.getMSG(cmd), 0);
    }

    private showSelector(cmd: Cmd) {
        this.addChild(this.uiFac.getSelector(cmd));
    }

    private showMenu(idx: number) {
        let m: Menu = this.uiFac.getMenu(idx);
        m.once(Event.CLOSE, this, this.closeMenu, [idx]);
        if (idx < 1000)
            this.closeMenu();
        this.ml.addChild(m);
    }

    private closeMenu(idx: number = NaN) {
        if (isNaN(idx))
            while (this.ml.numChildren)
                this.ml.removeChildAt(0);
        else {
            this.ml.removeChild(this.uiFac.getMenu(idx));
            if (this.ml.numChildren == 0)
                this.dh.cmdLine.insertTempChapter(new Chapter({
                    id: NaN,
                    name: "code_151",
                    cmdArr: [{code: 151, idt: NaN, para: [""], links: []}]
                }));
        }
    }

    private showHotarea(cmd: Cmd) {
        this.uiFac.getHotarea().reset(cmd)
    }

    checkHotarea(cmd: Cmd) {
        return this.uiFac.getHotarea().check(cmd);
    }
};