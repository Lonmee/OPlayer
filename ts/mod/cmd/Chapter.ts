import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
import CmdList from "./CmdList";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    sceneArr: Scene[] = [];
    cmdList: CmdList = new CmdList();
    private linkArr: number[] = [];

    constructor(dc: DChapter) {
        super(dc);
        this.formScene(dc.cmdArr);
        for (let s of this.sceneArr) {
            for (let cmd of s.cmdArr) {
                console.log("code:", cmd.code, this.cmdList.get(cmd.code), cmd.code == 100 ? cmd.para[2] : "");
            }
            console.log("                    next scene: ", s.link);
        }
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }

    getScene(idx: number): Scene {
        return this.sceneArr[idx];
    }

    /**
     * 101  "剧情分歧"
     * 1010 "剧情分歧EX"
     * 1011 "剧情分歧EX2"   (108:"分支选项内容")      (102:"剧情分歧结束")
     * 204  "按钮分歧"      (212:"按钮分歧内容")      (205:"按钮分歧结束")
     * 200  "条件分歧"
     * 217  "高级条件分歧"   (211:"除此之外的场合")     (201:"条件分歧结束")
     * 202  "循环"          (209:"中断循环")          (203:"以上反复")
     */

    private formScene(cmdArr: Cmd[]) {
        let s: Scene;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        while (cmdArr.length > 0) {
            let cmd: Cmd = cmdArr.shift();
            switch (cmd.code) {
                case 100: {
                    s.cmdArr.push(cmd);
                    if (cmdArr.length > 0) {
                        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    }
                    break;
                }//显示文章
                case 101://剧情分歧
                case 1010:
                case 1011:
                case 204://按钮分歧
                case 200://条件分歧
                case 217: {//高级条件分歧
                    s.cmdArr.push(cmd);
                    // this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    this.formScene(cmdArr);
                    while (this.linkArr.length) {//回填分支线索引
                        cmd.para.push(this.linkArr.shift().toString());
                    }
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                }

                case 108: //分支选项内容
                case 212: //按钮分歧内容
                case 211: {//条件分歧else内容
                    // this.formScene(cmdArr);
                    s.cmdArr.push(cmd);
                    this.linkArr.push(this.sceneArr.length - 1);
                    break;
                }

                //循环
                case 202 : {
                    // this.formScene(cmdArr);
                    break;
                }
                //循环跳出
                case 209 : {
                    // s.link = 999;
                    return;
                }

                //闭包结束
                case 102://剧情分歧
                case 205://按钮分歧
                case 201: {//条件分歧
                    this.sceneArr.pop();
                    return;
                }
                case 203 : {//循环
                    // s.link -= 1;
                    // this.sceneArr.push(s);
                    // return;
                }

                default: {
                    s.cmdArr.push(cmd);
                }
            }
        }
        s.link = -1;
    }
}