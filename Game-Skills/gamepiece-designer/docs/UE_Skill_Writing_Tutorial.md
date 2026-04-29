# 虚幻引擎 Claude Skill 编写完整教程
参考 ue57-gamepiece-designer 这个技能创建的教程，也编写了一个关于 UE5.7 多玩家存档系统的技能教程。

## 目录
1. [技能核心概念](#一技能核心概念)
2. [技能文件结构](#二技能文件结构)
3. [skill.md 编写指南](#三skillmd-编写指南)
4. [不同类型 UE 技能模板](#四不同类型-ue-技能模板)
5. [实战：创建完整技能](#五实战创建完整技能)
6. [最佳实践与常见陷阱](#六最佳实践与常见陷阱)
7. [测试与调试技能](#七测试与调试技能)

---

## 一、技能核心概念

### 1.1 什么是 Claude Skill？

Claude Skill 是一种**结构化指令集**，告诉 Claude 在特定场景下：
- **何时激活**：什么情况下使用这个技能
- **如何响应**：遵循什么格式和规则
- **输出什么**：产生什么样的结果

### 1.2 UE 技能的典型应用场景

| 场景 | 技能类型 | 示例 |
|------|---------|------|
| 设计游戏系统 | 规划型 | 存档系统、背包系统 |
| 生成代码/蓝图 | 生成型 | C++ 类模板、蓝图节点 |
| 排查问题 | 辅助型 | 崩溃诊断、性能优化 |
| 资产操作 | MCP集成型 | 创建材质、管理骨骼 |

---

## 二、技能文件结构

### 2.1 目录布局

```
.claude/skills/
├── my-ue-skill-0.1.0/              # 技能根目录（版本号必须）
│   ├── skill.md                    # 核心定义文件（必须）
│   ├── examples/                   # 示例目录（可选）
│   │   ├── simple-example.md
│   │   └── advanced-example.md
│   └── templates/                  # 模板目录（可选）
│       └── output-template.txt
```

### 2.2 命名规范

- **文件夹名**：`<skill-name>-<semver>`
  - 例如：`ue57-gamepiece-designer-0.1.0`
  - 使用小写和连字符

- **文件名**：`skill.md`（固定，不可更改）

- **版本号**：语义化版本（MAJOR.MINOR.PATCH）
  - 0.1.0：初始版本
  - 0.2.0：新增功能
  - 1.0.0：稳定发布

---

## 三、skill.md 编写指南

### 3.1 文件结构模板

```markdown
# [技能标题] ([版本])

## What this skill does
[技能功能描述 - 何时触发、做什么]

## Non-negotiable rules (Safety)
[安全规则 - 禁止的操作]

## Output format (always)
[输出格式 - 固定结构]

## [领域规范 1 - 如命名约定]
[具体内容]

## [领域规范 2 - 如默认值]
[具体内容]

## [其他补充...]
```

### 3.2 各部分详解

#### 3.2.1 What this skill does（核心功能）

**目的**：明确告诉 Claude 这个技能在什么场景下被激活，以及它要产出什么。

**写作要点**：
- 以 "When the user..." 开头，明确定义触发条件
- 列出具体产出内容（用 bullet points）
- 提及适用版本（如 UE 5.7）

**示例**：
```markdown
## What this skill does
When the user requests a save/load system for Unreal Engine 5.7, 
especially for multiplayer games, provide a complete, implementation-ready 
design including:
- Save game architecture (single-player vs multiplayer considerations)
- Data serialization strategy (SaveGame objects, JSON, binary)
- Multiplayer synchronization approach (host-authoritative, distributed)
- Async I/O and performance optimization
- Migration/versioning strategy for save data
```

#### 3.2.2 Non-negotiable rules（安全规则）

**目的**：防止 Claude 执行可能有害的操作。

**UE 技能常用安全规则**：
```markdown
## Non-negotiable rules (Safety)
- Do NOT execute any terminal commands or file operations
- Do NOT modify project files directly
- Do NOT generate executable scripts or batch files
- Provide ONLY text-based specifications the user can manually implement
- If the user asks for files, respond with file *contents* they can paste
- Include warnings about data loss risks and backup recommendations
```

#### 3.2.3 Output format（输出格式）

**目的**：确保每次响应的结构一致性。

**示例**：
```markdown
## Output format (always)

### 1. **System Overview**
   - Architecture choice and rationale
   - Key components and their responsibilities

### 2. **Data Architecture**
   - Class/struct definitions
   - Data flow diagram (text-based)

### 3. **Implementation**
   - Step-by-step instructions
   - Code snippets (if applicable)

### 4. **Testing**
   - Validation checklist
   - Common issues and solutions
```

#### 3.2.4 领域特定规范

**命名约定示例**：
```markdown
## Naming Conventions

### Classes
- `A[ProjectPrefix][System][Type]` (e.g., `AMyGameInventoryComponent`)
- `U[ProjectPrefix][System][Type]` for non-actor classes

### Functions
- Verbs: `Get`, `Set`, `Add`, `Remove`, `Calculate`
- Blueprint events: `On[EventName]` (e.g., `OnItemPickedUp`)

### Variables
- Boolean: `bIs[State]`, `bCan[Action]`, `bHas[Thing]`
- Arrays: `[ItemType]Array` or `[ItemType]s`
- Maps: `[Key]To[Value]Map`
```

**默认值示例**：
```markdown
## Default Values

### Replication
- Net update frequency: 100Hz for critical, 10Hz for cosmetic
- Reliable RPCs: Only for critical gameplay events
- Replication mode: `EGameplayAnimMode::PlayAutonomous` for feedback

### Performance
- Max tickable objects: Profile-guided, start with 100
- Async loading: Use for assets >1MB
- Pool size: Based on max concurrent instances
```

---

## 四、不同类型 UE 技能模板

### 4.1 设计/规划型技能（如 gamepiece-designer）

```markdown
# UE5 [System] Designer

## What this skill does
When the user requests a [system] design for Unreal Engine 5, provide a 
structured design ready for implementation...

## Non-negotiable rules
- No file operations
- No script generation
- Text output only

## Output format
1. **Goal**
2. **Inputs**
3. **Outputs**
4. **Assumptions**
5. **Implementation**
   - Blueprint recipe
   - Replication notes
   - Asset naming
6. **Test Checklist**

## Naming conventions
...

## Multiplayer defaults
...
```

### 4.2 代码生成型技能

```markdown
# UE5 Code Generator

## What this skill does
When the user requests UE C++ or Blueprint code generation, provide 
production-ready, copy-pasteable code snippets...

## Non-negotiable rules
- Do NOT write to files
- Do NOT execute any code
- Include header includes and dependencies
- Flag performance-critical sections

## Output format

### 1. **Header File** (.h)
```cpp
// Code here
```

### 2. **Implementation** (.cpp)
```cpp
// Code here
```

### 3. **Blueprint Equivalent** (if applicable)
[Node chain description]

### 4. **Usage Example**
```cpp
// How to use
```

### 5. **Dependencies**
- Required modules
- Include paths
- Third-party libs

## Code style
- UE naming conventions (AClass, UClass, FStruct, bBool)
- Use UE_LOG not std::cout
- Prefer const correctness
- Use TSharedPtr/TWeakPtr for complex ownership
```

### 4.3 调试辅助型技能

```markdown
# UE5 Diagnostics Assistant

## What this skill does
When the user reports UE issues (crashes, errors, unexpected behavior), 
provide systematic diagnosis and resolution guidance...

## Non-negotiable rules
- Do NOT execute commands on user's machine
- Do NOT delete or modify files
- Provide safe, reversible diagnostic steps

## Output format

### 1. **Issue Classification**
- Category: [Crash/Compile/Runtime/Performance]
- Severity: [Critical/Major/Minor]
- Likely cause area: [Rendering/Physics/Networking/etc]

### 2. **Information Gathering**
Questions to ask / info needed:
- [ ] UE version
- [ ] Platform
- [ ] Recent changes
- [ ] Log files
- [ ] Repro steps

### 3. **Diagnostic Steps**
Numbered checklist:
1. Step one
2. Step two
3. ...

### 4. **Common Causes & Solutions**
| Symptom | Likely Cause | Solution |
|---------|-------------|----------|
| ... | ... | ... |

### 5. **Prevention Tips**
- Best practice 1
- Best practice 2
```

### 4.4 MCP 集成型技能

```markdown
# UE5 MCP Tool Controller

## What this skill does
When the user requests UE operations that can be performed via MCP tools,
select and invoke appropriate tools with correct parameters...

## Available Tools Reference

### Blueprint Management
- `mcp__unreal-engine__manage_blueprint`
  - create, add_component, add_variable, add_function, compile

### Asset Management
- `mcp__unreal-engine__manage_asset`
  - list, import, duplicate, delete, create_material

### Actor Control
- `mcp__unreal-engine__control_actor`
  - spawn, delete, set_transform, add_component

### Editor Control
- `mcp__unreal-engine__control_editor`
  - play, stop, pause, console_command, screenshot

## Tool Selection Logic

1. **Parse user request** - Identify the core action
2. **Map to tool** - Find the most specific matching tool
3. **Validate parameters** - Check required vs optional params
4. **Execute** - Call tool with correct parameter structure
5. **Handle response** - Interpret result and provide feedback

## Common Patterns

### Creating a Blueprint
```
User: "Create a pickup blueprint"
→ manage_blueprint, action: create, name: BP_Pickup
→ manage_blueprint, action: add_component, componentType: StaticMeshComponent
```

### Spawning an Actor
```
User: "Spawn a cube at origin"
→ control_actor, action: spawn, classPath: /Engine/BasicShapes/Cube.Cube_C
```

## Parameter Guidelines

### Required Parameters
Always include:
- `action` - The specific operation
- Resource identifier (name, path, or ID)

### Optional Parameters
Include when relevant:
- Location/Rotation/Scale for actors
- Parent class for blueprints
- Properties for customization

## Error Handling

When a tool call fails:
1. Identify the error type (invalid params, resource not found, etc.)
2. Provide a clear explanation to the user
3. Suggest corrective action or alternatives

## Safety Reminders

Even with tools available:
- Confirm destructive operations (delete, overwrite)
- Warn about performance impact of bulk operations
- Suggest backups before major changes
```

---

## 五、实战：创建完整技能

我们已经创建了一个完整的示例技能 `ue57-save-system-designer-0.1.0`。现在让我展示如何使用它：

### 使用示例

用户输入：
```
帮我设计一个多人游戏的存档系统，需要支持玩家进度、世界状态和设置
```

Claude 使用技能后，会输出结构化的完整设计方案，包括：
1. 系统架构（单人/多人选择）
2. 数据结构（USaveGame 子类定义）
3. 实现细节（单人流程、多人流程）
4. 蓝图节点链
5. 命名规范和文件夹结构
6. 测试清单
7. 迁移和版本控制策略

---

## 六、最佳实践与常见陷阱

### 6.1 最佳实践清单

#### ✓ 要做的

- [ ] **明确触发条件**：用 "When the user..." 精确描述
- [ ] **分层安全规则**：根据技能类型设置不同限制
- [ ] **固定输出格式**：用编号列表定义结构
- [ ] **嵌入领域知识**：直接写入命名约定、默认值
- [ ] **提供示例**：展示期望的输出样式
- [ ] **版本控制**：使用语义化版本号
- [ ] **可扩展设计**：预留 "[Planned]" 功能点

#### ✗ 不要做的

- [ ] **模糊的触发条件**：如 "帮助用户处理 UE 相关任务"
- [ ] **混合职责**：一个技能只做一件事
- [ ] **忽视安全**：即使是纯文本技能也要有安全规则
- [ ] **硬编码过细**：保留合理的灵活性
- [ ] **忽略错误情况**：提供故障排除指引
- [ ] **过度设计**：从简单开始，逐步迭代

### 6.2 常见陷阱

#### 陷阱 1：触发条件过于宽泛

❌ 错误示例：
```markdown
## What this skill does
帮助用户使用虚幻引擎。
```

✅ 正确示例：
```markdown
## What this skill does
When the user requests a Niagara VFX design in Unreal Engine 5, 
provide a complete, implementation-ready specification including:
- Emitter setup steps and module configurations
- Material/texture requirements
- Performance optimization settings
```

#### 陷阱 2：安全规则不完整

❌ 错误示例：
```markdown
## Safety Rules
不要删除文件。
```

✅ 正确示例：
```markdown
## Non-negotiable rules (Safety)
- Do NOT execute any terminal commands or file operations
- Do NOT modify project files directly
- Do NOT generate executable scripts or batch files
- Provide ONLY text-based specifications the user can manually implement
- Include warnings about data loss risks and backup recommendations
```

#### 陷阱 3：输出格式不一致

❌ 错误示例：
```markdown
## Output Format
我会输出设计文档。
```

✅ 正确示例：
```markdown
## Output format (always)

### 1. **System Overview**
   - Architecture choice and rationale
   - Key components and their responsibilities

### 2. **Data Architecture**
   - Class/struct definitions
   - Data flow diagram (text-based)

### 3. **Implementation**
   - Step-by-step instructions
   - Code snippets (if applicable)

### 4. **Testing**
   - Validation checklist
   - Common issues and solutions
```

---

## 七、测试与调试技能

### 7.1 测试清单

创建技能后，使用以下清单验证：

#### 功能测试
- [ ] 触发条件正确识别用户意图
- [ ] 输出格式符合定义
- [ ] 安全规则生效
- [ ] 领域知识正确应用

#### 边界测试
- [ ] 模糊请求处理
- [ ] 不完整输入处理
- [ ] 冲突需求处理
- [ ] 超长输出处理

#### 一致性测试
- [ ] 多次相同输入，输出结构一致
- [ ] 相关输入，输出风格一致
- [ ] 时间/上下文变化，核心规则不变

### 7.2 调试技巧

#### 问题：技能未被触发

**排查步骤**：
1. 检查触发条件是否过于具体
2. 验证关键词是否被用户输入包含
3. 测试简化版触发条件

**示例修复**：
```markdown
# 之前（太具体）
When the user wants to create a Niagara system for fire effects...

# 之后（更通用）
When the user requests a Niagara VFX design in Unreal Engine 5...
```

#### 问题：输出格式不一致

**排查步骤**：
1. 检查 Output format 部分是否编号清晰
2. 验证每个部分是否有明确标题
3. 测试添加更具体的格式要求

#### 问题：安全规则被绕过

**排查步骤**：
1. 检查规则是否绝对禁止（Do NOT...）
2. 添加更具体的反面示例
3. 测试边界情况

---

## 附录 A：快速参考卡片

### 技能最小可行结构

```markdown
# [Name] ([Version])

## What this skill does
When the user [trigger condition], provide [output description].

## Non-negotiable rules
- Do NOT [prohibited action]
- Do NOT [another prohibited action]
- [Additional safety rules]

## Output format
1. [Section 1]
2. [Section 2]
3. [Section 3]

## [Domain-specific guidelines]
[Best practices, naming conventions, etc.]
```

### 版本升级检查清单

从 0.1.0 升级到 0.2.0：
- [ ] 新增功能已测试
- [ ] 向后兼容旧输入
- [ ] 文档已更新
- [ ] 示例已添加

从 0.x 升级到 1.0.0：
- [ ] 核心功能稳定
- [ ] 已解决所有已知问题
- [ ] 文档完整
- [ ] 已验证多种使用场景

---

## 附录 B：示例技能库

| 技能名称 | 类型 | 用途 |
|---------|------|------|
| ue57-gamepiece-designer | 设计型 | 游戏系统设计 |
| ue57-save-system-designer | 设计型 | 存档系统设计 |
| ue5-niagara-designer | 设计型 | Niagara 特效设计 |
| ue5-bp-code-generator | 生成型 | 蓝图代码生成 |
| ue5-crash-diagnoser | 辅助型 | 崩溃诊断 |
| ue5-mcp-controller | MCP型 | 工具调用控制 |

---

**教程结束**

现在你已掌握创建虚幻引擎 Claude Skill 的完整知识。建议从简单技能开始，逐步迭代完善。记住：**完成比完美更重要**——先让技能能用，再让它好用。
