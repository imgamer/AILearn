# 第 4 篇：实战迁移——把 Skill 模式落地到虚幻引擎自动化

> 这是本系列的最终目标。前三篇分析了 `ue57-gamepiece-designer` 这个**纯文本型** skill。本篇会突破"纯文本"限制，讲怎么让 skill 真的去调用虚幻引擎的 Python API / Web Remote Control，实现真正的 UE 自动化。
>
> 包含四部分：
> 1. **桥接方案对比** — Skill → UE 的 4 条通路，选哪条
> 2. **桥接方案详解** — Python Scripting 与 Web Remote Control 的接入方式
> 3. **实战 1：UE_AssetCheck** — 检查资产命名规范
> 4. **实战 2：UE_LightSetup** — 自动配置场景全局光照
>
> 所有伪代码均可直接复制改造（替换路径/类名即可）。

---

## 4.1 桥接方案对比：Skill → UE 的 4 条通路

`ue57-gamepiece-designer` 是"零执行" skill——它只输出文本，不碰 UE。但如果你想真的让 skill **执行** UE 操作（如检查资产、配置光照、批量重命名），需要在 skill 和 UE 之间架一座"桥"。

### 4.1.1 四条通路速览

```
┌──────────────┐                              ┌──────────────────┐
│  Claude Code │  通路 1：纯文本（本案例）    │   Unreal Editor  │
│   Skill      │  ─────────────────────────→  │   （人工操作）   │
└──────────────┘                              └──────────────────┘
                                                      ↑
┌──────────────┐                              ┌──────────────────┐
│  Claude Code │  通路 2：Python Scripting   │   unreal Python  │
│   Skill      │  ─────生成脚本────────────→  │   插件执行        │
└──────────────┘                              └──────────────────┘
                                                      ↑
┌──────────────┐                              ┌──────────────────┐
│  Claude Code │  通路 3：Web Remote Control │   UE HTTP Server  │
│   Skill      │  ─────发 HTTP 请求─────────→  │   (remoteexec)   │
└──────────────┘                              └──────────────────┘
                                                      ↑
┌──────────────┐                              ┌──────────────────┐
│  Claude Code │  通路 4：MCP Server         │   MCP Bridge     │
│   Skill      │  ─────调 MCP 工具──────────→  │   → UE API       │
└──────────────┘                              └──────────────────┘
```

### 4.1.2 四条通路的详细对比

| 通路 | 执行方式 | 优点 | 缺点 | 适用场景 |
|---|---|---|---|---|
| **1. 纯文本** | Claude 输出文本，用户复制粘贴 | 零依赖、跨环境、可审计 | 不能自动执行 | 设计型、规划型 skill（本案例） |
| **2. Python Scripting** | Claude 生成 .py 脚本，用户在 UE 内执行 | UE 原生支持、API 完整 | 需用户手动跑脚本 | 批量资产操作、自动化检查 |
| **3. Web Remote Control** | Claude 发 HTTP 请求到 UE | 实时执行、可双向通信 | 需启动 UE 编辑器、配端口 | 实时调试、远程控制 |
| **4. MCP Server** | Claude 调 MCP 工具，MCP 转 UE API | 工程化最彻底、可复用 | 开发成本最高 | 长期团队工具链 |

### 4.1.3 推荐选择策略

```
你的需求是什么？
   │
   ├─ 设计 / 规划（"帮我设计 XX 系统"）
   │   → 选通路 1（纯文本），就是 ue57-gamepiece-designer 的模式
   │
   ├─ 批量操作 / 一次性脚本（"检查所有资产命名"）
   │   → 选通路 2（Python Scripting），skill 输出可执行 .py
   │
   ├─ 实时控制 / 调试（"打开 PIE，截图"）
   │   → 选通路 3（Web Remote Control），skill 发 HTTP 请求
   │
   └─ 团队长期工具链（"标准化所有项目的光照配置"）
       → 选通路 4（MCP Server），开发一次性投入，长期复用
```

本篇重点讲**通路 2 和通路 3**，因为它们最实用、最容易上手。通路 4 是工程化方向，第 4.5 节会简单提一下思路。

---

## 4.2 桥接方案详解

### 4.2.1 通路 2：Python Scripting（推荐入门）

#### 前置条件

UE5.7 必须开启 Python 插件：

1. 编辑器 → Edit → Plugins → 搜索 "Python Editor Script Plugin" → 启用
2. 重启编辑器
3. 验证：在 Content Browser 里能跑 Python 命令

#### 工作流

```
Claude Code Skill
   ↓ 生成 .py 脚本内容（文本）
用户复制内容，保存为 check_assets.py
   ↓
用户在 UE 编辑器里执行脚本
   • 方式 A：File → Execute Python Script → 选 check_assets.py
   • 方式 B：在 Output Log 的 Python 命令行里输入 exec("check_assets.py")
   ↓
unreal Python 插件执行脚本
   ↓ 调用 unreal.* API
操作 UE 资产 / 编辑器
   ↓ 返回结果
脚本打印结果到 Output Log
```

#### 核心 API 速查

```python
import unreal

# 资产管理
editor_asset_lib = unreal.EditorAssetLibrary()
assets = editor_asset_lib.list_assets("/Game/")          # 列出所有资产
asset_data = editor_asset_lib.find_asset_data("path")     # 查资产元数据
editor_asset_lib.rename_asset(old, new)                   # 重命名
editor_asset_lib.delete_asset(path)                       # 删除

# 子系统访问
world = unreal.EditorLevelLibrary.get_editor_world()      # 当前关卡
actors = unreal.EditorLevelLibrary.get_all_level_actors() # 所有 actor

# 蓝图操作
blueprint_lib = unreal.SubsystemBlueprintLibrary
factory = unreal.BlueprintFactory()
bp = factory.create_blueprint(parent_class, package_path, name)

# 编辑器工具
editor_lib = unreal.UnrealEditorSubsystem()
editor_lib.request_exit_session(False)                    # 退出编辑器

# 通用工具
unreal.log("message")                                     # 打日志
unable.log_warning("warn")
unreal.log_error("error")
```

#### Skill 如何生成这样的脚本

这是关键——**skill 本身不执行 Python，它只生成"用户可执行的 Python 脚本内容"**。在 SKILL.md 的 Safety 段要相应调整：

```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT directly execute Python scripts.
- Do NOT modify .uasset files directly.
- CAN output Python script *contents* for user to execute in UE editor.
- If user asks for files, respond with file *contents* they can paste.
```

注意第 4 条：**允许输出 Python 脚本内容**，但禁止直接执行。这突破了纯文本 skill 的限制，但保留了"可审计"的安全边界。

---

### 4.2.2 通路 3：Web Remote Control（实时控制）

#### 前置条件

UE5.7 启用 Web Remote Control：

1. 编辑器 → Edit → Plugins → 搜索 "Remote Control Web Interface" → 启用
2. 编辑器 → Edit → Project Settings → Plugins → Remote Control → 启用 "Enable Web Remote Control"
3. 默认端口 8080，可改
4. 验证：浏览器访问 `http://localhost:8080/remote` 应能返回响应

#### 工作流

```
Claude Code Skill
   ↓ 生成 HTTP 请求（cURL 命令或 Python requests 代码）
用户执行请求
   ↓
UE 的 Web Remote Control 服务器接收请求
   ↓ 解析 JSON-RPC payload
调用内部 API
   ↓ 例如 unreal.EditorAssetLibrary.list_assets
返回 JSON 响应
   ↓
用户/Claude 解析响应
```

#### 核心 API 调用模式

Web Remote Control 用 JSON-RPC 协议。所有 UE Python API 都能通过这个协议调用。

**列出所有资产**：

```bash
curl -X POST http://localhost:8080/remote/api/asset/list \
  -H "Content-Type: application/json" \
  -d '{
    "Arguments": {
      "DirectoryPath": "/Game/"
    }
  }'
```

**执行任意 Python 代码**（更灵活）：

```bash
curl -X POST http://localhost:8080/remote/api/python/exec \
  -H "Content-Type: application/json" \
  -d '{
    "Arguments": {
      "command": "import unreal; print(unreal.EditorAssetLibrary.list_assets(\"/Game/\"))"
    }
  }'
```

#### Skill 如何用这条通路

这条通路最有意思的地方：**skill 可以让 Claude 直接发 HTTP 请求**（如果宿主允许工具调用）。但更安全的做法是 skill 输出 cURL 命令，用户自己执行。

```markdown
## Output format (always)
1) **Goal**
2) **Inputs**
3) **Outputs** (including HTTP request templates)
4) **Assumptions**
5) **Implementation**
   - **Python Script** (executable in UE editor)
   - **Web Remote Control Requests** (cURL commands)
   - **Assets / Naming / Folders**
6) **Test Checklist**
```

Output format 加了一个 "Web Remote Control Requests" 子段，输出可执行的 cURL 命令。

---

### 4.2.3 通路 4：MCP Server（工程化方向）

这是最重的一条通路，但也是最适合长期团队工具链的方案。

#### 架构

```
Claude Code
   ↓ 调用 MCP 工具（如 ue_asset_check）
MCP Server（独立进程，自研或用现成方案）
   ↓ 转发调用
UE 编辑器（通过 Python / Web Remote Control）
   ↓ 返回结果
MCP Server 整理结果
   ↓ 返回给 Claude
Claude 解读结果，输出给用户
```

#### 自研 MCP Server 的最小骨架

```python
# ue_mcp_server.py（伪代码，展示思路）
from mcp.server import Server
import unreal_remote  # 假设的 UE 远程调用库

server = Server("ue-automation")

@server.tool("ue_asset_check")
async def asset_check(directory: str, naming_pattern: str):
    """检查指定目录下资产命名是否符合规范"""
    assets = unreal_remote.list_assets(directory)
    violations = []
    for asset_path in assets:
        asset_name = asset_path.split("/")[-1]
        if not matches_pattern(asset_name, naming_pattern):
            violations.append({
                "path": asset_path,
                "name": asset_name,
                "expected_pattern": naming_pattern
            })
    return {
        "total_checked": len(assets),
        "violations_count": len(violations),
        "violations": violations[:50]  # 限制返回数量
    }

if __name__ == "__main__":
    server.run()
```

#### Skill 如何调用 MCP 工具

```markdown
## What this skill does
When the user asks to check UE asset naming, invoke the `ue_asset_check` MCP tool
with appropriate parameters, and interpret the results...

## Available MCP Tools
- `ue_asset_check(directory, naming_pattern)` - Check asset naming compliance
- `ue_light_setup(level, preset)` - Apply lighting preset to level
- `ue_blueprint_audit(blueprint_path)` - Audit blueprint for common issues
```

这条通路的核心：**skill 不直接生成 Python，而是指导 Claude 调用 MCP 工具**。MCP 工具内部再走 Python / Web Remote Control 操作 UE。

#### 何时选这条路

- 团队长期使用（多个项目复用）
- 操作复杂（需要事务、回滚、日志）
- 安全要求高（需要权限管理、操作审计）
- 多 skill 共享同一个 UE 连接

如果只是个人开发、一次性脚本，通路 2/3 更合适。

---

## 4.3 实战 1：UE_AssetCheck（检查资产命名规范）

这是一个**检查型** skill：用户说"检查我的资产命名"，skill 输出可执行的 Python 脚本，用户在 UE 里跑，拿到违规清单。

### 4.3.1 Step 1：定义边界

| 问题 | 回答 |
|---|---|
| 解决什么问题？ | 检查 UE 项目里资产命名是否符合团队规范（BP_/DT_/NS_ 等前缀） |
| 触发条件？ | 用户说"检查资产命名""审计资产""asset naming check" |
| 产出什么？ | 可执行的 Python 脚本 + 解读结果的指南 |
| 不做什么？ | 不直接执行脚本，不修改资产（只读检查） |
| 安全规则？ | 输出脚本内容，但禁止自动执行；禁止 rename/delete 操作 |

### 4.3.2 Step 2：目录结构

```
ue57-asset-check/
├── SKILL.md
├── _meta.json
└── Templates/
    ├── AssetCheck_Script_Template.py.md   ← Python 脚本骨架
    └── NamingRules_Default.md              ← 默认命名规则表
```

### 4.3.3 Step 3：SKILL.md

```markdown
---
name: ue57-asset-check
description: Audits UE5.7 asset naming compliance (generates executable Python scripts that scan project, list violations against BP_/DT_/NS_ conventions). Text-only, outputs scripts for user to run.
---

# UE5.7 Asset Check (Text-Only, Script-Generating)

## What this skill does
When the user asks to check or audit UE asset naming, generate an executable Python
script that scans the project and reports naming violations:
- Python script content (runnable in UE5.7 Python console)
- Naming rule table (BP_/DT_/NS_/Cue_ etc.)
- Violation report format (path, current name, expected pattern)
- Fix recommendations (suggested rename for each violation)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT directly execute Python scripts in UE.
- Do NOT modify .uasset files.
- Do NOT auto-rename assets (audit only, fix is user-driven).
- CAN output Python script *contents* for user to execute manually.
- If user asks for files, respond with file *contents* they can paste.

## Output format (always)
1) **Goal**
2) **Inputs** (project root path, rule set, exclusions)
3) **Outputs** (Python script, violation report template)
4) **Assumptions**
5) **Implementation**
   - **Python Script** (full content, ready to paste; refer to Templates/AssetCheck_Script_Template.py.md)
   - **Naming Rules** (the rule set used; refer to Templates/NamingRules_Default.md)
   - **How to Run** (step-by-step instructions for executing in UE editor)
6) **Test Checklist**

## UE naming rules (default, refer to Templates/NamingRules_Default.md for full list)
- Blueprints: `BP_<Thing>`
- Components: `BPComp_<Thing>`
- Interfaces: `BPI_<Thing>`
- DataTables: `DT_<Thing>`
- DataAssets: `DA_<Thing>`
- Structs/Enums: `ST_<Thing>` / `E_<Thing>`
- Niagara Systems: `NS_<Effect>`
- Audio Cues: `Cue_<Sound>`
- Materials: `M_<Name>`
- Textures: `T_<Name>`

## Check defaults (unless user says otherwise)
- Scan root: `/Game/`
- Exclude folders: `/Game/Developers/`, `/Game/__ExternalActors__/`, `/Game/Collections/`
- Exclude engine-migrated assets (T_ prefix textures in /Engine/)
- Max violations to report: 200 (beyond that, summarize counts only)
- Case-sensitive prefix matching
```

### 4.3.4 Step 4：Templates/AssetCheck_Script_Template.py.md

```markdown
# UE Asset Check Script Template

This is the Python script skeleton. Replace `<占位符>` with actual values.

```python
import unreal
import re

# ============ Configuration ============
SCAN_ROOT = "<scan_root, default: /Game/>"
EXCLUDE_FOLDERS = [
    "<exclude_1, default: /Game/Developers/>",
    "<exclude_2, default: /Game/__ExternalActors__/>",
]
MAX_REPORT = <max_violations, default: 200>

# ============ Naming Rules ============
# Format: (asset_class, expected_prefix, regex_pattern)
NAMING_RULES = [
    ("Blueprint", "BP_", r"^BP_[A-Z][a-zA-Z0-9_]*$"),
    ("BlueprintComponent", "BPComp_", r"^BPComp_[A-Z][a-zA-Z0-9_]*$"),
    ("BlueprintInterface", "BPI_", r"^BPI_[A-Z][a-zA-Z0-9_]*$"),
    ("DataTable", "DT_", r"^DT_[A-Z][a-zA-Z0-9_]*$"),
    ("DataAsset", "DA_", r"^DA_[A-Z][a-zA-Z0-9_]*$"),
    ("NiagaraSystem", "NS_", r"^NS_[A-Z][a-zA-Z0-9_]*$"),
    ("AudioCue", "Cue_", r"^Cue_[A-Z][a-zA-Z0-9_]*$"),
    ("Material", "M_", r"^M_[A-Z][a-zA-Z0-9_]*$"),
    ("Texture", "T_", r"^T_[A-Z][a-zA-Z0-9_]*$"),
    # <add more rules here>
]

# ============ Execution ============
def is_excluded(path):
    for excl in EXCLUDE_FOLDERS:
        if path.startswith(excl):
            return True
    return False

def get_asset_class(asset_path):
    """获取资产类型，用于匹配命名规则"""
    asset_data = unreal.EditorAssetLibrary.find_asset_data(asset_path)
    if asset_data:
        return str(asset_data.asset_class)
    return "Unknown"

def check_asset(asset_path):
    """检查单个资产的命名，返回 violation dict 或 None"""
    asset_name = asset_path.split("/")[-1]
    asset_class = get_asset_class(asset_path)

    for class_name, prefix, pattern in NAMING_RULES:
        if class_name.lower() in asset_class.lower():
            if not re.match(pattern, asset_name):
                return {
                    "path": asset_path,
                    "name": asset_name,
                    "class": asset_class,
                    "expected_prefix": prefix,
                    "expected_pattern": pattern,
                }
    return None

def main():
    unreal.log("=" * 60)
    unreal.log("UE Asset Naming Check")
    unreal.log("=" * 60)

    all_assets = unreal.EditorAssetLibrary.list_assets(SCAN_ROOT)
    violations = []

    for asset_path in all_assets:
        if is_excluded(asset_path):
            continue
        v = check_asset(asset_path)
        if v:
            violations.append(v)
            if len(violations) >= MAX_REPORT:
                break

    # Report
    unreal.log(f"\nScanned: {len(all_assets)} assets")
    unreal.log(f"Violations: {len(violations)} (showing first {MAX_REPORT})")
    unreal.log("-" * 60)
    for v in violations:
        unreal.log_warning(
            f"VIOLATION: {v['name']}"
            f" | class={v['class']}"
            f" | expected={v['expected_prefix']}*"
            f" | path={v['path']}"
        )

    unreal.log("-" * 60)
    unreal.log("Done.")

if __name__ == "__main__":
    main()
```

## How to Run
1. Copy the script above to a file named `asset_check.py`
2. In UE Editor: Tools → Python → Run Script → select `asset_check.py`
3. View results in Output Log (Window → Output Log, filter by "Python")
```

### 4.3.5 Step 5：Templates/NamingRules_Default.md

```markdown
# Default UE Naming Rules

## Class → Prefix Mapping

| Asset Class | Expected Prefix | Regex Pattern | Example |
|---|---|---|---|
| Blueprint | BP_ | `^BP_[A-Z][a-zA-Z0-9_]*$` | BP_Pickup |
| BlueprintComponent | BPComp_ | `^BPComp_[A-Z][a-zA-Z0-9_]*$` | BPComp_Health |
| BlueprintInterface | BPI_ | `^BPI_[A-Z][a-zA-Z0-9_]*$` | BPI_Interactable |
| DataTable | DT_ | `^DT_[A-Z][a-zA-Z0-9_]*$` | DT_Weapons |
| DataAsset | DA_ | `^DA_[A-Z][a-zA-Z0-9_]*$` | DA_WeaponConfig |
| Struct (ST_) | ST_ | `^ST_[A-Z][a-zA-Z0-9_]*$` | ST_WeaponData |
| Enum (E_) | E_ | `^E_[A-Z][a-zA-Z0-9_]*$` | E_AbilityType |
| Widget Blueprint | WBP_ | `^WBP_[A-Z][a-zA-Z0-9_]*$` | WBP_HUD |
| Niagara System | NS_ | `^NS_[A-Z][a-zA-Z0-9_]*$` | NS_MuzzleFlash |
| Niagara Emitter | NE_ | `^NE_[A-Z][a-zA-Z0-9_]*$` | NE_Spark |
| Audio Cue | Cue_ | `^Cue_[A-Z][a-zA-Z0-9_]*$` | Cue_FireRifle |
| Sound Class | SC_ | `^SC_[A-Z][a-zA-Z0-9_]*$` | SC_Weapon |
| Sound Attenuation | Att_ | `^Att_[A-Z][a-zA-Z0-9_]*$` | Att_Range30m |
| Material | M_ | `^M_[A-Z][a-zA-Z0-9_]*$` | M_Beam |
| Material Instance | MI_ | `^MI_[A-Z][a-zA-Z0-9_]*$` | MI_BeamRed |
| Texture | T_ | `^T_[A-Z][a-zA-Z0-9_]*$` | T_PotionIcon |

## Customization
- Add project-specific prefixes to the NAMING_RULES list in the script
- Adjust regex strictness (e.g., allow lowercase: `^BP_[a-zA-Z0-9_]*$`)
- Exclude folders via EXCLUDE_FOLDERS list
```

### 4.3.6 这个设计的精髓

1. **职责分离**：skill 只生成脚本，不执行。用户在 UE 里跑脚本，结果在 UE Output Log 里看。
2. **可审计**：脚本全文给用户，用户能读、能改、能存。不像 MCP 方案是黑盒。
3. **零依赖**：不需要 MCP Server、不需要 Web Remote Control，只要 UE 装了 Python 插件。
4. **可定制**：模板里的命名规则可由用户覆盖（`NAMING_RULES` 列表）。

### 4.3.7 使用示例

用户输入：
> "检查我项目里 /Game/Systems/ 目录下的资产命名"

Claude（用本 skill）输出：
1. Goal：检查 /Game/Systems/ 下所有资产的命名规范
2. Inputs：扫描根 `/Game/Systems/`，默认规则集
3. Outputs：可执行 Python 脚本 + 违规报告格式
4. Assumptions：UE5.7 已启用 Python 插件
5. Implementation：
   - Python Script（按模板填充 `SCAN_ROOT = "/Game/Systems/"`）
   - Naming Rules（默认规则表）
   - How to Run（在 UE 里 Tools → Python → Run Script）
6. Test Checklist：空目录 / 全合规 / 全违规 / 部分违规

用户拿到脚本，保存为 `.py`，在 UE 里跑，看 Output Log 拿违规清单。

---

## 4.4 实战 2：UE_LightSetup（自动配置场景全局光照）

这是一个**配置型** skill：用户说"配置白天室内光照"，skill 输出 Python 脚本，用户执行后场景里自动加 DirectionalLight + SkyLight + PostProcess。

### 4.4.1 Step 1：定义边界

| 问题 | 回答 |
|---|---|
| 解决什么问题？ | 按预设（白天/黄昏/夜晚/室内/室外）自动配置场景光照 |
| 触发条件？ | 用户说"配置光照""光照预设""light setup""lighting preset" |
| 产出什么？ | Python 脚本（spawn 灯光 actor + 配置参数）+ 预设说明 |
| 不做什么？ | 不直接执行脚本，不删除现有灯光（只 spawn 新的） |
| 安全规则？ | 输出脚本内容；不直接 spawn；保留现有灯光（除非用户明确说"覆盖"） |

### 4.4.2 Step 2：目录结构

```
ue57-light-setup/
├── SKILL.md
├── _meta.json
└── Templates/
    ├── LightSetup_Script_Template.py.md   ← Python 脚本骨架
    └── LightingPresets.md                  ← 预设参数表
```

### 4.4.3 Step 3：SKILL.md（节选）

```markdown
---
name: ue57-light-setup
description: Generates UE5.7 lighting setup scripts (DirectionalLight + SkyLight + PostProcess configurations for day/dusk/night/interior presets). Text-only, outputs Python scripts for user to run.
---

# UE5.7 Light Setup (Text-Only, Script-Generating)

## What this skill does
When the user asks to set up scene lighting in Unreal Engine 5.7, generate an executable
Python script that spawns and configures light actors:
- DirectionalLight (sun/moon) with intensity/color/angle
- SkyLight with HDRI/cubemap
- PostProcess volume with exposure/tonemapper/bloom
- AtmosphericFog / ExponentialHeightFog (if preset requires)
- Preset parameter table (day/dusk/night/interior)

## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT directly execute Python scripts.
- Do NOT delete existing lights unless user explicitly says "replace".
- Do NOT modify existing light actors (spawn new ones only).
- CAN output Python script *contents* for user to execute.
- If user asks for files, respond with file *contents*.

## Output format (always)
1) **Goal**
2) **Inputs** (preset name, scene type, target platform)
3) **Outputs** (Python script, preset parameter table)
4) **Assumptions**
5) **Implementation**
   - **Python Script** (refer to Templates/LightSetup_Script_Template.py.md)
   - **Preset Parameters** (refer to Templates/LightingPresets.md)
   - **How to Run**
6) **Test Checklist**

## Lighting presets (default, refer to Templates/LightingPresets.md)
- `day_outdoor`: bright directional (10 lux), blue sky, low fog
- `dusk_warm`: orange directional (3 lux), warm post-process, medium fog
- `night_moonlit`: dim bluish directional (0.5 lux), dark sky, high fog
- `interior_office`: warm point lights array, no directional, low sky

## Setup defaults (unless user says otherwise)
- Target engine: UE5.7 with Lumen GI enabled
- Spawn location: world origin (0,0,0), offset per preset
- Use mobility "Movable" for all spawned lights
- PostProcess volume: infinite extent (unbound)
```

### 4.4.4 Step 4：Templates/LightSetup_Script_Template.py.md

```markdown
# UE Light Setup Script Template

Replace `<占位符>` with values from the chosen preset.

```python
import unreal

# ============ Configuration ============
PRESET = "<preset_name, e.g., day_outdoor>"
SCENE_TYPE = "<scene_type, e.g., outdoor>"
REPLACE_EXISTING = <True/False, default: False>

# ============ Preset Parameters ============
# (Claude fills these based on chosen preset, refer to LightingPresets.md)
DIRECTIONAL = {
    "intensity": <lux, e.g., 10.0>,
    "light_color": <RGB, e.g., (1.0, 0.95, 0.85)>,
    "rotation": <pitch_yaw_roll, e.g., (-40, 30, 0)>,
    "mobility": "Movable",
    "cast_shadows": True,
    "atmosphere_sun_light": True,
}

SKY_LIGHT = {
    "intensity": <lux, e.g., 2.0>,
    "light_color": <RGB>,
    "mobility": "Movable",
    "source_type": "SpecifiedCubemap",  # or "SLS_CapturedScene"
    "cubemap_path": "<path or None>",
}

POST_PROCESS = {
    "auto_exposure": True,
    "exposure_compensation": <float, e.g., 1.0>,
    "tonemapper_type": "ACES",
    "bloom_intensity": <float, e.g., 0.5>,
    "white_temp": <kelvin, e.g., 6500>,
    "vignette_intensity": <float, e.g., 0.4>,
}

FOG = {
    "type": "<atmospheric/exponential/none>",
    "density": <float>,
    "fog_color": <RGB>,
}

# ============ Execution ============
def spawn_actor(class_name, location=(0,0,0)):
    """通用 spawn actor 工具"""
    actor_class = getattr(unreal, class_name)
    return unreal.EditorLevelLibrary.spawn_actor_from_class(
        actor_class, unreal.Vector(*location), unreal.Rotator()
    )

def setup_directional_light(config):
    light = spawn_actor("DirectionalLight")
    light.set_actor_label(f"DirLight_{PRESET}")
    light_comp = light.get_editor_property("light_component")
    light_comp.set_editor_property("intensity", config["intensity"])
    # ... (set other properties)
    return light

def setup_sky_light(config):
    light = spawn_actor("SkyLight")
    light.set_actor_label(f"SkyLight_{PRESET}")
    # ... (set properties)
    return light

def setup_post_process(config):
    pp = spawn_actor("PostProcessVolume")
    pp.set_actor_label(f"PP_{PRESET}")
    pp.get_editor_property("settings").set_editor_property(
        "auto_exposure_min_brightness", config["auto_exposure"]
    )
    # ... (set other properties)
    return pp

def cleanup_existing_lights():
    """如果 REPLACE_EXISTING=True，删除现有同类灯光"""
    actors = unreal.EditorLevelLibrary.get_all_level_actors()
    for actor in actors:
        if isinstance(actor, (unreal.DirectionalLight, unreal.SkyLight)):
            actor.destroy_actor()

def main():
    unreal.log(f"Setting up lighting preset: {PRESET}")

    if REPLACE_EXISTING:
        unreal.log_warning("Removing existing lights...")
        cleanup_existing_lights()

    setup_directional_light(DIRECTIONAL)
    setup_sky_light(SKY_LIGHT)
    setup_post_process(POST_PROCESS)
    if FOG["type"] != "none":
        # spawn fog actor (logic omitted for brevity)
        pass

    unreal.log(f"Lighting setup complete: {PRESET}")

if __name__ == "__main__":
    main()
```

## How to Run
1. Copy script to `light_setup.py`
2. In UE Editor: Tools → Python → Run Script → select file
3. Verify spawned actors in World Outliner
4. Adjust parameters and re-run as needed
```

### 4.4.5 Step 5：Templates/LightingPresets.md

```markdown
# UE Lighting Presets

## day_outdoor
- DirectionalLight: intensity=10.0, color=(1.0,0.95,0.85), rotation=(-40,30,0), atmosphere_sun=True
- SkyLight: intensity=2.0, color=(0.8,0.9,1.0), source=CapturedScene
- PostProcess: auto_exposure=True, exposure_comp=1.0, tonemapper=ACES, white_temp=6500, bloom=0.5
- Fog: atmospheric, density=0.01, color=(0.9,0.95,1.0)

## dusk_warm
- DirectionalLight: intensity=3.0, color=(1.0,0.6,0.3), rotation=(-5,90,0), atmosphere_sun=True
- SkyLight: intensity=1.5, color=(1.0,0.7,0.5), source=CapturedScene
- PostProcess: auto_exposure=True, exposure_comp=0.8, tonemapper=ACES, white_temp=3200, bloom=0.8
- Fog: exponential, density=0.05, color=(1.0,0.5,0.3)

## night_moonlit
- DirectionalLight: intensity=0.5, color=(0.7,0.8,1.0), rotation=(-60,180,0), atmosphere_sun=True
- SkyLight: intensity=0.3, color=(0.5,0.6,0.8), source=CapturedScene
- PostProcess: auto_exposure=True, exposure_comp=-1.0, tonemapper=ACES, white_temp=8000, bloom=1.0
- Fog: exponential, density=0.08, color=(0.4,0.5,0.7)

## interior_office
- DirectionalLight: None (skip)
- SkyLight: intensity=0.5, color=(1.0,0.95,0.9), source=CapturedScene
- PointLights: array of 4-6 warm lights, intensity=2000, color=(1.0,0.9,0.8), placed by user
- PostProcess: auto_exposure=False, exposure_comp=1.2, tonemapper=ACES, white_temp=4000, bloom=0.3
- Fog: none

## Customization
- Add new presets by appending to this table and the script's PRESET dict
- Adjust intensity/color per scene need
- Set REPLACE_EXISTING=True to remove old lights before spawn
```

### 4.4.6 设计要点

1. **预设化**：把"光照配置"这种参数密集型任务拆成 4 个预设，用户选一个就行。
2. **可覆盖**：用户可以说"白天室外但更暗"，Claude 在脚本里把 `intensity` 从 10 改成 5。
3. **非破坏性**：默认 `REPLACE_EXISTING=False`，不删现有灯光，只 spawn 新的。安全第一。
4. **可读脚本**：脚本里有完整的 config dict，用户能直接改参数再跑，不用每次都问 skill。

### 4.4.7 进阶：用 Web Remote Control 实现实时预览

如果想做"调一个参数立刻看到效果"，可以把通路 2 升级为通路 3。skill 输出 cURL 命令而非 Python 脚本：

```bash
# 修改 DirectionalLight 的强度（实时）
curl -X PUT http://localhost:8080/remote/api/object/property \
  -H "Content-Type: application/json" \
  -d '{
    "object_path": "/Game/Maps/Default.DirectionalLight_0",
    "property_name": "intensity",
    "value": 5.0
  }'
```

这种模式下 skill 输出的不再是完整脚本，而是**一组可独立执行的微命令**，用户每条试一次，实时看效果。适合调试阶段。

---

## 4.5 关键架构设计思路总结

把上面两个实战案例的设计思路提炼成通用模式：

### 4.5.1 UE 自动化 Skill 的三层架构

```
┌─────────────────────────────────────────────────────────┐
│  Layer 1: SKILL.md（行为规则层）                        │
│  ─────────────────────────────                          │
│  • What this skill does: 触发条件 + 产物（Python 脚本） │
│  • Safety: 允许输出脚本内容，但禁止直接执行             │
│  • Output format: 6 段结构 + Python Script 子段         │
│  • UE naming: 资产命名约定                              │
│  • Presets/Defaults: 预设参数表 + 可覆盖声明            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 2: Templates/（脚本骨架层）                      │
│  ─────────────────────────────                          │
│  • Script Template: 可填充的 Python 脚本                │
│    - 占位符标可替换位置（<占位符>）                     │
│    - 默认值兜底（default: ...）                         │
│    - 配置块集中（易于修改）                             │
│  • Presets/Rules: 参数表 + 命名规则表                   │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Layer 3: 用户执行层                                    │
│  ─────────────────────────────                          │
│  • 用户复制脚本内容到 .py 文件                          │
│  • 在 UE 编辑器内执行（Tools → Python → Run Script）    │
│  • 结果输出到 UE Output Log                             │
│  • 用户根据结果调整脚本或参数                            │
└─────────────────────────────────────────────────────────┘
```

### 4.5.2 与纯文本型 skill 的核心差异

| 维度 | 纯文本型（ue57-gamepiece-designer） | 自动化型（UE_AssetCheck / UE_LightSetup） |
|---|---|---|
| 产物 | 文档（蓝图配方、数据 schema） | 可执行脚本（Python） |
| Safety | 禁止所有执行 | 允许输出脚本内容，禁止直接执行 |
| Templates 内容 | 输出骨架（Markdown） | 脚本骨架（Python in Markdown） |
| 用户操作 | 复制文本到 UE 手动实现 | 复制脚本到 UE 一键执行 |
| 反馈循环 | 慢（用户实现后才知道好不好） | 快（跑脚本立即看结果） |
| 危险性 | 极低（纯文本） | 中（脚本可能误操作，靠 Safety 控制） |

### 4.5.3 安全规则的进阶设计

自动化 skill 的 Safety 段要比纯文本型更精细：

```markdown
## Non-negotiable rules (Safety)
- Do NOT run terminal commands.
- Do NOT directly execute Python scripts in UE.
- Do NOT auto-execute any generated code.
- Do NOT modify .uasset files directly.
- CAN output Python script *contents* for user to review and execute.
- For destructive operations (delete/rename): default to False, require explicit user opt-in.
- For spawn operations: prefer adding new actors over modifying existing ones.
- If user asks for files, respond with file *contents*.
- Always include a "dry-run" mode in generated scripts (print changes without applying).
```

新增的安全规则：
- **破坏性操作默认关闭**：删除、重命名、覆盖默认 `False`，需用户明确开启。
- **优先 add 不 modify**：spawn 新 actor 优于改现有 actor。
- **Dry-run 模式**：脚本支持"只打印将做什么，不实际执行"，让用户预审。

### 4.5.4 通用伪代码模板

任何 UE 自动化 skill 都可以用这个伪代码骨架：

```python
import unreal

# ============ Configuration ============
CONFIG = {
    "scan_root": "<path>",
    "preset": "<name>",
    "dry_run": <True/False>,  # 关键：默认 True 安全
    "destructive": <True/False>,  # 关键：默认 False 安全
    "max_iterations": <int>,  # 防止无限循环
}

# ============ Helpers ============
def log(msg, level="info"):
    """统一日志格式"""
    if level == "info":
        unreal.log(f"[UE_AUTO] {msg}")
    elif level == "warn":
        unreal.log_warning(f"[UE_AUTO] {msg}")
    elif level == "error":
        unreal.log_error(f"[UE_AUTO] {msg}")

def safe_execute(func, *args, **kwargs):
    """安全执行包装：捕获异常，不崩溃 UE"""
    try:
        return func(*args, **kwargs)
    except Exception as e:
        log(f"Error in {func.__name__}: {e}", "error")
        return None

# ============ Core Logic ============
def scan_or_audit():
    """检查型 skill 的主逻辑：扫描，返回报告"""
    # ...实现...
    pass

def apply_changes():
    """配置型 skill 的主逻辑：执行变更"""
    if CONFIG["dry_run"]:
        log("DRY RUN: no changes will be applied", "warn")
        # 只打印计划
        return
    # ...实际执行...
    pass

def main():
    log(f"Starting with config: {CONFIG}")
    report = safe_execute(scan_or_audit)
    if report:
        log(f"Report: {report}")
    if not CONFIG["dry_run"]:
        safe_execute(apply_changes)
    log("Done.")

if __name__ == "__main__":
    main()
```

这个骨架的特点：
1. **dry_run 默认 True**：安全第一，让用户先看再执行。
2. **safe_execute 包装**：捕获异常，不让脚本崩溃影响 UE。
3. **统一日志格式**：方便在 Output Log 里过滤本脚本输出。
4. **CONFIG 集中**：所有可配置项在一个 dict 里，用户改起来方便。

---

## 4.6 学习路径与下一步

### 4.6.1 你现在应该掌握的

读完本系列 4 篇，你应该能：

1. ✅ 看懂 `ue57-gamepiece-designer` 的每个文件、每段章节
2. ✅ 解释 skill 的加载机制与触发匹配流程
3. ✅ 写出纯文本型 skill（设计/规划类）
4. ✅ 写出脚本生成型 skill（自动化检查/配置类）
5. ✅ 选择合适的桥接方案（Python / Web Remote / MCP）
6. ✅ 设计带 dry-run 和安全开关的 UE 自动化脚本

### 4.6.2 进阶方向

#### 方向 1：把脚本生成型 skill 升级为 MCP 集成型

把 `Templates/AssetCheck_Script_Template.py.md` 里的脚本固化成一个 MCP 工具，skill 直接调工具而非生成脚本。优点：用户不用复制脚本，直接对话即可触发检查。

#### 方向 2：加 examples/ 做 few-shot

在 skill 文件夹加 `examples/` 目录，放 2-3 个"标杆输出"。Claude 看到示例后输出质量更稳定。

#### 方向 3：状态持久化

如果想做"增量检查"（只检查上次没检查过的资产），需要让 skill 写状态文件。这需要突破 Safety 段，允许写 `.claude/skill-state/<skill>.json`。

#### 方向 4：CI/CD 集成

把 skill 的输出脚本接入 UE 项目的 CI 流水线，每次 PR 自动跑资产检查、光照配置审计。这是 skill 工程化的最终形态。

### 4.6.3 学习资源

- 仓库内 [UE_Skill_Writing_Tutorial.md](file:///workspace/Game-Skills/gamepiece-designer/docs/UE_Skill_Writing_Tutorial.md)：通用 UE skill 教程
- 仓库内 [ue57-save-system-designer-0.1.0/skill.md](file:///workspace/Game-Skills/gamepiece-designer/docs/ue57-save-system-designer-0.1.0/skill.md)：另一个设计型 skill 范例
- UE 官方 [Python API 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/scripting-the-unreal-editor-using-python)
- UE 官方 [Web Remote Control 文档](https://dev.epicgames.com/documentation/en-us/unreal-engine/remote-control-web-application-for-unreal-engine)

---

## 4.7 本篇小结

### 三个核心结论

1. **4 条桥接通路各有适用场景**：纯文本（设计）、Python 脚本（批量操作）、Web Remote（实时控制）、MCP（长期工具链）。
2. **脚本生成型 skill 是入门最佳选择**：兼顾"可执行"和"可审计"，安全性和实用性平衡最好。
3. **自动化 skill 的 Safety 要更精细**：dry-run 默认开、破坏性操作默认关、优先 add 不 modify。

### 从 ue57-gamepiece-designer 到 UE 自动化的迁移路径

```
第 1 阶段：模仿 ue57-gamepiece-designer 写纯文本设计型 skill
   ↓ 掌握 SKILL.md 的 6 段结构 + Templates 模板分离
第 2 阶段：写脚本生成型 skill（如 UE_AssetCheck）
   ↓ 掌握 Python Scripting 桥接 + dry-run 安全机制
第 3 阶段：写实时控制型 skill（如 UE_LightSetup 升级版）
   ↓ 掌握 Web Remote Control + HTTP 请求模板
第 4 阶段：写 MCP 集成型 skill
   ↓ 掌握 MCP Server 开发 + 工具调用模式
第 5 阶段：CI/CD 集成
   ↓ 把 skill 输出接入项目流水线
```

每阶段都能产出可用工具，不必一次到位。**完成比完美更重要**。

---

## 本系列结束

回到 [00-README.md](file:///workspace/AI-Docs/skills/ue-gamepiece-designer/gemini/00-README.md) 看完整文档地图。
