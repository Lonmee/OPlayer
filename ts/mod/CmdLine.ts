import ValueMgr from "./Mgr/ValueMgr";
import VideoMgr from "./Mgr/VideoMgr";
import AudioMgr from "./Mgr/AudioMgr";
import {Cmd, DChapter} from "../data/sotry/Story";
import {StateEnum, StateMgr} from "./state/State";
import AssMgr from "./Mgr/AssMgr";
import {ViewMgr} from "./Mgr/ViewMgr";
import {IMgr} from "./Mgr/Mgr";
import DH from "../data/DH";
import Conf from "../data/Conf";
import Reporter from "./reporter/Reporter";
import Chapter from "./cmd/chapter/Chapter";

export enum MgrEnum {ass, view, value, audio, video}

/**
 * 逻辑控制器
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    private dh: DH = DH.instance;
    private reporter: Reporter;
    private cc: number;//call counter
    private state: StateMgr;

    private assMgr: AssMgr;
    private viewMgr: ViewMgr;
    private valueMgr: ValueMgr;
    private audioMgr: AudioMgr;
    private videoMgr: VideoMgr;

    mgrArr: IMgr[] = [
        this.assMgr = new AssMgr(),
        this.viewMgr = new ViewMgr(),
        this.valueMgr = new ValueMgr(),
        this.audioMgr = new AudioMgr(),
        this.videoMgr = new VideoMgr()
    ];

    private cmdArr: Cmd[];
    private curCid: number;

    constructor() {
        this.reporter = this.dh.reporter;
        this.state = new StateMgr();
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Conf.RESTORE, this, this.restore);
        this.dh.eventPoxy.on(Conf.ITEM_CHOSEN, this, this.update);
        this.dh.eventPoxy.on(Conf.CMD_LINE_RESUME, this, this.update);
    }

    printCmdArr() {
        this.reporter.printCmdArr(this.cmdArr);
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        this.cmdArr = new Chapter(c).cmdArr;
        this.curCid = 0;
        this.state.play(true);
    }

    restore(snap) {
        this.reporter.logRestore(snap);//test only
        this.curCid = snap[0];
        this.cmdArr = snap[1];
    }

    complete() {
        if (!this.state.restore()) {
            this.state.pause(0, true);
            if (this.dh.story.sys.skipTitle)
                this.dh.story.gotoChapter(this.dh.story.sys.startStoryId);
            else
                this.viewMgr.ul.showMenu(-1);
        }
    }

    /**
     * 浮层及高级UI临时命令行插入
     * @param chapter
     * @returns {number}
     */
    insertChapter(chapter: Chapter) {
        if (this.state.id != StateEnum.Frozen && this.state.id != StateEnum.FrozenAll)
            this.state.mark([this.curCid, this.cmdArr]);
        this.state.frozen();
        this.cmdArr = chapter.cmdArr;
    }

    update(cid = NaN) {
        if (!isNaN(cid)) {
            this.curCid = cid;
            cid = NaN;
        }
        while (this.curCid < this.cmdArr.length) {
            this.cc++;
            let cmd = this.cmdArr[this.curCid++];
            this.reporter.logProcess(cmd, this.cc);//test only
            switch (cmd.code) {
                //需暂停等待
                case 208: //"返回标题画面"
                case 214: //"呼叫游戏界面"
                    if (parseInt(cmd.para[0]) == 10008) {
                        this.state.mark(null);
                        this.complete();
                    }
                    else if (parseInt(cmd.para[0]) == 10009)
                        this.state.auto();
                    else {
                        if (this.state.id < 4)
                            this.state.mark([this.curCid, this.cmdArr]);
                        this.state.frozenAll();
                        this.viewMgr.exe(cmd);
                    }
                    return this.cc = 0;
                // case 110: //"打开指定网页";
                case 100 : { //"显示文章"
                    this.state.pause();
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                case 101: //剧情分歧
                case 1010: //剧情分歧EX
                case 1011: //剧情分歧EX2
                case 204: { //按钮分歧
                    this.state.pause(0, true);
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                case 151: {//"返回游戏界面"
                    this.state.restore();
                    this.viewMgr.exe(cmd);
                    return this.cc = 0;
                }
                //状态指令
                case 210: {//等待
                    this.state.pause(parseInt(cmd.para[0]));
                    return this.cc = 0;
                }
                case 103: {//"自动播放剧情"
                    if (cmd.para[0] == "1")
                        this.state.auto();
                    else
                        this.state.cancel();
                    break;
                }
                case 104: {//"快进剧情"
                    if (cmd.para[0] == "1")
                        this.state.fast();
                    else
                        this.state.cancel();
                    break;
                }
                case 108 :
                case 212 :
                case 211 :
                case 102 :
                case 205 :
                case 201 :
                    return this.update(cmd.links[0]);
                //repeat end
                case 203:
                //repeat interrupt
                case 209: {
                    if (this.cc > 8000) {
                        this.curCid = cmd.links[0];
                        return this.cc = 0;
                    } else
                        return this.update(cmd.links[0]);
                }

                case 206 : //跳转剧情
                case 251: {//呼叫子剧情
                    this.state.mark(cmd.code == 206 ? null : [this.curCid, this.cmdArr]);
                    this.reporter.logTrans(cmd, cmd.code == 206 ? "" : [this.curCid, this.cmdArr]);//test only
                    this.state.pause(0, true);
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return this.cc = 0;
                }

                //条件分歧
                case 200: {
                    let bingo;
                    if (cmd.para[0].split("|")[0] == "MO") {
                        bingo = this.viewMgr.ul.checkHotarea(cmd);
                        this.curCid = cmd.links[bingo ? 0 : 1];
                        if (bingo && cmd.para[3] == '1')
                            return this.cc = 0;
                    } else
                        return this.update(cmd.links[this.valueMgr.judge(cmd.para) ? 0 : 1]);
                }
                case 217: {//高级条件分歧
                    let len = parseInt(cmd.para[3]);
                    let bingo;
                    for (let i = 4; i < 4 + len; i++) {
                        let p = cmd.para[i].split("&");
                        if (cmd.para[0] == "0") { // cmd.para[0] || : &&;
                            if (p[0].split("|")[0] == "MO") {
                                let moCmd: Cmd = {code: 200, para: p};
                                this.viewMgr.exe(moCmd);
                                bingo = this.viewMgr.ul.checkHotarea(moCmd);
                            } else {
                                bingo = this.valueMgr.judge(p);
                            }
                            if (bingo)
                                break;
                        }
                        else {
                            if (p[0].split("|")[0] == "MO") {
                                let moCmd: Cmd = {code: 200, para: p};
                                bingo = this.viewMgr.ul.checkHotarea(moCmd);
                            } else {
                                bingo = this.valueMgr.judge(p);
                            }
                            if (!bingo)
                                break;
                        }
                        bingo = cmd.para[0] != "0";
                    }
                    return this.update(cmd.links[bingo ? 0 : 1]);
                }

                default: {//非逻辑命令分发
                    for (let mgr of this.mgrArr)
                        mgr.exe(cmd);
                    if (this.state.id == StateEnum.FF)
                        this.viewMgr.update(0);
                }
            }
        }
        return this.complete();
    }
};