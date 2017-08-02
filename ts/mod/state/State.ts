/**
 * Created by ShanFeng on 5/9/2017.
 */
import DH from "../../data/DH";
import Conf from "../../data/Conf";
import {IMgr} from "../Mgr/Mgr";
import {MgrEnum} from "../CmdLine";
import Browser = laya.utils.Browser;

export enum StateEnum {Play, Auto, FF, Pause, Frozen}

export interface IState {
    id: StateEnum

    wait(dur: number);

    update(...mgrs: IMgr[]): void;

    resume();
}

class State implements IState {
    id: StateEnum;
    protected left: number = 0;
    protected uc: number = 0;//update counter
    /**动画刷新倍率，用以降低刷新率**/
    protected us: number = Browser.onPC ? 1 : 2;//update speed

    update(...mgrs: IMgr[]): void {
        if (this.left > 0)
            this.left--;
        if (++this.uc % this.us == 0)
            for (let m of mgrs)
                m.update(this.uc = this.us);
    }

    wait(dur) {
        this.left = dur;
    }

    resume() {
        if (!this.left)
            DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
    }
}

export class PlayState extends State {
    id = StateEnum.Play;
}

export class PauseState extends State {
    id = StateEnum.Pause;

    resume() {
    }
}

export class AutoState extends State {
    id = StateEnum.Auto;
    delay = 60;
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

    wait(dur = 0) {
        this.resume();
    }
}

export class FrozenState extends State {
    id = StateEnum.Frozen;

    update(...mgrs: IMgr[]): void {
    }

    wait(dur = 0) {
        this.resume();
    }

}

export class StateMgr {
    private dh: DH = DH.instance;
    private append: any[] = [];
    private states: IState[] = [new PlayState(), new AutoState(), new FFState(), new PauseState(), new FrozenState()];
    private curState: IState;

    constructor() {
        this.dh.eventPoxy.on(Conf.CHANGE_STATE, this, this.switchState);
        // this.dh.eventPoxy.on(Conf.STAGE_BLUR, this, this.reset);
        Laya.timer.frameLoop(1, this, this.tick);
        this.curState = this.states[StateEnum.Pause];
    }

    private tick() {
        this.dh.reporter.logFrame();//test only
        this.curState.resume();
        this.curState.update(this.dh.cmdLine.mgrArr[MgrEnum.view]);
    }

    reset() {
        this.switchState(StateEnum.Play);
    }

    mark(snap) {
        if (snap)
            this.append.push(snap.concat(this.curState.id));
        else
            this.append = [];
    }

    restore(): boolean {
        let snap = this.append.pop();
        if (snap) {
            this.switchState(snap.pop());
            this.dh.eventPoxy.event(Conf.RESTORE, [snap]);
            return true;
        }
        else
            return false;
    }

    freeze() {
        this.switchState(StateEnum.Frozen);
    }

    unfreeze() {
        this.switchState(StateEnum.Play);
    }

    switchState(idx: StateEnum) {
        if (this.curState.id != idx)
            this.curState = this.states[idx];
    }

    pause() {
        this.switchState(StateEnum.Pause)
    }

    wait(dur: number) {
        this.curState.wait(dur);
    }
}