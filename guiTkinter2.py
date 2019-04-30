from tkinter import *
import tkinter as tk

root = tk.Tk()

def changeText():
    if button['text'] == 'text':
        v.set('change')
        print('change')
    else:
        v.set('text')
        print('text')

def printInfo(event):
    t.insert(1.0,event.time)
    t.insert(END,event.type.encode('utf8'))
    t.insert(END,event.keysym)

t = Text(root,width=50,height=50)
t.insert(1.0,"")
t.pack()
v = StringVar()
# button = Button(root,width=100,height=50,textvariable = v,command=changeText)
# v.set('text')
# button.pack()
but = Button(root,width=100,height=50,text='press')
but.bind("<Return>",printInfo)
but.pack()
but.focus_set()
root.title("button test")
root.mainloop()
root.destroy()
