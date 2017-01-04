/**
 * Created by ming on 2016/4/16.
 */
'use strict'

var selector = {
    SelectorDQ: require('./dq'), //地区
    SelectorCS: require('./cs'), //城市
    SelectorCSNum: require('./csVlaueNum'), //城市
    SelectorYear: require('./year'), //年度
    SelectorDF: require('./df'), //省份
    SelectorFG: require('./fg'), //法规代码
    SelectorFZYZXLB: require('./fzyzxlb'), //非执业注销类别
    SelectorHY: require('./hy'), // 行业门类
    SelectorJCLB: require('./jclb'), //检查类别
    SelectorJGXZ: require('./jgxz'), //机构性质
    SelectorSWSXZ: require('./swsxz'), //机构性质
    SelectorMZ: require('./mz'),//民族
    SelectorZW: require('./zw'),//职务
    SelectorZZMM: require('./zzmm'), //政治面貌
    SelectorNJJL: require('./njjl'), //年检结论
    SelectorRYZT: require('./ryzt'), //人员状态
    SelectorRYSPZT: require('./ryspzt'), //人员审批状态
    SelectorZYSWSZXYY: require('./zyswszxyy'), //执业税务师注销原因
    SelectorRYLB: require('./rylb'), //人员类别
    SelectorXL: require('./xl'), //学历
    SelectorXB: require('./xb'), //性别
    SelectorRYSF: require('./rysf'), //人员身份
    SelectorRSLB: require('./rslb'), //入所类别
    SelectorYWLX: require('./ywlx'), //业务类型
    SelectorSPLX: require('./splx'), //审批类型
    SelectorZTBJ: require('./ztbj'), //通过状态
    SelectorZTDM: require('./ztdm'), //年检状态
    SelectorISGZ: require('./isgz'), //是否改制
    SelectorTGZT: require('./tgzt'), //通过状态
    SelectorXZ: require('./xz'), //性质
    SelectorZT: require('./zt'), //状态
    SelectorIS: require('./is'), //是否
    SelectorRoles: require('./roles'), //角色
    SelectorISWS:require('./isws'), //业务报备是否省外
    SelectorSB:require('./sb'), //国税或地税
    SelectorYWZT:require('./ywzt'), //业务报备状态
    SelectorZSFS:require('./zsfs'), //业务报备征收方式
    SelectorJg:require('./jg'), //机构
    SelectorXm:require('./zyswsxm'),//执业税务师人员姓名选择
    SelectorLogRole:require('./log_roles'),//登陆用户角色选择
    SelectorQGSS:require('./qgss'), //全国省市
    SelectorMsgType:require('./msgType') //全国省市


};

module.exports = selector;