/**
 * binTree  实现二叉树
 */
class binTree {
    constructor () {
        this.left = null;  //左节点
        this.right = null;  //右节点
        this.root = null;  //根节点
        this.data = null; //插入的节点数据
        this.obj = {
            data: this.data,
            left: this.left,
            right: this.right
        }
    }
    /**
     * insert 插入数据方法
     * @param {*} data
     */
    insert (data) {
        // if (this.root == null) {
        //     this.root = node;
        // } else {
        //     let current = this.root;
        //     while (true) {
        //         if (current.data > data) {
        //             if (current.left == null) {
        //                 current.left = node;
        //                 break;
        //             }
        //             current = current.left;
        //         } else {
        //             if (current.right == null) {
        //                 current.right = node;
        //                 break;
        //             }
        //             current = current.right;
        //         }
        //     }
        // }
        if (this.root == null) {  //第一个节点
            this.obj.data = data;
            this.root = this.obj;
            console.log(data);
        } else {
            console.log(data);
            let myRoot = this.root;
            console.log(myRoot.data, data);
            while (true) {
                if (myRoot.data > data) {
                    if (myRoot.left == null) {
                        myRoot.left = this.obj
                        console.log('----', this.obj.left.data);
                        break;
                    }
                    myRoot = myRoot.left;
                } else {
                    if (myRoot.right == null) {
                        myRoot.right = this.obj;
                        break;
                    }
                    myRoot = myRoot.right;
                }
                // console.log("root", myRoot.data, data);
            }
        }
    }
    create () {
        return new binTree();
    }
};

const bin = new binTree();
bin.insert(5);
bin.insert(3);
bin.insert(7);
bin.insert(9);
bin.insert(1);
//二叉树模型
const bt = {
    data : {left: {
        left: {

        },
        right: {

        }
    }, right: {
        left: {

        },
        right: {

        }
    }} 
}
console.log("bt", bt);
