
import numpy as np
import pylab
from sklearn.datasets import load_digits
from sklearn.model_selection import train_test_split
from sklearn import svm
import matplotlib.pyplot as plt
import pylab

mnist = load_digits()

x,test_x, y, test_y = train_test_split(mnist.data, mnist.target, test_size=0.3, random_state=40)

model = svm.LinearSVC()
model.fit(x,y)
y_predict = model.predict(test_x)
print('准确率：', np.sum(y_predict==test_y)/y_predict.size)

print(model.predict(mnist.data[1650:1656]))

mnist.target[1650:1656]

fig = pylab.gcf()
#fig.canvas.set_window.title('KNN')
plt.subplot(321)
plt.imshow(mnist.images[1650],cmap=plt.cm.gray_r,interpolation='nearest')
plt.subplot(322)
plt.imshow(mnist.images[1651],cmap=plt.cm.gray_r,interpolation='nearest')
plt.subplot(323)
plt.imshow(mnist.images[1652],cmap=plt.cm.gray_r,interpolation='nearest')
plt.subplot(324)
plt.imshow(mnist.images[1653],cmap=plt.cm.gray_r,interpolation='nearest')
plt.subplot(325)
plt.imshow(mnist.images[1654],cmap=plt.cm.gray_r,interpolation='nearest')
plt.subplot(326)
plt.imshow(mnist.images[1655],cmap=plt.cm.gray_r,interpolation='nearest')
plt.show()




