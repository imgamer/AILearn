"""
需求：
使用笔记本电脑摄像头，实现以下内容
    录制视频
    按下“q”键，读取一帧，将该帧和录制的视频一起保存到同一文件夹下

    1. 建立目录
    2. 初始化摄像头
    3. 初始化VideoWriter
    4. 主循环每帧抓取
    5. 按下q时存储最后一帧
    6. 释放资源
"""

import cv2
import os

# 建立目录
output_dir = 'video'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 初始化摄像头
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("error: 无法打开摄像头")
    exit()

# 定义视频编码器和输出文件
# VideoWriter 参数
# filename:保存视频的路径和文件名，字符串类型，例如，output.mp4'
# fourcc:用于指定视频编码的4字符代码，例如mp4v'，可以通过 cv2.VideoWriter_fourcc()函数生成。
# fps:视频的帧率，浮点型，表示每秒播放的帧数。
# framesize:视频帧的尺寸，以(宽度,高度) 的元组形式给出
# isColor(可选):布尔值，默认为 True，表示视频是彩色的;如果为 False，则表示视频是灰度的。

# 获取视频的帧率和尺寸
video_width = int(camera.get(cv2.CAP_PROP_FRAME_WIDTH))
video_height = int(camera.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = int(camera.get(cv2.CAP_PROP_FPS))
# 定义视频编码器和输出文件，把每一帧图片写入，最后保存到磁盘
video_writer = cv2.VideoWriter(
    os.path.join(output_dir, 'video.avi'),
    cv2.VideoWriter_fourcc(*'XVID'),
    fps,
    (video_width, video_height)
)

# 用于保存最后一帧
last_frame = None

# 以上初始化完毕后进入主循环，不断读取当前帧写入video_writer
while True:
    success, frame = camera.read()
    if not success:
        print("error 无法获取帧")
        break

    # 显示图像以便能看到摄像头实时帧
    cv2.imshow('Camera', frame)
    # 把每一帧写入视频文件
    video_writer.write(frame)

    # 按下 'q' 键保存最后一帧并退出
    # waitKey等待用户输入，并返回值限制在按键的ASCII值范围
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        last_frame = frame
        break   # 如果不退出循环无法成功保存？

# 保存最后一帧
if last_frame is not None:
    frame_path = os.path.join(output_dir, 'last_frame.jpg')
    cv2.imwrite(frame_path, last_frame)
    print(f"保存最后一帧: {frame_path}")

camera.release()
video_writer.release()
cv2.destroyAllWindows()
