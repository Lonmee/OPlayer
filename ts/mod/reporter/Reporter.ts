import CmdList from "../cmd/CmdList";
import {StateEnum} from "../state/State";
import {Cmd} from "../../data/sotry/Story";

/**
 * Created by ShanFeng on 6/27/2017.
 */
export default class Reportor {
    showState: boolean = false;
    showProcess: boolean = false;
    frame: number = 0;

    cmdList: CmdList = new CmdList();

    constructor() {
    }

    logProcess(cmd, cc) {
        if (this.showProcess)
            console.log(cmd.code, "@:" + cc, this.cmdList.get(cmd.code) + this.cmdList.getDetails(cmd));
    }

    logFrame() {
        if (this.showProcess)
            console.log("frame:", this.frame++);
    }

    logTrans(cmd, snap) {
        // console.log((cmd.code == 206 ? "go" : "inset") + " story:" + cmd.para[0], snap);
    }

    logRestore(snap) {
        // console.log("restore to ", snap);
    }

    logState(idx: StateEnum) {
        if (this.showState)
            console.log("switch state to:", StateEnum[idx]);
    }

    printCmdArr(cmdArr: Cmd[]) {
        //for dynamic usage
        /*if (this.cmdList == null)
         require(["js/mod/cmd/CmdList.js"], (CmdList) => {
         this.cmdList = new CmdList.default();
         for (let s of this.sceneArr)
         this.cmdList.printChapter(s, this.sceneArr);
         });*/
        this.cmdList.printCmdArr(cmdArr);
    }
}