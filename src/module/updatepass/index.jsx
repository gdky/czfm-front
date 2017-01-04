/*更改密码*/
module.exports = {
    path: '/updatepass(/)',
    breadcrumbName:'更改密码',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('./component'))
        })
    }
};