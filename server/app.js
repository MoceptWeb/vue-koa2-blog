//koa
const Koa = require('koa');
const app = new Koa();
const static = require('koa-static')
const path = require('path')

//配置文件
const config = require('./configs');

// connect-history-api-fallback中间件，然后将所有的页面请求 转到index.html
const connectHistory = require('./middlewares/koa2-connect-history-api-fallback')

const koaConnectHistory = require('koa-connect-history-api-fallback');
//response中间件
const response = require('./middlewares/response.js');

//try/catch中间件
const errorHandle = require('./middlewares/errorHandle.js');

// 转发特定前缀的api给真正的后端
const proxy = require('./middlewares/proxyRequest')

//initAdmin中间件
const initAdmin = require('./middlewares/initAdmin.js');

//引入路由
const router = require('./routes');

//mongoose
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoUrl = `mongodb://${ config.mongodb.user }:${ config.mongodb.password }@${ config.mongodb.host }:${ config.mongodb.port }/${ config.mongodb.database }`; 
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('error', () => {
    console.log('数据库连接出错!');
});
db.once('open', () => {
    console.log('数据库连接成功！');
});
// app.use(koaConnectHistory({
//     verbose: true
// }))

// 静态资源目录对于相对入口文件index.js的路径
// const staticPath = './dist'

// app.use(static(
//   path.join( __dirname,  staticPath)
// ))


// const history = require('connect-history-api-fallback');
// app.use(history({
//     verbose: true,
//     // index: '/dist/index.html'
// }))

// app.use(history())

app.use(connectHistory({
    verbose: true
}))

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './dist'

app.use(static(
  path.join( __dirname,  staticPath)
))

//输出请求的方法，url,和所花费的时间
app.use(async (ctx, next) => {
    let start = new Date();
    await next();
    let ms = new Date() - start;
    console.log(`${ ctx.method } ${ ctx.url } - ${ ms } ms`);
});

//bodyParser中间件
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

//使用response中间件(放在最前面)
app.use(response);

//使用errorHandle中间件
app.use(errorHandle);


// app.use(proxy(config.api.proxyApi, {
//     target: config.api.url
// }))

//使用initAdmin中间件
app.use(initAdmin);

//使用路由中间件
app
    .use(router.routes())
    .use(router.allowedMethods());


//监听端口
app.listen(config.app.port, () => {
    console.log('The server is running at http://localhost:' + config.app.port);
});