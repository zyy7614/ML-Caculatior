// 简单的测试框架
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
}

function assertAlmostEqual(actual, expected, tolerance = 0.01, message) {
    if (Math.abs(actual - expected) > tolerance) {
        throw new Error(message || `Expected ${expected}, but got ${actual}`);
    }
}

// 导入要测试的模块
const { GlassCalculator, glassTypes, InputValidator, NumberFormatter } = require('./script.js');

// 测试套件
function runTests() {
    console.log('开始运行玻璃计算器单元测试...\n');

    // 测试玻璃材质数据结构
    function testGlassTypesData() {
        console.log('测试玻璃材质数据结构...');

        // 验证材质数量
        assertEqual(Object.keys(glassTypes).length, 4, '应该有4种玻璃材质');

        // 验证每种材质都有名称和价格
        for (const [key, value] of Object.entries(glassTypes)) {
            assert(value.name, `材质 ${key} 应该有名称`);
            assert(typeof value.price === 'number', `材质 ${key} 的价格应该是数字`);
            assert(value.price > 0, `材质 ${key} 的价格应该大于0`);
        }

        // 验证具体材质和价格
        assertEqual(glassTypes.normal.name, '普通玻璃');
        assertEqual(glassTypes.normal.price, 65);
        assertEqual(glassTypes.tempered.name, '钢化玻璃');
        assertEqual(glassTypes.tempered.price, 100);
        assertEqual(glassTypes.laminated.name, '夹胶玻璃');
        assertEqual(glassTypes.laminated.price, 150);
        assertEqual(glassTypes.insulated.name, '中空玻璃');
        assertEqual(glassTypes.insulated.price, 125);

        console.log('✓ 玻璃材质数据结构测试通过\n');
    }

    // 测试计算器类初始化
    function testCalculatorInitialization() {
        console.log('测试计算器初始化...');

        const calculator = new GlassCalculator();

        assertEqual(calculator.length, 0, '初始长度应该为0');
        assertEqual(calculator.width, 0, '初始宽度应该为0');
        assertEqual(calculator.glassType, 'normal', '初始材质应该为普通玻璃');

        console.log('✓ 计算器初始化测试通过\n');
    }

    // 测试设置方法
    function testSetterMethods() {
        console.log('测试设置方法...');

        const calculator = new GlassCalculator();

        // 测试设置长度
        calculator.setLength(2.5);
        assertEqual(calculator.length, 2.5, '设置长度应该正确');

        calculator.setLength('3.2');
        assertEqual(calculator.length, 3.2, '设置字符串长度应该转换为数字');

        calculator.setLength('invalid');
        assertEqual(calculator.length, 0, '无效长度应该设置为0');

        // 测试设置宽度
        calculator.setWidth(1.8);
        assertEqual(calculator.width, 1.8, '设置宽度应该正确');

        calculator.setWidth('2.1');
        assertEqual(calculator.width, 2.1, '设置字符串宽度应该转换为数字');

        // 测试设置材质类型
        calculator.setGlassType('tempered');
        assertEqual(calculator.glassType, 'tempered', '设置材质类型应该正确');

        calculator.setGlassType('invalid');
        assertEqual(calculator.glassType, 'tempered', '无效材质类型不应该改变当前类型');

        console.log('✓ 设置方法测试通过\n');
    }

    // 测试面积计算
    function testAreaCalculation() {
        console.log('测试面积计算...');

        const calculator = new GlassCalculator();

        // 测试基本面积计算
        calculator.setLength(2);
        calculator.setWidth(3);
        assertEqual(calculator.calculateArea(), 6, '面积计算应该正确');

        // 测试小数面积计算
        calculator.setLength(2.5);
        calculator.setWidth(1.8);
        assertAlmostEqual(calculator.calculateArea(), 4.5, 0.01, '小数面积计算应该正确');

        // 测试零面积
        calculator.setLength(0);
        calculator.setWidth(3);
        assertEqual(calculator.calculateArea(), 0, '零长度应该得到零面积');

        console.log('✓ 面积计算测试通过\n');
    }

    // 测试价格计算
    function testPriceCalculation() {
        console.log('测试价格计算...');

        const calculator = new GlassCalculator();

        // 测试普通玻璃价格计算
        calculator.setLength(2);
        calculator.setWidth(3);
        calculator.setGlassType('normal');
        assertEqual(calculator.calculatePrice(), 390, '普通玻璃价格计算应该正确 (6 * 65 = 390)');

        // 测试钢化玻璃价格计算
        calculator.setGlassType('tempered');
        assertEqual(calculator.calculatePrice(), 600, '钢化玻璃价格计算应该正确 (6 * 100 = 600)');

        // 测试夹胶玻璃价格计算
        calculator.setGlassType('laminated');
        assertEqual(calculator.calculatePrice(), 900, '夹胶玻璃价格计算应该正确 (6 * 150 = 900)');

        // 测试中空玻璃价格计算
        calculator.setGlassType('insulated');
        assertEqual(calculator.calculatePrice(), 750, '中空玻璃价格计算应该正确 (6 * 125 = 750)');

        // 测试小数价格计算
        calculator.setLength(2.5);
        calculator.setWidth(1.8);
        calculator.setGlassType('normal');
        assertAlmostEqual(calculator.calculatePrice(), 292.5, 0.01, '小数价格计算应该正确 (4.5 * 65 = 292.5)');

        console.log('✓ 价格计算测试通过\n');
    }

    // 测试获取方法
    function testGetterMethods() {
        console.log('测试获取方法...');

        const calculator = new GlassCalculator();
        calculator.setGlassType('tempered');

        assertEqual(calculator.getUnitPrice(), 100, '获取单价应该正确');
        assertEqual(calculator.getGlassTypeName(), '钢化玻璃', '获取材质名称应该正确');

        // 测试获取计算结果对象
        calculator.setLength(2);
        calculator.setWidth(3);
        const result = calculator.getCalculationResult();

        assertEqual(result.length, 2, '结果对象长度应该正确');
        assertEqual(result.width, 3, '结果对象宽度应该正确');
        assertEqual(result.area, 6, '结果对象面积应该正确');
        assertEqual(result.unitPrice, 100, '结果对象单价应该正确');
        assertEqual(result.totalPrice, 600, '结果对象总价应该正确');
        assertEqual(result.glassType, 'tempered', '结果对象材质类型应该正确');
        assertEqual(result.glassTypeName, '钢化玻璃', '结果对象材质名称应该正确');

        console.log('✓ 获取方法测试通过\n');
    }

    // 运行所有测试
    try {
        testGlassTypesData();
        testCalculatorInitialization();
        testSetterMethods();
        testAreaCalculation();
        testPriceCalculation();
        testGetterMethods();

        console.log('🎉 所有测试通过！玻璃计算器功能正常工作。');
        return true;
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        return false;
    }
}

// 运行测试
if (require.main === module) {
    runTests();
}

module.exports = { runTests };