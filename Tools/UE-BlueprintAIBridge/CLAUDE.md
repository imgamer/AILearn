# CLAUDE.md
本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供指导。

## 项目概述

使用虚幻引擎 5.7 开发材质节点解析插件 MaterialParser，参考的源代码在 Plugins/BlueprintNodeBridge/ 目录。
思路是，把选中节点转为T3D格式代码和短代码，以便人类阅读和AI解析。

## 技术栈
- **Engine**: Unreal Engine 5.7
- **Language**: C++ (primary), Blueprint (gameplay prototyping)
- **API Lookup** Context7
- **mcp server** chir24-unreal-engine

