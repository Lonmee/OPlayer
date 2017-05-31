import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
import CmdList from "./CmdList";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    repeat: [number[], Cmd[][]] = [[], []];
    sceneArr: Scene[] = [];

    constructor(dc: DChapter) {
        super(dc);
    }

    printSceneArr() {
        for (let s of this.sceneArr) {
            this.cmdList.printChater(s, this.sceneArr);
        }
    }

    getScene(idx: number): Scene {//[option 1]
        /*while (this.repeat[0].length > 0 || idx >= this.sceneArr.length && this.cmdArr.length > 0)
         this.formScene();
         return idx >= this.sceneArr.length ? new Scene() : this.sceneArr[idx];*/

        //[option 2]
        /*return idx > this.sceneArr.length ? new Scene() : this.sceneArr[idx] || this.formScene();*/

        //[option 3]
        /*while (this.cmdArr.length && idx >= this.sceneArr.length) {
            this.formScene();
        }
        return this.sceneArr[idx] || new Scene;*/
        while (this.repeat[0].length > 0 || idx >= this.sceneArr.length && this.cmdArr.length > 0) {
            this.formScene();
        }
        return idx >= this.sceneArr.length ? new Scene() : this.sceneArr[idx];
    }

    /**
     * 小心！勿动！不解释！
     * @param branch
     * @returns {Scene}
     */
    private formScene(): Scene {
        let s: Scene;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.shift();
            s.cmdArr.push(cmd);
            switch (cmd.code) {
                case 206 ://跳转剧情
                case 251 : {//呼叫子剧情
                    return s;
                }
                /*********************repeat*********************/
                case 202 : {//start
                    //todo:该cmd可剔除
                    this.repeat[0].push(s.link);
                    if (this.repeat[1][this.repeat[0].length - 1] == null) {
                        this.repeat[1].push([]);
                    }
                    return s;
                }

                case 209 : {//interrupt
                    this.repeat[1][parseInt(cmd.para[0]) - 1].push(cmd);
                    return s;
                }

                case 203 : {//end
                    this.repeat[1].reverse();
                    while (this.repeat[1][this.repeat[0].length - 1].length > 0) {
                        this.repeat[1][this.repeat[0].length - 1].pop().links = [s.link];
                    }
                    this.repeat[1].pop();
                    this.repeat[1].reverse();
                    cmd.links = [this.repeat[0].pop()];
                    return s;
                }
                /*********************repeat end*****************/
                /*********************branch*********************/
                case 101://剧情分歧
                case 1010:
                case 1011:
                case 204://按钮分歧
                case 200://条件分歧
                case 217: {//高级条件分歧
                    //option:
                    // this.formBranchScene(cmd.code == 200 || cmd.code == 217 ? [cmd.links = [s.link], [s]] : [cmd.links = [], []]);
                    // s.link = NaN;
                    // return s;

                    let scenesToLinks = this.formBranchScene(cmd.links = [], []);
                    while (scenesToLinks.length) {
                        scenesToLinks.pop().link = isNaN(s.link) ? 0 : this.sceneArr.length;
                    }
                    if (cmd.code != 200 && cmd.code != 217)
                        s.link = NaN;
                    return s;
                }
                /*********************branch end*****************/
            }
        }
    }

    cmdList = new CmdList();

    private formBranchScene(links, branchScene) {
        let s: Scene;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        // console.log("parse scene:", s.link - 1);
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.shift();
            s.cmdArr.push(cmd);
            switch (cmd.code) {
                case 206 ://跳转剧情
                case 251 : {//呼叫子剧情
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                }
                /*********************repeat*********************/
                case 202 : {//start
                    //todo:该cmd可剔除
                    this.repeat[0].push(s.link);
                    if (this.repeat[1][this.repeat[0].length - 1] == null) {
                        this.repeat[1].push([]);
                    }
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                }

                case 209 : {//interrupt
                    this.repeat[1][parseInt(cmd.para[0]) - 1].push(cmd);
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                }

                case 203 : {//end
                    //todo:该cmd可剔除
                    this.repeat[1].reverse();
                    while (this.repeat[1][this.repeat[0].length - 1].length > 0) {
                        this.repeat[1][this.repeat[0].length - 1].pop().links = [s.link];
                    }
                    this.repeat[1].pop();
                    this.repeat[1].reverse();
                    cmd.links = [this.repeat[0].pop()];
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                }
                /*********************repeat end*****************/
                case 101://剧情分歧
                case 1010:
                case 1011:
                case 204://按钮分歧
                case 200://条件分歧
                case 217: {//高级条件分歧
                    // this.formBranchScene(cmd.code == 200 || cmd.code == 217 ? [cmd.links = [s.link], [s]] : [cmd.links = [], []]);
                    this.formBranchScene(cmd.links = [], branchScene);
                    if (cmd.code != 200 && cmd.code != 217)
                        s.link = NaN;
                    break;
                }
                //options
                case 108: {//分支选项内容
                }
                case 212: {//按钮分歧内容
                }
                case 211: {//条件分歧else内容
                    //todo:该cmd可剔除
                    if (s.cmdArr.length == 1) {
                        this.sceneArr.pop();
                    } else {
                        s.cmdArr.pop();
                    }
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    // s.cmdArr.push(cmd);

                    /*//条件结构特例（是情况无分支cmd)
                     if (cmd.code == 211) {
                     links.push(this.sceneArr[branch[0][0]]);
                     }*/

                    links.push(s.link - 1);
                    branchScene.push(s);
                    break;
                }
                //end
                case 102: {//剧情分歧
                }
                case 205: {//按钮分歧
                }
                case 201: {//条件分歧
                    //todo:该cmd可剔除
                    if (s.cmdArr.length == 1) {
                        this.sceneArr.pop();
                    } else {
                        s.cmdArr.pop();
                    }
                    // while (branch[1].length) {
                    //     branch[1].pop().link = isNaN(s.link) ? 0 : s.link;
                    // }
                    return branchScene;
                }
            }
        }
    }
}