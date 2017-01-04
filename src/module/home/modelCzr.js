/**
 * Created by admin on 2016/9/23.
 */

const model = {
    columns: [{
        title: '姓名',
        dataIndex: 'xming',
        key: 'xming',
        width: 50
    }, {
        title: '性别',
        dataIndex: 'xb',
        key: 'xb',
        width: 20
    }, {
        title: '资格证编号',
        key: 'zyzgzsbh',
        dataIndex: 'zyzgzsbh',
        width:50
    }, {
        title: '执业注师编号',
        key: 'zyzsbh',
        dataIndex: 'zyzsbh',
        width: 50
    }, {
        title: '学历',
        key: 'xl',
        dataIndex: 'xl',
        width:50
    }, {
        title: '职位',
        key: 'zw',
        dataIndex: 'zw',
        width:50
    }]
};

module.exports = model;