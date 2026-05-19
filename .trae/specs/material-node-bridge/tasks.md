# MaterialNodeBridge 实现任务清单

## 任务概述

基于 BlueprintNodeBridge 插件的实现，开发 MaterialNodeBridge 插件，实现材质节点的 T3D 和短代码格式转换功能。

---

## 任务 1: 创建项目基础结构

- [x] 1.1 创建 MaterialNodeBridge.uplugin 插件描述文件
- [x] 1.2 创建 MaterialNodeBridge.Build.cs 构建配置
- [x] 1.3 创建目录结构（Public/Private/Resources）

## 任务 2: 实现核心类

### 2.1 MaterialNodeBridge 模块主类
- [x] 2.1.1 创建 MaterialNodeBridge.h 模块接口定义
- [x] 2.1.2 创建 MaterialNodeBridge.cpp 模块启动/关闭逻辑
- [x] 2.1.3 实现菜单注册（材质编辑器工具栏）
- [x] 2.1.4 实现命令绑定（复制/粘贴/整理）
- [x] 2.1.5 实现缓存管理（加载/保存）
- [x] 2.1.6 实现编辑器焦点检测

### 2.2 MaterialNodeBridgeCommands 命令类
- [x] 2.2.1 创建命令结构体定义
- [x] 2.2.2 实现命令注册/注销

### 2.3 MaterialNodeBridgeStyle 样式类
- [x] 2.3.1 创建样式初始化/关闭函数

---

## 任务 3: 实现材质节点解析器

### 3.1 MaterialTextGraphParser 短代码解析器
- [x] 3.1.1 Create MaterialTextGraphParser.h 头文件
- [x] 3.1.2 实现 GenerateShortCode() - 生成材质节点短代码
- [x] 3.1.3 实现 ParseAndPaste() - 解析并粘贴材质节点
- [x] 3.1.4 实现引脚名称映射（表达式输入/输出名称）
- [x] 3.1.5 实现转义/反转义函数

### 3.2 MaterialExpressionFactory 表达式工厂
- [x] 3.2.1 Create MaterialExpressionFactory.h 头文件
- [x] 3.2.2 实现 CreateExpression() - 根据类型创建表达式
- [x] 3.2.3 实现 SetExpressionProperties() - 设置表达式属性
- [x] 3.2.4 实现常量表达式属性设置
- [x] 3.2.5 实现向量表达式属性设置
- [x] 3.2.6 实现纹理表达式属性设置
- [x] 3.2.7 实现参数表达式属性设置

### 3.3 MaterialNodeRegistry 节点注册表
- [x] 3.3.1 Create MaterialNodeRegistry.h 头文件
- [x] 3.3.2 定义 FMaterialNodeInfo 结构体
- [x] 3.3.3 实现数学运算节点映射（Constant, Add, Multiply 等）
- [x] 3.3.4 实现向量操作节点映射（ComponentMask, Append 等）
- [x] 3.3.5 实现纹理采样节点映射（TextureSample, TextureObject 等）
- [x] 3.3.6 实现参数节点映射（ScalarParameter, VectorParameter 等）
- [x] 3.3.7 实现材质属性节点映射（Fresnel, BumpOffset 等）

---

## 任务 4: 实现材质节点布局

### 4.1 MaterialGraphFormatter 布局格式化器
- [x] 4.1.1 Create MaterialGraphFormatter.h 头文件
- [x] 4.1.2 实现节点布局信息结构体
- [x] 4.1.3 实现层级分配算法（BFS）
- [x] 4.1.4 实现节点位置计算
- [x] 4.1.5 实现位置应用逻辑

---

## 任务 5: 创建资源文件

- [x] 5.1 创建 Resources/AIRules.json AI 生成规则文件

---

## 任务 6: 集成测试

- [ ] 6.1 测试单节点复制粘贴（Constant 节点）
- [ ] 6.2 测试数学运算链复制粘贴（Add -> Multiply）
- [ ] 6.3 测试纹理采样节点复制粘贴
- [ ] 6.4 测试参数节点复制粘贴
- [ ] 6.5 测试节点布局功能
- [ ] 6.6 测试缓存持久化
- [ ] 6.7 测试撤销/重做

---

## 任务依赖关系

```
任务 1 (项目结构)
    │
    ├──▶ 任务 2.1 (模块主类) ──▶ 任务 2.2 (命令类) ──▶ 任务 2.3 (样式类)
    │
    └──▶ 任务 3.3 (节点注册表)
            │
            └──▶ 任务 3.2 (表达式工厂) ──▶ 任务 3.1 (短代码解析器)
                    │
                    └──▶ 任务 4.1 (布局格式化器)
                            │
                            └──▶ 任务 5 (资源文件)
                                    │
                                    └──▶ 任务 6 (集成测试)
```

---

## 验证方式

1. 编译插件无错误
2. 在材质编辑器中加载插件
3. 选中节点并执行"复制为短代码"
4. 粘贴短代码并验证节点创建
5. 检查材质编译是否成功
