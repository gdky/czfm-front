/*权限管理功能*/
module.exports = {
    path: '/xtgnsz/qxgl',
    breadcrumbName:'权限管理',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}