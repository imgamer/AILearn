"""
卷积神经网络

错误不影响：
2024-10-27 16:43:34.003589: I tensorflow/core/platform/cpu_feature_guard.cc:182] This TensorFlow binary is optimized to use available CPU instructions in performance-critical operations.
To enable the following instructions: SSE SSE2 SSE3 SSE4.1 SSE4.2 AVX AVX2 FMA, in other operations, rebuild TensorFlow with the appropriate compiler flags.

"""
import cv2
import keras.utils
from keras.models import Sequential
from keras.layers import Dense, Dropout, Conv2D, MaxPooling2D, Flatten
from keras.optimizers import SGD    # 优化器会有多种,也可以用别的
from keras.datasets import cifar10  # 用小一点的数据集
import numpy as np  # 计算用
from tensorflow.python.data.experimental.kernel_tests.service.multi_process_cluster import test_main

model = Sequential()

# 搭载神经网络
# 为什么要用激活函数，怎么选激活函数，分析需求
# padding是如何扩展图片数据，以便进行卷积处理，卷积盒是input_shape=(32,32,3)
model.add(Conv2D(32, (3, 3), activation='relu', input_shape=(32,32,3),padding='same'))
model.add(Conv2D(32,(3,3), activation='relu'))

# 池化层，设置大小
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.25))

# 再加一层卷积，filters设置64，过滤的多一点
model.add(Conv2D(64, (3, 3), activation='relu', input_shape=(32,32,3),padding='same'))
model.add(Conv2D(64,(3,3), activation='relu'))

# 池化层，设置大小，2个卷积一个池化
model.add(MaxPooling2D(pool_size=(2,2)))
model.add(Dropout(0.25))

# 输出前加一个展平层，把数据变成一个长条
model.add(Flatten())
# Dense全连接
model.add(Dense(512, activation='relu' ))
model.add(Dropout(0.5)) # 用一半

# 输出层，不能用卷积了，用Dense,输出10个类，10种动物，不能错。
# 中间都是隐藏层，输入输出层是必须存在
model.add(Dense(10, activation='softmax'))

# 优化
opt = SGD(learning_rate=0.01)

# 编译
model.compile(loss='categorical_crossentropy', optimizer=opt)

# 下载数据，注意数据格式
(x_train, y_train), (x_test, y_test) = cifar10.load_data()
# 彩色数据，需要把0-255像素变成0-1
x_train = x_train/255
x_test = x_test/255

# 观察标签cat、dog...，是文本，转为数字0-1，程序编码用one-hot编码，
print(y_train.shape, '\n', y_train)

y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)
print(y_train)

# 训练
model.fit(x_train, y_train, batch_size=32, epochs=10)

# 预测
result = model.predict(x_test, batch_size=128, verbose=1)
print(result.shape, '\n', result)   # 输出查看一下

result_max = np.argmax(result, axis=1)  # 求横轴
test_max = np.argmax(y_test, axis=1)

result_bool = np.equal(result_max, test_max)    # 预测值和真实值比较
true_num = np.sum(result_bool)
print('the accuacy of the model is %f' % (true_num/len(result_bool))) # 输出准确率

# 保存好模型
model.save('CNN.h5')


labels = ['airplane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship']

# 随便取一张图片
# *255是把0-1区间映射回来，变回原来的彩色图
test_image = (x_test[13,:,:,:].reshape(32,32,3)*255).astype(np.uint8)
cv2.imshow('test_image', cv2.resize(test_image,(128,128)))
cv2.waitKey()

# 做一个图片的预测
test_image = test_image/255
test_image=test_image.reshape(1, 32, 32, 3)
test_result = model.predict(test_image, batch_size=1)
print(test_result)
test_max = np.argmax(test_result, axis=1)
print(labels[test_max[0]])
# 如果想要准确率高，要多跑一跑，调整模型参数，准确率才会更高



