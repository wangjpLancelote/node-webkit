from PIL import Image
from pytesseract import image_to_string
import urllib3, os
import util

#创建网络请求
http = urllib3.PoolManager()
header = {'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36', 'Content-type': 'text/json'}
res = http.request('get', 'http://www.ztbu.edu.cn/captcha/1', headers=header)
# exsts = os.path.exists('~/node-webkit/selenium/images')
# print('exsts', exsts)
# if exsts:
#     print('目录已存在')
#     # return False
# else:
#     os.mkdir('~/node-webkit/selenium/images')
#     print('创建成功')
#     # return True
    
# e = os.path.exists('/selenium/images')
# print('e', e)
# print('util', util.addDir);
current_dir = util.curDir();
print(current_dir + '/images');
print(util.has(current_dir + '/images'));

if not util.has(current_dir):
    util.addDir(current_dir + '/images');
# else:
#     print('已存在');

print('s', util.has(current_dir + '/images'));
f = open('/Users/lance/node-webkit/selenium/images/1.png', 'wb+')
f.write(res.data)
f.close()
#取出图片
img = Image.open('/Users/lance/node-webkit/selenium/images/1.png')

#图像灰度处理
#获取图像的像素点
pix = img.load()
w,h = img.size
for i in range(w):
    for j in range(h):
        val = (pix[i, j][0] + pix[i, j][1] + pix[i, j][2]) // 3
        pix[i, j] = (val, val, val, 255)
img.save('/Users/lance/node-webkit/selenium/images/2.png', 'png') #灰度处理后的图片

#二值化处理

img = Image.open('/Users/lance/node-webkit/selenium/images/2.png')
pix = img.load()
for i in range(w):
    for j in range(h):
        if pix[i, j][0] <= 100:
            pix[i, j] = (0, 0, 0);
        else:
            pix[i, j] = (255, 255, 255);
img.save('/Users/lance/node-webkit/selenium/images/3.png', 'png')
#转为黑白图片
img.convert('L')
#识别黑白图片的数字字母
#image_to_string  -psm 7 表示视为一行文本
txt = image_to_string(img, config='-psm 7')
print('验证码是--->>')
print(txt)