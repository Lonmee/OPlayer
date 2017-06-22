/**
 * Created by Lonmee on 4/19/2017.
 */
import {BinLoader} from "./mod/loader/BinLoader";
import Conf from "./data/Conf";
import DH from "./data/DH";
import CmdLine from "./mod/CmdLine";
import Browser = laya.utils.Browser;
export class OPlayer {
    constructor() {

    }

    init(gid: string, ver: number, m: string, s: string,
         qlty: string, path: string, gs: string, gi: string, pf: string) {
        Conf.info.gid = gid;
        Conf.info.ver = ver;
        Conf.info.qlty = qlty;
        Conf.info.miniPath = path;

        Laya.init(Laya.Browser.width, Laya.Browser.height/*, WebGL*/);

        DH.instance.cmdLine = new CmdLine();
        // DH.instance.binLoader = new BinLoader();
        DH.instance.binLoader = new BinLoader(true);
    }

}

Browser.window.oplayer = new OPlayer();

if (Conf.debug) {
    Browser.window.conf = Conf;
    Browser.window.dh = DH.instance;
}

//console.log('%c this is color! ', 'background: #222; color: #bada55‘);

//todo:import//region improved @laya.core.js:2745
/*if (isHit = sp.getGraphicBounds().contains(mouseX, mouseY)) {
 rgba = sp.graphics._one[0].getPixels(mouseX, mouseY, 1, 1);
 alpha = rgba.pop();
 pure = rgba.every(function (v){return v == 255}) || rgba.every(function (v){return v == 0});
 isHit = !(alpha < 5 && pure);
 }*/
//endregion

//todo:waiting
// webgl将影响"submit.shaderValue.color=shader.fillStyle._color._color;"@laya.core.js:4158