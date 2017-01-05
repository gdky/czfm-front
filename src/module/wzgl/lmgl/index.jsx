/*栏目管理*/
module.exports = {
    path: '/wzgl/lmgl(/)',
    breadcrumbName:'栏目管理',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}