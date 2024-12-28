"""
需求：
使用笔记本电脑摄像头，实现以下内容
    录制视频
    按下“q”键，读取一帧，将该帧和录制的视频一起保存到同一文件夹下

    1. 建立目录
    2. 初始化摄像头
    3. 初始化VideoWriter，注意要保存2个东西，视频和一帧图片
    4. 主循环每帧抓取和存储
    5. 按下q时存储最后一帧
    6. 释放资源，写入磁盘

视频的本质是很多离散的图片组成的序列。每帧抓取图片并显示就看到了视频效果。

每个持续运行的程序都需要一个主循环，while True，直到break。处理用户输入，不断抓取图像生成视频。

本段程序涉及的对象：Camera 和 VideoWriter。使用了OpenCV库。

注意，视频的录制是读取每一帧图像写入 VideoWriter，调用write后可能需要release才会保存到磁盘。

【环境准备】
pip install opencv-python

【灰度图】
灰度是指亮度，并不是指颜色，从黑到白为 0-255.
"""

import cv2
import os

# 1 建立目录
output_dir = 'video'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 2 初始化摄像头
# 调用 camera = cv2.VideoCapture(0) 之后，程序会尝试连接到索引为0的摄像头设备。如果连接成功，摄像头设备会被激活。
#
# 摄像头【不会自动不断拍摄图像并保存，它只是准备好了读取帧数据】
# 若要从摄像头读取图像，需要使用 camera.read() 方法。【每次调用该方法时，都会获取当前的一帧图像】
# 获取的图像默认不会被保存。如果需要保存图像，需要在代码中显式地将图像保存到文件，例如使用 cv2.imwrite('filename.jpg', frame)。
# 如果不进行任何读取操作或保存操作，【摄像头虽然处于激活状态，但不会产生任何图像文件】
camera = cv2.VideoCapture(0)
if not camera.isOpened():
    print("error: 无法打开摄像头")
    exit()

# 3 定义视频编码器和输出文件
#
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
    cv2.VideoWriter_fourcc(*'XVID'),    # 用于标识视频编解码器的4字节代码，*'XVID'语法是解包操作符，用于将字符串中的每个字符作为单独的参数传递给函数。
    fps,
    (video_width, video_height)
)

# 用于保存最后一帧，保存是在跳出主循环之后进行，因此需要一个变量来保存
last_frame = None

# 4 以上初始化完毕后进入主循环，不断读取当前帧写入video_writer
while True:
    success, frame = camera.read()
    if not success:
        print("error 无法获取帧")
        break

    # 显示图像以便能看到摄像头实时帧
    cv2.imshow('Camera', frame)

    # 把每一帧写入视频对象，注意，不是磁盘
    # write 会将帧数据写入到内存缓冲区，而不是直接写入到磁盘。
    # 
    # 在大多数情况下，cv2.VideoWriter 会定期将缓冲区中的数据刷新到磁盘，以防止缓冲区溢出。但是，这种刷新行为是不可控的，具体刷新时机取决于内部实现。
    # 如果不调用 video_writer.release()，即使有部分数据被刷新到磁盘，文件可能仍然处于不完整或损坏的状态，导致无法正常播放。
    # 因此，为了确保视频文件的完整性和正确性，必须在所有帧写入完成后调用 video_writer.release()。
    #
    # video_writer.write(frame) 主要将数据写入内存缓冲区。可能会有部分数据被自动刷新到磁盘，但这是不可控的。
    video_writer.write(frame)

    # waitKey等待用户输入，参数1表示阻塞等待1ms，
    # cv2.waitKey(0) 或 cv2.waitKey() 会阻塞等待用户按键事件
    #
    # 在某些操作系统和Python环境中，cv2.waitKey(1) 返回的值可能是一个32位整数，使用 & 0xFF 可以确保只保留最低的8位，确保返回值是一个有效的8位ASCII码值。
    key = cv2.waitKey(1) & 0xFF
    # 按下 'q' 键保存最后一帧并退出
    if key == ord('q'): # ord 函数接受一个长度为1的字符串，返回该字符的 Unicode 码点。字符 'q' 的 ASCII 码值 113。
        last_frame = frame
        break   # release时才会完全把视频数据保存到磁盘

# 保存最后一帧
if last_frame is not None:
    frame_path = os.path.join(output_dir, 'last_frame.jpg')
    cv2.imwrite(frame_path, last_frame)
    print(f"保存最后一帧: {frame_path}")

# 保存视频
#
# 调用 video_writer.release() 会将缓冲区中的数据写入磁盘并关闭文件。因此，必须调用 video_writer.release() 才能确保视频文件被正确保存。
video_writer.release()

camera.release()
cv2.destroyAllWindows()
