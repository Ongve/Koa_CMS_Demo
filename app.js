const Koa = require('koa'),
  router = require('koa-router')(),
  path = require('path'),
  render = require('koa-art-template'),
  static = require('koa-static'),
  session = require('koa-session'),
  bodyParser = require('koa-bodyparser')

const app = new Koa()

// 配置POST提交数据的中间件
app.use(bodyParser())

app.keys = ['some secret hurr']

const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: false,
}
app.use(session(CONFIG, app))

render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
})
// 配置静态资源的中间件
app.use(static(__dirname + '/public'))

const index = require('./routes/index')
const api = require('./routes/api')
const admin = require('./routes/admin')

router.use('/api', api)
router.use('/admin', admin)
router.use(index)

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3001)