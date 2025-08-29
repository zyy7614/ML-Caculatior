# 设计文档

## 概述

玻璃价格计算器是一个单页面H5应用，采用响应式设计，支持移动端和桌面端访问。页面使用现代CSS和JavaScript技术，提供实时价格计算功能。

## 架构

### 技术栈
- HTML5：页面结构
- CSS3：样式和响应式布局
- Vanilla JavaScript：交互逻辑和计算功能
- 无需后端服务，纯前端实现

### 页面结构
```
index.html (主页面)
├── styles.css (样式文件)
└── script.js (脚本文件)
```

## 组件和接口

### 1. 页面布局组件

#### 头部区域 (Header)
- 应用标题："玻璃价格计算器"
- 简短说明文字

#### 输入区域 (Input Section)
- 玻璃材质选择器（下拉菜单或单选按钮组）
- 长度输入框（数字输入，单位：米）
- 宽度输入框（数字输入，单位：米）

#### 结果显示区域 (Result Section)
- 面积显示（平方米）
- 单价显示（元/平方米）
- 总价显示（元）

#### 底部区域 (Footer)
- 使用说明或版权信息

### 2. 交互组件

#### 材质选择器
```javascript
const glassTypes = {
  'normal': { name: '普通玻璃', price: 65 },
  'tempered': { name: '钢化玻璃', price: 100 },
  'laminated': { name: '夹胶玻璃', price: 150 },
  'insulated': { name: '中空玻璃', price: 125 }
}
```

#### 计算器类
```javascript
class GlassCalculator {
  constructor() {
    this.length = 0;
    this.width = 0;
    this.glassType = 'normal';
  }
  
  calculateArea() {
    return this.length * this.width;
  }
  
  calculatePrice() {
    const area = this.calculateArea();
    const unitPrice = glassTypes[this.glassType].price;
    return area * unitPrice;
  }
}
```

## 数据模型

### 玻璃材质数据
```javascript
{
  type: string,        // 材质类型标识
  name: string,        // 材质显示名称
  price: number        // 单价（元/平方米）
}
```

### 计算结果数据
```javascript
{
  length: number,      // 长度（米）
  width: number,       // 宽度（米）
  area: number,        // 面积（平方米）
  unitPrice: number,   // 单价（元/平方米）
  totalPrice: number   // 总价（元）
}
```

## 用户界面设计

### 视觉设计
- 主色调：蓝色系（#2196F3）
- 辅助色：灰色系（#757575）
- 背景色：浅灰色（#F5F5F5）
- 卡片式布局，使用阴影效果
- 圆角设计，现代简洁风格

### 响应式设计
- 移动端：单列布局，最小宽度320px
- 平板端：适中间距，最大宽度768px
- 桌面端：居中显示，最大宽度1200px

### 交互设计
- 输入框获得焦点时高亮边框
- 按钮悬停时颜色变化
- 实时计算，无需点击计算按钮
- 输入验证，错误时红色提示

## 错误处理

### 输入验证
1. 长度和宽度必须为正数
2. 数值范围：0.1米 - 50米
3. 小数点后最多2位
4. 非数字输入时显示错误提示

### 错误提示
- 输入框下方显示红色错误文字
- 计算结果区域显示"请输入有效数值"
- 错误状态下输入框边框变红

### 边界情况处理
- 面积为0时显示"请输入尺寸"
- 面积过大时（>100平方米）显示警告
- 价格显示格式化为千分位

## 测试策略

### 单元测试
- 计算器类的计算方法测试
- 输入验证函数测试
- 价格格式化函数测试

### 集成测试
- 用户输入到结果显示的完整流程
- 不同材质选择的价格计算
- 响应式布局在不同设备上的显示

### 用户体验测试
- 移动设备触摸操作测试
- 不同浏览器兼容性测试
- 页面加载性能测试

## 性能优化

### 前端优化
- CSS和JS文件压缩
- 图片资源优化（如有）
- 使用CDN加速（可选）

### 用户体验优化
- 防抖处理输入事件
- 平滑的动画过渡
- 快速响应的交互反馈