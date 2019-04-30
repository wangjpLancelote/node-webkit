from requests_html import HTMLSession
import pandas as pd
session = HTMLSession()
url = 'https://www.jianshu.com/p/85f4624485b9'
r = session.get(url)
sel = 'body > div.note > div.post > div.article > div.show-content > div > p:nth-child(4) > a'
sels = 'body > div.note > div.post > div.article > div.show-content > div > p > a'
# print(r.html.text)
def get_link_from_html (sel):
    linkList = []
    try:
        results = r.html.find(sel)
        for result in results:
            text = result.text
            myLink = list(result.absolute_links)[0]
            linkList.append((text,myLink))
            return linkList
    except:
        return None
df = pd.DataFrame(get_link_from_html(sels))
df.columns = ["text","link"]
df.to_csv('output.csv',encoding='gbk',index=False)
print(df)
print(get_link_from_html(sels))
