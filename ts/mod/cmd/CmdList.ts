import Dictionary = laya.utils.Dictionary;
/**
 * Created by ShanFeng on 5/3/2017.
 */
export interface ILinkage {
    link?: number
}

export interface IPausable {
    duration: number
}

export interface IUICallable {
    uiNo: number
}

export default class CmdList extends Dictionary {
    constructor() {
        super();
        this.set(100, "显示文章");
        this.set(101, "剧情分歧");
        this.set(1010, "剧情分歧EX");
        this.set(1011, "剧情分歧EX2");
        this.set(102, "剧情分歧结束");
        this.set(103, "自动播放剧情");
        this.set(104, "快进剧情");
        this.set(105, "数值输入");
        this.set(106, "提示消息框");
        this.set(107, "注释");
        this.set(108, "分支选项内容");
        this.set(109, "消失对话框");
        this.set(110, "打开指定网页");
        this.set(111, "禁用开启菜单功能");
        this.set(112, "悬浮组件开关");
        this.set(150, "刷新UI画面");
        this.set(151, "返回游戏界面");
        this.set(200, "条件分歧");
        this.set(201, "条件分歧结束");
        this.set(202, "循环");
        this.set(203, "以上反复");
        this.set(204, "按钮分歧");
        this.set(205, "按钮分歧结束");
        this.set(206, "跳转剧情");
        this.set(207, "数值操作");
        this.set(208, "返回标题画面");
        this.set(209, "中断循环");
        this.set(210, "等待");
        this.set(211, "除此之外的场合");
        this.set(212, "按钮分歧内容");
        this.set(213, "二周目变量");
        this.set(214, "呼叫游戏界面");
        this.set(215, "字符串");
        this.set(216, "高级数值操作");
        this.set(217, "高级条件分歧");
        this.set(218, "强制存档读档");
        this.set(219, "气泡式效果");
        this.set(251, "呼叫子剧情");
        this.set(301, "天气");
        this.set(302, "震动");
        this.set(303, "画面闪烁");
        this.set(304, "准备转场");
        this.set(305, "转场开始");
        this.set(306, "更改场景色调");
        this.set(307, "插入到BGM鉴赏");
        this.set(308, "插入到CG鉴赏");
        this.set(400, "显示图片");
        this.set(401, "淡出图片");
        this.set(402, "移动图片");
        this.set(403, "显示心情");
        this.set(404, "旋转图片");
        this.set(405, "资源预加载(仅web用)");
        this.set(406, "显示动态图片");
        this.set(407, "变色");
        this.set(501, "播放背景音乐");
        this.set(502, "播放音效");
        this.set(503, "播放语音");
        this.set(504, "播放背景音效");
        this.set(505, "淡出背景音乐");
        this.set(506, "停止音效");
        this.set(507, "停止语音");
        this.set(508, "淡出音效");
    }
}

/*

 Laya.timer.once(parseInt("2000"), null, () => {
 this.pause = false;
 });
 this.pause = true;
 break;
 }

 Laya.timer.once(parseInt(cmd.para[0]), null, () => {
 this.pause = false
 });
 this.pause = true;
 break;
 }

 等待集合:
 case 100://"显示文章"

 //状态指令
 case 210://等待
 case 103://"自动播放剧情"
 case 104://"快进剧情"

 //数值
 case 105://"数值输入"
 case 207://"数值操作"
 case 213://"二周目变量"
 case 215://"字符串"
 case 216://"高级数值操作"

 //显示控制指令
 case 110://"打开指定网页";
 case 111://"禁用开启菜单功能";
 case 112://"悬浮组件开关";

 //资源管理指令
 case 405://"资源预加载(仅web用)";

 //剧情指令
 case 206://"跳转剧情"
 case 251: //"呼叫子剧情"

 //界面指令
 case 150:// "刷新UI画面"
 case 151: //"返回游戏界面"
 case 208: //"返回标题画面"
 case 214: //"呼叫游戏界面"
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

 */
