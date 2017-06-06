import LoaderManager = laya.net.LoaderManager;
import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;
import DH from "../../data/DH";
import {getBtnData, getBtnLink, getUILink} from "../view/ui/comp/Comp";
import Conf from "../../data/Conf";
/**
 * Created by ShanFeng on 6/5/2017.
 */
export default class Preloader extends LoaderManager {
    preArr: [string[]];

    constructor() {
        super();
        this.preArr = [
            //橙光菜单
            [
                "local/img/sys/game_menu2.png",
                "local/img/sys/game_menu2_pitch.png",
                "local/img/sys/game_menu3.png",
                "local/img/sys/game_menu3_pitch.png"
            ],
            //选项资源
            this.parseBtn(DH.instance.story.sys.MessageBox.choiceButtonIndex),
            //对话框资源
            [getUILink(DH.instance.story.sys.MessageBox.talk.bgImg.path)]
        ];

        this.next();
    }

    parseBtn(btnIdx: number) {
        let bd = getBtnData(btnIdx);
        return [getBtnLink(bd.image1.path), getBtnLink(bd.image2.path)];
    }

    private next(): void {
        if (this.preArr.length) {
            super.load(this.preArr.shift(), Handler.create(this, this.next), Handler.create(this, this.progress), Loader.IMAGE, 2, true, "preload", false);
        } else {
            //todo:开始预载伺服
            // if (Conf.info.single) {
            //     DH.instance.story.gotoChapter(DH.instance.story.sys.startStoryId);
            //     delete DH.instance.binLoader;
            // } else {
            //     //Todo:该处可提前至开始剧情赋值之后实现提前载入，但实际意义待考
            //     require(["js/mod/loader/StepLoader"], (StepLoader) => {
            //         DH.instance.binLoader = new StepLoader.default(DH.instance.story.sys.startStoryId);
            //     });
            // }
        }
    }

    private progress() {

    }
}