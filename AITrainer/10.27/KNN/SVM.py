
import numpy as np
from sklearn.datasets import load_digits    # 使用手写数字数据集，训练集
from sklearn.model_selection import train_test_split    # 测试集，划分好
#from sklearn.neighbors import KNeighborsClassifier  # 分类器，决策树，KNN算法
from sklearn import svm
import matplotlib.pyplot as plt, pylab     # 接下来画图

mnist = load_digits()
# 划分数据集，数据和标签，比例test_size，
x_train, test_x, y_train, test_y = train_test_split(mnist.data, mnist.target, test_size=0.3, random_state=40)

# 使用 svm 算法来训练模型
model = svm.LinearSVC()
# 训练，x是数据，y是标签（target）
model.fit(x_train, y_train)
# 训练完毕，进行预测
y_predict = model.predict(test_x)
# 评价
print('准确率：', np.sum(y_predict == test_y)/y_predict.size)

# 画图
#
# 选择输出6张图片
print(model.predict(mnist.data[1650:1656]))
mnist.target[1650:1656]

fig = plt.gcf()
#fig.canvas.set_window.title('KNN')
plt.subplot(321) # 6张图 3行2列，第1张
# cmap=plt.cm.gray_r 灰度图，去掉就是彩色图
plt.imshow(mnist.images[1650],cmap=plt.cm.gray_r,interpolation='nearest')

# 第二张图
plt.subplot(322)
plt.imshow(mnist.images[1651],cmap=plt.cm.gray_r,interpolation='nearest')

#
plt.subplot(323)
plt.imshow(mnist.images[1652],cmap=plt.cm.gray_r,interpolation='nearest')

#
plt.subplot(324)
plt.imshow(mnist.images[1653],cmap=plt.cm.gray_r,interpolation='nearest')

#
plt.subplot(325)
plt.imshow(mnist.images[1654],cmap=plt.cm.gray_r,interpolation='nearest')

#
plt.subplot(326)
plt.imshow(mnist.images[1655],cmap=plt.cm.gray_r,interpolation='nearest')

plt.show()