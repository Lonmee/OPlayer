import {ILinkage} from "./CmdList";
import {Cmd} from "../../data/sotry/Story";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class Scene implements ILinkage {
    link: number;
    cmdArr: Cmd[] = [];
    private idx: number = 0;

    constructor(link: number = -1) {
        this.link = link;
    }

    nextCmd(): Cmd | number {
        if (this.idx == this.cmdArr.length) {
            return this.link;
        }
        return this.cmdArr[this.idx++];
    }
};


// private formScene(cmdArr: Cmd[]): Scene {
//     let s: Scene = new Scene();
//     for (let cmd of cmdArr) {
//         switch (cmd.code) {
//             //剧情分歧
//             case 101:
//             case 1010:
//             case 1011 : {
//                 this.sceneArr.push(s = this.formScene(cmdArr));
//                 break;
//             }
//             case 108: {
//                 console.log(cmd.code);
//                 // link = {};
//                 break;
//             }
//             case 102: {
//                 console.log(cmd.code);
//                 break;
//             }
//
//             //按钮分歧
//             case 204: {
//
//                 break;
//             }
//             case 212: {
//
//                 break;
//             }
//             case 205: {
//
//                 break;
//             }
//
//             //条件分歧
//             case 200:
//             case 217: {
//
//                 break;
//             }
//             case 211: {
//
//                 break;
//             }
//             case 201: {
//
//                 break;
//             }
//
//             //循环
//             case 202 : {
//
//                 break;
//             }
//             case 209 : {
//
//                 break;
//             }
//             case 203 : {
//
//                 break;
//             }
//
//             default: {
//                 s.cmdArr.push(cmd);
//             }
//         }
//     }