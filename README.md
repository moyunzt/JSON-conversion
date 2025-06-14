# JSON/YAML 转换工具

一个易于使用的格式转换工具，支持在JSON、YAML、TOML和XML格式之间进行转换。提供Web应用、桌面应用和VSCode插件三种使用方式。

## 功能特点

- **多格式支持**：支持JSON、YAML、TOML和XML格式之间的相互转换
- **多种使用方式**：
  - Web应用：直接在浏览器中使用
  - 桌面应用：独立的Windows应用程序
  - VSCode插件：在编辑器中直接转换
- **格式化输出**：美化输出结果，使其更易于阅读
- **键排序**：按字母顺序排序对象键
- **注释处理**：保留YAML和TOML中的注释（基础支持）
- **响应式设计**：适配桌面和移动设备
- **暗色模式支持**：自动适应系统主题设置

## 安装说明

### Web应用

1. 克隆或下载本仓库
2. 使用任何静态文件服务器提供服务，例如：
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
   - PHP: `php -S localhost:8000`
3. 在浏览器中访问 `http://localhost:8000`

### 桌面应用

#### 从源码构建

1. 安装依赖：
   ```bash
   npm install
   ```

2. 构建应用：
   ```bash
   npm run build
   ```

3. 在 `dist` 目录下找到安装程序

#### 直接下载

从 [Releases](https://github.com/yourusername/json-yaml-converter/releases) 页面下载最新版本的安装程序。

### VSCode插件

#### 从源码安装

1. 安装依赖：
   ```bash
   npm install
   ```

2. 编译插件：
   ```bash
   npm run compile
   ```

3. 打包插件：
   ```bash
   npm run package
   ```

4. 使用 VSCode 的扩展安装功能安装生成的 `.vsix` 文件

#### 从应用商店安装

1. 打开 VSCode
2. 转到扩展视图（Ctrl+Shift+X）
3. 搜索 "JSON/YAML Converter"
4. 点击安装

## 使用方法

### Web应用和桌面应用

1. 选择输入格式（JSON、YAML、TOML或XML）
2. 粘贴您的代码到输入框
3. 选择输出格式
4. 设置所需选项（格式化输出、键排序、保留注释）
5. 点击"转换"按钮
6. 查看转换结果，可以复制或下载

### VSCode插件

1. 打开要转换的文件
2. 右键点击编辑器，选择"转换文档格式 (JSON/YAML/TOML/XML)"
3. 从弹出的选项中选择目标格式
4. 转换后的内容将在新标签页中打开

## 开发说明

### 项目结构

```
├── src/                  # VSCode插件源码
├── electron/            # Electron应用源码
├── assets/             # 图标等资源文件
├── index.html          # Web应用主页面
├── styles.css          # 样式文件
├── script.js           # Web应用脚本
├── package.json        # 项目配置文件
└── README.md           # 项目说明文档
```

### 技术栈

- **前端**：HTML5、CSS3、JavaScript
- **桌面应用**：Electron
- **VSCode插件**：TypeScript
- **格式转换**：
  - js-yaml：YAML解析和生成
  - toml：TOML解析
  - fast-xml-parser：XML解析和生成

### 构建命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建桌面应用
npm run build

# 编译VSCode插件
npm run compile

# 打包VSCode插件
npm run package
```

## 贡献

欢迎提交问题报告、功能请求或代码贡献！

## 许可证

MIT