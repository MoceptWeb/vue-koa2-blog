//在index.js里面直接配置也可以
// module.exports = {
//    admin: {
//        user: 'admin',
//        password: 'admin'
//    },
//    jwt: {
//        secret: 'secret',
//        exprisesIn: '2h'
//    },
//    mongodb: {
//        host: '127.0.0.1',
//        database: 'blog',
//        port: 27017,
//        user: '',
//        password: ''
//    },
//    app: {
//        port: process.env.PORT || 8000,
//        baseApi: '/api'
//    }
// };
module.exports = {
  admin: {
      username: 'admin',           
      password: 'admin',
      name: 'sinner77'            
  },
  jwt: {
      secret: 'secret',            
      exprisesIn: '3600s'          //以秒为单位
  },
  mongodb: {
      host: '127.0.0.1',
      database: 'vue-koa2-blog',
      port: 27017,
      user: '',                    //非必填
      password: ''                 //非必填
  },
  app: {
      port: process.env.PORT || 3000,
      routerBaseApi: '/api'
  },
  api: {
    proxyApi: '/api',
    url: 'http://localhost:9090'
  }
};