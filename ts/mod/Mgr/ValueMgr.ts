import {IMgr} from "./Mgr";
import {Cmd} from "../../data/sotry/Story";
import Dictionary = laya.utils.Dictionary;
/**
 * Created by ShanFeng on 5/8/2017.
 */
export default class ValueMgr implements IMgr {
    valueDic = new Dictionary();

    constructor() {
    }

    exe(cmd: Cmd) {
        switch (cmd.code) {
            case 105://"数值输入"
                this.valueDic.set(cmd.para[0], cmd.para[1]);
                break;
            //0：数值索引
            // 1:数值名称
            // 2:显示信息
            case 207://"数值操作"
                //0：数值索引
                // 1:操作符id(=,+=,-=,*=,/=,%=)
                // 2:操作数为常量(0)、其他数值(1)、随机数(2)、二周目变量(3)、索引变量(4)、服务器时间变量(5)、任务(9)、本地时间变量(10)
                // 3:值
                // 4:显示信息
                // 5:数值(0)或索引(1)
                break;
            case 213://"二周目变量"
                //0：同207数值操作
                break;
            case 215://"字符串"
                //0: 字符串索引  1:字符串内容
                break;
            case 216://"高级数值操作"
            //0：数值索引（二周目为: EX|数值索引）
            // 1：操作符id(=,+=,-=,*=,/=,%=)(0,1,2,3,4,5)
            // 2：操作数为常量(0)、其他数值(1)、随机数(2)、二周目变量(3)、索引变量(4)、服务器时间变量(5)、 鲜花数(6)、最大值(7)、最小值(8)、任务(9)、本地时间变量(10)
            // 3：值或最大、小值 [n|固定数,v(数值)|1(索引位置),x(二周目数值)|1,s|索引数值]
            // 4：显示信息
            // 5：数值(0)或索引(1) 【6：操作index(+,-,*,/,%)(0,1,2,3,4) （若为-1后面忽略  7同2   8同3】
        }
    }

}