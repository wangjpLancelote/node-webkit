import os;

#获取当前文件所在目录
current_dir = os.path.abspath(os.path.dirname(__file__));
print('current', current_dir);

#文件名
cFile = __file__
# print('cFile', cFile)

#当前文件目录的父级目录
path_dir = os.path.dirname(current_dir);
# print('path_dir', path_dir);

isExsts = os.path.exists('/Users/lance/node-webkit/selenium');
# print('isExsts', isExsts);

# hasImages = os.path.exists('/Users/lance/node-webkit/selenium/images');
# print('hasImages', hasImages);

# if (not hasImages):
#     os.mkdir('/Users/lance/node-webkit/selenium/images');
#     print('创建images 成功');

# print('now hasImages', os.path.exists("/Users/lance/node-webkit/selenium/images"));
# if (os.path.exists('/Users/lance/node-webkit/selenium/images')):
#     os.rmdir('/Users/lance/node-webkit/selenium/images');
#     print('已经移除目录', '/Users/lance/node-webkit/selenium/images');

#是否有该目录
def has (path) :
    return os.path.exists(path);

#移除目录
def rmdir(dirPath):
    if os.path.exists(dirPath):
        print('d');
        os.rmdir(dirPath);
        print('已成功移除目录', dirPath);
        return True;
    else:
        print('未找到该目录, 或该目录不存在');
        return False;

# res = rmdir('/Users/lance/node-webkit/selenium/images');
# print('res', res);

#获取当前的目录
def curDir () :
    import os;
    return os.path.abspath(os.path.dirname(__file__));

# print('curDir', curDir());
#获取当前文件
def getFile () :
    return __file__;

#添加目录
def addDir (path) :
    # import os;

    if (os.path.exists(path)):
        print('已存在该目录', path);
        return False;
    else :
        os.mkdir(path);
        print('目录已创建');
        return True;

# addDir('/Users/lance/node-webkit/selenium/images');
