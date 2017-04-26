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
    miniPath?: string;
    gid?: string
    ver?: string
    qlty?: string
}

/**
 * 起始游戏文件名
 * 单包、分包
 */
interface StarName {
    single:string
    multiple:string
}

export default class Conf {
    //Event
    static EVN_READY:string = "evn_ready";

    //static
    static domain: Domain = {
        cdn: "http://dlcdn1.cgyouxi.com/",
        resCdn: "http://dlcdn1.cgyouxi.com/shareres/"
    };
    static domain4Test: Domain = {
        cdn: "http://testcdn.66rpg.com/",
        resCdn: "http://testcdn.66rpg.com/shareres/"
    };
    static loader: LoaderConf = {};
    static starName: StarName = {single: "data/game.bin", multiple: "game00.bin"};

    //dynamic
    static frameworks: Frameworks = {bgColor: "#AAAAAA", showStatus: true};
    static info: Info = {};
}