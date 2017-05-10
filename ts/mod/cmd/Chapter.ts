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
    private c108: string[] = [];
    private c212: string[] = [];
    private c211: string[] = [];
    private c209: string[] = [];

    private formScene(cmdArr: Cmd[]) {
        let s = new Scene();
        //linkage cache
        while (cmdArr.length > 0) {
            let cmd: Cmd = cmdArr.shift();
            s.cmdArr.push(cmd);

            switch (cmd.code) {
                case 100: {
                    s.cmdArr.push({code: 0, para: [this.sceneArr.length.toString()], idt: 0});
                    break;
                }//显示文章
                case 101://剧情分歧
                case 1010:
                case 1011: {
                    s.cmdArr.push({code: 0, para: this.c108, idt: 0});
                    this.sceneArr.push(s);
                    this.formScene(cmdArr);
                    break;
                }
                case 204: {
                    s.cmdArr.push({code: 0, para: this.c212, idt: 0});
                    break;
                } //按钮分歧
                case 200://条件分歧
                case 217: {//高级条件分歧
                    s.cmdArr.push({code: 0, para: this.c211, idt: 0});
                    break;
                }

                case 108: {
                    this.sceneArr.push(s);
                    this.formScene(cmdArr);
                    this.c108.push(this.sceneArr.length.toString());
                    return;
                }//分支选项内容
                case 212: {
                    break;
                }//按钮分歧内容
                case 211: {//条件分歧else内容
                    break;
                }

                //循环
                case 202 : {
                    s.cmdArr.push({code: 0, para: this.c209, idt: 0});
                    break;
                }
                case 209 : {
                    s.cmdArr.pop();
                    return;
                }

                //闭包结束
                case 102: {
                    this.sceneArr.push(s);
                    s.cmdArr.pop();
                    return;
                }
                case 205: {
                    s.cmdArr.pop();
                    return;
                }
                case 201: {
                    s.cmdArr.pop();
                    return;
                }
                case 203 : {
                    s.cmdArr.pop();
                    this.c209.push();
                    return;
                }

                default: {

                }
            }
        }
    }
}