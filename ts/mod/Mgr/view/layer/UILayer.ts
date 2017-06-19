/**
 * Created by ShanFeng on 5/8/2017.
 */
import Sprite = laya.display.Sprite;
import UIFac, {MenuEnum} from "../ui/UIFac";
import {Cmd} from "../../../../data/sotry/Story";
import DH from "../../../../data/DH";
import {Layer} from "./Layer";
import Browser = laya.utils.Browser;
import Label = laya.ui.Label;
import Conf from "../../../../data/Conf";
import {StateEnum} from "../../../state/State";
import Event = laya.events.Event;
import {Menu} from "../ui/comp/Menu";
import {MSG} from "../ui/comp/MSG";

export default class UILayer extends Layer {
    constructor() {
        super();
    }

    exe(cmd: Cmd) {
        switch (cmd.code) {
            //UI交互类
            case 100 : {//"显示文章"
                this.showMSG(cmd);
                break;
            }
            case 101: //剧情分歧
            case 1010: //剧情分歧EX
            case 1011: //剧情分歧EX2
            case 204: { //按钮分歧
                this.showSelector(cmd);
                return;
            }
            case 200: {//条件分歧之鼠标条件
                this.hotArea(cmd);
                return;
            }

            //UI控制指令
            case 150: //"刷新UI画面"
            case 151: //"返回游戏界面"
                this.closeMenu();
                break;
            case 208: //"返回标题画面"
                this.showMenu(MenuEnum.title);
                break;
            case 214: //"呼叫游戏界面"
                if (parseInt(cmd.para[0]) == 10008) {
                    this.dh.eventPoxy.event(Conf.QUITE_GAME);
                    this.dh.eventPoxy.event(Conf.CMD_LINE_RESUME);
                }
                else if (parseInt(cmd.para[0]) == 10009) {
                    this.dh.eventPoxy.event(Conf.CHANGE_STATE, StateEnum.Auto);
                    this.dh.eventPoxy.event(Conf.CMD_LINE_RESUME);
                }
                else
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

    private hotArea(cmd: Cmd) {
        this.addChild(this.uiFac.getSelector(cmd));
    }

    private showMSG(cmd: Cmd) {
        if (cmd.para[7] == "1")
            this.addChild(this.uiFac.getMSG(cmd));
        else
            this.uiFac.getMSG(cmd);
    }

    private showSelector(cmd: Cmd) {
        this.addChild(this.uiFac.getSelector(cmd));
    }

    private showMenu(idx: number) {
        let m: Menu = this.uiFac.getMenu(idx);
        m.once(Event.CLOSE, this, this.closeMenu, [idx]);
        this.addChild(m);
    }

    private closeMenu(idx: number = NaN) {
        if (isNaN(idx)) {
            while (this.numChildren) {
                this.removeChildAt(0);
            }
        } else {
            this.removeChild(this.uiFac.getMenu(idx));
            if (this.numChildren == 0 || this.numChildren == 1 && this.getChildAt(0) instanceof MSG) {
                this.dh.eventPoxy.event(Conf.CMD_LINE_RESUME);
            }
        }
    }
};