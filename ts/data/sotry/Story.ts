import Conf from "../Conf";
import DH from "../DH";

import Color = laya.utils.Color
/**
 * Created by ShanFeng on 4/10/2017.
 */

interface Header {
    ver?: number
    gWidth?: number
    gHeight?: number
    mPWid?: number
    mPHei?: number
    gUid?: string
    title?: string
    gVer?: number
    crc32?: number
}

export interface Path {
    from: number
    path: string
}

export interface IdxBtn {
    idx: number
    x: number
    y: number
}

export interface ImgBtn {
    name: string
    image1: Path
    image2: Path
    x: number
    y: number
}

export interface Music {
    path: Path
    vol: number
}

export interface Title {
    showLog: boolean
    logoImage: Path
    titleImage: Path
    drawTitle: boolean
    bgm: Music
    buttons: IdxBtn[]
}

export interface GameMenu {
    bgImg: Path
    buttons: IdxBtn[]
}

export interface CGItem {
    name: string
    path: Path
    msg: string
}

export interface VPRect {
    x: number
    y: number
    w: number
    h: number
}

export interface CG {
    bgImg: Path
    column: number
    spanRow: number
    spanCol: number
    showMsg: Boolean
    msgX: number
    msgY: number
    zoom: number
    cgx: number
    cgy: number
    noPic: Path
    CGList: CGItem[]
    vpRect: VPRect
    backButton: IdxBtn
    closeButton: IdxBtn
}

export interface BGMItem {
    name: string
    bgmPath: Path
    picPath: Path
    msg: string
}

export interface BGM {
    bgImg: Path
    column: number
    spanRow: number
    spanCol: number
    showPic: boolean
    showMsg: boolean
    px: number
    py: number
    mx: number
    my: number
    nx: number
    ny: number
    noName: string
    noPic: Path
    bgmList: BGMItem[]
    vpRect: VPRect
    selectButton: IdxBtn
    closeButton: IdxBtn
}

export interface SaveData {
    showMapName: boolean
    showDate: boolean
    bgImg: Path
    max: number
    column: number
    spanRow: number
    spanCol: number
    showMinPic: boolean
    nameX: number
    nameY: number
    dateX: number
    dateY: number
    picX: number
    picY: number
    zoom: number
    vpRect: VPRect
    backButton: IdxBtn
    closeButton: IdxBtn
}

export interface MsgBox {
    faceStyle: number
    choiceButtonIndex: number
    talk: TalkWin
    name: NameWin
}

export interface TalkWin {
    backX?: number
    backY?: number
    bgImg?: Path
    FaceBorderImage?: Path
    FaceBorderX?: number
    FaceBorderY?: number
    textX?: number
    textY?: number
    buttons?: IdxBtn[]
}

export interface NameWin {
    backX: number
    backY: number
    bgImg: Path
    isCenter: boolean
    textX: number
    textY: number
}

export interface Replay {
    bgImg: Path
    closeButton: IdxBtn
    vpRect: VPRect
}

export interface Setting {
    bgImg: Path
    barNone: Path
    barMove: Path
    BgmX: number
    BgmY: number
    SeX: number
    SeY: number
    VoiceX: number
    VoiceY: number
    ShowFull: boolean
    ShowAuto: boolean
    ShowBGM: boolean
    ShowSE: boolean
    ShowVoice: boolean
    ShowTitle: boolean
    closeButton: IdxBtn
    fullButton: IdxBtn
    winButton: IdxBtn
    AutoOn: IdxBtn
    AutoOff: IdxBtn
    TitleButton: IdxBtn
}

export interface CusUI {
    loadEvent: Cmd[]
    afterEvent: Cmd[]
    controls: CusUIItem[]
    showEffect: number
    isMouseExit: boolean
    isKeyExit: boolean
}

export interface CusUIItem {
    cmdArr: Array<Cmd>
    type: number
    useStr: boolean
    image1: string
    image2: string
    strIdx: number
    useVar: boolean
    x: number
    y: number
    useIdx: boolean
    index: number
    maxIdx: number
    color: Color
}

export interface DFLayer {
    cmdArr: Cmd[]
    x: number
    y: number
    name: string
    itemArr: DFLayerItem[]
}

export interface DFLayerItem {
    type: number
    x: number
    y: number
    image: string
    useStr: boolean
    idxOfStr: number
    strIdx: number
    varIdx: number
    color: Color
}

export interface Cmd {
    code: number
    idt: number
    para: string[]
    links?: number[]
}

export class DChapter {
    name: string;
    id: number;
    cmdArr: Cmd[];

    constructor({name, id, cmdArr}) {
        this.name = name;
        this.id = id;
        this.cmdArr = cmdArr;
    }
}

export default class Story {
    name: string;
    id: number;
    header: Header = {};
    sys: any = {};
    fLayerArr: DFLayer[];
    dChapterArr: DChapter[];

    gotoChapter(id: number) {
        if (Conf.info.single) {
            for (let c of this.dChapterArr) {
                if (c.id == id) {
                    DH.instance.eventPoxy.event(Conf.PLAY_CHAPTER, {
                        name: c.name,
                        id: c.id,
                        cmdArr: c.cmdArr
                    });
                }
            }
        } else {
            DH.instance.binLoader.loadChapter(id);
        }
    }
};