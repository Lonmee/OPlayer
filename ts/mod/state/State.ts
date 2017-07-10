/**
 * Created by ShanFeng on 5/9/2017.
 */
import DH from "../../data/DH";
import Conf from "../../data/Conf";
import {ViewMgr} from "../Mgr/ViewMgr";
import Browser = laya.utils.Browser;
import {IMgr} from "../Mgr/Mgr";
export enum StateEnum {Normal, Auto, FF}

export interface IState {
    id: StateEnum
    pause();
    wait(dur: number);
    stopTimming();
    resumeTimming();
    update(...mgrs: IMgr[]): void;
}

class State implements IState {
    id: StateEnum;
    protected left: number = 0;
    protected uc: number = 0;//update counter
    /**动画刷新倍率，用以降低刷新率**/
    protected us: number = Browser.onPC ? 1 : 2;//update speed
    protected timming: boolean = false;

    update(...mgrs: IMgr[]): void {
        if (this.timming) {
            if (this.left > 0)
                if (--this.left == 0)
                    this.resume();
            if (++this.uc % this.us == 0)
                for (let m of mgrs)
                    m.update(this.uc = this.us);
        }
    }

    pause() {
    }

    wait(dur) {
        this.timming = true;
        this.left = dur;
    }

    stopTimming() {
        this.timming = false;
    }

    resumeTimming() {
        this.timming = true;
    }

    resume() {
        this.timming = false;
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
        if (this.timming)
            return;
        for (let m of mgrs)
            m.update(0);
    }

    pause() {
        this.wait(0);
    }

    wait(dur = 0) {
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME,);
    }
}

/*
 //状态指令
 case 210://等待
 case 103://"自动播放剧情"
 case 104://"快进剧情"*/
