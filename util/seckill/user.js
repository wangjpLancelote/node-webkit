/**
 * user 系统
 */

 const Router = require('koa-router');
 const router = new Router();

 router.get('/', async (ctx) => {
    ctx.body = 'respond with resource';
 });

 module.exports.router;