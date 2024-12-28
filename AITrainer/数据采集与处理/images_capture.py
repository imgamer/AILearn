
import cv2
import os

IMAGE_FOLDER = 'images'

def image_capture():
    if not os.path.exists(IMAGE_FOLDER):
        os.makedirs(IMAGE_FOLDER)

    # 激活摄像头，0表示索引为0的摄像头，一般是设备自带摄像头
    camera = cv2.VideoCapture(0)
    if not camera.isOpened():
        print('无法打开摄像头')
        return

    count = 0   # 抓取的图片编号
    while True:
        ret, frame = camera.read()
        if not ret:
            print('无法获取帧')
            break

        cv2.imshow('camera', frame)

        # 检测键盘输入事件，0xFF确保返回的是有效的8位ASCII码值
        key = cv2.waitKey(1) & 0xFF

        if key == ord('s'):         # s 键保存当前帧图片
            image_path = os.path.join(IMAGE_FOLDER, f'image_{count}.jpg')
            cv2.imwrite(image_path, frame)
            print(f'保存图像{image_path}')
            count += 1

        if key == ord('q'):         # q 键退出
            break

    print(f'采集了{count}张图片')

    # 退出前释放资源
    camera.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    image_capture()