import itchat,time
#微信接口

# 文件助手
# itchat.auto_login(enableCmdQR = True)
# itchat.auto_login(enableCmdQR=2)
itchat.auto_login(hotReload = True)

# itchat.send("hello filehelp",toUserName='filehelper')
chatRooms = itchat.get_chatrooms()
friends = itchat.get_friends()[0:]

#NickName = 用户昵称
#UserName = 用户Uid
#RemarkName = 备注
# for i in friends:
#     print(i["NickName"])
#     print(i["RemarkName"])
    # input("点击继续")

for i in friends:
    if i["NickName"] == "某某":
        print("id:",i["UserName"])
        itchat.send_msg("测试",i["UserName"])
        print("信息发送成功")
# print(friends)
# print(chatRooms)
itchat.run()
