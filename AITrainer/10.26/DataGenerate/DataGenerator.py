"""
请帮我生成一个用户购买商品行为数据集，
数据集包括商品、购买日期、购买价格、用户ID，商品包括"Clothing"（服装）、"Shoes"（鞋子）、"Books"（书籍）、
"Cosmetics"（化妆品）、"Toys"（玩具）、"Food & Beverage"（食品和饮料）、"Technology"（科技产品），
数据集规模为5000条，这个数据集将用于构造RFM模型

"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# 定义商品类别
categories = ["Clothing", "Shoes", "Books", "Cosmetics", "Toys", "Food & Beverage", "Technology"]

# 生成随机数据
np.random.seed(42)  # 设置随机种子以确保可重复性

# 生成用户ID
user_ids = [f"User_{i}" for i in range(1, 1001)]  # 假设有1000个用户

# 生成购买日期
start_date = datetime(2021, 1, 1)
end_date = datetime(2023, 12, 31)

# 生成数据集
data = {
    "Product": np.random.choice(categories, size=5000),
    "PurchaseDate": [start_date + timedelta(days=np.random.randint((end_date - start_date).days)) for _ in range(5000)],
    "Price": np.random.uniform(10, 1000, size=5000),  # 价格在10到1000之间
    "UserID": np.random.choice(user_ids, size=5000)
}

# 创建DataFrame
df = pd.DataFrame(data)

# 将日期格式化为字符串
df["PurchaseDate"] = df["PurchaseDate"].dt.strftime("%Y-%m-%d")

# 保存数据集到CSV文件
df.to_csv("user_purchase_data.csv", index=False)

print("数据集已生成并保存到 user_purchase_data.csv")