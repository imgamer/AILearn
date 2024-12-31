"""

这段代码实现了将一个图像（logo）作为水印叠加到另一张图像（lena）上，并且在叠加前调整了logo的大小。
debug练习：通过把错误代码修改为正确的代码，并使用opencv库实现图像处理，原始错误代码见 debug_practice_error.py
错误代码：
在代码中，使用了cv2.imread函数读取图像文件，但参数1表示以灰度模式读取图像，而实际需要以彩色模式读取。
在代码中，使用了cv2.resize函数调整图像大小，但实际需要调整logo图像的大小。
在代码中，使用了cv2.cvtColor函数将logo图像转换为灰度图像，但实际需要将logo图像转换为灰度图像。
在代码中，使用了cv2.threshold函数对灰度图像进行二值化处理，

opencv： 这是一个用于计算机视觉任务的强大库。
安装opencv库： pip install opencv-python
"""

# 以下为修改正确的代码
import cv2

# 使用OpenCV的imread函数读取名为lena03.png的图像文件。参数1表示以彩色模式读取图像。
lena = cv2.imread("image/lena03.png", 1)
logo = cv2.imread("image/anaconda.png", 1)

# 调整logo图像的大小为宽度400像素，高度300像素。
logo = cv2.resize(logo,(400,300))

# 获取图像的高度、宽度和颜色通道数。
h1, w1, ch1 = lena.shape
h2, w2, ch2 = logo.shape

# 定义lena图像的一个区域roi，这个区域与logo的大小相同，位置在lena图像的右下角。
roi = lena[h1-h2:h1, w1-w2:w1]

# 将logo图像转换为灰度图像。
grey = cv2.cvtColor(logo, cv2.COLOR_BGR2GRAY)

# 对灰度图像应用二值化处理，阈值设为220，得到一个黑白掩膜mask1，其中背景部分被标记为白色（255），前景部分为黑色（0）。
ret, mask1 = cv2.threshold(grey, 220, 255, cv2.THRESH_BINARY)

# 使用按位与操作将roi区域与mask1结合，保留roi中对应于mask1中的黑色部分。
fg1 = cv2.bitwise_and(roi, roi, mask=mask1)

# 再次对灰度图像应用二值化处理，但这次使用反向二值化(THRESH_BINARY_INV)，得到的掩膜mask2中前景部分为白色，背景部分为黑色。
ret, mask2 = cv2.threshold(grey, 220, 255, cv2.THRESH_BINARY_INV)

# 使用按位与操作将logo与mask2结合，保留logo中对应于mask2中的白色部分。
fg2 = cv2.bitwise_and(logo, logo, mask=mask2)

# 将fg1和fg2相加的结果赋值给roi区域，实现logo的叠加效果。
roi[:] = cv2.add(fg1,fg2)
cv2.imshow('roi2', roi) # 显示叠加后的roi区域。

cv2.waitKey(0)                  # 等待用户按键，直到按下任意键后继续执行程序。
cv2.destroyAllWindows()         # 关闭所有OpenCV创建的窗口。
