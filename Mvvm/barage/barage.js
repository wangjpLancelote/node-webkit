const data = [
    {value: '11111111', time: 5, color:'red', speed:1, fontSize: 22},
    {value: '22222222', time: 10, color: '#00a1f5', speed: 2, fontSize: 30},
    {value: '333333', time: 15}
]

const doc = document;
const canvas = doc.getElementById("canvas");
const video = doc.getElementById("video");
const text = doc.getElementById("text");
const btn = doc.getElementById("btn");
const color = doc.getElementById("color");
const range = doc.getElementById("range");

// value：代表弹幕的内容 (必填)
// time：代表弹幕展现的时间 (必填)
// color：代表弹幕文字的颜色
// speed：代表弹幕飘过的速度
// fontSize：代表弹幕文字的大小
// opacity：代表弹幕文字的透明度

class CanvasBarage {
    constructor (canvas, video, opts = {}) {
        if (!canvas || !video) return;

        this.canvas = canvas;
        this.video = video;
        this.canvas.width = video.width;
        this.canvas.height = video.height;
        this.ctx = canvas.getContent('2d');

        let defOpts = {
            color: '#e91e63',
            speed: 1.5,
            opacit: 0.5,
            fontSize: 20,
            data: []
        }

        Object.assign(this, defOpts, opts);

        //暂停
        this.isPaused = true;
        //所有的消息
        this.barages = this.data.map(item => new Barage(item, this));

        //渲染
        this.render();
    }

    render () {
        this.clear();  //清除原来的画布
        this.renderBarage();  //渲染弹幕数据
        if (!this.isPaused) {
            requestAnimationFrame(his.render.bind(this));  //递归调用 ==>setInterVal
        }
    }

    clear () {

    }
    renderBarage () {
        let time = this.video.currentTime;
        this.barages.forEach(barage => {
            if (!barage.flag && time >= barage.time) {
                if (!barage.isInit) {
                    barage.init();
                    barage.isInit = true;
                }
                barage.x -= barage.speed;
                barage.render();  //实例渲染

                if (barage.x < - barage.width) {
                    barage.flag = true;  //下次不渲染
                }
            }
        })
    }
}


//弹幕实现的类
class Barage {
    constructor (obj, ctx ) {
        this.value = obj.value;
        this.time = obj.time;
        this.obj = obj;
        this.context = ctx;
    }

    init () {
        this.color = this.obj.color || this.context.color;
        this.speed = this.obj.speed || this.context.speed;
        this.opacity = this.obj.opacity || this.context.opacity;
        this.fontSize = this.obj.fontSize || this.context.fontSize;

        //创建一个元素，承载弹幕的数据 p标签
        let p = document.createElement('p');
        p.style.fontSize = this.fontSize + 'px';
        p.innerHTML = this.value;
        document.body.appendChild(p);

        //弹幕宽度
        this.width = p.clientWidth;
        document.body.removeChild(p);

        //弹幕出现的位置
        this.x = this.context.canvas.width;
        this.y = this.context.canvas.height;

        if (this.y < this.fontSize) {
            this.y = this.fontSize;
        } else if (this.y < this.context.canvas.height - this.fontSize) {
            this.y = this.context.canvas.height - this.fontSize;
        }
    }

    render () {
        this.context.ctx.fontSize = `${this.fontSize}px Arial`;
        this.context.ctx.fillStyle = this.color;
        this.context.ctx.fillText(this.value, this.x, this.y);
    }
}

let canvasBarage = new CanvasBarage(canvas, video, data);