import cv2
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation  # 全连基层，，激活函数
from keras.optimizers import SGD  # 优化器
from keras.datasets import mnist
import numpy as np

# 加载顺序模型
model = Sequential()

# 第一层
model.add(Dense(500, input_shape=(784,)))  # 500个神经元
model.add(Activation('tanh'))
model.add(Dropout(0.5))
# model.add(Dense(500,input_shape=(784,)),Activation('tanh'),Dropout(0.5))

# 第二层
model.add(Dense(500))
model.add(Activation('tanh'))
model.add(Dropout(0.5))
# 第三层
model.add(Dense(500))
model.add(Activation('tanh'))
model.add(Dropout(0.5))

# 输出层
model.add(Dense(10))
model.add(Activation('softmax'))

# 优化和编译
sgd = SGD(learning_rate=0.01,weight_decay=1e-6)
model.compile(loss='categorical_crossentropy', optimizer=sgd)

# 下载数据
(x_train, y_train),(x_test, y_test) = mnist.load_data()
# 下载的数据和我们搭建的网络输入是不匹配的
# 要将28*28的数组 reshanpe 成 一维数组

x_train = x_train.reshape(x_train.shape[0], x_train.shape[1] * x_train.shape[2])

x_test = x_test.reshape(x_test.shape[0], x_test.shape[1] * x_test.shape[2])
y_train = (np.arange(10) == y_train[:,None]).astype(int)
y_test = (np.arange(10) == y_test[:,None]).astype(int)

# 开始训练
model.fit(x_train, y_train, batch_size=128, epochs=2, shuffle=True, verbose=2, validation_split=0.3)
# 预测评估
print('test set')
scores=model.evaluate(x_test, y_test, batch_size=128)
print('the test loss is: %f' % scores)

result = model.predict(x_test, batch_size=128, verbose=1)

# 找到每行最大的序号
result_max = np.argmax(result, axis=1)
test_max = np.argmax(y_test, axis=1)
result_bool=np.equal(result_max,test_max)

true_num=np.sum(result_bool)
print('the accuracy of the model is: %f' %(true_num/len(result_bool)))

# 只预测单张图片
test_image=x_test[1,:].reshape(28,28)
cv2.imshow('test_image',test_image)
cv2.waitKey()

test_image=test_image.reshape(1,test_image.shape[0]*test_image.shape[1])

test_result=model.predict(test_image,batch_size=1)
test_max2=np.argmax(test_result,axis=1)
print(test_max2)