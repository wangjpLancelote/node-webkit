from tkinter import *
import tkinter.messagebox
import tkinter.filedialog

root = Tk()

# 单项提示框
def tips():
    tkinter.messagebox.showinfo("提示","人生苦短")
def warn():
    tkinter.messagebox.showinfo("警告","wwww")
def error():
    tkinter.messagebox.showinfo("报错","wjp")
root.title('消息提示')

ti = Button(root,text="提示",command=tips,width=20,height=3)
wr = Button(root,text="警告",command=warn,width=20,height=3)
er = Button(root,text="报错",command=error,width=20,height=3)

ti.pack()
wr.pack()
er.pack()

# 选择框
def but1():
    a = tkinter.messagebox.askokcancel("提示","确定吗")
    print("返回值",a)
def but2():
    b = tkinter.messagebox.askretrycancel("提示","重试还是取消")
    print('选择的是重试还是取消',b)
ok = Button(root,text="确定与取消",command=but1,width=20,height=3)
retry = Button(root,text='重试或取消',command=but2,width=20,height=3)
ok.pack()
retry.pack()

# 打开文件
def chooseFile():
    f = tkinter.filedialog.askopenfilename()
    f1 = tkinter.messagebox.showinfo("显示路径",f)
file = Button(root,text='打开文件，显示路径',command=chooseFile,width=20,height=3)
file.pack()

root.mainloop()
root.destroy()
