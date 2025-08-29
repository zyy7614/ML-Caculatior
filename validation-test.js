// 输入验证功能测试
// 这个测试文件专门测试输入验证和错误处理功能

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

// 模拟DOM环境
global.document = {
    getElementById: () => null,
    createElement: () => ({
        id: '',
        className: '',
        textContent: '',
        style: { display: '' },
        classList: { add: () => { }, remove: () => { } },
        parentNode: { appendChild: () => { } }
    }),
    querySelectorAll: () => [],
    addEventListener: () => { }
};

// 导入InputValidator和NumberFormatter类
const { InputValidator, NumberFormatter } = require('./script.js');

// 测试套件
function runValidationTests() {
    console.log('开始运行输入验证和错误处理测试...\n');

    // 测试InputValidator初始化
    function testValidatorInitialization() {
        console.log('测试InputValidator初始化...');

        const validator = new InputValidator();

        assert(validator.errors instanceof Map, 'errors应该是Map实例');
        assertEqual(validator.errors.size, 0, '初始化时应该没有错误');
        assertEqual(validator.hasErrors(), false, '初始化时hasErrors应该返回false');

        console.log('✓ InputValidator初始化测试通过\n');
    }

    // 测试数字验证功能
    function testNumberValidation() {
        console.log('测试数字验证功能...');

        const validator = new InputValidator();

        // 测试空值验证
        let result = validator.validateNumber('', 'test');
        assertEqual(result.isValid, false, '空字符串应该无效');
        assertEqual(result.error, '请输入数值', '空值错误信息应该正确');

        result = validator.validateNumber('   ', 'test');
        assertEqual(result.isValid, false, '空白字符串应该无效');

        // 测试非数字验证
        result = validator.validateNumber('abc', 'test');
        assertEqual(result.isValid, false, '非数字字符串应该无效');
        assertEqual(result.error, '请输入有效的数字', '非数字错误信息应该正确');

        result = validator.validateNumber('12abc', 'test');
        assertEqual(result.isValid, false, '包含字母的字符串应该无效');

        // 测试负数验证
        result = validator.validateNumber('-5', 'test');
        assertEqual(result.isValid, false, '负数应该无效');
        assertEqual(result.error, '数值必须大于0', '负数错误信息应该正确');

        result = validator.validateNumber('0', 'test');
        assertEqual(result.isValid, false, '零应该无效');

        // 测试范围验证
        result = validator.validateNumber('0.05', 'test');
        assertEqual(result.isValid, false, '小于0.1的数值应该无效');
        assertEqual(result.error, '最小值为0.1米', '最小值错误信息应该正确');

        result = validator.validateNumber('51', 'test');
        assertEqual(result.isValid, false, '大于50的数值应该无效');
        assertEqual(result.error, '最大值为50米', '最大值错误信息应该正确');

        // 测试小数位数验证
        result = validator.validateNumber('1.234', 'test');
        assertEqual(result.isValid, false, '超过2位小数应该无效');
        assertEqual(result.error, '小数点后最多2位', '小数位数错误信息应该正确');

        // 测试有效数值
        result = validator.validateNumber('1.5', 'test');
        assertEqual(result.isValid, true, '有效数值应该通过验证');
        assertEqual(result.value, 1.5, '返回的数值应该正确');

        result = validator.validateNumber('0.1', 'test');
        assertEqual(result.isValid, true, '边界值0.1应该有效');
        assertEqual(result.value, 0.1, '边界值应该正确转换');

        result = validator.validateNumber('50', 'test');
        assertEqual(result.isValid, true, '边界值50应该有效');
        assertEqual(result.value, 50, '边界值应该正确转换');

        result = validator.validateNumber('25.99', 'test');
        assertEqual(result.isValid, true, '2位小数应该有效');
        assertEqual(result.value, 25.99, '小数值应该正确转换');

        console.log('✓ 数字验证功能测试通过\n');
    }

    // 测试小数位数计算
    function testDecimalPlaces() {
        console.log('测试小数位数计算...');

        const validator = new InputValidator();

        assertEqual(validator.getDecimalPlaces('5'), 0, '整数应该返回0位小数');
        assertEqual(validator.getDecimalPlaces('5.0'), 1, '5.0应该返回1位小数');
        assertEqual(validator.getDecimalPlaces('5.12'), 2, '5.12应该返回2位小数');
        assertEqual(validator.getDecimalPlaces('5.123'), 3, '5.123应该返回3位小数');
        assertEqual(validator.getDecimalPlaces('0.1'), 1, '0.1应该返回1位小数');

        console.log('✓ 小数位数计算测试通过\n');
    }

    // 测试错误管理功能
    function testErrorManagement() {
        console.log('测试错误管理功能...');

        const validator = new InputValidator();

        // 测试显示错误
        validator.showError('testField', '测试错误信息');
        assertEqual(validator.hasErrors(), true, '显示错误后应该有错误');
        assertEqual(validator.errors.get('testField'), '测试错误信息', '错误信息应该正确存储');

        // 测试获取错误
        const errors = validator.getErrors();
        assertEqual(errors.length, 1, '应该有1个错误');
        assertEqual(errors[0][0], 'testField', '错误字段名应该正确');
        assertEqual(errors[0][1], '测试错误信息', '错误信息应该正确');

        // 测试清除单个错误
        validator.clearError('testField');
        assertEqual(validator.hasErrors(), false, '清除错误后应该没有错误');
        assertEqual(validator.errors.has('testField'), false, '错误应该被删除');

        // 测试多个错误
        validator.showError('field1', '错误1');
        validator.showError('field2', '错误2');
        assertEqual(validator.errors.size, 2, '应该有2个错误');

        // 测试清除所有错误
        validator.clearAllErrors();
        assertEqual(validator.hasErrors(), false, '清除所有错误后应该没有错误');
        assertEqual(validator.errors.size, 0, '错误Map应该为空');

        console.log('✓ 错误管理功能测试通过\n');
    }

    // 测试NumberFormatter功能
    function testNumberFormatter() {
        console.log('测试NumberFormatter功能...');

        // 测试价格格式化
        assertEqual(NumberFormatter.formatPrice(1234.56), '1,234.56', '价格格式化应该正确');
        assertEqual(NumberFormatter.formatPrice(1000), '1,000.00', '整数价格应该显示2位小数');
        assertEqual(NumberFormatter.formatPrice(0), '0.00', '零价格应该正确格式化');
        assertEqual(NumberFormatter.formatPrice(NaN), '0.00', 'NaN应该返回0.00');
        assertEqual(NumberFormatter.formatPrice('invalid'), '0.00', '无效输入应该返回0.00');

        // 测试面积格式化
        assertEqual(NumberFormatter.formatArea(12.34), '12.34', '面积格式化应该正确');
        assertEqual(NumberFormatter.formatArea(100), '100.00', '整数面积应该显示2位小数');
        assertEqual(NumberFormatter.formatArea(0), '0.00', '零面积应该正确格式化');

        // 测试小数位数限制
        assertEqual(NumberFormatter.limitDecimalPlaces('1.234', 2), '1.23', '应该限制到2位小数');
        assertEqual(NumberFormatter.limitDecimalPlaces('1.200', 2), '1.2', '应该去除尾随零');
        assertEqual(NumberFormatter.limitDecimalPlaces('1.000', 2), '1', '应该去除所有尾随零');
        assertEqual(NumberFormatter.limitDecimalPlaces('invalid', 2), '', '无效输入应该返回空字符串');

        console.log('✓ NumberFormatter功能测试通过\n');
    }

    // 测试边界情况
    function testEdgeCases() {
        console.log('测试边界情况...');

        const validator = new InputValidator();

        // 测试边界值
        let result = validator.validateNumber('0.10', 'test');
        assertEqual(result.isValid, true, '0.10应该有效');

        result = validator.validateNumber('49.99', 'test');
        assertEqual(result.isValid, true, '49.99应该有效');

        result = validator.validateNumber('50.00', 'test');
        assertEqual(result.isValid, true, '50.00应该有效');

        // 测试科学计数法
        result = validator.validateNumber('1e2', 'test');
        assertEqual(result.isValid, false, '科学计数法应该无效（因为包含字母）');

        // 测试前导零
        result = validator.validateNumber('01.5', 'test');
        assertEqual(result.isValid, true, '前导零应该有效');
        assertEqual(result.value, 1.5, '前导零应该正确转换');

        // 测试空格
        result = validator.validateNumber(' 1.5 ', 'test');
        assertEqual(result.isValid, true, '带空格的数字应该有效');
        assertEqual(result.value, 1.5, '空格应该被忽略');

        console.log('✓ 边界情况测试通过\n');
    }

    // 运行所有测试
    try {
        testValidatorInitialization();
        testNumberValidation();
        testDecimalPlaces();
        testErrorManagement();
        testNumberFormatter();
        testEdgeCases();

        console.log('🎉 所有输入验证测试通过！输入验证和错误处理功能正常工作。');
        return true;
    } catch (error) {
        console.error('❌ 测试失败:', error.message);
        console.error('错误堆栈:', error.stack);
        return false;
    }
}

// 运行测试
if (require.main === module) {
    runValidationTests();
}

module.exports = { runValidationTests };