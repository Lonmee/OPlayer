import {Cmd} from "../../../data/sotry/Story";
import {IMgr} from "./Mgr";
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class AudioMgr implements IMgr{
    exe(cmd: Cmd) {
        switch (cmd.code) {
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
/*
501	播放背景音乐		 0：背景音乐的相对路径  1:音量 2:显示信息 3 网盘还是本地
502	播放音效			 0：音效的相对路径      1:音量 2:显示信息 3 网盘还是本地
503	播放语音			 0：语音的相对路径		1:音量 2:显示信息 3 网盘还是本地
504	播放背景音效		 0：背景音效的相对路径  1:音量 2:显示信息 3 网盘还是本地
505	淡出背景音乐		 0：时间
506	停止音效			 0：空
507	停止语音			 0：空
508	淡出音效			 0：时间*/
