import cv2
import os

# 创建保存图像的文件夹
output_folder = 'captured_images'
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

# 初始化摄像头
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