# Claude Code Game Studios — 游戏工作室Agent架构

通过49个协调的Claude Code子Agent管理独立游戏开发。
每个Agent负责特定领域，强制执行关注点分离和质量保证。

## 技术栈

- **引擎**: [选择：Godot 4 / Unity / Unreal Engine 5]
- **语言**: [选择：GDScript / C# / C++ / Blueprint]
- **版本控制**: Git + 主干开发模式
- **构建系统**: [选择引擎后指定]
- **资源管线**: [选择引擎后指定]

> **注意**: 引擎专家Agent已覆盖Godot、Unity和Unreal，具有专门的子专家。
> 使用与您引擎匹配的集合。

## 项目结构

@.claude/docs/directory-structure.md

## 引擎版本参考

@docs/engine-reference/godot/VERSION.md

## 技术偏好

@.claude/docs/technical-preferences.md

## 协调规则

@.claude/docs/coordination-rules.md

## 协作协议

**用户驱动的协作，而非自主执行。**
每个任务遵循：**提问 → 选项 → 决策 → 起草 → 审批**

- Agent在使用Write/Edit工具前**必须**问"可以写入[文件路径]吗？"
- Agent**必须**在请求审批前展示草稿或摘要
- 多文件变更需要明确审批整个变更集
- 未经用户指示不得提交

详见 `docs/COLLABORATIVE-DESIGN-PRINCIPLE.md` 获取完整协议和示例。

> **首次会话？** 如果项目未配置引擎且没有游戏概念，
> 运行 `/start` 开始引导式入职流程。

## 编码标准

@.claude/docs/coding-standards.md

## 上下文管理

@.claude/docs/context-management.md
