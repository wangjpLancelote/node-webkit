/**
 * seckill 秒杀系统
 */

 const Router = require('koa-router');
 const router = new Router();
 const redis = require('redis');

 const Kafka = require('kafka-node');

 const Producer = Kafka.Producer;
 const kafkaClient = new Kafka.Client();
 const producer = new Producer(kafkaClient);

 let count = 0;

 router.post('/seckill', async (ctx) => {
    console.log(`count ${count++}`);
    let client;

    let fn = function (optionalClient) {
        if (!optionalClient) {
            client = redis.createClient();
        } else {
            client = optionalClient;
        }

        client.on('error', (error) => {
            console.trace('hi error');
            console.error(error.stack);
            client.end(true);
        });

        client.watch('counter');
        client.get('counter', (err, reply) => {
            if (Number(reply) > 0) {
                let multi = client.multi();
                multi.decr('counter');
                multi.exec(function (err, replies) {
                    console.log('replies', replies);
                    if (replies === null) {
                        console.log('confict ====>>>');
                        fn(client);
                    } else {
                        let payLoad = [
                            {
                                topic: 'CAR_NUMBER',
                                message: 'buy 1 car',
                                partition: 0
                            }
                        ];
                        producer.send(payLoad, (err, data) => {
                            console.log(data);
                        });
                        ctx.body = replies;
                        client.end(true);
                    }
                })
            } else {
                console.log('sold out');
                ctx.body = 'sold out';
                client.end(true);
            }
        })
    };

    fn();
 })

 module.exports = router;