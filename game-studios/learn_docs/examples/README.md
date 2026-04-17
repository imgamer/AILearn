# Skill 示例代码库

这里提供了多个完整的 Skill 示例，从简单到复杂，供学习和参考。

## 示例列表

### 入门级别

| 示例 | 类型 | 描述 | 学习重点 |
|------|------|------|----------|
| [01-hello-world](./01-hello-world/) | Type 1 | 最简单的 Skill，问候用户 | 基本结构、参数解析 |
| [02-file-info](./02-file-info/) | Type 1 | 显示文件信息 | 文件操作、格式化输出 |
| [03-code-counter](./03-code-counter/) | Type 1 | 统计代码行数 | Glob、Grep 使用 |

### 中级

| 示例 | 类型 | 描述 | 学习重点 |
|------|------|------|----------|
| [04-project-init](./04-project-init/) | Type 2 | 初始化项目结构 | 多步骤流程、文件生成 |
| [05-readme-generator](./05-readme-generator/) | Type 2 | 生成 README 文档 | 模板处理、交互式输入 |
| [06-api-tester](./06-api-tester/) | Type 2 | API 测试工具 | 外部命令执行、结果解析 |

### 高级

| 示例 | 类型 | 描述 | 学习重点 |
|------|------|------|----------|
| [07-code-review-team](./07-code-review-team/) | Type 3 | 多智能体代码审查 | 多智能体编排、结果整合 |
| [08-feature-implementation](./08-feature-implementation/) | Type 3 | 端到端功能开发 | 复杂工作流、阶段管理 |
| [09-skill-manager](./09-skill-manager/) | Type 4 | Skill 管理工具 | 元 Skill、文件操作 |

## 如何使用示例

### 方式 1：学习阅读

1. 从入门级别开始，按顺序阅读
2. 重点关注 `SKILL.md` 文件
3. 理解每一步的设计意图
4. 对比不同示例的差异

### 方式 2：动手实践

```bash
# 1. 复制示例到项目的 Skill 目录
cp -r learn_docs/examples/01-hello-world .claude/skills/my-hello

# 2. 修改为你自己的版本
# 编辑 .claude/skills/my-hello/SKILL.md

# 3. 在 Claude Code 中测试
# 输入 /my-hello
```

### 方式 3：作为模板

使用示例作为基础模板，快速创建新 Skill：

1. 找到最接近你需求的示例
2. 复制并修改元数据（name, description 等）
3. 替换执行逻辑为你的需求
4. 调整约束条件
5. 测试并迭代

---

## 示例详解

### 01-hello-world

**文件：** `01-hello-world/SKILL.md`

**学习目标：**
- 理解最基本的 Skill 结构
- 学习 Frontmatter 配置
- 掌握 When 块的基本格式
- 练习参数解析

**代码亮点：**
- 简单的 if/else 分支
- 用户输入处理
- 文件创建基础

**扩展练习：**
- 添加更多问候语选项
- 支持多语言问候
- 记录问候历史到文件

---

### 02-file-info

**文件：** `02-file-info/SKILL.md`

**学习目标：**
- 使用 `Read` 工具获取文件信息
- 使用 `Bash` 执行系统命令
- 格式化输出信息
- 错误处理（文件不存在等）

**代码亮点：**
- 多种信息收集方式
- 表格格式化输出
- 边界情况处理

---

### 03-code-counter

**文件：** `03-code-counter/SKILL.md`

**学习目标：**
- 使用 `Glob` 批量查找文件
- 使用 `Grep` 分析代码内容
- 统计和分类代码
- 生成汇总报告

**代码亮点：**
- 文件过滤和分类
- 正则表达式应用
- 数据聚合和展示

---

### 04-project-init

**文件：** `04-project-init/SKILL.md`

**学习目标：**
- 设计多步骤工作流
- 创建多个文件和目录
- 从模板生成内容
- 处理用户配置选项

**代码亮点：**
- 清晰的阶段划分
- 模板变量替换
- 配置验证

---

### 05-readme-generator

**文件：** `05-readme-generator/SKILL.md`

**学习目标：**
- 交互式信息收集
- 模板处理引擎
- 多格式输出
- 智能默认值

**代码亮点：**
- 动态表单生成
- 条件模板渲染
- 预览和确认机制

---

### 06-api-tester

**文件：** `06-api-tester/SKILL.md`

**学习目标：**
- 外部命令执行
- 结果解析和处理
- 错误恢复策略
- 测试报告生成

**代码亮点：**
- 多测试场景覆盖
- 结果对比分析
- 详细日志记录

---

### 07-code-review-team

**文件：** `07-code-review-team/SKILL.md`

**学习目标：**
- 多智能体编排
- 并行任务管理
- 结果整合和冲突解决
- 团队协调模式

**代码亮点：**
- 角色分工明确
- 阶段检查点设计
- 智能冲突处理

---

### 08-feature-implementation

**文件：** `08-feature-implementation/SKILL.md`

**学习目标：**
- 端到端工作流设计
- 复杂状态管理
- 多会话协作
- 里程碑追踪

**代码亮点：**
- 完整生命周期覆盖
- 灵活的阶段管理
- 详细的进度报告

---

### 09-skill-manager

**文件：** `09-skill-manager/SKILL.md`

**学习目标：**
- 元 Skill 设计
- 文件系统操作
- Skill 分析和优化
- 批量处理模式

**代码亮点：**
- 递归 Skill 调用
- 复杂的文件操作
- 智能分析和建议

---

## 贡献新示例

如果你有好的 Skill 示例想要分享：

1. 在 `examples/` 目录下创建新文件夹
2. 按照现有示例的结构组织文件
3. 编写详细的 README 说明
4. 提交 Pull Request

让我们一起丰富这个学习资源库！
