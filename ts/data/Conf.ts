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

interface LoaderConf {
    retry?: number
    delay?: number
    max?: number
}

interface Domain {
    cdn?: string
}

export default class Conf {
    static frameworks: Frameworks = {bgColor: "#AAAAAA", showStatus: true};
    static domain: Domain = {cdn: "http://dlcdn1.cgyouxi.com/"};
    static domain4Test: Domain = {cdn: "http://testcdn.66rpg.com/"};
    static loader: LoaderConf = {};
}