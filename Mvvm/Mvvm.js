/*mvvm**/

//构造函数，对数据(data)处理
function Mvvm (option = {}) {
    this.$option = option;
    let data = this._data = this.$option.data;
    console.log("computed", this.$option.computed);
    let vm = initVm.call(this);
    initObserve.call(this, data);  //初始化data的Observe ，监控数据变化的类
    initComputed.call(this);  //添加计算函数
    console.log("_computed", this._computed);
    new Compile(this.$option.el, vm);  //编译函数，将{{}}里面的内容解析出来,将vm中的数据添加到编译器内，表明，只有将数据放在data里才能被编译器识别
    
    // let hookClass = new Hook(vm);
    // for (let hookKey in hook) { //遍历钩子
    //     new Hook().hook[hookKey].call(this._vm);
    // }
    created.call(this._vm);
    console.log("this._vm", this._vm);
    return this._vm;
}

//初始化vm，利用代理和反射，将data的数据传递到this._vm
function initVm () {
    console.log("this", this._data);
    this._vm = new Proxy(this, {
        get: (target, key, recevier) => {
            console.log("222", this._data[key])
            return this[key] || this._data[key] || this._computed[key];
        },
        set : (target, key, value) => {
            return Reflect.set(this._data, key, value);
        }
    });
    return this._vm;
}

// const hook = {  //钩子函数，钩子函数指的是通过这个钩子函数，可以获取到或影响到一些数据的变化.
//     'created': created,
//     'mounted': mounted,
//     'updated': updated,
//     'destroyed': destroyed
// }

//initObserve初始化Observe
function initObserve (data) {
    this._data = observe(data);
}
//这两个observe方法递归调用
function observe (data) {
    if (!data || typeof data !== 'object') return data //不是对象，直接返回
    return new Observe(data);
}

//Observe类
class Observe {
    constructor (data) {
        this.dep = new Dep()
        for (let key in data) {
            data[key] = observe(data[key]);
        }
        return this.proxy(data);
    }
    proxy (data) {
        let dep = this.dep;
        return new Proxy(data, {
            get: (target, key, recevier) => {
                if (Dep.target) {
                    if (!dep.subs.includes(Dep.exp)) {  //若没有在订阅数组里，就push到数组里
                        dep.addSub(Dep.exp);
                        dep.addSub(Dep.target);
                    }
                }
                return Reflect.get(target, key, recevier);
            },
            set: (target, key, value) => {
                const result = Reflect.set(target, key, observe(value));
                dep.notify();  //发布
                return result;
            }
        })
    }
}

//Compile类
class Compile {
    constructor (el, vm) {
        this.vm = vm;
        let element = document.querySelector(el);  //获取节点
        let fragment = document.createDocumentFragment(); //创建fragment
        fragment.appendChild(element);
        // element.append(fragment);
        this.replace(fragment);
        document.body.appendChild(fragment);  //将数据解析后的html结构添加到body中
    }
    replace(frag) {  //将数据解析并替换节点的函数
        let vm = this.vm;  //拿到之前存的vm
        Array.from(frag.childNodes).forEach(node => {
            let txt = node.textContent  //文本
            let req = /\{\{(.*?)\}\}/g  //匹配规则 解析{{}}

            if (node.nodeType === 1) {
                const nodeAttr = node.attributes  //属性集合
                Array.from(nodeAttr).forEach(item => {
                    let name = item.name;
                    let exp = item.value;

                    ///判断v-属性
                    if (name.includes('v-')) {
                        node.value = vm[exp];
                        node.addEventListener('input', e => {   //这里只是为了实现v-model，所以绑定的是input事件
                            vm[exp] = e.target.value;  //赋新值给原来的变量
                        })
                    }
                })
            }
            if (node.nodeType === 3 && req.test(txt)) {
                replaceTxt();
                function replaceTxt () { //替换文本
                    node.textContent = txt.replace(req, (matched, placeholder) => {
                        new Watcher(vm, placeholder, replaceTxt); ///监听变化，进行匹配替换内容
                        return placeholder.split('.').reduce((obj, key) => {
                            return obj[key];
                        }, vm);
                    }).trim();
                }
            }
            if (node.childNodes && node.childNodes.length) {
                this.replace(node);
            }
        })
    }
}

//Dep类
class Dep {
    constructor () {
        this.subs = [];  //订阅数组
    }
    addSub (sub) {  //订阅
        this.subs.push(sub);
    }
    notify () {  //发布
        this.subs.filter(item => typeof item != 'string').forEach(sub => sub.update())
    }
}

//Watcher类，监听,这个类就是我们要订阅的watcher，为什么要订阅，是为了监听data的数据变化，再通过正则解析data并更新页面,所以要在编译器内添加watcher
class Watcher {
    constructor (vm, exp, fn) {
        this.fn = fn;
        this.vm = vm;
        this.exp = exp;
        Dep.exp = exp;
        Dep.target = this;  //给Dep类挂载一个Watcher对象
        let val = vm;
        let arr = exp.split('.');
        arr.forEach(key => {
            val = val[key];  //获取值，vm.proxy里的get()
        })
        Dep.target = null;  //添加订阅之后，就把Dep.target清空
    }
    update () {
        let exp = this.exp;
        let arr = exp.split('.');
        let val = this.vm;
        arr.forEach(key => {
            val = val[key];
        })
        this.fn(val);
    }
}

function initComputed () {
    let vm = this;
    let computed = vm.$option.computed;
    vm._computed = {};
    console.log("lll", computed);
    if (!computed) return;
    Reflect.ownKeys(computed).forEach(item => {
        console.log("item", computed[item].call(this._vm));
        //这里遍历的computed里的key值，并改变this的指向到this._vm，用以获取computed里的方法里的变量的值:this.a
        this._computed[item] = computed[item].call(this._vm);
        new Watcher(this._vm, item, val => {
            this._computed[item] = computed[item].call(this._vm);
        })
    })
}

class Hook {  //钩子类
    constructor (vm) {
        this.vm = vm;
    }
    created () {
        let created = this.vm.$option.created;
        if (!created) return;
        // created.call(this.vm);
    }
    mounted () {

    }
    updated () {

    }
    destroyed () {

    }
}
function created () {
    let created = this.$option.created;
    created && created.call(this);
}
