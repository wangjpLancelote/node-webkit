/**
 * Immutable 不可变的数据结构
 * 一般用于数据量较大的项目
 * 持久化数据的解决方案
 */

 class Immutable {
     constructor (data = {}) {
        this.data = data; //引用的数据结构 , 默认{}

        this.modified = false; //是否被修改

        this.copy = null; //拷贝的对象
     }

     get (key) {
        if (!this.modified) return this.data[key]; //没有被修改过，就返回原对象
        return this.copy[key];
     }

     /**修改对象 若没有修改过，就修改标记状态，否则修改copy对象 */
     set (key, value) {
        if (!this.modified) this.mark();
        return this.copy[key] = value;
     }

     /**标记 */
     mark () {
        if (this.modified) return;
        this.modified = true;
        this.copy = this.execCopy(this.data);
     }
     /**拷贝函数 */
     execCopy (data) {
        if (Array.isArray(data)) return data.slice();
        if (data.__proto__ === undefined) return {...Object.create(null), ...data};
        return {...data, ...{}};
     }
 }

 //test
 const PROXY_STATE = Symbol('state');
 const handler = {
     get (target, key) {
         console.log('d',);
        if (key = PROXY_STATE) return target;
        return target.get(key);
     },
     set (data, key, value) {
        return data.set(key, value);
     }
 }
/**类似于react 的reducer 接受一个目标对象和一个处理函数 */
 const reduce = (state, producer) => {
    const store = new Immutable(state); //经过Immutable处理过的数据
    const proxy = new Proxy(store, handler);

    producer(proxy);
    const newState = proxy[PROXY_STATE];
    console.log('newState', newState);
    if (newState.modified) return newState.copy;
    return newState.target;
 }

 const base = [
     {
         'todo' : 'learn',
         done : false
     },
     {
         todo : 'try immer',
         done : true
     }
 ];
 const nextState = reduce(base, (current) => {
     console.log('c', current);
    current.push({todo: 'someThing', done: true});
    current[1].done = false;
 })

 console.log('=====>>>', base, nextState);