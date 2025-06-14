# JSON/YAML 转换工具

一个易于使用的格式转换工具，支持在JSON、YAML、TOML和XML格式之间进行转换。提供Web应用使用方式。

## 功能特点

- **多格式支持**：支持JSON、YAML、TOML和XML格式之间的相互转换
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

## 使用方法

### Web应用

1. 选择输入格式（JSON、YAML、TOML或XML）
2. 粘贴您的代码到输入框
3. 选择输出格式
4. 设置所需选项（格式化输出、键排序、保留注释）
5. 点击"转换"按钮
6. 查看转换结果，可以复制或下载

## 开发说明

### 项目结构

├── index.html          # Web应用主页面
├── styles.css          # 样式文件
├── script.js           # Web应用脚本
└── README.md           # 项目说明文档
```

### 技术栈

- **前端**：HTML5、CSS3、JavaScript
- **格式转换**：
  - js-yaml：YAML解析和生成
  - toml：TOML解析
  - fast-xml-parser：XML解析和生成
