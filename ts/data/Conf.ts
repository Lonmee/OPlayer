import Story from "./sotry/Story";

/**
 * Created by Lonmee on 4/23/2017.
 * 框架静态数据预置
 */
interface Frameworks {
    ver?: string
    width?: number
    height?: number
    bgColor?: string
    showStatus?: boolean
}

interface Domain {
    cdn?: string
    resCdn: string
}

interface WebApi {
    testSvr: string
    svr: string
}

interface LoaderConf {
    retry?: number
    delay?: number
    max?: number
}

interface Info {
    storyArr?: Story[];
    miniPath?: string;
    gid?: string
    ver?: number
    qlty?: string
    single?: boolean
}

interface LocalTest {
    on: boolean
    mb: string
    sb: string
}

/**
 * 起始游戏文件名
 * 单包、分包
 */
interface StarName {
    single: string
    multiple: string
}

export default class Conf {
    //Event
    static STAGE_BLUR: string = "stage_blur";
    static LOADING_PROGRESS: string = "loading_progress";
    static PLAY_CHAPTER: string = "play_chapter";
    static ITEM_CHOSEN: string = "item_chosen";
    static RESTORE: string = "restore";
    static CMD_LINE_RESUME: string = "cmd_line_resume";
    static STATE_FF: string = "state_ff";
    static STATE_CANCEL: string = "state_cancel";

    //static
    static debug: boolean = true;//Todo:发布时关掉
    static localTest: LocalTest = {on: false, mb: "local/Map.bin", sb: "local/Game.bin"};
    static domain: Domain = {
        cdn: "http://dlcdn1.cgyouxi.com/",
        resCdn: "http://dlcdn1.cgyouxi.com/shareres/",
    };
    static domain4Test: Domain = {
        cdn: "http://testcdn.66rpg.com/",
        resCdn: "http://testcdn.66rpg.com/shareres/"
    };
    static webApi: WebApi = {
        testSvr: "//test-cg.66rpg.com/",
        svr: "//cgv2.66rpg.com/"
    };
    static loaderConf: LoaderConf = {};
    static starName: StarName = {single: "data/game.bin", multiple: "game00.bin"};

    //dynamic
    static frameworks: Frameworks = {ver: "1.0", bgColor: "#0", showStatus: false};
    static info: Info = {};

    constructor() {
        //TODO:平台适配设置
        /*this.isMobile = Laya.Browser.onMobile;
         this.isIos = Laya.Browser.onIOS;
         this.isAndroid = Laya.Browser.onAndriod;
         this.isAndroidBox = (GloableData.getInstance().mark== 'aBox');
         this.isSafrai = Laya.Browser.onSafari;
         var ua:string = window.navigator.userAgent.toLowerCase();
         if(ua.indexOf('micromessenger') !=-1){
         this.isWX = true;*/

        //Laya.Browser.onMobile
        //navigator.platform
        //navigator.appVersion
        //navigator.userAgent
    }

    static query(name: string) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    }
}