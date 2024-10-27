import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler # (x - avg) / std
from sklearn.decomposition import PCA

# 1. 读取数据集
data = pd.read_csv('purchase_behavior_data.csv')  # data是一个DataFrame数据类型，Series
print(data.head())
# 2. 基本的统计信息
# 有多少个用户
print("数据集的用户数量：", data['User_ID'].nunique())
# 有多少种商品？
print("商品种类：", data['Category'].unique())  # unique是唯一值
# 每种商品的销售金额总和，可视化
res1 = data.groupby('Category')['Price'].sum()  # groupby是分组聚合函数，分组依据是Category列
print(res1)
# 直方图
plt.rcParams['font.sans-serif'] = "SimHei"
plt.rcParams['axes.unicode_minus'] = False
#绘图步骤1：添加画布（可省略）
plt.figure(figsize=(8,6))
# 绘图步骤2：绘制图形
# X轴数据range(0,2*(len(res1)),2),生成一个序列，序列前后数字差为2，比如0,2,4,6,8，。。。
# Y轴就是金额总和，X和Y的数据长度要一样
plt.bar(range(0,2*(len(res1)),2),res1) # x轴数据，y轴数据
# 绘图步骤3：添加图例、标签等美化图标
plt.xticks(range(0,2*(len(res1)),2), res1.index, rotation = 45)
plt.title("商品销售金额总和")
plt.show()


# 每个月的销售金额折线图

# 构造RFM模型
# 步骤1：准备数据
# 时间类型转换
data['Purchase_Date'] = pd.to_datetime(data['Purchase_Date'])
rfm = pd.DataFrame()
# 对用户进行分组
group = data.groupby('User_ID')
rfm['R'] = pd.Timestamp('2024.10.26') - group['Purchase_Date'].max()
# 获取R列中的天
rfm['R'] = rfm['R'].apply(lambda x: x.days)

rfm['F'] = group['Price'].count()

rfm['M'] = group['Price'].sum()
print(rfm)
# 步骤2：构建模型
model = KMeans(n_clusters=4)
# 步骤3：训练模型
model = model.fit(rfm)
# 步骤4：模型训练好了，可以做预测
print(model.predict([[1,2,1000]]))

rfm['tag'] = model.labels_ # 获取每一行数据的标签
print(rfm)
print("中心点:", model.cluster_centers_) # 获取每一类标签的中心点

# 数据集可视化
# 降维，目标维度2
rfm_pca = PCA(n_components=2).fit_transform(rfm[['R','F','M']])
print(rfm_pca)

# 绘制散点图
for i in range(0,4):
    plt.scatter(rfm_pca[rfm['tag'] == i,0], rfm_pca[rfm['tag'] == i,1]) # 根据不同类别绘制散点图
plt.legend(['用户群0','用户群1','用户群2','用户群3'])
plt.show()

# 模型评价
score1 = []
from sklearn.metrics import silhouette_score,calinski_harabasz_score
for i in range(3,10):
    model = KMeans(i).fit(rfm[['R','F','M']])
    score1.append(silhouette_score(rfm[['R','F','M']], model.labels_))
    score2 = calinski_harabasz_score(rfm[['R','F','M']], model.labels_)
    print(i,score2)
plt.plot(range(3,10), score1)
plt.show()

