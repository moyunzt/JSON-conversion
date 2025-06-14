// 全局变量
let lastConvertedData = null;
let lastInputFormat = null;
let lastOutputFormat = null;

// DOM元素
const inputFormatSelect = document.getElementById('input-format');
const outputFormatSelect = document.getElementById('output-format');
const inputTextarea = document.getElementById('input-text');
const outputTextarea = document.getElementById('output-text');
const convertBtn = document.getElementById('convert-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const clearBtn = document.getElementById('clear-btn');
const formatOutputCheckbox = document.getElementById('format-output');
const sortKeysCheckbox = document.getElementById('sort-keys');
const preserveCommentsCheckbox = document.getElementById('preserve-comments');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 设置默认值
    inputFormatSelect.value = 'json';
    outputFormatSelect.value = 'yaml';
    
    // 添加事件监听器
    convertBtn.addEventListener('click', convertData);
    copyBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadOutput);
    clearBtn.addEventListener('click', clearAll);
    
    // 自动调整输入框高度
    inputTextarea.addEventListener('input', () => {
        inputTextarea.style.height = 'auto';
        inputTextarea.style.height = (inputTextarea.scrollHeight) + 'px';
    });
    
    // 示例数据
    const exampleData = {
        "name": "JSON/YAML 转换工具",
        "version": "1.0.0",
        "description": "在JSON和YAML格式之间轻松转换",
        "features": [
            "格式化输出",
            "键排序",
            "注释处理",
            "多格式支持"
        ],
        "settings": {
            "theme": "auto",
            "indentation": 2,
            "defaultInputFormat": "json",
            "defaultOutputFormat": "yaml"
        }
    };
    
    // 设置示例数据
    inputTextarea.value = JSON.stringify(exampleData, null, 2);
});

// 主要转换函数
async function convertData() {
    const inputFormat = inputFormatSelect.value;
    const outputFormat = outputFormatSelect.value;
    const inputText = inputTextarea.value.trim();
    
    if (!inputText) {
        showError('请输入要转换的内容');
        return;
    }
    
    try {
        // 解析输入数据
        const parsedData = await parseInput(inputText, inputFormat);
        if (!parsedData) return;
        
        // 保存转换后的数据以供下载
        lastConvertedData = parsedData;
        lastInputFormat = inputFormat;
        lastOutputFormat = outputFormat;
        
        // 转换为输出格式
        const outputText = await formatOutput(parsedData, outputFormat);
        if (!outputText) return;
        
        // 显示结果
        outputTextarea.value = outputText;
        
        // 显示成功消息
        showSuccess(`已成功从 ${formatName(inputFormat)} 转换为 ${formatName(outputFormat)}`);
    } catch (error) {
        showError(`转换失败: ${error.message}`);
        console.error('转换错误:', error);
    }
}

// 解析输入数据
async function parseInput(text, format) {
    try {
        let result;
        
        switch (format) {
            case 'json':
                // 尝试解析JSON
                result = JSON.parse(text);
                break;
                
            case 'yaml':
                // 使用js-yaml库解析YAML
                result = jsyaml.load(text);
                break;
                
            case 'toml':
                // 使用toml库解析TOML
                result = toml.parse(text);
                break;
                
            case 'xml':
                // 使用fast-xml-parser解析XML
                const parser = new XMLParser.XMLParser({
                    ignoreAttributes: false,
                    attributeNamePrefix: "@_",
                    allowBooleanAttributes: true
                });
                result = parser.parse(text);
                break;
                
            default:
                throw new Error(`不支持的输入格式: ${format}`);
        }
        
        return result;
    } catch (error) {
        showError(`解析 ${formatName(format)} 失败: ${error.message}`);
        console.error('解析错误:', error);
        return null;
    }
}

// 格式化输出
async function formatOutput(data, format) {
    try {
        // 如果需要排序键
        if (sortKeysCheckbox.checked) {
            data = sortObjectKeys(data);
        }
        
        let result;
        const formatOutput = formatOutputCheckbox.checked;
        
        switch (format) {
            case 'json':
                // 转换为JSON
                result = formatOutput 
                    ? JSON.stringify(data, null, 2) 
                    : JSON.stringify(data);
                break;
                
            case 'yaml':
                // 转换为YAML
                const yamlOptions = {
                    indent: formatOutput ? 2 : 0,
                    noArrayIndent: !formatOutput,
                    noCompatMode: true
                };
                result = jsyaml.dump(data, yamlOptions);
                break;
                
            case 'toml':
                // 转换为TOML (使用toml库)
                // 注意：toml库没有直接的stringify方法，这里使用一个简单的实现
                result = formatToToml(data, formatOutput);
                break;
                
            case 'xml':
                // 转换为XML
                const xmlOptions = {
                    ignoreAttributes: false,
                    format: formatOutput,
                    indentBy: formatOutput ? '  ' : '',
                    attributeNamePrefix: "@_",
                    suppressEmptyNode: true
                };
                const builder = new XMLParser.XMLBuilder(xmlOptions);
                result = builder.build(data);
                break;
                
            default:
                throw new Error(`不支持的输出格式: ${format}`);
        }
        
        return result;
    } catch (error) {
        showError(`转换为 ${formatName(format)} 失败: ${error.message}`);
        console.error('格式化错误:', error);
        return null;
    }
}

// 复制到剪贴板
function copyToClipboard() {
    const outputText = outputTextarea.value;
    if (!outputText) {
        showError('没有可复制的内容');
        return;
    }
    
    navigator.clipboard.writeText(outputText)
        .then(() => {
            showSuccess('已复制到剪贴板');
        })
        .catch(err => {
            showError('复制失败: ' + err.message);
            console.error('复制错误:', err);
        });
}

// 下载输出
function downloadOutput() {
    const outputText = outputTextarea.value;
    if (!outputText) {
        showError('没有可下载的内容');
        return;
    }
    
    // 确定文件扩展名
    let extension = '';
    switch (lastOutputFormat) {
        case 'json': extension = 'json'; break;
        case 'yaml': extension = 'yaml'; break;
        case 'toml': extension = 'toml'; break;
        case 'xml': extension = 'xml'; break;
        default: extension = 'txt';
    }
    
    // 创建下载链接
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${extension}`;
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
    
    showSuccess(`已下载为 converted.${extension}`);
}

// 清除所有内容
function clearAll() {
    inputTextarea.value = '';
    outputTextarea.value = '';
    lastConvertedData = null;
    showSuccess('已清除所有内容');
}

// 辅助函数：排序对象键
function sortObjectKeys(obj) {
    // 如果不是对象或是数组，直接返回
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
        return obj;
    }
    
    // 创建一个新的排序对象
    const sortedObj = {};
    const keys = Object.keys(obj).sort();
    
    // 递归排序所有嵌套对象
    for (const key of keys) {
        sortedObj[key] = sortObjectKeys(obj[key]);
    }
    
    return sortedObj;
}

// 辅助函数：格式化为TOML
function formatToToml(data, format = true) {
    // 简单的TOML格式化实现
    // 注意：这只是一个基本实现，不处理所有TOML特性
    let result = '';
    const indent = format ? '  ' : '';
    
    function processValue(value) {
        if (value === null || value === undefined) {
            return 'null';
        } else if (typeof value === 'string') {
            return `"${value.replace(/"/g, '\\"')}"`;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
            return value.toString();
        } else if (Array.isArray(value)) {
            return `[${value.map(processValue).join(', ')}]`;
        } else if (typeof value === 'object') {
            // 对象需要特殊处理，在TOML中使用嵌套表
            return 'OBJECT'; // 这里只是一个占位符，实际实现需要更复杂的逻辑
        }
        return String(value);
    }
    
    // 处理顶级键
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            // 处理嵌套表
            result += `\n[${key}]\n`;
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
                if (typeof nestedValue !== 'object' || Array.isArray(nestedValue)) {
                    result += `${indent}${nestedKey} = ${processValue(nestedValue)}\n`;
                }
            }
        } else {
            // 处理简单值
            result += `${key} = ${processValue(value)}\n`;
        }
    }
    
    return result;
}

// 辅助函数：获取格式名称
function formatName(format) {
    switch (format) {
        case 'json': return 'JSON';
        case 'yaml': return 'YAML';
        case 'toml': return 'TOML';
        case 'xml': return 'XML';
        default: return format.toUpperCase();
    }
}

// 显示错误消息
function showError(message) {
    // 简单实现，可以替换为更好的通知系统
    alert(`错误: ${message}`);
}

// 显示成功消息
function showSuccess(message) {
    // 简单实现，可以替换为更好的通知系统
    console.log(`成功: ${message}`);
    // 可以添加一个临时的成功消息元素
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.position = 'fixed';
    successElement.style.bottom = '20px';
    successElement.style.right = '20px';
    successElement.style.backgroundColor = '#2ecc71';
    successElement.style.color = 'white';
    successElement.style.padding = '10px 20px';
    successElement.style.borderRadius = '4px';
    successElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    successElement.style.zIndex = '1000';
    successElement.style.transition = 'opacity 0.5s';
    
    document.body.appendChild(successElement);
    
    // 3秒后淡出
    setTimeout(() => {
        successElement.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(successElement);
        }, 500);
    }, 3000);
}