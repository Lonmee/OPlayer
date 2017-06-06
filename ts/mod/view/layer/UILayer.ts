/**
 * Created by ShanFeng on 5/8/2017.
 */
import Sprite = laya.display.Sprite;
import UIFac, {MenuEnum} from "../ui/UIFac";
import {Cmd} from "../../../data/sotry/Story";
import DH from "../../../data/DH";
import Conf from "../../../data/Conf";
import {Layer} from "./Layer";
import Browser = laya.utils.Browser;
import Label = laya.ui.Label;

export default class UILayer extends Layer {
    uiFac: UIFac = new UIFac();
    dh: DH = DH.instance;

    exe(cmd: Cmd) {
        switch (cmd.code) {
            //UI交互类
            case 100 : {//"显示文章"
                // console.log(cmd.para[2]);
                // if (Browser.onMobile) {
                //     (this.stage.getChildByName("label") as Label).text = cmd.para[2];
                // }
                this.showMSG(cmd);
                break;
            }
            case 101: //剧情分歧
            case 1010: //剧情分歧EX
            case 1011: //剧情分歧EX2
            case 204: { //按钮分歧
                // let choice: string = window.prompt(cmd.para.toString() + "\n input your choice below   option [" + cmd.links + "]");
                // while (choice == "") {
                //     choice = window.prompt(cmd.para.toString() + "\n input your choice below   option [" + cmd.links + "]");
                // }
                // this.dh.eventPoxy.event(Conf.ITEM_CHOOSEN, cmd.links[parseInt(choice) - 1]);
                this.showSelector(cmd);
                return;
            }

            //UI控制指令
            case 150: //"刷新UI画面"
            case 151: //"返回游戏界面"
                this.showMenu(MenuEnum.game);
                break;
            case 208: //"返回标题画面"
                this.showMenu(MenuEnum.title);
                break;
            case 214: //"呼叫游戏界面"
                this.showMenu(MenuEnum.game);
                break;
            case 218: //"强制存档读档"
                this.showMenu(MenuEnum.save);
                break;
            case 110: //"打开指定网页";
            case 111: //"禁用开启菜单功能";
        }
    }

    showMSG(cmd: Cmd) {
        if (cmd.para[7] == "1")
            this.addChild(this.uiFac.getMSG(cmd));
        else
            this.uiFac.getMSG(cmd);
    }

    private showSelector(cmd: Cmd) {
        this.addChild(this.uiFac.getSelector(cmd));
    }

    showMenu(idx: number) {
        this.closeMenu();
        this.addChild(this.uiFac.getMenu(idx));
    }

    closeMenu(idx: number = NaN) {
        if (isNaN(idx)) {
            while (this.numChildren) {
                this.removeChildAt(0);
            }
        } else {
            this.removeChild(this.uiFac.getMenu(idx));
        }
    }
}