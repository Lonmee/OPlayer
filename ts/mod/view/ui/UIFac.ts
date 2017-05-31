/**
 * Created by ShanFeng on 5/29/2017.
 */
import {Menu, Setting, Title, Replay, Game, Save, Store} from "./comp/Menu";
import DH from "../../../data/DH";
export enum MenuEnum{game, title, replay, setting, save, store}
export default class UIFac {
    dh: DH = DH.instance;
    menuArr: Menu[] = [];

    getMenu(type: number) {
        return this.menuArr[type] || this.construct(type);
    }

    construct(type: number): Menu {
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
}