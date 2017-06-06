/**
 * Created by ShanFeng on 5/29/2017.
 */
import {Menu, Setting, Title, Replay, Game, Save, Store} from "./comp/Menu";
import DH from "../../../data/DH";
import {Selector, BtnSelector, SelectorEx} from "./comp/Selector";
import {Cmd} from "../../../data/sotry/Story";
import {MSG} from "./comp/MSG";
export enum MenuEnum{game, title, replay, setting, save, store}
export default class UIFac {
    private msg: MSG;
    private dh: DH = DH.instance;
    private menuArr: Menu[] = [];

    getMenu(type: number) {
        return this.menuArr[type] || this.constructMenu(type);
    }

    private constructMenu(type: number): Menu {
        let m: Menu;
        switch (type) {
            case 0 :
                m = new Game(this.dh.story.sys.gMenu);
                break;
            case 1 :
                m = new Title(this.dh.story.sys.title);
                break;
            case 2:
                m = new Replay(this.dh.story.sys.Replay);
                break;
            case 3:
                m = new Setting(this.dh.story.sys.Setting);
                break;
            case 4:
                m = new Save(this.dh.story.sys.SaveData);
                break;
            case 5:
                m = new Store(this.dh.story.sys.Setting);
                break;
        }
        return this.menuArr[type] = m;
    }

    getSelector(cmd: Cmd): Selector {
        switch (cmd.code) {
            case 101:
                return new Selector(cmd);
            case 1010:
                return new SelectorEx(cmd);
            case 1011:
                return new Selector(cmd);
            case 204:
                return new BtnSelector(cmd);
        }
    }

    getMSG(cmd: Cmd): MSG {
        return this.msg ? this.msg.update(cmd) : this.msg = new MSG(cmd);
    }
}