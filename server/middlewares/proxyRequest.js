/**
 * Created by kid on 2017/5/17.
 */
const request = require('request');
const defaultOptions = {
 target: ''
};
// const redis = require('../modules/Redis');
const config = require('../configs');
// const uuidV1 = require('uuid/v1');

module.exports = (context, options = defaultOptions) => async (ctx, next) => {
 const re = new RegExp('^\\' + context + '(\\/|\\/\\w+)?');
 const pass = re.test(ctx.req.url);

 if (!pass) return next();

 const url = ctx.req.url.replace(context, options.target);

 let opts = {
  method: ctx.req.method,
  url,
  json: true,
  headers: {
   'Content-Type': 'application/json; charset=utf-8',
  //  'App-Key': config.appKey,
  //  'uid': ctx.session.user ? ctx.session.user.userId : ''
  }
 };

 if (ctx.req.method === 'POST') {
  Object.assign(opts, {
   body: Object.assign(ctx.request.body, {
    // gid: uuidV1()
    gid: new Date().getTime()
   })
  })
 }

 ctx.body = await getData(ctx, opts);
};

function getData(ctx, opts) {
 return new Promise((resolve, reject) => {
  request(opts, (e, r, body) => {
   if (!e && body) {
    if (body.code === 0) {
     switch (ctx.req.url) {
      case '/api/ams/login':
       if (redis.status !== 'ready') {
        resolve({
         code: -1,
         resultMsg: 'redis未连接'
        });
       } else {
        ctx.session.user = body.user;
        resolve(body);
       }
       break;
      default:
       resolve(body);
     }
    } else {
     resolve(body);
    }
   } else {
    reject(e);
   }
  })
 });
}