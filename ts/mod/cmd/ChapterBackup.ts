import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    arrow: number;
    sceneArr: Scene[] = [];

    constructor(dc: DChapter) {
        super(dc);
        this.formScene(dc.cmdArr, [0, [], [[], [], []]]);//递归层级，需回填目标的scene（分歧用），循环目标
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

    private formScene(cmdArr: Cmd[], itemArr: [number, Scene[], [number[], Cmd[], number[]]]): number[] {
        let s: Scene;
        let linkArr: number[] = [];
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        while (cmdArr.length > 0) {
            let cmd: Cmd = cmdArr.shift();
            switch (cmd.code) {
                case 100: {
                    itemArr[1].pop();
                    itemArr[1].push(s);
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
                    itemArr[0] += 1;
                    itemArr[1].pop();
                    let links: number[] = this.formScene(cmdArr, itemArr);
                    while (links.length) {//回填分支线索引
                        cmd.para.push(links.shift().toString());
                    }
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    break;
                }

                case 108: {//分支选项内容
                    if (s.cmdArr.length > 0) {
                        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    }
                    s.cmdArr.push(cmd);
                    itemArr[1].push(s);
                    linkArr.push(this.sceneArr.length - 1);
                    break;
                }
                case 212: {//按钮分歧内容
                    // if (s.cmdArr.length > 0) {
                    //     this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    // }
                    // s.cmdArr.push(cmd);
                    // itemArr[1].push(s);
                    // linkArr.push(this.sceneArr.length - 1);
                    break;
                }
                case 211: {//条件分歧else内容
                    // if (s.cmdArr.length > 0) {
                    //     this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    // }
                    // s.cmdArr.push(cmd);
                    // itemArr[1].push(s);
                    // linkArr.push(this.sceneArr.length - 1);
                    break;
                }

                //循环
                case 202 : {
                    // s.cmdArr.push(cmd);//不必要元素
                    itemArr[2][0].push(this.sceneArr.length - 1);
                    break;
                }

                // 中断循环
                case 209 : {
                    s.cmdArr.push(cmd);
                    itemArr[2][1].push(cmd);
                    if (s.cmdArr.length > 0) {
                        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    }
                    break;
                }

                //闭包结束
                case 102: {//剧情分歧
                    if (itemArr[0] == 1) {
                        itemArr[0] = 0;
                        while (itemArr[1].length > 0) {
                            itemArr[1].pop().link = this.sceneArr.length - 1;
                        }
                    } else {
                        itemArr[0] -= 1;
                    }
                    if (s.cmdArr.length == 0) {
                        this.sceneArr.pop();
                    }
                    return linkArr;
                }
                case 205: {//按钮分歧
                    // this.sceneArr.pop();
                    return linkArr;
                }
                case 201: {//条件分歧
                    // this.sceneArr.pop();
                    return linkArr;
                }

                case 203 : {//以上反复
                    s.cmdArr.push(cmd);
                    s.link = itemArr[2][0].pop();
                    itemArr[2][2].push(this.cmdArr.length == 0 ? -1 : this.sceneArr.length);
                    //回填中断循环情况下的目标索引
                    if (itemArr[2][0].length == 0) {
                        for (let rCmd of itemArr[2][1]) {
                            rCmd.para.push((itemArr[2][2][parseInt(rCmd.para[0]) - 1]).toString());
                        }
                        itemArr[2][1] = [];
                        itemArr[2][2] = [];
                    }
                    if (cmdArr.length > 0) {
                        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    }
                    break;
                }

                default: {
                    s.cmdArr.push(cmd);
                }
            }
        }
        if (s.link >= this.sceneArr.length) {
            s.link = -1;
        }
    }
}