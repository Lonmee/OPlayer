import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./view/Mgr/ValueMgr";
import VideoMgr from "./view/Mgr/VideoMgr";
import AudioMgr from "./view/Mgr/AudioMgr";
import Chapter from "./cmd/Chapter";
import {DChapter} from "../data/sotry/Story";
import Scene from "./cmd/Scene";
import {AutoState, FFState, IState} from "./state/State";
import CmdList from "./cmd/CmdList";
import AssMgr from "./view/Mgr/AssMgr";
/**
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    appending: boolean = false;
    chapters: [[number, Chapter]] = [[0, null]];
    assMgr: AssMgr = new AssMgr();
    valueMgr: ValueMgr = new ValueMgr();
    soundMgr: AudioMgr = new AudioMgr();
    videoMgr: VideoMgr = new VideoMgr();
    states: IState[] = [new AutoState(), new FFState()];

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
        //呼叫子剧情时缓存当前剧情及播放进度
        if (this.appending) {
            this.chapters.push([this.curSid, this.chapter]);
        }
        this.chapter = new Chapter(c);
        this.curSid = 0;
        this.pause = false;
    }

    changeState(state: number) {
        //this.nextScene = StateNo.Auto;
    }

    nextScene(sid: number = NaN): Scene {
        if (this.pause)
            return null;

        //结束标识
        if (this.curSid < 0) {
            if (this.appending && this.chapters.length > 0) {//还原父剧情
                let reS: [number, Chapter] = this.chapters.pop();
                this.curSid = reS[0];
                this.chapter = reS[1];
                if (this.chapters.length == 0) {
                    this.appending = false;
                }
            } else {
                this.pause = true;
                console.log("chapter complete");
                return null;
            }
        }

        //过滤逻辑跳转专属CMD
        let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);
        this.curSid = s.link;
        for (let cmd of s.cmdArr) {
            console.log("senceID:", this.curSid, cmd.code, this.cmdList.get(cmd.code));
            switch (cmd.code) {
                case 100: {//显示文字
                    this.pause = true;
                    break;
                }

                case 200: {//条件分歧
                    this.valueMgr;
                    break;
                }

                case 217: {//高级条件分歧
                    this.valueMgr;
                    break;
                }

                case 209 : {//跳出循环
                    //return this.nextScene(this.curSid = parseInt(cmd.para[cmd.para.length - 1]));
                    this.curSid = parseInt(cmd.para[cmd.para.length - 1]);
                    break;
                }

                case 210: {//等待
                    Laya.timer.once(parseInt(cmd.para[0]) / 60 * 1000, null, () => {
                        this.pause = false
                    });
                    this.pause = true;
                    break;
                }

                case 206 : {//跳转剧情
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    this.pause = true;
                    break;
                }

                case 251: {//呼叫子剧情
                    this.appending = this.pause = true;
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    break;
                }
            }
        }

        return s;
    }
};

/*
 //剧情指令
 case 206://"跳转剧情"   story.gotoChapter();
 case 251: //"呼叫子剧情"  snapper + story;
 */
