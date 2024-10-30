"""
使用当前设备摄像头采集10张图像
按下s键，保存当前帧到指定目录
按下q键，退出程序

需求分析：
把图像保存到哪里？  建立目录或者保存到当前工作目录。
如何采集当前帧？      cap.read()
如何保存当前帧？      cv2.imwrite()
如何接受和处理键盘事件？ cv2.waitkey()
程序是持续运行直到按下q键才会退出。 while true
程序运行到采集了10张图像也可以主动退出。while count == 10
持续运行的过程中，接受键盘事件，判断是否按下了s键，按下了就保存当前帧，并继续循环。

本程序使用OpenCV库，需要先安装OpenCV库才能运行

1. 是要理解视频数据是由离散的图像帧组成的，显示视频就是获取每一帧然后用vs2显示。camrea.read()
2. 检测键盘事件和处理
3. 熟练使用cv2.imshow()和cv2.imwrite()函数

主要逻辑是抓取图像并保存，但这之前要先准备好环境，建立目录，初始化摄像头

"""

import cv2
import os

# 创建保存图像的文件夹
output_folder = 'captured_images'
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 初始化摄像头，摄像头开始拍摄，0表示第一个摄像头
cap = cv2.VideoCapture(0)
# 检查摄像头是否成功打开
if not cap.isOpened():
    print("无法打开摄像头")
    exit()

# 设置要采集的图像数量
num_images = 10
count = 0

while count < num_images:
    # 读取一帧图像
    ret, frame = cap.read()

    if not ret:
        print("无法获取帧")
        break

    # 显示图像
    cv2.imshow('Camera', frame)

    # 按下 's' 键保存当前帧
    key = cv2.waitKey(1) & 0xFF
    if key == ord('s'):
        image_path = os.path.join(output_folder, f'image_{count}.jpg')
        cv2.imwrite(image_path, frame)
        print(f"保存图像: {image_path}")
        count += 1

    # 按下 'q' 键退出
    if key == ord('q'):
        break

# 释放摄像头资源并关闭所有窗口
cap.release()
cv2.destroyAllWindows()