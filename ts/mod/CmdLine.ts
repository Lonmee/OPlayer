import Conf from "../data/Conf";
import DH from "../data/DH";
import ValueMgr from "./Mgr/ValueMgr";
import VideoMgr from "./Mgr/VideoMgr";
import AudioMgr from "./Mgr/AudioMgr";
import Chapter from "./cmd/Chapter";
import {Cmd, DChapter} from "../data/sotry/Story";
import {AutoState, FFState, IState, NormalState, StateEnum} from "./state/State";
import AssMgr from "./Mgr/AssMgr";
import {ViewMgr} from "./Mgr/ViewMgr";
import CmdList from "./cmd/CmdList";
import Scene from "./cmd/Scene";
import Event = laya.events.Event;
import {IMgr} from "./Mgr/Mgr";
import Browser = laya.utils.Browser;
import Label = laya.ui.Label;

export enum MgrEnum {ass, view, value, audio, video}
/**
 * 逻辑控制器
 * 负责命令分发至各管理器
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    appending: [number, number, Chapter][] = [];
    assMgr: AssMgr;
    viewMgr: ViewMgr;
    valueMgr: ValueMgr;
    soundMgr: AudioMgr;
    videoMgr: VideoMgr;

    mgrArr: IMgr[] = [
        this.assMgr = new AssMgr(),
        this.viewMgr = new ViewMgr(),
        this.valueMgr = new ValueMgr(),
        this.soundMgr = new AudioMgr(),
        this.videoMgr = new VideoMgr()
    ]

    states: IState[] = [new NormalState(), new AutoState(), new FFState()];
    state: IState;
    pause: boolean = true;
    chapter: Chapter;
    curSid: number = 0;
    curCid: number = 0;

    private dh: DH = DH.instance;
    private cmdArr: Cmd[] = [];

    constructor() {
        this.dh.mgrArr = this.mgrArr;

        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
        this.dh.eventPoxy.on(Event.CLICK, this, this.resume);
        this.dh.eventPoxy.on(Event.KEY_DOWN, this, this.resume);
        this.dh.eventPoxy.on(Conf.CMD_LINE_RESUME, this, this.resume);
        this.dh.eventPoxy.on(Conf.ITEM_CHOOSEN, this, this.resume);
        Laya.timer.frameLoop(1, this, this.update);
    }

    /**
     * 章节数据准备完毕启动该句柄
     * @param c
     */
    playHandler(c: DChapter) {
        //呼叫子剧情时缓存当前剧情及播放进度
        this.curCid = 0;
        this.curSid = 0;
        this.chapter = new Chapter(c);
        this.cmdArr = [];
        this.pause = false;
    }

    /**
     * 恢复父剧情
     */
    restoreChapter() {
        let snap: [number, number, Chapter] = this.appending.pop();
        this.curCid = snap[0];
        this.curSid = snap[1];
        this.chapter = snap[2];
        this.cmdArr = [];
        this.pause = false;
    }

    changeState(cmd: Cmd | number) {
        if (typeof cmd == "number") {
            this.states[cmd];
        } else {
            this.state = cmd.code == 103 ?
                this.states[parseInt(cmd.para[0]) ? StateEnum.Auto : StateEnum.Normal] :
                this.states[parseInt(cmd.para[0]) ? StateEnum.FF : StateEnum.Normal];
        }
    }

    resume(e: Event | number) {
        this.pause = false;
        if (typeof e == "number") {
            this.update(e);
        }
    }

    cmdList: CmdList = new CmdList();

    update(sid = NaN) {
        if (this.pause) {
            return;
        }
        // if (this.curCid == this.cmdArr.length && this.curSid != -1)
        // if (this.curSid != -1 && sid != this.curSid)
        if (sid > 0 || this.curCid == this.cmdArr.length) {
            let s: Scene = this.chapter.getScene(isNaN(sid) ? this.curSid : this.curSid = sid);
            this.cmdArr = s.cmdArr;
            this.curSid = s.link;
            this.curCid = 0;
        }
        if (this.curSid == -1) {
            if (this.appending.length > 0) {
                this.restoreChapter();
            } else {
                this.pause = true;
                //todo:chapter complete
                this.curCid = this.curSid = 0;
                console.log("chapter complete");
            }
        }

        while (this.curCid < this.cmdArr.length) {
            let cmd = this.cmdArr[this.curCid++];
            console.log(cmd.code, this.cmdList.get(cmd.code));
            // if (Browser.onMobile) {
            (Laya.stage.getChildByName("cmd") as Label).text = cmd.code + this.cmdList.get(cmd.code);
            // }
            switch (cmd.code) {
                //需暂停等待
                case 150: //"刷新UI画面"
                case 208: //"返回标题画面"
                case 214: //"呼叫游戏界面"
                case 218: //"强制存档读档"
                case 110: //"打开指定网页";
                case 111: //"禁用开启菜单功能";

                case 101: //剧情分歧
                case 1010: //剧情分歧EX
                case 1011: //剧情分歧EX2
                case 204:  //按钮分歧
                case 100 : { //"显示文章"
                    this.pause = true;
                    this.viewMgr.exe(cmd);
                    return;
                }
                case 151: {//"返回游戏界面"
                    this.pause = false;
                    this.viewMgr.exe(cmd);
                    return;
                }
                //状态指令
                case 210: {//等待
                    this.pause = true;
                    Laya.timer.once(Math.round(parseInt(cmd.para[0]) / 60 * 1000), this, this.resume);
                    console.log("waiting for", Math.round(parseInt(cmd.para[0]) / 60 * 1000) + " ms");
                    return;
                }
                case 103://"自动播放剧情"
                case 104: {//"快进剧情"
                    this.changeState(cmd);
                }
                //repeat end
                case 203:
                //repeat interrupt
                case 209: {
                    this.curSid = cmd.links[0];
                    return
                }
                //跳转剧情
                case 206 : {
                    this.pause = true;
                    console.log("gotoChapter:", parseInt(cmd.para[0]));
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return;
                }
                //呼叫子剧情
                case 251: {
                    this.pause = true;
                    this.appending.push([this.curCid, this.curSid, this.chapter]);
                    console.log("insertChapter:", parseInt(cmd.para[0]));
                    this.dh.story.gotoChapter(parseInt(cmd.para[0]));
                    return;
                }

                case 200://条件分歧
                    // 0：数值索引 (二周目变量为: EX|数值索引,鼠标按下：MO|,鲜花：FL|,平台：PT|，支付：PA )
                    // 1：关系Index(==,>=,<=,>,<,!=)() 或支付下的支付ID
                    // 2:比较对象为常量(0)、其他数值(1)或二周目变量(2)
                    // 3：操作数
                    // 4：有无else(1,0)
                    // 5:显示信息【若为鼠标按下】 1：矩形类型
                                                // 2：矩形大小(x,y,w,h)或图片编号
                                                // 3：0是经过1是按下
                                                // 4：有无else(1,0)】
                    //          【若为平台】0:PT|
                                        // 1:0
                                        // 2:0
                                        // 3:平台[1pc,2web,3Android,4IOS,5H5],
                                        // 4:有无else(1,0)
                                        // 5:显示信息
						// 	 	【若为支付】0:PA| 加上 二周目变量
                                        // 1:是否为恢复购买
                                        // 2:商品名称（ID）
                                        // 3:无
                                        // 4:有无else留位
                                        // 5:说明
						// 		【若为任务】长度+1  0:0
                                        // 1:6(关系index不在指定范围)
                                        // 2:0
                                        // 3:0
                                        // 4:有无else(1,0)
                                        // 5:显示信息
                                        // 6:TA|任务编号
                    break;
                case 217: {//高级条件分歧
                    // 0：0（或者）、1（并且）
                    // 1：0(无else)、1（有else）
                    // 2:说明信息
                    // 3:共几个条件项
                    // 4： 是以&符号隔开的条件分歧每项(增加了最大小值比较)
                    // 5： 是以&符号隔开的条件分歧每项
                    // 5:...最个多有5
                    let choice: string = window.prompt(cmd.para.toString() + "\n input your choice below   option [yes, no]");
                    while (choice == "") {
                        choice = window.prompt(cmd.para.toString() + "\n input your choice below   option [yes, no]");
                    }
                    //兼容条件结构特例
                    if (parseInt(choice) == 1 || parseInt(choice) == 2 && cmd.links.length == 2)
                        this.curSid = cmd.links[parseInt(choice) - 1];
                    return;
                }

                default: {
                    for (let mgr of this.mgrArr)
                        mgr.exe(cmd);
                }
            }
        }
    }
};