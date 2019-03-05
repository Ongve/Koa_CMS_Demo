const router = require('koa-router')()
const tools = require('../../model/tools')
const db = require('../../model/db')

router.get('/', async (ctx) => {
    await ctx.render('admin/login')
})

router.post('/doLogin', async (ctx) => {
    console.log(ctx.request.body)
    // 首先得去数据库匹配
    let username = ctx.request.body.username
    let password = ctx.request.body.password
    // console.log(tools.md5(password))
    let result = await db.find('admin', {
        'username': username,
        'password': tools.md5(password)
    })
    if (result.length > 0) {
        // console.log('登录成功')
        console.log(result)
        ctx.session.userinfo = result[0]
        ctx.redirect(ctx.state.__ROOT__ + '/admin')
    } else {
        console.log('登录失败')
    }
})

module.exports = router.routes()