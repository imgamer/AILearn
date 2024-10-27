"""
类似excel数据透视表的思路统计分析
DataFrame的应用，DataFrame理解为一个excel表，提供各种强大的功能
"""
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np  # 基础的数据分析库
import matplotlib.pyplot as ptl # 绘图

from sklearn.cluster import KMeans  # 聚类函数，模型函数
from sklearn.preprocessing import StandardScaler    # 数据差异较大？标准差标准化 (x - / avg )/ std
 # 存在姜维的情况，需要做降维
from sklearn.decomposition import PCA

# 1. 读取数据
# data数据类型是DataFrame，Series
data = pd.read_csv("user_purchase_data.csv")

print(data.head)

# 数据集的用户数量
print("数据集的用户数量：", data['UserID'].nunique())

# 有多少种商品
print("有多少种商品：", data['Product'].nunique())

# 每种商品的销售金额总和，可视化
# data.groupby 分组聚合函数，获得一个对象，使用它的统计函数，例如count
#result1 = data.groupby('Product').count().sum() # 分组一句是 Product
result1 = data.groupby('Product')['Price'].sum()    # 只计算价格
print(result1)


# 直方图
# 可视化可以是对result1做直方图
# plt.rcParams 设置图形格式，plt库对中文支持不好，可以通过大模型来调整合适的值
plt.rcParams['font.sans-serif'] = "SimHei"
plt.rcParams['axes.unicode_minus'] = False  # 设置为黑体后要单独设置负号的格式
# 绘图步骤：
# 1 添加画布（可省略）
plt.figure(figsize=(10, 6))
# 2 绘制图形，直方图是bar
plt.bar(range(0, 2*len(result1), 2),result1)   # X轴数据，Y轴数据
plt.xticks(range(0, 2*len(result1), 2), result1.index, rotation = 45)    # 刻度
plt.title('商品销售金额总和')
plt.show()

# 每个月销售金额折线图

# 构造RFM模型
# 1 准备数据
# 2 构建模型
# 做时间类型数据的转换
data['PurchaseDate'] = pd.to_datetime(data['PurchaseDate'])
rfm = pd.DataFrame()
# 关注用户的情况，对用户进行分组
group = data.groupby('UserID')
rfm['R'] = pd.Timestamp('2024.10.26') - group['PurchaseDate'].max()
# 获取R列中的天
rfm['R'] = rfm['R'].apply(lambda x: x.days)
print(rfm)

# F是这个用户在这个时间范围内买了多少次
#rfm['F']

# 步骤2 构建模型

# 步骤3 训练模型
# 训练集和测试集的使用，先不做，下节课讲

# 步骤4 模型训练好了，开始做预测


rfm['F'] = group['Price'].count()

rfm['M'] = group['Price'].sum()
print(rfm)
# 步骤2：构建模型
model = KMeans(n_clusters=4, n_init=10)
# 步骤3：训练模型
model = model.fit(rfm)
# 步骤4：模型训练好了，可以做预测
print(model.predict([[1,2,1000]]))
rfm['tag'] = model.labels_
print(rfm)
print('中心点',model.cluster_centers_)

# 数据集可视化，把3个特征转为2个特征，叫做降维，在训练模型之前会做降维
# fit 是训练
#绘制散点图
# 数据集可视化
# 降维
rfm_pca = PCA(n_components=2).fit_transform(rfm[['R','F','M']])
print(rfm_pca)

# ,分割行列，:表示所有行，每调用一次sctter，点的颜色就会自动换
for i in range(0,4):
    plt.scatter(rfm_pca[rfm['tag'] == i,0], rfm_pca[rfm['tag'] == i,1])
plt.legend(['用户群0','用户群1','用户群2','用户群3'])
plt.show()

# 模型评价
score1 = []
from sklearn.metrics import silhouette_score,calinski_harabasz_score
for i in range(3,10):
    model = KMeans(i, n_init=10).fit(rfm[['R','F','M']])    # 加上  n_init=10避免警告
    score1.append(silhouette_score(rfm[['R','F','M']], model.labels_))
    score2 = calinski_harabasz_score(rfm[['R','F','M']], model.labels_)
    print(i,score2)
plt.plot(range(3,10), score1)
plt.show()