/*用户管理功能*/
module.exports = {
    path: '/xtgnsz/yhgl',
    breadcrumbName:'用户管理',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}