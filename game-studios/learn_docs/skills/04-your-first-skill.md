# 第四课：创建你的第一个 Skill

> ⏱️ 预计学习时间：1小时\
> 🎯 目标：通过实践，完整体验从构思到测试的 Skill 创建流程

***

## 🎯 本课概览

在这节课中，你将：

1. ✅ 选择一个真实的场景
2. ✅ 设计 Skill 的结构
3. ✅ 编写完整的 Skill 文件
4. ✅ 测试和调试你的 Skill
5. ✅ 迭代改进

***

## 场景选择：代码片段生成器

### 场景描述

你在开发过程中经常需要生成一些通用的代码片段：

- 单例模式
- 观察者模式
- 状态机框架
- 简单的类模板

每次手动编写很耗时，而且容易出错。你希望有一个 Skill 可以快速生成这些常用代码模式。

### 需求分析

**输入：**

- 代码模式名称（如 "singleton", "observer"）
- 可选：类名、命名空间等自定义参数

**输出：**

- 生成的代码文件
- 代码说明和使用示例

**约束：**

- 生成的代码必须符合项目编码规范
- 代码必须包含适当的注释
- 生成的代码应该是可以直接使用的

***

## 步骤 1：确定 Skill 类型

根据前面的学习，我们需要确定这个 Skill 应该是什么类型。

**分析：**

- 这是一个单一的、原子性的任务（生成代码片段）
- 步骤相对简单：识别模式 → 生成代码 → 保存文件
- 不需要多个智能体协作
- 不需要复杂的条件分支或循环

**结论：** 这是一个 **Type 1（单一任务 Skill）**

***

## 步骤 2：设计 Frontmatter

现在我们来设计 Skill 的元数据。

### 基础信息

```yaml
name: code-snippet
description: "Generate common code patterns and snippets (singleton, observer, state machine, etc.)"
```

### 调用方式

```yaml
user-invocable: true
argument-hint: "[pattern-name] [options]"
```

### 工具权限

这个 Skill 需要：

- 读取项目配置（`Read`）
- 生成代码文件（`Write`）
- 检查现有文件结构（`Glob`）
- 可能需要搜索现有代码（`Grep`）

```yaml
allowed-tools: [Read, Write, Glob, Grep]
```

### 完整 Frontmatter

```yaml
---
name: code-snippet
description: "Generate common code patterns and snippets (singleton, observer, state machine, class template, etc.)"
argument-hint: "[pattern-name] [--class=ClassName] [--namespace=Namespace]"
user-invocable: true
allowed-tools: [Read, Write, Glob, Grep]
---
```

***

## 步骤 3：设计 When 块

现在我们来设计 Skill 的执行逻辑。

### 步骤规划

1. **解析输入参数**
   - 解析模式名称
   - 解析可选参数（类名、命名空间等）
2. **读取项目配置**
   - 读取 CLAUDE.md 了解技术栈
   - 读取编码规范（如果有）
3. **验证和准备**
   - 验证模式名称是否支持
   - 确定输出文件路径
   - 检查是否已存在同名文件
4. **生成代码**
   - 根据模式生成代码模板
   - 应用自定义参数（类名、命名空间）
   - 添加适当的注释
5. **保存和输出**
   - 将代码写入文件
   - 提供使用示例
   - 输出文件路径和说明

### 完整 When 块

```markdown
When this skill is invoked:

1. **Parse the input arguments**
   - Extract the pattern name (first argument)
   - Parse optional flags:
     - `--class=ClassName` or `-c ClassName`
     - `--namespace=Namespace` or `-n Namespace`
     - `--output=path` or `-o path`
   - If pattern name is missing or "help", show usage and available patterns

2. **Read project configuration**
   - Read `CLAUDE.md` to determine:
     - Programming language
     - Engine/framework (if applicable)
     - Coding standards location
   - Read `.claude/docs/coding-standards.md` if exists

3. **Validate and prepare**
   - Check if pattern is supported. Available patterns:
     - `singleton` - Singleton pattern implementation
     - `observer` - Observer pattern with subject and observer
     - `state-machine` - Basic state machine framework
     - `class-template` - Generic class template with comments
   - Determine output file name:
     - From `--output` flag, OR
     - Auto-generate from class name and pattern (e.g., `GameManager.Singleton.cs`)
   - Check if file already exists:
     - If yes: Ask user to overwrite, append, or cancel
     - If no: Proceed

4. **Generate the code**
   
   For `singleton` pattern:
```

Generate singleton implementation with:

- Private static instance field
- Public static Instance property with lazy initialization
- Private constructor
- Thread-safety consideration (if applicable for language)
- Proper XML/docstring comments

```

For `observer` pattern:
```

Generate:

- IObserver<T> interface with Update method
- ISubject<T> interface with Attach/Detach/Notify methods
- Concrete Subject implementation
- Example concrete Observer implementation

```

[其他模式类似...]

Apply customization:
- Replace placeholder class names with provided --class
- Replace placeholder namespace with provided --namespace
- Add file header comment with pattern name and generation date

5. **Save and output**
- Write generated code to the determined file path
- Output to user:
  - Success message with file path
  - Brief description of what was generated
  - Usage example showing how to use the generated code
  - Any important notes or TODOs (e.g., "Add your business logic in the Update method")

### Important Constraints

- Never overwrite existing files without explicit user confirmation
- Generated code must follow the project's established coding standards
- All generated code must include appropriate comments and documentation
- If the target language/framework is not supported, clearly state this and exit gracefully
- Do not generate business logic - only the pattern structure and boilerplate
- Thread-safety considerations must be noted in comments, even if not fully implemented
```

***

## 步骤 4：完整 Skill 文件

将以上所有部分组合起来，我们就得到了完整的 Skill 文件：

**文件路径：** `.claude/skills/code-snippet/SKILL.md`

```markdown
---
name: code-snippet
description: "Generate common code patterns and snippets (singleton, observer, state machine, class template, etc.)"
argument-hint: "[pattern-name] [--class=ClassName] [--namespace=Namespace]"
user-invocable: true
allowed-tools: [Read, Write, Glob, Grep]
---

When this skill is invoked:

[前面编写的完整 When 块内容...]

### Important Constraints

[前面编写的约束内容...]
```

***

## 步骤 5：测试你的 Skill

创建完 Skill 文件后，你需要进行测试：

### 测试清单

- [ ] **文件位置检查**：确认文件在 `.claude/skills/code-snippet/SKILL.md`
- [ ] **语法检查**：确保 YAML Frontmatter 格式正确（可以使用 YAML 验证工具）
- [ ] **基本调用测试**：在 Claude Code 中输入 `/code-snippet help`
- [ ] **参数测试**：测试带参数的调用 `/code-snippet singleton --class=GameManager`
- [ ] **边界测试**：
  - 测试无效的模式名称
  - 测试缺少必需参数
  - 测试文件已存在的情况
- [ ] **输出验证**：检查生成的代码质量和格式

### 调试技巧

1. **如果 Skill 没有出现**：
   - 检查文件路径是否正确
   - 确认 `user-invocable: true`
   - 重启 Claude Code 会话
2. **如果执行报错**：
   - 检查 YAML Frontmatter 语法
   - 确认 `allowed-tools` 包含需要的工具
   - 查看 Claude Code 的错误输出
3. **如果输出不符合预期**：
   - 检查 When 块的指令是否清晰
   - 添加更多约束条件
   - 提供示例输出格式

***

## 步骤 6：迭代改进

基于测试结果，对 Skill 进行迭代改进：

### 常见改进点

1. **增强错误处理**：
   ```markdown
   3. **Validate and prepare**
      - Check if pattern is supported
      - If not supported: 
        - List available patterns
        - Ask user to select or exit
   ```
2. **提供更多示例**：
   ````markdown
   5. **Save and output**
      - Output usage example:
        ```csharp
        // Example usage
        GameManager.Instance.Initialize();
        GameManager.Instance.OnGameStateChanged += HandleStateChange;
        ```
   ````
3. **增加自定义选项**：
   - 添加更多命令行参数
   - 支持配置文件
   - 提供交互式提示

***

## ✅ 本课小结

### 核心知识点

1. **创建 Skill 的 6 个步骤**：
   - 确定 Skill 类型
   - 设计 Frontmatter
   - 编写 When 块
   - 组合成完整文件
   - 测试
   - 迭代改进
2. **Skill 文件结构**：
   ```
   ---
   [Frontmatter - YAML 元数据]
   ---

   When this skill is invoked:
   [When 块 - 执行逻辑]

   ### Important Constraints
   [约束条件]
   ```
3. **测试清单**：
   - 文件位置正确
   - YAML 语法正确
   - 基本调用正常
   - 参数处理正确
   - 边界情况处理
   - 输出质量合格

### 关键技能

完成本课后，你应该能够：

- [ ] 从零创建一个完整的 Skill
- [ ] 为 Skill 设计清晰的执行步骤
- [ ] 编写规范的 Frontmatter
- [ ] 测试并调试 Skill
- [ ] 根据反馈迭代改进

### 下一步

➡️ **[第五课：Skill 工作坊 →](./05-skill-workshop.md)**

通过一个完整的实战项目，深入理解 Skill 设计的最佳实践和常见陷阱。

***

## 📝 课后作业

### 作业 1：完善 `code-snippet` Skill

将你刚才创建的 `code-snippet` Skill 补充完整：

1. 添加至少 2 个额外的代码模式（如 `state-machine`, `class-template`）
2. 为每个模式提供完整的代码生成逻辑
3. 添加更多自定义选项（如 `--include-tests` 生成单元测试框架）
4. 添加详细的帮助信息（当用户输入 `/code-snippet help` 时显示）

### 作业 2：创建一个新 Skill

选择一个你日常工作中经常重复的任务，创建一个 Type 1 或 Type 2 的 Skill：

**一些想法：**

- `/todo-create` - 从自然语言创建结构化的 TODO 列表
- `/meeting-notes` - 整理会议记录，提取行动项
- `/bug-template` - 生成标准化的 bug 报告模板
- `/api-test` - 生成 API 测试代码框架

**要求：**

- 完成完整的 SKILL.md 文件
- 包含清晰的文档字符串
- 处理至少 2 种边界情况
- 提供使用示例

***

## 📚 参考资源

- [完整 Skill 示例：/prototype](../.claude/skills/prototype/SKILL.md) - Type 2 工作流
- [完整 Skill 示例：/changelog](../.claude/skills/changelog/SKILL.md) - Type 1 单一任务
- [完整 Skill 示例：/team-combat](../.claude/skills/team-combat/SKILL.md) - Type 3 团队编排
- [YAML 语法速查](https://quickref.me/yaml)
- [Markdown 语法指南](https://www.markdownguide.org/)

