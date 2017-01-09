/*文章发布*/
module.exports = {
    path: '/wzgl/wzfb(/)',
    breadcrumbName:'文章发布',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}