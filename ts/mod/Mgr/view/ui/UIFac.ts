/**
 * Created by ShanFeng on 5/29/2017.
 */
import {BGM, CG, CUI, Game, Menu, Replay, Restore, Save, Setting, Title} from "./comp/Menu";
import DH from "../../../../data/DH";
import {BtnSelector, Selector, SelectorEx, SelectorEx2} from "./comp/Selector";
import {Cmd} from "../../../../data/sotry/Story";
import {MSG} from "./comp/MSG";
import FLayer from "./comp/FLayer";
import {HotareaSelector} from "./comp/Hotarea";
import Event = laya.events.Event;
export enum MenuEnum{title, game, replay, CG, BGM, save, restore, setting}
export default class UIFac {
    private fLayer: FLayer;
    private msg: MSG;
    private hotarea: HotareaSelector;
    private dh: DH = DH.instance;
    private menuArr: Menu[] = [];

    getMenu(type: number) {
        if (this.menuArr[type] && type < 10000) {
            (<CUI>this.menuArr[type]).exeLoadChapter();
            (<CUI>this.menuArr[type]).updateControls();
            (<CUI>this.menuArr[type]).exeAfterChapter();
        }
        return this.menuArr[type] || this.constructMenu(type);
    }

    private constructMenu(type: number): Menu {
        let m: Menu;
        switch (type) {
            case -1 :
                m = new Title(type, this.dh.story.sys.title);
                break;
            case 10001://游戏菜单
                m = new Game(type, this.dh.story.sys.gMenu);
                break;
            case 10002://剧情回放
                m = new Replay(type, this.dh.story.sys.Replay);
                break;
            case 10003://CG
                m = new CG(type, this.dh.story.sys.CG);
                break;
            case 10004://BGM
                m = new BGM(type, this.dh.story.sys.BGM);
                break;
            case 10005://存档
                m = new Save(type, this.dh.story.sys.SaveData);
            case 10006://读档
                m = new Restore(type, this.dh.story.sys.SaveData);
                break;
            case 10007://环境设置
                m = new Setting(type, this.dh.story.sys.Setting);
                break;
            // case 10008://离开游戏 ignore
            //     break;
            // case 10009://自动剧情 移入UILayer
            //     break;
            case  10010://新版商城
                break;
            default:
                m = new CUI(type, this.dh.story.sys.Cuis[type]);
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
        }
    }

    getMSG(cmd: Cmd): MSG {
        return this.msg ? this.msg.update(cmd) : this.msg = new MSG(cmd);
    }

    getFLayer() {
        return this.fLayer ? this.fLayer : this.fLayer = new FLayer(this.dh.story.fLayerArr);
    }

    getHotarea() {
        return this.hotarea ? this.hotarea : this.hotarea = new HotareaSelector();
    }
}