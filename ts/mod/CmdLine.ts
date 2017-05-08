import {Cmd} from "../data/sotry/Story";
import Conf from "../data/Conf";
import DH from "../data/DH";
import {Chapter} from "../data/sotry/Chapter";
/**
 * Created by ShanFeng on 5/2/2017.
 * alias "TimeLine"
 */
export default class CmdLine {
    dh: DH = DH.instance;
    chapter: Chapter;
    len: number;
    idx: number = 0;
    pause: boolean = true;
    private cmdArr: Cmd[];

    constructor() {
        this.dh.eventPoxy.on(Conf.PLAY_CHAPTER, this, this.playHandler);
    }

    playHandler(c: Chapter) {
        this.chapter = c;
        this.cmdArr = c.cmdArr;
        this.len = c.cmdArr.length;
        this.idx = 0;
        this.pause = false;

        for (let cmd of c.cmdArr) {
            switch (cmd.code) {


                case 204: {//按钮分歧(205, "按钮分歧结束")(212, "按钮分歧内容")
                    // this.pause = true;
                    Laya.timer.once(parseInt("2000"), null, () => {
                        this.pause = false;
                    });
                    this.pause = true;
                    break;
                }

                //状态指令
                case 210: {//等待
                    Laya.timer.once(parseInt(cmd.para[0]), this, () => {
                        this.pause = false
                    });
                    this.pause = true;
                    break;
                }
                case 103://"自动播放剧情"
                case 104://"快进剧情"

                case 202://循环(203, "以上反复");(209, "中断循环");

                case 200://条件分歧(201, "条件分歧结束")(211, "除此之外的场合")
                case 217://"高级条件分歧"

                //数值
                case 105://"数值输入"
                case 207://"数值操作"
                case 213://"二周目变量"
                case 215://"字符串"
                case 216://"高级数值操作"

                //指令
                case 110://"打开指定网页");
                case 111://"禁用开启菜单功能");
                case 112://"悬浮组件开关");
                case 405://"资源预加载(仅web用)");

                //剧情指令
                case 206://"跳转剧情"

                //界面指令
                case 150:// "刷新UI画面"
                case 151: //"返回游戏界面"
                case 208: //"返回标题画面"
                case 214: //"呼叫游戏界面"
                case 251: //"呼叫子剧情"
                case 218: //"强制存档读档"

                //显示
                case 100://"显示文章"
                case 106://"提示消息框"
                case 107://"注释"
                case 109://"消失对话框"
                case 219://"气泡式效果"
                case 301://"天气"
                case 302://"震动"
                case 303://"画面闪烁"
                case 304://"准备转场"
                case 305://"转场开始"
                case 306://"更改场景色调"
                case 307://"插入到BGM鉴赏"
                case 308://"插入到CG鉴赏"
                case 400://"显示图片"
                case 401://"淡出图片"
                case 402://"移动图片"
                case 403://"显示心情"
                case 404://"旋转图片"
                case 406://"显示动态图片"
                case 407://"变色"

                //声音
                case 501://"播放背景音乐"
                case 502://"播放音效"
                case 503://"播放语音"
                case 504://"播放背景音效"
                case 505://"淡出背景音乐"
                case 506://"停止音效"
                case 507://"停止语音"
                case 508://"淡出音效"
            }
        }
    }

    nextCmd(): Cmd {
        this.pause = this.idx == this.len - 1;
        return this.cmdArr[this.idx++];
    }
}