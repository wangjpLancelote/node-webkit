import time
import os
i = 1
num = 100000
while (num != 0):
    print ("num is : %u" %i)
    num -= 1
    i += 1
print ("use time: %s" %(time.clock() - time_begin))
os.system("pause")