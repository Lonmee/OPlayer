/**
 * Created by ShanFeng on 5/9/2017.
 */
import DH from "../../data/DH";
import Conf from "../../data/Conf";
export enum StateEnum {Normal, Auto, FF}

export interface IState {
    id: StateEnum
    pause();
    /**
     *
     * @param dur frame(s)
     */
    wait(dur: number);
}

class State implements IState {
    id: StateEnum;

    pause() {
    }

    wait(dur) {
        Laya.timer.frameOnce(dur, null, () => {
            DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
        });
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
