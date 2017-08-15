import {Cmd} from "../../data/sotry/Story";
import {IMgr} from "./Mgr";
import SoundManager = laya.media.SoundManager;
import SoundChannel = laya.media.SoundChannel;

/**
 * Created by ShanFeng on 5/8/2017.
 */
enum ChannelEnum {bg, fx, vo, bfx}

export default class AudioMgr implements IMgr {
    private channels: SoundChannel[] = [];

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 501://"播放背景音乐"
                this.play(ChannelEnum.bg, cmd.para[0], parseInt(cmd.para[1]));
                break;
            case 502://"播放音效"
                this.play(ChannelEnum.fx, cmd.para[0], parseInt(cmd.para[1]));
                break;
            case 503://"播放语音"
                this.play(ChannelEnum.vo, cmd.para[0], parseInt(cmd.para[1]));
                break;
            case 504://"播放背景音效"
                this.play(ChannelEnum.bfx, cmd.para[0], parseInt(cmd.para[1]));
                break;
            case 505://"淡出背景音乐"
                this.fadeOut(ChannelEnum.bg, parseInt(cmd.para[0]));
                break;
            case 508://"淡出音效"
                this.fadeOut(ChannelEnum.fx, parseInt(cmd.para[0]));
                break;
            case 506://"停止音效"
                this.stop(ChannelEnum.fx);
                break
            case 507://"停止语音"
                this.stop(ChannelEnum.vo);
        }
    }

    update(speed: number) {

    }

    fadeOut(c: ChannelEnum, t: number) {

    }

    play(c: ChannelEnum, url: string, v: number) {
        switch (c) {
            case ChannelEnum.bg:
                this.channels[c] = SoundManager.playSound(url);
                break;
            case ChannelEnum.fx:
                this.channels[c] = SoundManager.playSound(url);
                break;
            case ChannelEnum.vo:
                this.channels[c] = SoundManager.playSound(url);
                break;
            case ChannelEnum.bfx:
                this.channels[c] = SoundManager.playSound(url);
        }

    }

    stop(c: ChannelEnum) {
        this.channels[c].stop();
    }

    pause() {

    }

    resume() {

    }
};
/*
 501	播放背景音乐		 0：背景音乐的相对路径  1:音量 2:显示信息 3 网盘还是本地
 502	播放音效			 0：音效的相对路径      1:音量 2:显示信息 3 网盘还是本地
 503	播放语音			 0：语音的相对路径		1:音量 2:显示信息 3 网盘还是本地
 504	播放背景音效		 0：背景音效的相对路径  1:音量 2:显示信息 3 网盘还是本地
 505	淡出背景音乐		 0：时间
 506	停止音效			 0：空
 507	停止语音			 0：空
 508	淡出音效			 0：时间*/
