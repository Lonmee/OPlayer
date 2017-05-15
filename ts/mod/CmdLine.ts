import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./ValueMgr";
import VideoMgr from "./VideoMgr";
import AudioMgr from "./AudioMgr";
import Chapter from "./cmd/Chapter";
import {DChapter} from "../data/sotry/Story";
import Scene from "./cmd/Scene";
import {IState} from "./state/State";
import CmdList from "./cmd/CmdList";
import AssMgr from "./AssMgr";
/**
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    assMgr: AssMgr = new AssMgr();
    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: AudioMgr = new AudioMgr();
    videoMgr: VideoMgr = new VideoMgr();
    state: IState;

    dh: DH = DH.instance;

    chapter: Chapter;
    cmdList: CmdList = new CmdList();
    curSid: number = 0;
    pause: boolean = true;

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        this.chapter = new Chapter(c);
        this.printChater();
        this.pause = false;
    }

    nextScene(sid: number = NaN): Scene {
        if (this.pause)
            return null;

        //结束标识
        if (this.curSid < 0) {
            this.pause = true;
            console.log("chapter complete");
            return null;
        }

        //过滤逻辑跳转专属CMD
        let s: Scene = this.chapter.getScene(this.curSid);
        for (let cmd of s.cmdArr) {
            console.log("senceID:", this.curSid, cmd.code, this.cmdList.get(cmd.code));

            switch (cmd.code) {
                case 100 : {
                    console.log("                   ", cmd.para[2]);
                    this.pause = true;
                    break;
                }

                case 101: {
                    let choise: string = window.prompt("input your choise below   option[" + cmd.para.slice(cmd.para.length / 2).toString() + "]");
                    while (choise == "") {
                        choise = window.prompt("input your choise below   option[" + cmd.para.slice(cmd.para.length / 2).toString() + "]");
                    }
                    return this.chapter.getScene(this.curSid = parseInt(cmd.para[cmd.para.length / 2 + parseInt(choise) - 1]));
                }

                case 1010: {

                }

                case 1011: {

                }

                case 209 : {
                    return this.nextScene(this.curSid = parseInt(cmd.para[cmd.para.length - 1]));
                }
            }
        }

        this.curSid = s.link;
        return s;
    }

    /**
     * 打印解析结果
     */
    private printChater() {
        for (let s of this.chapter.sceneArr) {
            console.log("Scene:", this.chapter.sceneArr.indexOf(s));
            for (let cmd of s.cmdArr) {
                console.log("      code:", cmd.code, this.cmdList.get(cmd.code), cmd.code == 100 ? cmd.para[2] : "",
                    cmd.code == 101 ? cmd.para.slice(cmd.para.length / 2) : "", cmd.code == 209 ? cmd.para[cmd.para.length - 1] : "");
            }
            console.log("                    next scene: ", s.link);
        }
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
}

/*
 //剧情指令
 case 206://"跳转剧情"   story.gotoChapter();
 case 251: //"呼叫子剧情"  snapper + story;
 */
