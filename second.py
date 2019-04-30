import urllib.request
from bs4 import BeautifulSoup
import pandas as pd

res = urllib.request.urlopen("http://www.douban.com/tag/%E5%B0%8F%E8%AF%B4/?focus=book")
soup = BeautifulSoup(res,"html.parser")
book_div = soup.find(attrs={"id":"book"})
book_a = book_div.findAll(attrs={"class":"title"})
for book in book_a:
    # df = pd.DataFrame(book)
    # df.columns = ["书名"]
    # df.to_csv("豆瓣.csv",encoding='gbk',index=false)
    print (book.string)
