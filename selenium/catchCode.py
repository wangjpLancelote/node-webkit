from PIL import Image
from pytesseract import image_to_string
import urllib3, os

#创建网络请求
http = urllib3.PoolManager()
header = {'User-Agent' : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36', 'Content-type': 'text/json'}
res = http.request('get', 'http://www.ztbu.edu.cn/captcha/1', headers=header)
f = open('selenium/images/1.png', 'wb+')
f.write(res.data)
f.close()
#取出图片
img = Image.open('selenium/images/1.png')

#图像灰度处理
#获取图像的像素点
pix = img.load()
w,h = img.size
for i in range(w):
    