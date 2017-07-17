/**
 * Created by ShanFeng on 5/9/2017.
 */
import DH from "../../data/DH";
import Conf from "../../data/Conf";
import {IMgr} from "../Mgr/Mgr";
import Browser = laya.utils.Browser;
export enum StateEnum {Normal, Auto, FF, Temp, Sleep}

export interface IState {
    id: StateEnum
    pause();
    wait(dur: number);
    update(...mgrs: IMgr[]): void;
}

class State implements IState {
    id: StateEnum;
    protected left: number = 0;
    protected uc: number = 0;//update counter
    /**动画刷新倍率，用以降低刷新率**/
    protected us: number = Browser.onPC ? 1 : 2;//update speed

    update(...mgrs: IMgr[]): void {
        if (this.left > 0)
            if (--this.left == 0)
                this.resume();
        if (++this.uc % this.us == 0)
            for (let m of mgrs)
                m.update(this.uc = this.us);
    }

    pause() {
    }

    wait(dur) {
        this.left = dur;
    }

    resume() {
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
    }
}

export class NormalState extends State {
    id = StateEnum.Normal;
}

export class AutoState extends State {
    id = StateEnum.Auto;
    delay = 60;

    pause() {
        this.wait(this.delay);
    }
}

export class FFState extends State {
    id = StateEnum.FF;

    update(...mgrs: IMgr[]): void {
        if (this.left > 0) {
            this.left = 0;
            this.resume();
        }
        for (let m of mgrs)
            m.update(0);
    }

    pause() {
        this.wait(0);
    }

    wait(dur = 0) {
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
    }
}

export class TempState extends State {
    id = StateEnum.Temp;

    update(...mgrs: IMgr[]): void {

    }

    pause() {
        this.wait(0);
    }

    wait(dur = 0) {
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
    }
}

export class SleepState extends State {
    id = StateEnum.Sleep;

    pause() {
    }
}

/*
 //状态指令
 case 210://等待
 case 103://"自动播放剧情"
 case 104://"快进剧情"*/
