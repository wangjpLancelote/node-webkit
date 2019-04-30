const CNodeJS = require('../cNodeJs');
const client = new CNodeJS();

// client.request('GET', 'topics', {page: 1}, (err, res) => {
//     if (err) {
//         console.error(err);
//     } else {
//         console.log('res', res);
//     }
// })
// client.request('GET', 'topics', {page: 1}).then((res) => {
//     console.log("rs", res);
// }).catch((err) => {
//     console.log('err', err);
// })