import cv2
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation
from keras.optimizers import SGD
from keras.datasets import mnist
import numpy as np

model = Sequential()#构建顺序模型

#第一层：输入为784节点
model.add(Dense(500, input_shape=(784,))) #input_shape指定输入数据的尺寸
model.add(Activation('tanh')) #add() 方法将各层添加到模型中
model.add(Dropout(0.5)) # 每次仅随机使用一半的神经元

#第二隐藏层
model.add(Dense(500))
model.add(Activation('tanh'))
model.add(Dropout(0.5))

# #第三隐藏层
model.add(Dense(500))
model.add(Activation('tanh'))
model.add(Dropout(0.5))

#输出层
model.add(Dense(10))
model.add(Activation('softmax'))

#''网络优化和编译'''
sgd = SGD(learning_rate=0.01) #优化器
model.compile(loss='categorical_crossentropy', optimizer=sgd) #编译

(X_train, y_train), (X_test, y_test)= mnist.load_data()

X_train = X_train.reshape(X_train.shape[0],X_train.shape[1] * X_train.shape[2])
X_test = X_test.reshape(X_test.shape[0],X_test.shape[1] * X_test.shape[2])
y_train = (np.arange(10) == y_train[:,None]).astype(int)
y_test = (np.arange(10) == y_test[:,None]).astype(int)

#训练模型
model.fit(X_train,y_train,batch_size=128, epochs=50, shuffle=True,verbose=2, validation_split=0.3 )

scores = model.evaluate(X_test, y_test, batch_size=128, verbose=1 )
print("test loss is %f" % scores)

#计算模型在测试集上的准确性

result = model.predict(X_test, batch_size=128, verbose=1)
result_max = np.argmax(result, axis=1)
test_max = np.argmax(y_test, axis=1)
result_bool = np.equal(result_max, test_max)
true_num = np.sum(result_bool)
print("the accuracy of the model is； %f" % (true_num / len(result_bool)))

#单张图片预测
test_image = X_test[0,:].reshape(28,28)
cv2.imshow("test_image", test_image)
cv2.waitKey()

test_image = test_image.reshape(1,test_image.shape[0] * test_image.shape[1])
test_result=model.predict(test_image, batch_size=1)
print(test_result)
test_max2 = np.argmax(test_result,axis=1)
print(test_max2)





