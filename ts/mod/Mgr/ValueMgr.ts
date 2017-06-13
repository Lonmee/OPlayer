import {IMgr} from "./Mgr";
import {Cmd} from "../../data/sotry/Story";
import Dictionary = laya.utils.Dictionary;
import {DigitalDic, StringDic} from "./value/ODictionary";
/**
 * Created by ShanFeng on 5/8/2017.
 * 尊重用户主逻辑，各数值从1开始
 */
export default class ValueMgr implements IMgr {
    vDic = new DigitalDic();
    sDic = new StringDic();
    exVDic = new DigitalDic();

    constructor() {
    }

    exe(cmd: Cmd) {
        switch (cmd.code) {
            // case 105://"数值输入"//ignore
            // 0：数值索引
            // 1:数值名称
            // 2:显示信息
            //     break;
            case 207://"数值操作"
            //0：数值索引
            // 1:操作符id(=,+=,-=,*=,/=,%=)
            // 2:操作数为常量(0)、其他数值(1)、随机数(2)、二周目变量(3)、索引变量(4)、服务器时间变量(5)、任务(9)、本地时间变量(10)
            // 3:值
            // 4:显示信息
            // 5:数值(0)或索引(1)
            case 213://"二周目变量"
                //0：同207数值操作
                let v1 = cmd.para[5] == "0" ? this.vDic.get(cmd.para[0]) : this.digByType("4", cmd.para[0]);
                let v2 = this.digByType(cmd.para[2], cmd.para[3]);
                if (cmd.code == 207)
                    this.vDic.set(cmd.para[5] == "0" ? cmd.para[0] : this.vDic.get(cmd.para[0]) - 1, this.calc(v1, v2, cmd.para[1]))
                else
                    this.exVDic.set(cmd.para[5] == "0" ? cmd.para[0] : this.vDic.get(cmd.para[0]) - 1, this.calc(v1, v2, cmd.para[1]))
                break;
            case 215://"字符串"
                //0: 字符串索引  1:字符串内容
                this.sDic.set(cmd.para[0], cmd.para[1]);
                break;
            case 216://"高级数值操作"
                // 0：数值索引（二周目为: EX|数值索引）
                // 1：操作符id(=,+=,-=,*=,/=,%=)(0,1,2,3,4,5)
                // 2：操作数为常量(0)、其他数值(1)、随机数(2)、二周目变量(3)、索引变量(4)、服务器时间变量(5)、 鲜花数(6)、最大值(7)、最小值(8)、任务(9)、本地时间变量(10)
                // 3：值或最大、小值 [n|固定数,v(数值)|1(索引位置),x(二周目数值)|1,s|索引数值]
                // 4：显示信息
                // 5：数值(0)或索引(1)
                // 【6：操作index(+,-,*,/,%)(0,1,2,3,4) （若为-1后面忽略  7同2   8同3】
                v1 = cmd.para[0].split("!").length == 1 ? this.vDic.get(cmd.para[5] == "0" ? cmd.para[0] : this.digByType("4", cmd.para[0])) :
                    this.exVDic.get(cmd.para[5] == "0" ? cmd.para[0] : this.digByType("4", cmd.para[0]));
                v2 = this.digByType(cmd.para[2], cmd.para[3]);
                break;
        }
    }

    parsePara(p: string, idx: number) {
        return p.split("|")[idx];
    }

    /**
     * @param p1 操作数为常量(0)、其他数值(1)、随机数(2)、二周目变量(3)、索引变量(4)、服务器时间变量(5)、任务(9)、本地时间变量(10)
     * @param p2
     * @returns {any}
     */
    digByType(type: string, p2: string) {
        switch (parseInt(type)) {
            case 0:
                return parseInt(p2);
            case 1:
                return this.vDic.get(p2);
            case 2:
                return Math.random();
            case 3:
                return this.exVDic.get(p2);
            case 4:
                return this.vDic.get(this.vDic.get(p2) - 1);
            case 5:
                return;
            case 6:
                return;
            case 7:
            case 8:
            case 9:
            case 10:
        }
    }

    digByTag(p: string) {
        switch (this.parsePara(p, 0)) {
            case "EX" :
                return this.exVDic.get(this.parsePara(p, 1));
            case "MO" :
                //移入view模块处理
                return "MO";
            case "FL" :
            case "PT" :
            case "PA" :
                return this.exVDic.get(p);
            default:
                return this.vDic.get(p);
        }
    }

    /**
     * @param v1
     * @param v2
     * @param op 操作符id(=,+=,-=,*=,/=,%=)
     * @returns {number}
     */
    calc(v1: number, v2: number, op: string) {
        switch (parseInt(op)) {
            case 0:
                return v1 = v2;
            case 1:
                return v1 += v2;
            case 2:
                return v1 -= v2;
            case 3:
                return v1 *= v2;
            case 4:
                return v1 /= v2;
            case 5:
                return v1 %= v2;
        }
    }

    compare(v1: number, v2: number, op: string) {
        //EX/MO/FL/PT/PA
        // 【若为鼠标按下】 1：矩形类型 2：矩形大小(x,y,w,h)或图片编号 3：0是经过1是按下 4：有无else(1,0)】
        // 【若为平台】0:PT| 1:0 2:0 3:平台[1pc,2web,3Android,4IOS,5H5],4:有无else(1,0) 5:显示信息
        // 		 	【若为支付】0:PA| 加上 二周目变量 1:是否为恢复购买 2:商品名称（ID） 3:无 4:有无else留位 5:说明
        // 			【若为任务】长度+1  0:0 1:6(关系index不在指定范围) 2:0  3:0  4:有无else(1,0)  5:显示信息 6:TA|任务编号
        switch (parseInt(op)) {
            case 0:
                return v1 == v2;
            case 1:
                return v1 >= v2;
            case 2:
                return v1 <= v2;
            case 3:
                return v1 > v2;
            case 4:
                return v1 < v2;
            case 5:
                return v1 != v2;
        }
    }

};