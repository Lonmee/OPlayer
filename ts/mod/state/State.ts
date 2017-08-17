/**
 * Created by ShanFeng on 5/9/2017.
 */
import DH from "../../data/DH";
import Conf from "../../data/Conf";
import {IMgr} from "../Mgr/Mgr";
import {MgrEnum} from "../CmdLine";
import Browser = laya.utils.Browser;

export enum StateEnum {Play, Auto, FF, Pause, Frozen, FrozenAll}

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
            if (--this.left == 0)
                DH.instance.eventPoxy.event(Conf.ITEM_CHOSEN);
        if (++this.uc % this.us == 0)
            for (let m of mgrs)
                m.update(this.uc = this.us);
    }

    wait(dur) {
        this.left = dur;
    }

    resume() {
        DH.instance.eventPoxy.event(Conf.CMD_LINE_RESUME);
    }
}

export class PlayState extends State {
    id = StateEnum.Play;

    wait(dur) {
    }
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

    wait(dur) {
    }
}

export class Frozen extends State {
    id = StateEnum.Frozen;

    update(...mgrs): void {
    }
}

export class FrozenAll extends State {
    id = StateEnum.FrozenAll;

    update(...mgrs): void {
        if (this.left > 0)
            if (--this.left == 0)
                DH.instance.eventPoxy.event(Conf.STATE_FROZEN);
    }

    resume(): any {
    }
}

export class StateMgr {
    private forcePause: boolean = true;
    private dh: DH = DH.instance;
    private append: any[] = [];
    private states: IState[] = [new PlayState(), new AutoState(), new FFState(), new PauseState(), new Frozen(), new FrozenAll()];
    private curState: IState;

    constructor() {
        this.dh.eventPoxy.on(Conf.STATE_AUTO, this, this.auto);
        this.dh.eventPoxy.on(Conf.STATE_FF, this, this.fast);
        this.dh.eventPoxy.on(Conf.STATE_CANCEL, this, this.cancel);
        this.dh.eventPoxy.on(Conf.STAGE_BLUR, this, this.cancel);
        this.dh.eventPoxy.on(Conf.ITEM_CHOSEN, this, this.play);
        this.dh.eventPoxy.on(Conf.STATE_FROZEN, this, this.frozen);
        Laya.timer.frameLoop(1, this, this.tick);
        this.curState = this.states[StateEnum.Pause];
    }

    private tick() {
        this.dh.reporter.logFrame();//test only
        this.dh.cmdLine.mgrArr[MgrEnum.audio].update(1);
        this.curState.update(this.dh.cmdLine.mgrArr[MgrEnum.view]);
        this.curState.resume();
    }

    get id() {
        return this.curState.id;
    }

    mark(snap) {
        if (snap)
            this.append.push(snap.concat(this.curState.id == StateEnum.FF ? StateEnum.Play : this.curState.id));
        else if (this.append.length)
            this.append = [];
    }

    restore(): boolean {
        let snap = this.append.pop();
        if (snap) {
            this.curState = this.states[snap.pop()];
            this.dh.reporter.logState(this.curState.id);//test only
            this.dh.eventPoxy.event(Conf.RESTORE, [snap]);
            return true;
        }
        else
            return false;
    }

    switchState(idx: StateEnum) {
        if (this.curState.id != idx) {
            this.curState = this.states[idx];
            this.dh.reporter.logState(idx);//test only
        }
    }

    play(v: boolean | number = null) {
        if (v != null) {
            this.forcePause = false;
            this.switchState(StateEnum.Play);
        } else if (!this.forcePause && this.curState.id != StateEnum.FF)
            this.switchState(StateEnum.Play);
    }

    auto() {
        this.switchState(StateEnum.Auto);
    }

    fast() {
        if (!this.forcePause) {
            if (this.curState.id == StateEnum.Pause)
                this.curState.wait(0);
            this.switchState(StateEnum.FF);
        }
    }

    pause(dur: number = 0, force: boolean = false) {
        if (force) {
            this.forcePause = force;
            this.switchState(StateEnum.Pause);
            if (dur > 0)
                this.curState.wait(dur);
        } else if (this.curState.id != StateEnum.FF) {
            this.switchState(this.curState.id == StateEnum.Frozen ? StateEnum.FrozenAll : StateEnum.Pause);
            if (dur > 0)
                this.curState.wait(dur);
        }
    }

    frozen() {
        this.switchState(StateEnum.Frozen);
    }

    frozenAll() {
        this.switchState(StateEnum.FrozenAll);
    }

    cancel() {
        if (this.curState.id == StateEnum.FF)
            this.switchState(StateEnum.Play);
    }
}