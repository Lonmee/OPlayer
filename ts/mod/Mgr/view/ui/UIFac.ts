/**
 * Created by ShanFeng on 5/29/2017.
 */
import {BGM, CG, CUI, Game, Menu, Replay, Restore, Save, Setting, Title} from "./comp/Menu";
import DH from "../../../../data/DH";
import {BtnSelector, HotareaSelector, Selector, SelectorEx, SelectorEx2} from "./comp/Selector";
import {Cmd} from "../../../../data/sotry/Story";
import {MSG} from "./comp/MSG";
import FLayer from "./comp/FLayer";
import Event = laya.events.Event;
export enum MenuEnum{title, game, replay, CG, BGM, save, restore, setting}
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
                m = new Title(this.dh.story.sys.title);
                break;
            case 1 :
            case 10001://游戏菜单
                m = new Game(this.dh.story.sys.gMenu);
                break;
            case 2:
            case 10002://剧情回放
                m = new Replay(this.dh.story.sys.Replay);
                break;
            case 3:
            case 10003://CG
                m = new CG(this.dh.story.sys.CG);
                break;
            case 4:
            case 10004://BGM
                m = new BGM(this.dh.story.sys.BGM);
                break;
            case 5:
            case 10005://存档
                m = new Save(this.dh.story.sys.SaveData);
            case 6:
            case 10006://读档
                m = new Restore(this.dh.story.sys.SaveData);
                break;
            case 7:
            case 10007://环境设置
                m = new Setting(this.dh.story.sys.Setting);
                break;
            // case 10008://离开游戏 ignore
            //     break;
            // case 10009://自动剧情 移入UILayer
            //     break;
            case  10010://新版商城
                break;
            default:
                m = new CUI(this.dh.story.sys.Cuis[type]);
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
                return new SelectorEx2(cmd);
            case 204:
                return new BtnSelector(cmd);
            case 200:
                return new HotareaSelector(cmd);
        }
    }

    getMSG(cmd: Cmd): MSG {
        return this.msg ? this.msg.update(cmd) : this.msg = new MSG(cmd);
    }

    getFLayer() {
        return new FLayer(this.dh.story.fLayerArr);
    }
}