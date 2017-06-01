/**
 * Created by ShanFeng on 5/9/2017.
 */
export enum StateEnum {Normal, Auto, FF}

export interface IState {
    pause();
    wait();
}

export class NormalState implements IState {

    pause() {
    }

    wait() {
    }
}

export class AutoState implements IState {

    pause() {
    }

    wait() {
    }
}

export class FFState implements IState {

    pause() {
    }

    wait() {
    }
}

/*
 //状态指令
 case 210://等待
 case 103://"自动播放剧情"
 case 104://"快进剧情"*/
