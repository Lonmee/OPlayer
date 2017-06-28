import Conf from "../../data/Conf";
import CmdList from "../cmd/CmdList";
import DH from "../../data/DH";
/**
 * Created by ShanFeng on 6/27/2017.
 */
export default class Reportor {

    constructor() {
        if (!Conf.debug)
            this.addInterruptor();
    }

    addInterruptor() {
        window.onerror = function (m, f, l, c, e) {
        //     let eInfo = {
        //         msg: m,
        //         file: f,
        //         line: l,
        //         column: c,
        //         error: JSON.stringify(e),
        //         gIndex: GloableData.getInstance().gameInfo.gIndex,
        //         guid: GloableData.getInstance().gameMainData.Headr.guid,
        //         sid: GloableData.getInstance().iMain.storyId,
        //         pos: GloableData.getInstance().iMain.pos,
        //         plat: plat
        //     };
        //
        //     let DataTime = new Date().getTime() / 1000;
        //     let uploadData = {
        //         sn: '9',
        //         sv: '1',
        //         ei: JSON.stringify(eInfo),
        //         rt: '1',
        //         sign: DataTime
            };
        //     AjaxManager.getInstance().sendAjaxPost("http://support.66rpg.com/report/bug", uploadData, this, null);
        //     // HttpManager.getInstance().sendPostRequest("http://support.66rpg.com/report/bug", uploadData, null, "json", null);
        // }
        // }
        Laya.Browser.onMobile
        /**
         * "Win32"
         * "Win64"
         */
        navigator.platform;
        /**
         * chrome:"Google Inc.
         * FF:""
         * IE:""
         * safari:"Apple Computer, Inc."
         */
        navigator.vendor;
        /**
         * chrome/FF/IE/safari:"Mozilla"
         */
        navigator.appCodeName;
        /**
         * chrome/FF/safari:"Netscape"
         * IE:"Microsoft Internet Explorer"
         */
        navigator.appName;
        /**
         * chrome:"5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3138.0 Safari/537.36"
         * FF:"5.0 (Windows)"
         * IE:"4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)"
         * safari:"5.0 (Windows NT 6.2; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2"
         */
        navigator.appVersion;
        /**
         * kw: "Chrome"
         * chrome:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3138.0 Safari/537.36'
         * kw: "Firefox"
         * FF:"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:54.0) Gecko/20100101 Firefox/54.0"
         * kw: "MSIE"
         * IE:"Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)"
         * kw: "Safari"
         * safari:"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2"
         */
        navigator.userAgent;

        Conf.frameworks.ver;
        Conf.info.ver;
        Conf.info.gid;
    }
}

//"para0|para1|para2|..."

// 错误日志分析：~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//o 客户端类型 ：采用英文编码，编码定好后，告知我
//o 操作系统
//o 客户端版本号
//x 设备型号
//x 设备ID
//x 浏览器版本
//o 错误类别：崩溃，错误
//o 堆栈
//x 内存总量
//x 内存可用量
//o 用户ID @ external @@ window["commonPlayer"]
//o 游戏ID @ gIndex
//o 时间
//
//
// 程序启动信息：~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//o 客户端类型
//o 操作系统
//o 客户端版本号
//ox 设备型号
//x 浏览器版本
//x 客户端IP
//x 设备ID
//o 时间

// /** 浏览器代理信息。*/
// static userAgent: string;
// /** 表示是否在 ios 设备。*/
// static onIOS: boolean;
// /** 表示是否在移动设备。*/
// static onMobile: boolean;
// /** 表示是否在 iphone设备。*/
// static onIPhone: boolean;
// /** 表示是否在 ipad 设备。*/
// static onIPad: boolean;
// /** 表示是否在 andriod设备。*/
// static onAndriod: boolean;
// /** 表示是否在 Windows Phone 设备。*/
// static onWP: boolean;
// /** 表示是否在 QQ 浏览器。*/
// static onQQBrowser: boolean;
// /** 表示是否在移动端 QQ 或 QQ 浏览器。*/
// static onMQQBrowser: boolean;
// /** 表示是否在移动端 Safari。*/
// static onSafari: boolean;
// /** 微信内*/
// static onWeiXin: boolean;
// /** 表示是否在 PC 端。*/
// static onPC: boolean;



















