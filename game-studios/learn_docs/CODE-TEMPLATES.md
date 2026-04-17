# 代码模板和示例

> 本文档提供了各个阶段的代码模板和示例，帮助你快速开始编码

---

## 📁 项目结构模板

### 初始项目结构
```
my-agent-project/
├── skills/              # Skill 定义
│   ├── file-reader/     # 文件读取 Skill
│   └── text-analyzer/   # 文本分析 Skill
├── agents/              # Agent 定义
│   ├── tier1/           # Tier 1 智能体
│   ├── tier2/           # Tier 2 智能体
│   └── tier3/           # Tier 3 智能体
├── tests/               # 测试文件
│   ├── skills/          # Skill 测试
│   └── agents/          # Agent 测试
├── docs/                # 文档
│   ├── architecture.md  # 架构文档
│   └── api.md           # API 文档
├── config/              # 配置文件
│   └── settings.json    # 系统配置
└── README.md            # 项目说明
```

---

## 🔧 Skill 模板

### 基础 Skill 模板

```python
"""
Skill 名称：[Skill Name]
功能描述：[Description]
输入参数：
  - param1: [Type] - [Description]
  - param2: [Type] - [Description]
输出：
  - result: [Type] - [Description]
"""

def execute(param1, param2):
    """
    执行 Skill 的主要逻辑
    
    Args:
        param1: [Description]
        param2: [Description]
    
    Returns:
        dict: 包含执行结果
    """
    try:
        # 1. 参数验证
        if not param1:
            raise ValueError("param1 不能为空")
        
        # 2. 核心逻辑
        result = perform_core_logic(param1, param2)
        
        # 3. 返回结果
        return {
            "success": True,
            "result": result,
            "message": "执行成功"
        }
        
    except Exception as e:
        # 4. 错误处理
        return {
            "success": False,
            "error": str(e),
            "message": "执行失败"
        }

def perform_core_logic(param1, param2):
    """
    执行核心业务逻辑
    
    Args:
        param1: [Description]
        param2: [Description]
    
    Returns:
        [Type]: [Description]
    """
    # 在这里实现你的核心逻辑
    pass
```

### 文件读取 Skill 示例

```python
"""
Skill 名称：File Reader
功能描述：读取文件内容
输入参数：
  - file_path: str - 文件路径
  - encoding: str - 文件编码（默认：utf-8）
输出：
  - content: str - 文件内容
  - line_count: int - 行数
"""

def execute(file_path, encoding="utf-8"):
    """
    读取文件内容
    
    Args:
        file_path: 文件路径
        encoding: 文件编码
    
    Returns:
        dict: 包含文件内容和元数据
    """
    try:
        # 参数验证
        if not file_path:
            raise ValueError("文件路径不能为空")
        
        # 读取文件
        with open(file_path, 'r', encoding=encoding) as f:
            content = f.read()
        
        # 计算行数
        line_count = len(content.split('\n'))
        
        return {
            "success": True,
            "content": content,
            "line_count": line_count,
            "file_size": len(content),
            "message": f"成功读取文件，共 {line_count} 行"
        }
        
    except FileNotFoundError:
        return {
            "success": False,
            "error": "文件不存在",
            "message": f"文件 {file_path} 不存在"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "读取文件失败"
        }
```

### 文本分析 Skill 示例

```python
"""
Skill 名称：Text Analyzer
功能描述：分析文本统计信息
输入参数：
  - text: str - 待分析的文本
输出：
  - word_count: int - 词数
  - char_count: int - 字符数
  - sentence_count: int - 句子数
"""

def execute(text):
    """
    分析文本统计信息
    
    Args:
        text: 待分析的文本
    
    Returns:
        dict: 包含文本统计信息
    """
    try:
        # 参数验证
        if not text:
            raise ValueError("文本不能为空")
        
        # 统计信息
        char_count = len(text)
        word_count = len(text.split())
        sentence_count = len([s for s in text.split('.') if s.strip()])
        
        return {
            "success": True,
            "word_count": word_count,
            "char_count": char_count,
            "sentence_count": sentence_count,
            "message": f"分析完成：{word_count} 词，{char_count} 字符"
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": "文本分析失败"
        }
```

---

## 🤖 Agent 模板

### Tier 1 Agent 模板

```python
"""
Agent 名称：[Agent Name]
类型：Tier 1（基础工具智能体）
职责：[Description]
能力：
  - [Capability 1]
  - [Capability 2]
依赖的 Skill：
  - [Skill 1]
  - [Skill 2]
"""

class Tier1Agent:
    def __init__(self):
        self.name = "[Agent Name]"
        self.type = "Tier 1"
        self.capabilities = [
            "[Capability 1]",
            "[Capability 2]"
        ]
    
    def execute(self, task):
        """
        执行任务
        
        Args:
            task: 任务对象，包含：
                - action: 动作类型
                - params: 参数字典
        
        Returns:
            dict: 执行结果
        """
        try:
            # 1. 任务验证
            self._validate_task(task)
            
            # 2. 路由到对应的 Skill
            result = self._route_to_skill(task)
            
            # 3. 返回结果
            return {
                "success": True,
                "agent": self.name,
                "result": result,
                "message": "任务执行成功"
            }
            
        except Exception as e:
            return {
                "success": False,
                "agent": self.name,
                "error": str(e),
                "message": "任务执行失败"
            }
    
    def _validate_task(self, task):
        """验证任务格式"""
        if not task or 'action' not in task:
            raise ValueError("任务格式无效")
    
    def _route_to_skill(self, task):
        """路由到对应的 Skill"""
        action = task['action']
        params = task.get('params', {})
        
        # 根据动作类型调用对应的 Skill
        if action == "action1":
            return skill1.execute(**params)
        elif action == "action2":
            return skill2.execute(**params)
        else:
            raise ValueError(f"不支持的动作: {action}")
```

### Tier 1 Agent 示例：文件操作 Agent

```python
"""
Agent 名称：File Operation Agent
类型：Tier 1（基础工具智能体）
职责：处理文件相关操作
能力：
  - 读取文件
  - 分析文本
依赖的 Skill：
  - File Reader
  - Text Analyzer
"""

import file_reader
import text_analyzer

class FileOperationAgent:
    def __init__(self):
        self.name = "File Operation Agent"
        self.type = "Tier 1"
        self.capabilities = [
            "read_file",
            "analyze_text"
        ]
    
    def execute(self, task):
        """
        执行文件操作任务
        
        Args:
            task: 任务对象
                - action: "read_file" 或 "analyze_text"
                - params: 参数字典
        
        Returns:
            dict: 执行结果
        """
        try:
            self._validate_task(task)
            result = self._route_to_skill(task)
            
            return {
                "success": True,
                "agent": self.name,
                "result": result,
                "message": "任务执行成功"
            }
            
        except Exception as e:
            return {
                "success": False,
                "agent": self.name,
                "error": str(e),
                "message": "任务执行失败"
            }
    
    def _validate_task(self, task):
        """验证任务格式"""
        if not task or 'action' not in task:
            raise ValueError("任务格式无效")
        
        action = task['action']
        if action not in self.capabilities:
            raise ValueError(f"不支持的动作: {action}")
    
    def _route_to_skill(self, task):
        """路由到对应的 Skill"""
        action = task['action']
        params = task.get('params', {})
        
        if action == "read_file":
            return file_reader.execute(**params)
        elif action == "analyze_text":
            return text_analyzer.execute(**params)
```

### Tier 2 Agent 模板

```python
"""
Agent 名称：[Agent Name]
类型：Tier 2（编排智能体）
职责：[Description]
协调的 Tier 1 Agent：
  - [Agent 1]
  - [Agent 2]
"""

class Tier2Agent:
    def __init__(self):
        self.name = "[Agent Name]"
        self.type = "Tier 2"
        self.tier1_agents = {
            "agent1": agent1_instance,
            "agent2": agent2_instance
        }
    
    def execute(self, task):
        """
        执行编排任务
        
        Args:
            task: 任务对象
                - goal: 目标描述
                - context: 上下文信息
        
        Returns:
            dict: 执行结果
        """
        try:
            # 1. 任务分解
            subtasks = self._decompose_task(task)
            
            # 2. 执行子任务（可并行）
            results = self._execute_subtasks(subtasks)
            
            # 3. 结果聚合
            final_result = self._aggregate_results(results)
            
            return {
                "success": True,
                "agent": self.name,
                "result": final_result,
                "subtasks": len(subtasks),
                "message": "编排任务执行成功"
            }
            
        except Exception as e:
            return {
                "success": False,
                "agent": self.name,
                "error": str(e),
                "message": "编排任务执行失败"
            }
    
    def _decompose_task(self, task):
        """
        分解任务为子任务
        
        Args:
            task: 主任务
        
        Returns:
            list: 子任务列表
        """
        # 实现任务分解逻辑
        subtasks = []
        # ... 分解逻辑
        return subtasks
    
    def _execute_subtasks(self, subtasks):
        """
        执行子任务
        
        Args:
            subtasks: 子任务列表
        
        Returns:
            list: 执行结果列表
        """
        results = []
        for subtask in subtasks:
            agent_name = subtask['agent']
            agent = self.tier1_agents[agent_name]
            result = agent.execute(subtask)
            results.append(result)
        return results
    
    def _aggregate_results(self, results):
        """
        聚合子任务结果
        
        Args:
            results: 子任务结果列表
        
        Returns:
            dict: 聚合后的结果
        """
        # 实现结果聚合逻辑
        aggregated = {}
        # ... 聚合逻辑
        return aggregated
```

### Tier 2 Agent 示例：文档处理 Agent

```python
"""
Agent 名称：Document Processing Agent
类型：Tier 2（编排智能体）
职责：协调文件读取和文本分析
协调的 Tier 1 Agent：
  - File Operation Agent
"""

from file_operation_agent import FileOperationAgent

class DocumentProcessingAgent:
    def __init__(self):
        self.name = "Document Processing Agent"
        self.type = "Tier 2"
        self.file_agent = FileOperationAgent()
    
    def execute(self, task):
        """
        执行文档处理任务
        
        Args:
            task: 任务对象
                - goal: File Operation Agent
                - context: 上下文信息
        
        Returns:
            dict: 执行结果
        """
        try:
            # 1. 任务分解
            subtasks = self._decompose_task(task)
            
            # 2. 执行子任务
            results = self._execute_subtasks(subtasks)
            
            # 3. 结果聚合
            final_result = self._aggregate_results(results)
            
            return {
                "success": True,
                "agent": self.name,
                "result": final_result,
                "message": "文档处理完成"
            }
            
        except Exception as e:
            return {
                "success": False,
                "agent": self.name,
                "error": str(e),
                "message": "文档处理失败"
            }
    
    def _decompose_task(self, task):
        """分解文档处理任务"""
        file_path = task['context']['file_path']
        
        subtasks = [
            {
                "agent": "file_agent",
                "action": "read_file",
                "params": {"file_path": file_path}
            }
        ]
        return subtasks
    
    def _execute_subtasks(self, subtasks):
        """执行子任务"""
        results = []
        for subtask in subtasks:
            result = Read File Operation Agent
            results.append(result)
        return results
    
    def _aggregate_results(self, results):
        """聚合结果"""
        if not results:
            return {}
        
        file_result = results[0]
        if file_result['success']:
            content = file_result['result']['content']
            
            # 分析文本
            analyze_result = self.file_agent.execute({
                "action": "analyze_text",
                "params": {"text": content}
            })
            
            return {
                "file_info": file_result['result'],
                "text_analysis": analyze_result['result']
            }
        
        return file_result
```

### Tier 3 Agent 模板

```python
"""
Agent 名称：[Agent Name]
类型：Tier 3（全局编排智能体）
职责：[Description]
协调的 Agent：
  - Tier 2 Agents
"""

class Tier3Agent:
    def __init__(self):
        self.name = "[Agent Name]"
        self.type = "Tier 3"
        self.tier2_agents = {
            "agent1": agent1_instance,
            "agent2": agent2_instance
        }
        self.task_queue = []
        self.task_states = {}
    
    def execute(self, request):
        """
        执行全局编排任务
        
        Args:
            request: 用户请求
                - goal: 目标描述
                - parameters: 参数字典
        
        Returns:
            dict: 执行结果
        """
        try:
            # 1. 任务路由
            agent_name = self._route_task(request)
            
            # 2. 状态管理
            task_id = self._create_task(request)
            self._update_task_state(task_id, "processing")
            
            # 3. 执行任务
            agent = self.tier2_agents[agent_name]
            result = agent.execute(request)
            
            # 4. 更新状态
            if result['success']:
                self._update_task_state(task_id, "completed")
            else:
                self._update_task_state(task_id, "failed")
            
            return {
                "success": True,
                "agent": self.name,
                "task_id": task_id,
                "result": result,
                "message": "全局编排完成"
            }
            
        except Exception as e:
            return {
                "success": False,
                "agent": self.name,
                "error": str(e),
                "message": "全局编排失败"
            }
    
    def _route_task(self, request):
        """
        路由任务到合适的 Agent
        
        Args:
            request: 用户请求
        
        Returns:
            str: Agent 名称
        """
        goal = request.get('goal', '')
        
        # 实现路由逻辑
        if "document" in goal.lower():
            return "document_agent"
        elif "code" in goal.lower():
            return "code_agent"
        else:
            return "default_agent"
    
    def _create_task(self, request):
        """创建任务并返回任务 ID"""
        import uuid
        task_id = str(uuid.uuid4())
        self.task_states[task_id] = {
            "status": "created",
            "request": request,
            "created_at": datetime.now()
        }
        return task_id
    
    def _update_task_state(self, task_id, status):
        """更新任务状态"""
        if task_id in self.task_states:
            self.task_states[task_id]['status'] = status
            self.task_states[task_id]['updated_at'] = datetime.now()
```

---

## 🧪 测试模板

### Skill 测试模板

```python
"""
测试文件：[Skill Name] 测试
"""

import unittest
from skill_module import execute

class TestSkill(unittest.TestCase):
    
    def test_success_case(self):
        """测试成功场景"""
        result = execute(param1="value1", param2="value2")
        self.assertTrue(result['success'])
        self.assertIn('result', result)
    
    def test_invalid_input(self):
        """测试无效输入"""
        result = execute(param1="", param2="value2")
        self.assertFalse(result['success'])
        self.assertIn('error', result)
    
    def test_error_handling(self):
        """测试错误处理"""
        result = execute(param1=None, param2=None)
        self.assertFalse(result['success'])

if __name__ == '__main__':
    unittest.main()
```

### Agent 测试模板

```python
"""
测试文件：[Agent Name] 测试
"""

import unittest
from agent_module import AgentClass

class TestAgent(unittest.TestCase):
    
    def setUp(self):
        """测试前准备"""
        self.agent = AgentClass()
    
    def test_agent_initialization(self):
        """测试 Agent 初始化"""
        self.assertIsNotNone(self.agent)
        self.assertEqual(self.agent.name, "[Agent Name]")
    
    def test_execute_valid_task(self):
        """测试执行有效任务"""
        task = {
            "action": "valid_action",
            "params": {"param1": "value1"}
        }
        result = self.agent.execute(task)
        self.assertTrue(result['success'])
    
    def test_execute_invalid_task(self):
        """测试执行无效任务"""
        task = {
            "action": "invalid_action",
            "params": {}
        }
        result = self.agent.execute(task)
        self.assertFalse(result['success'])

if __name__ == '__main__':
    unittest.main()
```

---

## 📝 配置文件模板

### settings.json

```json
{
  "system": {
    "name": "智能任务助手系统",
    "version": "1.0.0",
    "description": "基于智能体编排的任务处理系统"
  },
  "agents": {
    "tier1": {
      "enabled": true,
      "timeout": 30,
      "max_retries": 3
    },
    "tier2": {
      "enabled": true,
      "timeout": 60,
      "max_retries": 2,
      "parallel_execution": true,
      "max_parallel_tasks": 5
    },
    "tier3": {
      "enabled": true,
      "timeout": 120,
      "max_retries": 1,
      "task_queue_size": 100
    }
  },
  "logging": {
    "level": "INFO",
    "file": "logs/system.log",
    "max_size": "10MB",
    "backup_count": 5
  },
  "monitoring": {
    "enabled": true,
    "metrics_interval": 60,
    "alert_threshold": {
      "error_rate": 0.1,
      "response_time": 5000
    }
  }
}
```

---

## 🚀 快速开始示例

### 示例 1：使用 Tier 1 Agent

```python
from file_operation_agent import FileOperationAgent

# 创建 Agent
agent = FileOperationAgent()

# 执行任务
task = {
    "action": "read_file",
    "params": {
        "file_path": "example.txt",
        "encoding": "utf-8"
    }
}

result = agent.execute(task)

if result['success']:
    print("任务执行成功！")
    print(f"内容: {result['result']['content'][:100]}...")
else:
    print(f"任务执行失败: {result['error']}")
```

### 示例 2：使用 Tier 2 Agent

```python
from document_processing_agent import DocumentProcessingAgent

# 创建 Agent
agent = DocumentProcessingAgent()

# 执行任务
task = {
    "goal": "处理文档",
    "context": {
        "file_path": "document.txt"
    }
}

result = agent.execute(task)

if result['success']:
    print("文档处理完成！")
    print(f"文件信息: {result['result']['file_info']}")
    print(f"文本分析: {result['result']['text_analysis']}")
else:
    print(f"处理失败: {result['error']}")
```

### 示例 3：使用 Tier 3 Agent

```python
from orchestrator_agent import OrchestratorAgent

# 创建 Agent
agent = OrchestratorAgent()

# 执行任务
request = {
    "goal": "处理文档",
    "parameters": {
        "file_path": "document.txt"
    }
}

result = agent.execute(request)

if result['success']:
    print(f"任务 ID: {result['task_id']}")
    print(f"执行结果: {result['result']}")
else:
    print(f"执行失败: {result['error']}")
```

---

## 💡 使用建议

1. **从模板开始**：复制对应的模板到你的项目中
2. **逐步完善**：先实现基本功能，再添加高级特性
3. **测试驱动**：编写测试用例验证功能
4. **文档同步**：及时更新文档和注释
5. **参考示例**：查看示例代码理解用法

---

**祝你编码顺利！** 🎉
