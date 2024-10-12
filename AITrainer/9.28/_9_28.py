
"""
- 运行环境
注意：Python环境需要安装Pandas库
pip install pandas 或 conda install pandas

推荐在Anaconda的虚拟python环境中运行:
conda create -n 9.28 python=3.12
conda activate 9.28
[D: & cd D:\Path\to\your\folder]
pip install pandas [openpyxl]
python _9_28.py

- 使用Jupter调试
如果使用的是 Jupyter Notebook 或 Jupyter Lab，也可以在 Conda 环境中运行其他目录中的 Python 代码。
启动 Jupyter Notebook/Lab：jupyter notebook，或者 jupyter lab
导航到目标目录： 在 Jupyter Notebook 或 Jupyter Lab 中，导航到包含 Python 脚本的目录。
运行脚本： 在 Jupyter Notebook 或 Jupyter Lab 中，可以直接运行脚本中的代码。

- 注意事项
测试用到的模块：
from importlib import reload
reload(_9_28)

如果pandas模块需要读取excel文件，需要同时安装excel读取模块，默认使用：
pip install xlrd

动态数据类型意味着变量的类型是在运行时确定的，而不是在编译时确定的，在 Python 中，给变量赋值时，变量的类型自动根据赋值的内容来确定。

- 参考资料

---
作业题目：
1. Python 的基本数据类型有哪些，以及它们的特点和用途分别是什么?
python基本数据类型	特性	用途
整数(int)	支持算术运算	表示整数
浮点数（float）	支持算术运算	表示小数
复数（complex）	支持算术运算	表示复数
字符串（str）	可以进行索引和切片操作	表示文本
布尔（bool）	只有True和False 2个值，支持逻辑运算	用于条件语句
空值（None）	具有唯一性，用来表示空值	用于函数返回值和变量初始化

2. 请简述Excel中函数的输入规则和参数设置的注意事项。
2.1. 函数输入规则：
在单元格中以`=`号开头，接着是函数名称，然后输入参数值，参数之间用`,`分隔。
2.2. 函数参数设置：
函数参数设置是指在函数调用时，为函数提供具体的参数值。注意参数的数量和类型要正确，会有数值、文本、范围、逻辑值、日期、时间等。
参数来源可以是直接输入，也可以是引用其它单元格的值。如果函数返回错误，要注意检查参数是否输入正确。

3. 什么是数据框(DataFrame)，以及它在Pandas库中的重要性体现在哪些方面？
数据框（DataFrame）是Pandas库提供的一种二维表格型的数据结构，用于存储数据，具有行和列的概念，可以进行数据操作和计算。
重要性在于它可以存储不同类型的数据（如整数、浮点数、字符串等）。方便的进行数据组织、操作、清洗、转换，
可以和各种数据来源（Excel、json、数据库）直接读写交互，还可以和其它Python数据科学库（如 NumPy, Matplotlib 等）高度集成，便于数据分析和可视化。

DataFrame 是 Pandas 库中的核心数据结构之一，类似于电子表格或 SQL 表，具有行和列的概念。

4. 在Pandas库中，如何使用DataFrame进行数据导入和导出？
见代码示例。

"""

def testBaseDataType():
    print("- Python 基本数据类型:")
    # 数值类型
    a = 1
    print("a = 1, type is", type(a))
    a = 1.0 
    print("a = 1.0, type is", type(a))
    a = 1 + 2j
    print("a = 1 + 2j, type is", type(a))

    a = True
    print("a = True, type is", type(a))

    a = "hello"
    print("a = 'hello', type is", type(a))

    a = None
    print("a = None, type is", type(a))

    print()
    print("- Python 容器数据类型：")

    a = []
    print("a = [], type is", type(a))

    a = {}
    print("a = {}, type is", type(a))

    a = ()
    print("a = (), type is", type(a))

    a = set()
    print("a = set(), type is", type(a))


    print()
    print("- Python 常用对象类型：")
    a = range(10)
    print("a = range(10), type is", type(a))

    a = frozenset()
    print("a = frozenset(), type is", type(a))

    a = bytearray()
    print("a = bytearray(), type is", type(a))

    a = slice(1, 2, 3)
    print("a = slice(1, 2, 3), type is", type(a))

    a = type
    print("a = type, type is", type(a))

    a = zip
    print("a = zip, type is", type(a))

    a = __debug__
    print("a = __debug__, type is", type(a))

    a = __name__
    print("a = __name__, type is", type(a))


def testPandasDataFrame():
    """
    测试 Pandas DataFrame
    读取 csv 文件，并转换为DataFrame对象，输出指定数据
    """
    print("--- 测试 Pandas DataFrame:")
    import pandas as pd

    # 创建一个简单的 DataFrame
    data = {
        'Name': ['Alice', 'Bob', 'Charlie'],
        'Age': [25, 30, None],
        'City': ['New York', 'Los Angeles', 'Chicago']
    }
    df = pd.DataFrame(data)
    print(df)

    # 数据清洗
    df.dropna(inplace=True)        # 删除含有缺失值的行，删除了Charlie
    df.fillna(0, inplace=True)     # 填充缺失值

    # 数据选择和筛选
    names = df['Name']             # 选择特定列
    young_people = df[df['Age'] < 30] # 选择符合条件的行

    # 数据转换
    df['Age'] = df['Age'].apply(lambda x: x + 1)    # 应用函数
    df = df.T   # 重塑数据结构

    # 数据聚合与统计
    #age_stats = df.groupby('City')['Age'].mean()        # 分组并计算平均年龄

    # 数据可视化，使用matplotlib库绘制图表
    #df.plot(kind='bar', x='City', y='Age')
    # import matplotlib.pyplot as plt
    # plt.show()

    print('--- afters dropna and fillna')
    print(df)

    # 读取csv文件，转换为DataFrame对象
    # 保存为 CSV 文件
    csv_file = 'test.csv'
    df2 = pd.read_csv(csv_file, encoding='gbk') # 注意指定编码，默认是utf-8
    print()
    print('--- read csv file')
    print(df2)

if __name__ == '__main__':
    testBaseDataType()
    testPandasDataFrame()

