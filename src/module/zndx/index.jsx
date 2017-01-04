/*站内短信发送*/
module.exports = {
    path: '/zndx(/)',
    breadcrumbName:'站内短信',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
}