import Scene from "./Scene";
import {Cmd, DChapter} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    hasElse: any;
    repeat: [number[], Cmd[][]] = [[], []];
    sceneArr: Scene[] = [];

    constructor(dc: DChapter) {
        super(dc);
        while (this.cmdArr.length)
            this.formScene();
    }

    getScene(idx: number): Scene {
        return this.sceneArr[idx];
    }

    /**
     * 欢迎 ╮ (￣ 3￣) ╭
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
                    s.link = NaN;
                    let logic = cmd.code == 200 || cmd.code == 217;
                    /**p.s:stl means SceneToLink*/
                    let stl = this.formBranchScene(cmd.links = logic ? [this.sceneArr.length] : [], logic ? [s] : []);
                    while (stl.length) {
                        let ts = stl.pop();
                        ts.link = isNaN(ts.link) ? NaN : this.sceneArr.length;
                    }
                    return s;
                /*********************branch end*****************/
            }
        }
    }

    private formBranchScene(links, branchScene) {
        let s: Scene;
        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
        while (this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr.shift(), hasElse = false;
            s.cmdArr.push(cmd);
            switch (cmd.code) {
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
                    s.link = NaN;
                    let logic = cmd.code == 200 || cmd.code == 217;
                    let stl = this.formBranchScene(cmd.links = logic ? [this.sceneArr.length] : [], logic ? [s] : []);
                    while (stl.length) {
                        let ts = stl.pop();
                        ts.link = isNaN(ts.link) ? NaN : this.sceneArr.length;
                    }
                    if (this.cmdArr[0] &&
                        this.cmdArr[0].code != 202 &&
                        this.cmdArr[0].code != 209 &&
                        this.cmdArr[0].code != 203 &&
                        this.cmdArr[0].code != 101 &&
                        this.cmdArr[0].code != 1010 &&
                        this.cmdArr[0].code != 204 &&
                        this.cmdArr[0].code != 200 &&
                        this.cmdArr[0].code != 217 &&
                        this.cmdArr[0].code != 108 &&
                        this.cmdArr[0].code != 212 &&
                        this.cmdArr[0].code != 211 &&
                        this.cmdArr[0].code != 102 &&
                        this.cmdArr[0].code != 205 &&
                        this.cmdArr[0].code != 201) {
                        this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                        branchScene.push(s);
                    }
                    break;

                //options
                case 108: //分支选项内容
                case 212: //按钮分歧内容
                case 211: //条件分歧else内容
                    //去除无用scene，且防止空选项误删
                    // if (s.cmdArr.length == 1 && branchScene.indexOf(s) == -1)
                    //     this.sceneArr.pop();
                    // else
                    //     s.cmdArr.pop();
                    this.sceneArr.push(s = new Scene(this.sceneArr.length + 1));
                    links.push(s.link - 1);
                    branchScene.push(s);
                    hasElse = cmd.code == 211;
                    break;

                //end
                case 102: //剧情分歧
                case 205: //按钮分歧
                case 201: //条件分歧
                    //去除无用scene，且防止空选项误删
                    // if (s.cmdArr.length == 1 && branchScene.indexOf(s) == -1)
                    //     this.sceneArr.pop();
                    // else
                    //     s.cmdArr.pop();
                    if (cmd.code == 201) {
                        links.push(s.link);
                        branchScene.push(s);
                    }
                    return branchScene;
            }
        }
    }
}