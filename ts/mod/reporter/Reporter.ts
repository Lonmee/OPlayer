import CmdList from "../cmd/CmdList";
import Chapter from "../cmd/Chapter";

/**
 * Created by ShanFeng on 6/27/2017.
 */
export default class Reportor {
    private _showProcess: boolean = false;
    frame: number = 0;

    cmdList: CmdList = new CmdList();

    constructor() {
    }

    set showProcess(v) {
        this._showProcess = v;
    }

    logProcess(cmd, cc) {
        if (this._showProcess)
            console.log(cmd.code,"@:" + cc, this.cmdList.get(cmd.code) + this.cmdList.getDetails(cmd));
    }

    logFrame() {
        if (this._showProcess)
            console.log("frame:", this.frame++);
    }

    printSceneArr(chapter: Chapter) {
        //for dynamic usage
        /*if (this.cmdList == null)
         require(["js/mod/cmd/CmdList.js"], (CmdList) => {
         this.cmdList = new CmdList.default();
         for (let s of this.sceneArr)
         this.cmdList.printChapter(s, this.sceneArr);
         });*/
        for (let s of chapter.sceneArr)
            this.cmdList.printChapter(s, chapter.sceneArr);
    }
}