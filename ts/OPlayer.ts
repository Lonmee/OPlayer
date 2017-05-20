/**
 * Created by Lonmee on 4/19/2017.
 */
import {ViewMgr} from "./mod/ViewMgr";
import {BinLoader} from "./mod/loader/BinLoader";
import Conf from "./data/Conf";
import DH from "./data/DH";
import Browser = laya.utils.Browser;
import WebGL = laya.webgl.WebGL;
import CmdLine from "./mod/CmdLine";
export class OPlayer {
    dh: DH = DH.instance;

    constructor() {

    }

    init(gid: string, ver: number, m: string, s: string,
         qlty: string, path: string, gs: string, gi: string, pf: string) {
        Conf.info.gid = gid;
        Conf.info.ver = ver;
        Conf.info.qlty = qlty;
        Conf.info.miniPath = path;

        Laya.init(Laya.Browser.width, Laya.Browser.height, WebGL);

        this.dh.viewMgr = new ViewMgr(new CmdLine());
        // this.dh.binLoader = new BinLoader();
        this.dh.binLoader = new BinLoader(true);
    }

}

Browser.window.oplayer = new OPlayer();

//Todo:发布时可关掉
Browser.window.conf = Conf;
Browser.window.dh = DH.instance;

//console.log('%c this is color! ', 'background: #222; color: #bada55‘);