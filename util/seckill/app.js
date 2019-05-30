const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

const seckill = require('./seckill');

app.use(async (ctx, next) => {
    ctx.body = 'hello';

    await next();
})

router.get('/', async (ctx) => {
    ctx.body = '111';
})
router.get('/seckill', seckill.allowedMethods(), seckill.routes());

app.use(seckill.routes());
router.get('/user', async (ctx) => {
    ctx.body = 'respond a resouce';
})

// app.use(router.allowedMethods());
app.use(router.routes());
app.listen(3000);
console.log('has listen on port : %d', 3000);