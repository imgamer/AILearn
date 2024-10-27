import cv2
import keras
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Conv2D,MaxPooling2D,Flatten
from keras.optimizers import SGD,Adam
from keras.datasets import cifar10
import numpy as np

model = Sequential()#构建顺序模型

#第一层
model.add(Conv2D(32,(3,3),activation='relu', input_shape=(32,32,3),padding='same'))
model.add(Conv2D(32,(3,3),activation='relu'))

model.add(MaxPooling2D(pool_size= (2,2)))
model.add(Dropout(0.25))

model.add(Conv2D(64,(3,3),activation='relu', padding='same'))
model.add(Conv2D(64,(3,3),activation='relu'))

model.add(MaxPooling2D(pool_size= (2,2)))
model.add(Dropout(0.25))

model.add(Flatten())
model.add(Dense(512, activation='relu'))
model.add(Dropout(0.5))

#输出层
model.add(Dense(10,activation='softmax'))

sgd = SGD(learning_rate=0.01) #优化器
#opt=Adam()
model.compile(loss='categorical_crossentropy', optimizer=sgd) #编译

(X_train, y_train), (X_test, y_test)= cifar10.load_data()

X_train = X_train/255
X_test = X_test/255

y_train = keras.utils.to_categorical(y_train,10)
y_test = keras.utils.to_categorical(y_test,10)
print(y_train)

model.fit(X_train,y_train,batch_size=32, epochs=10)

result = model.predict(X_test,batch_size=32,verbose=1)
print(result.shape, '/n', result)
result_max = np.argmax(result,axis=1)
test_max = np.argmax(y_test,axis=1)
result_bool = np.equal(result_max,test_max)
true_num = np.sum(result_bool)
print("the accuracy of the model is； %f" % (true_num / len(result_bool)))

model.save("CNN1.h5")

labels = ['airplane', 'car', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'trunk']
test_image = (X_test[13, :, :, :].reshape(32, 32, 3) * 255).astype(np.uint8)
cv2.imshow('test_image', cv2.resize(test_image, (128, 128)))
cv2.waitKey()

test_image = test_image / 255
test_image = test_image.reshape(1, 32, 32, 3)
test_result = model.predict(test_image, batch_size=1)
print(test_result)
test_max = np.argmax(test_result, axis=1)  # 这是结果的真实序号
print(labels[test_max[0]])


