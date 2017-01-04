/*系统统计报表b*/
module.exports = {
    path: '/xtgnsz/yhdljlb(/)',
    breadcrumbName:'用户登录记录表',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
            
        })
    }
}