import {Chapter, Cmd, Scene} from "../data/sotry/Story";
import Conf from "../data/Conf";
import DH from "../data/DH";
/**
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    dh: DH = DH.instance;
    chapter: Chapter;
    len: number;
    idx: number = 0;
    end: boolean = true;
    private cmdArr: Cmd[];

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    playHandler(c: Chapter) {
        this.chapter = c;
        this.cmdArr = c.cmdArr;
        this.len = c.cmdArr.length;
        this.idx = 0;
        this.end = false;

        // for (let cmd of c.cmdArr) {
        //     switch (cmd.code) {
        //         //剧情分歧
        //         case 101 :
        //         case 108 :
        //         case 1010 :
        //         case 1011 : {
        //             console.log(`剧情分歧:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //
        //         //条件分歧
        //         case 200:
        //         case 217: {
        //             console.log(`条件分歧:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //
        //         //按钮分歧
        //         case 204: {
        //             console.log(`按钮分歧:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //
        //         //循环
        //         case 202: {
        //             console.log(`循环:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //
        //         //返回&呼叫
        //         case 151: {
        //             let target = "goto游戏界面";
        //             console.log(`${target}:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //         case 208: {
        //             let target = "goto标题界面";
        //             console.log(`${target}:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //         case 214: {
        //             let target = "call游戏界面";
        //             console.log(`${target}:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //         case 251: {
        //             let target = "call子剧情";
        //             console.log(`${target}:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //         case 218: {
        //             let target = "call读档";
        //             console.log(`${target}:${cmd.code}:${cmd.para}`);
        //             break;
        //         }
        //     }
        // }
    }

    nextScene(): Scene {
        return {link: 50};
    }

    nextCmd(): Cmd {
        this.end = this.idx == this.len - 1;
        return this.cmdArr[this.idx++];
    }
}