import Scene from "../Scene";
import {Cmd, DChapter} from "../../../data/sotry/Story";

/**
 * Created by ShanFeng on 5/8/2017.
 */

export default class Chapter extends DChapter {
    private curId: number = 0;
    private repeat: [number[], Cmd[][]] = [[], []];

    constructor(dc: DChapter) {
        super(dc);
        //值传开关，当前为数据轻量化关掉，但传入参数会被吸收导致外部数据缺失，外部可使用concat()方法复制一份作为入参
        // this.cmdArr = this.cmdArr.concat();
        this.formScene();
    }

    /**
     * 欢迎 ╮ (￣ 3￣) ╭
     * @param branch
     * @returns {Scene}
     */
    private formScene(otl = null) {
        let ote = [];
        while (this.curId < this.cmdArr.length) {
            let cmd: Cmd = this.cmdArr[this.curId++];
            switch (cmd.code) {
                /*********************repeat*********************/
                case 202 : //start
                    this.repeat[0].push(this.curId);
                    if (this.repeat[1][this.repeat[0].length - 1] == null)
                        this.repeat[1].push([]);
                    break;
                case 209 : //interrupt
                    this.repeat[1][parseInt(cmd.para[0]) - 1].push(cmd);
                    break;
                case 203 : //end
                    this.repeat[1].reverse();
                    while (this.repeat[1][this.repeat[0].length - 1].length > 0)
                        this.repeat[1][this.repeat[0].length - 1].pop().links = [this.curId];
                    this.repeat[1].pop();
                    this.repeat[1].reverse();
                    cmd.links = [this.repeat[0].pop()];
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
                    let te = this.formScene(cmd.links = cmd.code == 200 || cmd.code == 217 ? [this.curId] : []);
                    while (te.length)
                        te.pop().push(this.curId);
                    break;
                //options
                case 108: //分支选项内容
                case 212: //按钮分歧内容
                    if (otl.length == 0)
                        cmd.links = [this.curId];
                    else
                        ote.push(cmd.links = []);
                    otl.push(this.curId);
                    break;
                case 211: //条件分歧else内容
                    otl.push(this.curId);
                    ote.push(cmd.links = []);
                    break;
                //end
                case 102: //剧情分歧
                case 205: //按钮分歧
                    ote.push(cmd.links = []);
                    return ote;
                case 201: //条件分歧
                    if (otl.length == 1)
                        otl.push(this.curId);
                    ote.push(cmd.links = []);
                    return ote;
                /*********************branch end*****************/
                default:

            }
        }
    }
}