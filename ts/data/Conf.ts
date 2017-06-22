import Story from "./sotry/Story";
/**
 * Created by Lonmee on 4/23/2017.
 * 框架静态数据预置
 */
interface Frameworks {
    width?: number
    height?: number
    bgColor?: string
    showStatus?: boolean
}

interface Domain {
    cdn?: string
    resCdn: string;
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
    static LOADING_PROGRESS: string = "loading_progress";
    static PLAY_CHAPTER: string = "play_chapter";
    static CMD_LINE_RESUME: string = "cmd_line_resume";
    static ITEM_CHOOSEN: string = "item_choosen";
    static CHANGE_STATE: string = "change_state";
    static QUITE_GAME: string = "quite_game";
    
    //static
    static debug: boolean = true;//Todo:发布时关掉
    static localTest: LocalTest = {on: false, mb: "local/Map.bin", sb: "local/Game.bin"};
    static domain: Domain = {
        cdn: "http://dlcdn1.cgyouxi.com/",
        resCdn: "http://dlcdn1.cgyouxi.com/shareres/"
    };
    static domain4Test: Domain = {
        cdn: "http://testcdn.66rpg.com/",
        resCdn: "http://testcdn.66rpg.com/shareres/"
    };
    static loaderConf: LoaderConf = {};
    static starName: StarName = {single: "data/game.bin", multiple: "game00.bin"};

    //dynamic
    static frameworks: Frameworks = {bgColor: "#AAAAAA", showStatus: false};
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
    }
}