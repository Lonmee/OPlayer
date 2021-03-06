import Handler = laya.utils.Handler;
import Loader = laya.net.Loader;
import Byte = laya.utils.Byte;
import Color = laya.utils.Color;
import Conf from "../../data/Conf";
import DH, {IBinloader} from "../../data/DH";
import DStory, {
    BGM,
    BGMItem,
    CG,
    CGItem,
    Cmd,
    CusUI,
    CusUIItem,
    DChapter,
    DFLayer,
    DFLayerItem,
    GameMenu,
    IdxBtn,
    ImgBtn,
    MsgBox,
    Music,
    NameWin,
    Path,
    Replay,
    SaveData,
    Setting,
    TalkWin,
    Title,
    VPRect
} from "../../data/sotry/Story";
import Preloader from "./Preloader";

/**
 * Created by ShanFeng on 4/24/2017.
 * assetsmap、storymap加载器
 * 结果序列化之后自行回收
 * 分包情况下追建StepLoader用于后继剧情待载
 * 宿主置于DH.binLoader
 */
export class BinLoader implements IBinloader {
    single: boolean;
    private bufArr: any[] = [];

    /**
     * bin加载器
     * 负责mapbin/gamebin的加载及解析
     * @param localTest 是否本地测试模式（数据文件放在oplayer/local）
     */
    constructor(localTest: boolean = false) {
        //本地测试
        Conf.localTest.on = localTest;

        if (Conf.localTest.on) {
            this.load(Conf.localTest.mb);
            return;
        }

        let url: string = Conf.domain.cdn + "web/" +
            Conf.info.gid + "/" + Conf.info.ver + "/Map" +
            (Conf.info.qlty != "0" ? "_" + Conf.info.qlty : "") + ".bin";
        this.load(url);

        //todo:jason格式的resourceBin下载&解析
        /*url = (Conf.query("testPath") ? Conf.webApi.testSvr : Conf.webApi.svr) +
         "api/oapi_map.php?action=create_bin&" +
         "guid=" + Conf.info.gid +
         "&version=" + Conf.info.ver +
         "&quality=" + Conf.info.qlty;
         this.loadJason(url);*/

        if (Conf.info.miniPath) {
            url = Conf.domain.cdn + Conf.info.miniPath;
            this.load(url);
        }
    }

    private load(url: string) {
        let idx: number = this.bufArr.push(url);

        Laya.loader.load(url,
            Handler.create(this, this.completeHandler, [idx], true),
            Handler.create(this, BinLoader.progressHandler, [url], true),
            Loader.BUFFER, 0, true, "bin", false);
    }

    private static progressHandler(fName: string, p: number) {
        DH.instance.eventPoxy.event(Conf.LOADING_PROGRESS, [fName, p]);
    }

    private completeHandler(idx: number, ab: ArrayBuffer) {
        this.bufArr[idx - 1] = new Byte(ab);
        laya.net.Loader.clearResByGroup("bin");

        if (this.bufArr.every(fullyLoadedTester)) {
            for (let i: number = 0; i < this.bufArr.length; i++) {
                let byte: Byte = this.bufArr[i];
                let len: number = byte.getInt32();
                if (Conf.info.qlty == "31")
                    for (let i: number = 0; i < len; i++)
                        DH.instance.resMap.set(byte.getUTFBytes(byte.getInt32()), {
                            size: byte.getInt32(), md5: byte.getUTFBytes(byte.getInt32()),
                            info: byte.getUTFBytes(byte.getInt32()), obj: {w: NaN, h: NaN}
                        });
                else
                    for (let i: number = 0; i < len; i++)
                        DH.instance.resMap.set(byte.getUTFBytes(byte.getInt32()), {
                            size: byte.getInt32(),
                            md5: byte.getUTFBytes(byte.getInt32())
                        });
                if (byte.bytesAvailable > 0)
                    console.log("%c something left in assets bin", 'color: #FF5555');
                byte.clear();
            }
            Conf.info.single = this.single = this.bufArr.length == 1;
            this.loadChapter(this.single ? Conf.starName.single : Conf.starName.multiple);
        }

        function fullyLoadedTester(ele: any): boolean {
            return ele instanceof Byte;
        }
    }

    /**
     * 分包数据仅包含storyInfo
     * 单包数据含剧情
     * @param s
     */
    loadChapter(s: string | number) {
        if (typeof s == "number") {
            s = `game${s}.bin`;
        }
        Laya.loader.load(Conf.localTest.on ? Conf.localTest.sb : DH.instance.getResLink(s),
            Handler.create(this, this.sCompleteHandler, null, true),
            Handler.create(this, BinLoader.progressHandler, [s], true),
            Loader.BUFFER, 0, false, "bin", false);
    }

    private sCompleteHandler(ab: ArrayBuffer) {
        let byte: Byte = new Byte(ab);
        if (byte.readUTFBytes(6) == "ORGDAT") {
            //reset story
            let story: DStory = DH.instance.story = new DStory();
            //for header
            Conf.info.ver = story.header.ver = byte.getInt32();
            Conf.frameworks.width = story.header.gWidth = byte.getInt32();
            Conf.frameworks.height = story.header.gHeight = byte.getInt32();
            story.header.mPWid = byte.getInt32();
            story.header.mPHei = byte.getInt32();
            story.header.gUid = parseUTF();
            story.header.title = parseUTF();
            story.header.gVer = byte.getInt32();
            story.header.crc32 = byte.getInt32();
            byte.pos += 4;//project main len

            //for system
            byte.pos += 4;//system len
            story.sys.fontName = parseUTF();
            story.sys.fontSize = byte.getInt32();
            //Todo:该平台特性化操作应转移至控制层
            //0211 移动端字体较大，pc端较小，原始字体大小h5一行全是字可能顶出屏幕空间
            if (Laya.Browser.onMobile || Laya.Browser.onIOS) {
                story.sys.fontSize *= 0.85;
            } else {
                story.sys.fontSize *= 0.8;
            }

            story.sys.fontColor4Msg = new Color(parseUTF());
            story.sys.fontColor4UI = new Color(parseUTF());
            if (Conf.info.ver >= 101) {
                story.sys.fontStyle = byte.getInt32();
            }
            story.sys.skipTitle = byte.getInt32() != 0;
            story.sys.startStoryId = byte.getInt32();
            story.sys.autoUpdate = byte.getInt32() != 0;
            story.sys.icon = parsePath();
            story.sys.showAD = byte.getInt32() != 0;
            story.sys.authorWords = parseUTF();
            story.sys.authorWordsTime = byte.getInt32();
            story.sys.autoRun = byte.getInt32() != 0;
            story.sys.showSysMenu = byte.getInt32() != 0;

            story.sys.SEClick = parseMusic();
            story.sys.SEMove = parseMusic();
            story.sys.SECancel = parseMusic();
            story.sys.SEError = parseMusic();

            story.sys.title = parseTitle(); //标题画面
            story.sys.gMenu = parseGameMenu();//菜单
            story.sys.CG = parseCG();//CG
            story.sys.BGM = parseBGM();//BGM
            story.sys.SaveData = parseSaveData();//SAVE
            story.sys.MessageBox = parseMsgBox();//对话框
            story.sys.Replay = parseReplay();//回放
            story.sys.Setting = parseSetting();//设置
            story.sys.Buttons = parseImgBtnArr();

            story.sys.UIInitSave = byte.getInt32() != 0;

            if (Conf.info.ver >= 103) {
                story.sys.Cuis = parseCusUIArr();
                story.sys.MenuIndex = byte.getInt32();
            } else {
                story.sys.Cuis = null;
                story.sys.MenuIndex = 0;
            }
            //for commands
            //兼容单包、分包策略
            if (this.single) {
                byte.pos += 4;
                story.name = parseUTF();
                story.dChapterArr = parseChapterArr();
            }

            if (Conf.info.ver >= 104) {
                story.fLayerArr = parseFLayerArr();
            }

            if (byte.bytesAvailable > 0) {
                console.log("%c something left in story bin", 'color: #FF5555');
            }

            byte.clear();

            //region For game data init
            DH.instance.preloader = new Preloader();
            Laya.stage.size(Conf.frameworks.width, Conf.frameworks.height);
            //endregion
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Parse function~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        function parseUTF(): string {
            return byte.getUTFBytes(byte.getInt32());
        }

        function parsePath(): Path {
            byte.pos += 4;//structure len
            return {from: byte.getInt32(), path: parseUTF()}
        }

        function parseMusic(): Music {
            byte.pos += 4;//structure len
            return {path: parsePath(), vol: byte.getInt32()}
        }

        function parseTitle(): Title {
            byte.pos += 4;//structure len
            return {
                showLog: byte.getInt32() != 0,
                logoImage: parsePath(),
                titleImage: parsePath(),
                drawTitle: byte.getInt32() != 0,
                bgm: parseMusic(),
                buttons: parseIdxBtnArr()
            }
        }

        function parseIdxBtnArr(): IdxBtn[] {
            let arr: IdxBtn[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseIdxBtn());
            }
            return arr;
        }

        function parseIdxBtn(): IdxBtn {
            byte.pos += 4; //structure len
            return {idx: byte.getInt32(), x: byte.getInt32(), y: byte.getInt32()};
        }

        function parseImgBtnArr(): ImgBtn[] {
            let arr: ImgBtn[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseImgBtn());
            }
            return arr;
        }

        function parseImgBtn(): ImgBtn {
            byte.pos += 4; //structure len
            return {
                name: parseUTF(),
                image1: parsePath(),
                image2: parsePath(),
                x: byte.getInt32(),
                y: byte.getInt32()
            }
        }

        function parseGameMenu(): GameMenu {
            byte.pos += 4;
            return {bgImg: parsePath(), buttons: parseIdxBtnArr()};
        }

        function parseCG(): CG {
            byte.pos += 4;
            return {
                bgImg: parsePath(),
                column: byte.getInt32(),
                spanRow: byte.getInt32(),
                spanCol: byte.getInt32(),
                showMsg: byte.getInt32() != 0,
                msgX: byte.getInt32(),
                msgY: byte.getInt32(),
                zoom: byte.getInt32(),
                cgx: byte.getInt32(),
                cgy: byte.getInt32(),
                noPic: parsePath(),
                CGList: parseCGList(),
                vpRect: parseVPRect(),
                backButton: parseIdxBtn(),
                closeButton: parseIdxBtn()
            }
        }

        function parseVPRect(): VPRect {
            byte.pos += 4;
            return {x: byte.getInt32(), y: byte.getInt32(), w: byte.getInt32(), h: byte.getInt32()};
        }

        function parseCGList(): CGItem[] {
            let arr: CGItem[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseCGItem());
            }
            return arr;
        }

        function parseCGItem(): CGItem {
            byte.pos += 4;
            return {name: parseUTF(), path: parsePath(), msg: parseUTF()};
        }

        function parseBGM(): BGM {
            byte.pos += 4;
            return {
                bgImg: parsePath(),
                column: byte.getInt32(),
                spanRow: byte.getInt32(),
                spanCol: byte.getInt32(),
                showPic: byte.getInt32() != 0,
                showMsg: byte.getInt32() != 0,
                px: byte.getInt32(),
                py: byte.getInt32(),
                mx: byte.getInt32(),
                my: byte.getInt32(),
                nx: byte.getInt32(),
                ny: byte.getInt32(),
                noName: parseUTF(),
                noPic: parsePath(),
                bgmList: parseBgmItemList(),
                vpRect: parseVPRect(),
                selectButton: parseIdxBtn(),
                closeButton: parseIdxBtn()
            }
        }

        function parseBgmItemList(): BGMItem[] {
            let arr: BGMItem[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseBGMItem());
            }
            return arr;
        }

        function parseBGMItem(): BGMItem {
            byte.pos += 4;
            return {
                name: parseUTF(),
                bgmPath: parsePath(),
                picPath: parsePath(),
                msg: parseUTF()
            }
        }

        function parseSaveData(): SaveData {
            byte.pos += 4;
            return {
                showMapName: byte.getInt32() != 0,
                showDate: byte.getInt32() != 0,
                bgImg: parsePath(),
                max: byte.getInt32(),
                column: byte.getInt32(),
                spanRow: byte.getInt32(),
                spanCol: byte.getInt32(),
                showMinPic: byte.getInt32() != 0,
                nameX: byte.getInt32(),
                nameY: byte.getInt32(),
                dateX: byte.getInt32(),
                dateY: byte.getInt32(),
                picX: byte.getInt32(),
                picY: byte.getInt32(),
                zoom: byte.getInt32(),
                vpRect: parseVPRect(),
                backButton: parseIdxBtn(),
                closeButton: parseIdxBtn()
            }
        }

        function parseMsgBox(): MsgBox {
            byte.pos += 4;
            return {
                faceStyle: byte.getInt32(),
                choiceButtonIndex: byte.getInt32(),
                talk: parseTalkWin(),
                name: parseNameWin()
            }
        }

        function parseTalkWin(): TalkWin {
            byte.pos += 4;
            let tw: TalkWin = {
                backX: byte.getInt32(),
                backY: byte.getInt32(),
                bgImg: parsePath(),
                FaceBorderImage: parsePath(),
                FaceBorderX: byte.getInt32(),
                FaceBorderY: byte.getInt32()
            };
            tw.textX = byte.getInt32();
            byte.pos += 4;
            tw.textY = byte.getInt32();
            byte.pos += 4;
            tw.buttons = parseIdxBtnArr();
            return tw;
        }

        function parseNameWin(): NameWin {
            byte.pos += 4;
            return {
                backX: byte.getInt32(),
                backY: byte.getInt32(),
                bgImg: parsePath(),
                isCenter: byte.getInt32() != 0,
                textX: byte.getInt32(),
                textY: byte.getInt32(),
            }
        }

        function parseReplay(): Replay {
            byte.pos += 4;
            return {
                bgImg: parsePath(),
                closeButton: parseIdxBtn(),
                vpRect: parseVPRect()
            }
        }

        function parseSetting(): Setting {
            byte.pos += 4;
            return {
                bgImg: parsePath(),
                barNone: parsePath(),
                barMove: parsePath(),
                BgmX: byte.getInt32(),
                BgmY: byte.getInt32(),
                SeX: byte.getInt32(),
                SeY: byte.getInt32(),
                VoiceX: byte.getInt32(),
                VoiceY: byte.getInt32(),
                ShowFull: byte.getInt32() != 0,
                ShowAuto: byte.getInt32() != 0,
                ShowBGM: byte.getInt32() != 0,
                ShowSE: byte.getInt32() != 0,
                ShowVoice: byte.getInt32() != 0,
                ShowTitle: byte.getInt32() != 0,
                closeButton: parseIdxBtn(),
                fullButton: parseIdxBtn(),
                winButton: parseIdxBtn(),
                AutoOn: parseIdxBtn(),
                AutoOff: parseIdxBtn(),
                TitleButton: parseIdxBtn()
            }
        }

        function parseCusUIArr(): CusUI[] {
            let arr: CusUI[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseCusUI());
            }
            return arr;
        }

        function parseCusUI(): CusUI {
            byte.pos += 4;
            return {
                loadEvent: parseCmdArr(),
                afterEvent: parseCmdArr(),
                controls: parseCusUIItemArr(),
                showEffect: byte.getInt32(),
                isMouseExit: byte.getInt32() != 0,
                isKeyExit: byte.getInt32() != 0
            }
        }

        function parseCusUIItemArr(): CusUIItem[] {
            let arr: CusUIItem[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseCusUIItem());
            }
            return arr;
        }

        function parseCusUIItem(): CusUIItem {
            byte.pos += 4;
            return {
                cmdArr: parseCmdArr(),
                type: byte.getInt32(),
                useStr: byte.getInt32() != 0,
                image1: parseUTF(),
                image2: parseUTF(),
                strIdx: byte.getInt32(),
                useVar: byte.getInt32() != 0,
                x: byte.getInt32(),
                y: byte.getInt32(),
                useIdx: byte.getInt32() != 0,
                index: byte.getInt32(),
                maxIdx: byte.getInt32(),
                color: new Color(parseUTF())
            }
        }

        function parseFLayerArr(): DFLayer[] {
            let arr: DFLayer[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseFLayer());
            }
            return arr;
        }

        function parseFLayer(): DFLayer {
            return {
                cmdArr: parseCmdArr(),
                x: byte.getInt32(),
                y: byte.getInt32(),
                name: parseUTF(),
                itemArr: parseFLayerItemArr()
            }
        }

        function parseFLayerItemArr(): DFLayerItem[] {
            let arr: DFLayerItem[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseFLayerItem());
            }
            return arr;
        }

        function parseFLayerItem(): DFLayerItem {
            return {
                type: byte.getInt32(),
                x: byte.getInt32(),
                y: byte.getInt32(),
                image: parseUTF(),
                useStr: byte.getInt32() != 0,
                idxOfStr: byte.getInt32(),
                strIdx: byte.getInt32(),
                varIdx: byte.getInt32(),
                color: new Color(parseUTF())
            }
        }

        function parseChapterArr(): DChapter[] {
            let arr: DChapter[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseDchapter());
            }
            return arr;
        }

        function parseDchapter(): DChapter {
            byte.pos += 4;
            return {
                name: parseUTF(),
                id: byte.getInt32(),
                cmdArr: parseCmdArr()
            }
        }

        function parseCmdArr(): Cmd[] {
            let arr: Cmd[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseCmd());
            }
            return arr;
        }

        function parseCmd(): Cmd {
            byte.pos += 4;
            let c = byte.getInt32();
            byte.pos += 4;
            let p = parsePara();
            return {code: c, para: p};//{code: byte.getInt32(), idt: byte.getInt32(), para: parsePara()};
        }

        function parsePara(): string[] {
            let arr: string[] = [];
            let len = byte.getInt32();
            for (let i = 0; i < len; i++) {
                arr.push(parseUTF());
            }
            return arr;
        }

        /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Parse function end~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
    }
}
