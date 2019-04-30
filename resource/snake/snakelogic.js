class Snake {
    constructor (width, height, speed, foodSize) {
        /**
         * @param {Number} width
         * 游戏盒子的长度
         */
        this.width = width;
        /**
         * 游戏盒子的宽度
         * @param {Number} height
         */
        this.height = height;
        /**
         * 蛇的速度
         * @param {Number} speed
         */
        this.speed = speed;
        /**
         * 食物的大小 {长：xx, 宽：xx]}
         * @param {Object : {width:0, height:0}} foodSize
         */
        this.foodSize = foodSize;

        /**
         * food数量
         * @param {Array[]} foodConut
         */
        this.foodConut = [];

        this.bodySize;
        //得分
        this.score;
    }

    initGame () {
        return this;
    }

    controlHandler (keyCode) {

    }

    run (keyCode) {
        if (keyCode == 13) {  //启动蛇
            
        }
    }

    //食物的位置
    setRandom () {
        let size = 0;
        return size = {
            X : Math.floor(Math.random() * 540),
            Y : Math.floor(Math.random() * 340)
        };
    }

    //蛇的速度
    setSpeed (race) {
        if (!race) return this.speed = 0;
        if (race > this.width) return this.speed = 0;
        this.speed = race;
    }

}

// var _  = require("lodash") ;
new Vue ({
    
    el:'.box',
    data : {
        msg : "hello snake",
        left : 0,
        right : 0,
        up : 0,
        down : 0,
        stop : 0,
        start : 0,
        speed : 0,
        snakeLeft : 0,
        snakeRight : 0,
        snakeUp : 0,
        snakeDown : 0,
        cnt : 0,
        numberArr : []
    },
    created () {
        let _self = this;
        let snake = new Snake(550, 350, 10, {width : 5, height : 5});
        let init = snake.initGame();
        _self.speed = init.speed;
        console.log("init", init);
        _self.listenKey();

        //canvas
        // let canvas = document.getElementById('myCanvas');
        // let ctx = canvas.getContext("2d");
        // ctx.fillStyle = "#cccccc";
        // // ctx.fillRect(0, 0, 500, 300);

        // let position = 0;
        // setInterval(function () {
        //     ctx.clearRect(0, 0, 550, 350);
        //     ctx.fillRect(position, 0, 20, 20);
        //     position ++;
        //     if (position > 530) {
        //         position = 0;
        //     }
        // }, 30);
        // ctx.update();

        let ran = snake.setRandom();
        console.log("ran", ran);
        let food = document.getElementsByClassName("food")[0];
        let ground = document.getElementById("container");
        let snakeB = document.getElementsByClassName("snake")[0];
        
        snakeB.style.position = "relative";
        _self.snakeLeft = snakeB.style.left;
        _self.snakeUp = snakeB.style.top;
        
        ground.style.width = init.width + "px";
        ground.style.height = init.height + "px";
        food.style.position = "absolute";
        food.style.left = ran.X + 'px';
        food.style.top = ran.Y + 'px';
    },
    methods : {
        listenKey () {
            let _self = this;
                    //键盘监听
            document.onkeydown = function (e) {
                let key = window.event.keyCode;
                let keyMap = {
                    'enter' : 13,
                    'up' : 38,
                    'down' : 40,
                    'left' : 37,
                    'right' : 39,
                    'space' : 32
                };
                switch (key) {
                    
                    case 13:
                        _self.start = key;
                        if (_self.numberArr.length == 0) {
                            _self.numberArr.push(key);
                            _self.cnt = 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.cnt += 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.numberArr.splice(0 ,1, key);
                            _self.cnt = 1;
                        }
                        break;
                    case 38 :
                        _self.up = key;
                        if (_self.numberArr.length == 0) {
                            _self.numberArr.push(key);
                            _self.cnt = 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.cnt += 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.numberArr.splice(0 ,1, key);
                            _self.cnt = 1;
                        }
                        break;
                    case 40 :
                        _self.down = key;
                        if (_self.numberArr.length == 0) {
                            _self.numberArr.push(key);
                            _self.cnt = 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.cnt += 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.numberArr.splice(0 ,1, key);
                            _self.cnt = 1;
                        }
                        break;
                    case 37 :
                        _self.left = key;
                        if (_self.numberArr.length == 0) {
                            _self.numberArr.push(key);
                            _self.cnt = 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.cnt += 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.numberArr.splice(0 ,1, key);
                            _self.cnt = 1;
                        }
                        break;
                    case 39 :
                        _self.right = key;
                        if (_self.numberArr.length == 0) {
                            _self.numberArr.push(key);
                            _self.cnt = 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.cnt += 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.numberArr.splice(0 ,1, key);
                            _self.cnt = 1;
                        }
                        console.log(_self.right);
                        break;
                    case 32 :
                        if (_self.numberArr.length == 0) {
                            _self.numberArr.push(key);
                            _self.cnt = 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.cnt += 1;
                        } else if (~_self.numberArr.indexOf(key)) {
                            _self.numberArr.splice(0 ,1, key);
                            _self.cnt = 1;
                        }
                        _self.stop = key;
                        break;
                    default :
                        alert("按错键了。。。" + e.key +",keycode" + e.keyCode);
                        console.log(e.key);
                }

                let snakeD = document.getElementsByClassName("snake")[0];
                if (_self.right) {
                    console.log("11");
                    console.log("ccc", _self.cnt);
                    console.log(_self.snakeLeft);
                    console.log(_self.speed);
                    snakeD.style.left = _self.speed * _self.cnt + 'px';
                    
                    console.log("sty", snakeD.style.left);

                    snakeD.style.up = "0px";
                }
            };
        },
        moveLeft () {

        },
        moveRight () {

        },
        moveUp () {

        },
        moveDown () {

        },
        startMove () {

        },
        stopMove () {

        },
        update () {
            console.log("qq");
        },
        loadFood () {
            window.location.reload();
        }
    }

});