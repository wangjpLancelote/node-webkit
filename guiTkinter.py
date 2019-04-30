from tkinter import *
import tkinter as tk



class Application(object):
    """docstring for Application."""
    def __init__(self, root):
        # super(Application,rootlf).__init__()
        self.root=root
        self.root.bind("<KeyPress>",self.bind_key)
        self.root.bind("<KeyPress-Shift_R>",self.bind_r_key)

    def bind_key(self,event):
        print(event.keysym,"key is pressed")

    def bind_r_key(self,event):
        print("the right shift key has been pressed")


if __name__=='__main__':
    root=tk.Tk()
    root.title("hello world")
    Application(root)
    root.geometry('500x300')
    root.resizable(width=False,height=True)
    Label(root,text='hello'.encode('utf8'),font=('Arial',20)).pack()
    def printInT():
        t.insert('wjp')
    # 输入框
    var = StringVar()
    e = Entry(root,textvariable = var)
    var.set("hello")
    e.pack()
# 插入文本
    t = Text(root,width=500,height=100)
    t.insert(1.0,'hello\n')
    t.insert(END,'world')
    t.pack()
    # 按钮
    Button(root,text="press".encode('utf8'),width=30,height=20,command = printInT).pack()
    # Label()
    frame = Frame(root,width=200,height=200,background='green')
    root.mainloop()
    root.destroy()



def call_back(event):
    print(event.keysym)

def main():
    root = tk.Tk()
    root.title("对话框")

    frame.bind("<KeyPress>",call_back)
    frame.pack()
    frame.focus_set()
    mainloop()
if __name__ == '__main__':
    main()
