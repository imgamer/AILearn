# 下午14:00
# 神经网络1，无监督学习

import cv2
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation # 各种层和激活函数
from keras.optimizers import SGD   # 优化器
from keras.datasets import mnist # 数据集
import numpy as np

# 顺序
model = Sequential()

# 第一层 全连接层
model.add(Dense(500, input_shape=(784,)))    # 全连接层 500 个神经元
model.add(Activation('tanh'))   # 激活函数
model.add(Dropout(0.5)) # 每次使用一半的神经元，相当放弃一半

# 第二层 隐藏层，可以是多层
model.add(Dense(500))
model.add(Activation('tanh'))   # 激活函数
model.add(Dropout(0.5)) # 每次使用一半的神经元，相当放弃一半

# 第三层 隐藏层，可以是多层
model.add(Dense(500))
model.add(Activation('tanh'))   # 激活函数
model.add(Dropout(0.5)) # 每次使用一半的神经元，相当放弃一半

# 输入层 一般用的全连接
model.add(Dense(10))    # 使用10，手写10个数字
model.add(Activation('softmax'))

# 网络搭建完毕后要优化和编译
sgd = SGD(learning_rate=0.01)

# 编译要设置损失函数
model.compile(loss='categorical_crossentropy', optimizer=sgd)

# 训练
#
# 要看一下数据是否符合要求，需要把多维数据变成一维数据
# 下载的数据和我们搭建的网络输入是不匹配的
# 要将28*28的数组 reshanpe 成 一维数组
(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = x_train.reshape(x_train.shape[0], x_train.shape[1]*x_train.shape[2])
x_test = x_test.reshape(x_test.shape[0], x_test.shape[1]*x_test.shape[2])
y_train = (np.arange(10) == y_train[:,None]).astype(int)
y_test = (np.arange(10) == y_test[:,None]).astype(int)

# 开始训练，epochs=10做10次快一些
model.fit(x_train, y_train, batch_size=128, epochs=10, shuffle = True, verbose=2, validation_split=0.3)

# 评分
print('test set')
# 输出损失函数是否一直在变小
scores = model.evaluate(x_test, y_test, batch_size=128)
print('the test loss is: %f' % scores)

# 预测
result = model.predict(x_test, batch_size=128, verbose=1)

# 找到每行最大的序号
result_max = np.argmax(result, axis=1)  # result 是预测值
test_max = np.argmax(y_test, axis=1)    # 真实值
result_bool = np.equal(result_max, test_max)

true_num = np.sum(result_bool)
print("the accuracy of the model is :%f" % (true_num/len(result_bool)))

# 单张图片做预测
test_image=x_test[1,:].reshape(28,28)
cv2.imshow('test_image',test_image)
cv2.waitKey()

test_image=test_image.reshape(1,test_image.shape[0]*test_image.shape[1])

test_result=model.predict(test_image,batch_size=1)
test_max2=np.argmax(test_result,axis=1)
print(test_max2)