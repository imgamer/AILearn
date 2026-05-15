@echo off
chcp 65001 >nul

echo ==========================================
echo        BlueprintAIBridge 安装工具
echo ==========================================
echo.

REM 检查是否拖入了文件
if "%~1"=="" (
    echo 错误：请将 .uproject 文件拖到这个脚本上
    echo.
    pause
    exit /b 1
)

REM 获取项目路径
set "PROJECT_FILE=%~1"
set "PROJECT_FILE=%PROJECT_FILE:"=%"

echo 检测到文件：%PROJECT_FILE%
echo.

for %%i in ("%PROJECT_FILE%") do set "PROJECT_PATH=%%~dpi"

REM 获取插件路径（脚本所在的BlueprintAIBridge文件夹）
set "PLUGIN_PATH=%~dp0"

echo 项目路径：%PROJECT_PATH%
echo 插件路径：%PLUGIN_PATH%
echo.

REM 检查插件路径是否存在
if not exist "%PLUGIN_PATH%Source" (
    echo 错误：插件路径不正确
    echo 请确保脚本在BlueprintAIBridge文件夹内
    echo.
    pause
    exit /b 1
)

REM 创建Plugins文件夹
if not exist "%PROJECT_PATH%Plugins" (
    echo 创建Plugins文件夹...
    mkdir "%PROJECT_PATH%Plugins"
)

REM 删除旧版本
if exist "%PROJECT_PATH%Plugins\BlueprintAIBridge" (
    echo 删除旧版本...
    rmdir /s /q "%PROJECT_PATH%Plugins\BlueprintAIBridge"
)

REM 复制整个BlueprintAIBridge文件夹
echo.
echo 正在复制插件到：%PROJECT_PATH%Plugins\BlueprintAIBridge
echo.

xcopy "%PLUGIN_PATH%" "%PROJECT_PATH%Plugins\BlueprintAIBridge\" /E /I /H /Y

echo.
if exist "%PROJECT_PATH%Plugins\BlueprintAIBridge\Source" (
    echo ==========================================
    echo           安装成功！
    echo ==========================================
    echo.
    echo 插件已复制到：%PROJECT_PATH%Plugins\BlueprintAIBridge
    echo.
) else (
    echo ==========================================
    echo           安装可能失败
    echo ==========================================
    echo.
    echo 请检查目标文件夹
)

echo.
pause
