/*站内短信发送*/
module.exports = {
    path: '/yyscgl(/)',
    breadcrumbName:'语音上传管理',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}