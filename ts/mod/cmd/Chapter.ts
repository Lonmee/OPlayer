import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    sceneArr: Scene[] = [];
    repeat: [number[], Cmd[][]] = [[], []];

    constructor(dc: DChapter) {
        super(dc);
        this.cmdArr = this.cmdArr.concat();
        this.formScene();
    }

    getScene(idx: number): Scene {
        return this.sceneArr[idx];
    }

    insertScene(): Scene {
        let s;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        return s;
    }

    /**
     * 欢迎 ╮ (￣ 3￣) ╭
     * @param branch
     * @returns {Scene}
     */
    private formScene(otl = null) {
        let s = this.insertScene();
        let ote = [];
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.shift();
            switch (cmd.code) {
                /*********************repeat*********************/
                case 202 : //start
                    this.repeat[0].push(s.link);
                    if (this.repeat[1][this.repeat[0].length - 1] == null)
                        this.repeat[1].push([]);
                    s = this.insertScene();
                    break;
                case 209 : //interrupt
                    this.repeat[1][parseInt(cmd.para[0]) - 1].push(cmd);
                    s.cmdArr.push(cmd);
                    s.link = NaN;
                    s = this.insertScene();
                    break;
                case 203 : //end
                    this.repeat[1].reverse();
                    while (this.repeat[1][this.repeat[0].length - 1].length > 0)
                        this.repeat[1][this.repeat[0].length - 1].pop().links = [s.link];
                    this.repeat[1].pop();
                    this.repeat[1].reverse();
                    cmd.links = [this.repeat[0].pop()];
                    s.cmdArr.push(cmd);
                    s.link = NaN;
                    s = this.insertScene();
                    break;
                /*********************repeat end*****************/
                /*********************branch*********************/
                //switch
                case 101: //剧情分歧
                case 1010:
                case 1011:
                case 204: //按钮分歧
                case 200: //条件分歧
                case 217: //高级条件分歧
                    s.cmdArr.push(cmd);
                    let te = this.formScene(cmd.links = cmd.code == 200 || cmd.code == 217 ? [s.link] : []);
                    while (te.length)
                        te.pop().push(this.sceneArr.length);
                    s.link = NaN;
                    s = this.insertScene();
                    break;
                //options
                case 108: //分支选项内容
                case 212: //按钮分歧内容
                    if (otl.length == 0) {
                        otl.push(s.link - 1);
                    } else {
                        otl.push(s.link);
                        s.cmdArr.push(cmd);
                        ote.push(cmd.links = []);
                        s = this.insertScene();
                    }
                    break;
                case 211: //条件分歧else内容
                    s.cmdArr.push(cmd);
                    ote.push(cmd.links = []);
                    otl.push(s.link);
                    s = this.insertScene();
                    break;
                //end
                case 102: //剧情分歧
                case 205: //按钮分歧
                    s.cmdArr.push(cmd);
                    ote.push(cmd.links = []);
                    return ote;
                case 201: //条件分歧
                    if (otl.length == 1)
                        otl.push(s.link);
                    s.cmdArr.push(cmd);
                    ote.push(cmd.links = []);
                    return ote;
                /*********************branch end*****************/
                default:
                    s.cmdArr.push(cmd);
            }
        }
    }
}