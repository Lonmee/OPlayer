import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    sceneArr: Scene[] = [];

    constructor(dc: DChapter) {
        super(dc);
        this.formScene(dc.cmdArr);
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
        let s: Scene = new Scene();
        this.sceneArr.push(s);
        s.link = this.sceneArr.length;
        while (cmdArr.length > 0) {
            let cmd: Cmd = cmdArr.shift();
            s.cmdArr.push(cmd);
            switch (cmd.code) {
                case 100://显示文章
                case 101://剧情分歧
                case 1010:
                case 1011:
                case 204: {//按钮分歧

                }

                case 200://条件分歧
                case 217: {//高级条件分歧

                    break;
                }

                case 108://分支选项内容
                case 212://按钮分歧
                case 211: {//条件分歧
                    s = new Scene();
                    this.sceneArr.push(s);
                    s.link = this.sceneArr.length;
                    break;
                }

                //循环
                case 202 : {
                    s = new Scene();
                    this.sceneArr.push(s);
                    s.link = this.sceneArr.length - 1;
                    break;
                }
                case 209 : {
                    let len: number = parseInt(cmd.para[0]);
                    s.cmdArr.pop();
                    for (let i = 0; i < len; i++) {
                        s.cmdArr.push({code: 209, para: ["0"], idt: 0});//插入无线等待
                    }
                    break;
                }

                //闭包结束
                case 102:
                case 205:
                case 201:
                case 203 : {
                    s.cmdArr.pop();
                    s.cmdArr.push({code: 210, para: ["0"], idt: 0});//插入无线等待
                    s = new Scene();
                    this.sceneArr.push(s);
                    s.link = this.sceneArr.length;
                }

                default: {

                }
            }
        }
    }
}