"""
KNeighborsClassifier 是 scikit-learn 库中实现的 k-近邻（k-Nearest Neighbors, k-NN）分类算法。
k-NN 是一种监督学习算法，主要用于分类任务。
它的基本思想是：给定一个测试样本，找到训练集中与其最近的 k 个样本，然后根据这 k 个样本的多数类别来决定测试样本的类别。

KNeighborsClassifier 的主要作用
分类任务：
KNeighborsClassifier 主要用于解决分类问题，即将输入数据分为预先定义的类别。
适用于多分类问题，即目标变量有多个类别。

基于距离的决策：
k-NN 算法通过计算测试样本与训练集中每个样本的距离来找到最近的 k 个邻居。
常见的距离度量方法包括欧氏距离、曼哈顿距离等。

多数投票：
在找到最近的 k 个邻居后，根据这些邻居的类别进行多数投票，将测试样本归类为得票最多的类别。
如果 k 为 1，则测试样本的类别就是最近的那个邻居的类别。

KNeighborsClassifier 的主要参数
n_neighbors：int，默认为 5。指定最近邻居的数量 k。
weights：str 或 callable，默认为 'uniform'。权重函数用于预测。可选值有：
'uniform'：所有邻居的权重相同。
'distance'：邻居的权重与其距离成反比。
callable：用户自定义的权重函数。
algorithm：str，默认为 'auto'。用于计算最近邻的算法。可选值有：
'auto'：根据数据自动选择最合适的算法。
'ball_tree'：使用 Ball Tree 算法。
'kd_tree'：使用 KD Tree 算法。
'brute'：使用暴力搜索。
leaf_size：int，默认为 30。影响树算法的效率，较大的值会减少树的深度，但增加每层的节点数。
p：int，默认为 2。用于距离度量的幂参数。p=1 时为曼哈顿距离，p=2 时为欧氏距离。
metric：str 或 callable，默认为 'minkowski'。距离度量方法。可选值有：
'minkowski'：闵可夫斯基距离。
'euclidean'：欧氏距离。
'manhattan'：曼哈顿距离。
其他自定义的距离度量方法。
"""

import numpy as np
from sklearn.datasets import load_digits    # 使用手写数字数据集，训练集
from sklearn.model_selection import train_test_split    # 测试集，划分好
from sklearn.neighbors import KNeighborsClassifier  # 分类器，决策树，KNN算法
import matplotlib.pyplot as plt, pylab     # 接下来画图

mnist = load_digits()
# 划分数据集，数据和标签，比例test_size，
x_train, test_x, y_train, test_y = train_test_split(mnist.data, mnist.target, test_size=0.3, random_state=40)

# 使用KNN算法来训练模型，选择4个邻居来比较，然后投票，那么k应该是奇数
# 如何知道10个分类？数据集中有10个分类，数据本身有10个，10个分类是算法处理后的结果
model = KNeighborsClassifier(n_neighbors=4)
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
