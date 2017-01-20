/*栏目管理*/
module.exports = {
    path: '/yyhc(/)',
    breadcrumbName:'语音合成',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}