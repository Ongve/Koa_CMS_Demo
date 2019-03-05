var router = require('koa-router')()

var login = require('./admin/login')
var user = require('./admin/user')

// 配置中间件，获取URL的地址
router.use(async (ctx, next) => {
    // console.log(ctx.request.header.host)
    // 模版引擎配置全局的变量
    ctx.state.__ROOT__ = 'http://' + ctx.request.header.host
    // console.log(ctx)
    if (ctx.session.userinfo) {
        await next()
    } else {
        if (ctx.url == '/admin/login' || ctx.url == '/admin/login/doLogin'){
            await next()
        }else{
            ctx.redirect('/admin/login')
        }
    }
})

router.get('/', async (ctx) => {
    ctx.render('admin/index')
})

router.use('/login', login)
router.use('/user', user)

module.exports = router.routes()