import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
import CmdList from "./CmdList";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    repeat: [number[], Cmd[][]] = [[], []];
    sceneArr: Scene[] = [];
    cmdList: CmdList = new CmdList();
    showProcess: boolean = false;

    constructor(dc: DChapter) {
        super(dc);
    }

    printSceneArr() {
        //for dynamic usage
        /*if (this.cmdList == null)
         require(["js/mod/cmd/CmdList.js"], (CmdList) => {
         this.cmdList = new CmdList.default();
         for (let s of this.sceneArr)
         this.cmdList.printChapter(s, this.sceneArr);
         });*/

        for (let s of this.sceneArr)
            this.cmdList.printChapter(s, this.sceneArr);
    }

    getScene(idx: number): Scene {
        // while (this.repeat[0].length > 0 || this.cmdArr.length && idx >= this.sceneArr.length) {
        while (this.cmdArr.length) {
            this.formScene();
        }
        return this.sceneArr[idx] || new Scene;
    }

    /**
     * 欢迎 ╮ (￣ 3￣) ╭
     * @param branch
     * @returns {Scene}
     */
    private formScene(): Scene {
        if (this.showProcess)
            console.log("parse scene:", this.sceneArr.length);
        let s: Scene;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.shift();
            s.cmdArr.push(cmd);
            switch (cmd.code) {
                // case 206 ://跳转剧情
                // case 251 ://呼叫子剧情
                //     return s;
                /*********************repeat*********************/
                case 202 : //start
                    this.repeat[0].push(s.link);
                    if (this.repeat[1][this.repeat[0].length - 1] == null)
                        this.repeat[1].push([]);
                    return s;

                case 209 : //interrupt
                    this.repeat[1][parseInt(cmd.para[0]) - 1].push(cmd);
                    return s;

                case 203 ://end
                    this.repeat[1].reverse();
                    while (this.repeat[1][this.repeat[0].length - 1].length > 0)
                        this.repeat[1][this.repeat[0].length - 1].pop().links = [s.link];
                    this.repeat[1].pop();
                    this.repeat[1].reverse();
                    cmd.links = [this.repeat[0].pop()];
                    return s;
                /*********************repeat end*****************/
                /*********************branch*********************/
                case 101://剧情分歧
                case 1010:
                case 1011:
                case 204://按钮分歧
                case 200://条件分歧
                case 217://高级条件分歧
                    // let scenesToLinks = this.formBranchScene(cmd.links = [], []);
                    let scenesToLinks = this.formBranchScene(cmd.links = cmd.code == 200 || cmd.code == 217 ?
                        [this.sceneArr.length] : [], []);
                    while (scenesToLinks.length)
                        scenesToLinks.pop().link = isNaN(s.link) ? 0 : this.sceneArr.length;
                    if (cmd.code != 200 && cmd.code != 217)//条件结构特例
                        s.link = NaN;
                    return s;
                /*********************branch end*****************/
            }
        }
    }

    private formBranchScene(links, branchScene) {
        if (this.showProcess)
            console.log("parse scene:", this.sceneArr.length);
        let s: Scene;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        if (links.length)//条件结构特例
            branchScene.push(s);
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.shift();
            s.cmdArr.push(cmd);
            switch (cmd.code) {
                // case 206 ://跳转剧情
                // case 251 ://呼叫子剧情
                //     this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                //     break;
                /*********************repeat*********************/
                case 202 : //start
                    this.repeat[0].push(s.link);
                    if (this.repeat[1][this.repeat[0].length - 1] == null)
                        this.repeat[1].push([]);
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;

                case 209 : //interrupt
                    this.repeat[1][parseInt(cmd.para[0]) - 1].push(cmd);
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;

                case 203 : //end
                    this.repeat[1].reverse();
                    while (this.repeat[1][this.repeat[0].length - 1].length > 0)
                        this.repeat[1][this.repeat[0].length - 1].pop().links = [s.link];
                    this.repeat[1].pop();
                    this.repeat[1].reverse();
                    cmd.links = [this.repeat[0].pop()];
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                /*********************repeat end*****************/
                //start
                case 101://剧情分歧
                case 1010:
                case 1011:
                case 204://按钮分歧
                case 200://条件分歧
                case 217: //高级条件分歧
                    this.formBranchScene(cmd.links = cmd.code == 200 || cmd.code == 217 ?
                        [this.sceneArr.length] : [], branchScene);
                    if (cmd.code != 200 && cmd.code != 217)//条件结构特例
                        s.link = NaN;
                    break;

                //options
                case 108: //分支选项内容
                case 212: //按钮分歧内容
                case 211: //条件分歧else内容
                    //Maybe unstable
                    if (s.cmdArr.length == 1)
                        this.sceneArr.pop();
                    else
                        s.cmdArr.pop();
                    //Maybe unstable end
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    branchScene.push(s);
                    links.push(s.link - 1);
                    break;

                //end
                case 102: //剧情分歧
                case 205: //按钮分歧
                case 201: //条件分歧
                    //Maybe unstable
                    if (s.cmdArr.length == 1)
                        this.sceneArr.pop();
                    else
                        s.cmdArr.pop();
                    //Maybe unstable end
                    return branchScene;
            }
        }
    }
}