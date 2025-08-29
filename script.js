// 参数组管理器
class ParameterSetManager {
    constructor() {
        this.parameterSets = [0]; // 参数组索引数组
        this.currentIndex = 0; // 当前激活的参数组索引
        this.wrapper = null;
        this.indicators = null;
        this.addButton = null;
    }

    init() {
        this.wrapper = document.querySelector('.parameter-sets-wrapper');
        this.indicators = document.querySelector('.parameter-indicators');
        this.addButton = document.getElementById('add-parameter-set');

        if (this.addButton) {
            this.addButton.addEventListener('click', () => this.addParameterSet());
        }

        this.updateIndicators();
    }

    addParameterSet() {
        const newIndex = this.parameterSets.length;
        this.parameterSets.push(newIndex);

        // 创建新的参数组HTML
        const newParameterSet = this.createParameterSetHTML(newIndex);
        this.wrapper.appendChild(newParameterSet);

        // 更新指示器
        this.updateIndicators();

        // 切换到新参数组
        this.switchToParameterSet(newIndex);
    }

    createParameterSetHTML(index) {
        const parameterSet = document.createElement('div');
        parameterSet.className = 'parameter-set';
        parameterSet.setAttribute('data-set-index', index);

        // 克隆第一个参数组的内容
        const firstSet = document.querySelector('.parameter-set[data-set-index="0"]');
        if (firstSet) {
            parameterSet.innerHTML = firstSet.innerHTML;

            // 更新所有input和select的id，避免重复
            const inputs = parameterSet.querySelectorAll('input, select');
            inputs.forEach(input => {
                const oldId = input.id;
                if (oldId) {
                    input.id = `${oldId}-${index}`;
                    const label = parameterSet.querySelector(`label[for="${oldId}"]`);
                    if (label) {
                        label.setAttribute('for', `${oldId}-${index}`);
                    }
                }
            });
        }

        return parameterSet;
    }

    switchToParameterSet(index) {
        if (index < 0 || index >= this.parameterSets.length) return;

        const currentSet = document.querySelector('.parameter-set.active');
        const targetSet = document.querySelector(`.parameter-set[data-set-index="${index}"]`);

        if (currentSet && targetSet) {
            // 移除当前激活状态
            currentSet.classList.remove('active');
            currentSet.classList.add('prev');

            // 激活目标参数组
            targetSet.classList.remove('prev');
            targetSet.classList.add('active');

            // 更新指示器
            const currentIndicator = document.querySelector('.parameter-indicator.active');
            const targetIndicator = document.querySelector(`.parameter-indicator[data-index="${index}"]`);

            if (currentIndicator) currentIndicator.classList.remove('active');
            if (targetIndicator) targetIndicator.classList.add('active');

            this.currentIndex = index;

            // 重新绑定事件监听器
            if (window.priceCalculatorApp) {
                window.priceCalculatorApp.bindParameterSetEvents();
            }
        }
    }

    updateIndicators() {
        if (!this.indicators) return;

        this.indicators.innerHTML = '';

        this.parameterSets.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'parameter-indicator';
            indicator.setAttribute('data-index', index);

            if (index === this.currentIndex) {
                indicator.classList.add('active');
            }

            indicator.addEventListener('click', () => this.switchToParameterSet(index));
            this.indicators.appendChild(indicator);
        });
    }
}

// 玻璃材质数据结构
const glassTypes = {
    'normal': {
        name: '普通玻璃',
        price: 65
    },
    'tempered': {
        name: '钢化玻璃',
        price: 100
    },
    'laminated': {
        name: '夹胶玻璃',
        price: 150
    },
    'insulated': {
        name: '中空玻璃',
        price: 125
    }
};

// 白玻CL规格单价配置
const clGlassPrices = {
    '4CL': 65,
    '5CL': 65,
    '6CL': 80,
    '8CL': 143,
    '10CL': 196,
    '12CL': 255,
    '15CL': 381
};

// 超白玻UCL规格单价配置
const uclGlassPrices = {
    '5UCL': 80,
    '6UCL': 105,
    '8UCL': 179,
    '10UCL': 232,
    '12UCL': 306,
    '15UCL': 488
};

// 白玻单银LSE规格单价配置
const lseGlassPrices = {
    '5LSE': 95,
    '6LSE': 110,
    '8LSE': 196,
    '10LSE': 268,
    '12LSE': 398,
    '15LSE': 587
};

// 超白单银ULSE规格单价配置
const ulseGlassPrices = {
    '5ULSE': 115,
    '6ULSE': 140,
    '8ULSE': 214,
    '10ULSE': 327,
    '12ULSE': 428
};

// 超白双银ULDE规格单价配置
const uldeGlassPrices = {
    '6ULDE': 215,
    '8ULDE': 306,
    '10ULDE': 421,
    '12ULDE': 531
};

// 真空规格单价配置
const vacuumGlassPrices = {
    '5V.3': 1063,
    '6V.3': 1063,
    '5UV.3': 1063,
    '6UV.3': 1063
};

// 腔体尺寸-幕墙结构版T系列单价配置
const cavityTSeriesPrices = {
    '9.5Ar': 135,
    '10.2Ar': 140,
    '12.2Ar': 150,
    '14.2Ar': 160,
    '15.2Ar': 170,
    '16.2Ar': 175,
    '18.2Ar': 190,
    '20.2Ar': 215,
    '22.2Ar': 240,
    '24Ar': 270
};

// 腔体尺寸-幕墙结构版T系列（带7.3后缀）单价配置
const cavityTSeries73Prices = {
    '9.5Ar-7.3': 135,
    '10.2Ar-7.3': 140,
    '12.2Ar-7.3': 150,
    '14.2Ar-7.3': 160,
    '15.2Ar-7.3': 170,
    '16.2Ar-7.3': 175,
    '18.2Ar-7.3': 190,
    '20.2Ar-7.3': 215,
    '22.2Ar-7.3': 240,
    '24Ar-7.3': 270
};

// 腔体尺寸-超低能耗版D系列单价配置
const cavityDSeriesPrices = {
    '9.5Ar-D': 115,
    '10.2Ar-D': 120,
    '12.2Ar-D': 130,
    '14.2Ar-D': 140,
    '15.2Ar-D': 150,
    '16.2Ar-D': 155,
    '18.2Ar-D': 170,
    '20.2Ar-D': 195,
    '22.2Ar-D': 220,
    '24Ar-D': 250
};

// P-PVB规格单价配置
const pPvbPrices = {
    '0.76P': 80,
    '1.14P': 120,
    '1.52P': 160,
    '2.28P': 240
};

// S-SGP规格单价配置
const sSgpPrices = {
    '0.76S进': 500,
    '1.52S进': 1000,
    '2.28S进': 1500
};

// 夹胶胶片规格单价配置
const adhesiveFilmPrices = {
    '19CBY-手单': 891,
    '26CBY-手单': 926,
    '19CBY-手双': 937,
    '26CBY-手双': 971,
    '21DBY': 1157
};

// E-EVA规格单价配置
const eEvaPrices = {
    '20利日-手单': 480,
    '20利日-手双': 503,
    '27利日DBY': 757
};

// 玻璃价格计算器类
class GlassCalculator {
    constructor() {
        this.length = 0;
        this.width = 0;
        this.quantity = 1;
        this.glassType = 'normal';
        this.packagingFee = 0;
        this.glassShape = 'normal';
        this.discountRate = 1.0;
        this.priceDifference = 0;
        this.argonGas = 0;
        this.filmCoating = '';
        this.edgeProtection = '';
        this.woodenBox = '';
        this.edgingPerPiece = 0;
        this.edging45Degree = 0;
        this.homogenization = '';
        this.frostedGlass = '';
        this.grilleVistaIG = 0;

        // 玻璃配置参数
        this.g1 = '';
        this.pvb1 = '';
        this.g2 = '';
        this.cavity1 = '';
        this.g3 = '';
        this.pvb2 = '';
        this.g4 = '';
        this.g8 = '';
    }

    // 设置长度
    setLength(length) {
        this.length = parseFloat(length) || 0;
    }

    // 设置宽度
    setWidth(width) {
        this.width = parseFloat(width) || 0;
    }

    // 设置数量
    setQuantity(quantity) {
        this.quantity = parseInt(quantity) || 1;
    }

    // 设置包装费
    setPackagingFee(fee) {
        this.packagingFee = parseFloat(fee) || 0;
    }

    // 设置玻璃形状
    setGlassShape(shape) {
        this.glassShape = shape || 'normal';
    }

    // 设置折扣率
    setDiscountRate(rate) {
        this.discountRate = parseFloat(rate) || 1.0;
    }

    // 设置其他费用差价
    setPriceDifference(difference) {
        this.priceDifference = parseFloat(difference) || 0;
    }

    // 设置氩气需求
    setArgonGas(need) {
        this.argonGas = need || '';
    }

    // 设置贴膜类型
    setFilmCoating(type) {
        this.filmCoating = type || '';
    }

    // 设置护边护角类型
    setEdgeProtection(type) {
        this.edgeProtection = type || '';
    }

    // 设置木箱需求
    setWoodenBox(need) {
        this.woodenBox = need || '';
    }

    // 设置磨边（片）单价（元/片）
    setEdgingPerPiece(price) {
        this.edgingPerPiece = parseFloat(price) || 0;
    }

    // 设置45度磨边（片数）
    setEdging45Degree(pieces) {
        this.edging45Degree = parseFloat(pieces) || 0;
    }

    // 设置均质需求
    setHomogenization(need) {
        this.homogenization = need || '';
    }

    // 设置磨砂玻璃类型
    setFrostedGlass(type) {
        this.frostedGlass = type || '';
    }

    // 设置格栅/美景条中空单价（元/㎡）
    setGrilleVistaIG(price) {
        this.grilleVistaIG = parseFloat(price) || 0;
    }

    // 计算磨砂玻璃费用
    calculateFrostedGlassFee() {
        // 磨砂玻璃费用计算：
        // 总厚度在6mm以内，单价20元/㎡/面
        // 费用 = 单价 × 订单面积 × 面数（单面×1，双面×2）

        if (!this.frostedGlass || this.frostedGlass === '') {
            return 0; // 不需要磨砂时返回0
        }

        const orderArea = this.calculateOrderArea(); // 订单面积
        if (orderArea <= 0) return 0;

        // 计算总厚度
        const totalThickness = this.getTotalGlassThickness();
        if (totalThickness <= 0) return 0;

        // 检查厚度是否在6mm以内
        if (totalThickness > 6) {
            return 0; // 超过6mm不计算磨砂费用
        }

        // 磨砂单价：20元/㎡/面
        const frostedPrice = 20;

        // 计算面数
        const faceCount = this.frostedGlass === 'single' ? 1 : this.frostedGlass === 'double' ? 2 : 0;

        // 磨砂费用 = 单价 × 订单面积 × 面数
        const frostedFee = frostedPrice * orderArea * faceCount;

        return Math.round(frostedFee * 100) / 100; // 保留2位小数
    }

    // 获取贴膜费用
    getFilmCoatingFee() {
        switch (this.filmCoating) {
            case 'customer-not-provide-single': return 6; // 客户不提供单面贴膜
            case 'customer-not-provide-double': return 12; // 客户不提供双面贴膜
            case 'customer-provide-single': return 4; // 客户提供单面贴膜
            case 'customer-provide-double': return 10; // 客户提供双面贴膜
            default: return 0; // 未选择或空值
        }
    }

    // 获取护边护角费用
    getEdgeProtectionFee() {
        switch (this.edgeProtection) {
            case 'edge': return 10; // 护边
            case 'corner': return 10; // 护角
            case 'edge-corner': return 20; // 护边护角
            default: return 0; // 未选择或空值
        }
    }

    // 获取氩气费用
    getArgonGasFee() {
        return this.argonGas === 'needed' ? 36 : 0; // 需要氩气36元/㎡，不需要0元/㎡
    }

    // 设置玻璃材质类型
    setGlassType(type) {
        if (glassTypes[type]) {
            this.glassType = type;
        }
    }

    // 计算超版
    calculateSuperVersion() {
        const width = this.width;
        const height = this.length;

        // 超版逻辑判断
        if (width <= 2400 && height > 3600) {
            return "单超";
        } else if (width > 2400 && width <= 3600 && height > 2400 && height <= 3600) {
            return "单超";
        } else if (width > 3600 && height <= 2400) {
            return "单超";
        } else if (width > 3600 && height > 2400) {
            return "双超";
        } else if (width > 2400 && height > 3600) {
            return "双超";
        } else {
            return "不超";
        }
    }

    // 计算面积 (毫米转换为平方米)
    calculateArea() {
        // 使用公式：ROUND(高 * 宽 / 1000000, 2)
        let area = (this.length * this.width) / 1000000;
        // 若为直角三角形，面积按矩形一半计算
        if (this.glassShape === 'right-triangle') {
            area = area / 2;
        }
        return Math.round(area * 100) / 100; // 保留2位小数
    }

    // 计算结算面积
    calculateSettlementArea() {
        const actualArea = this.calculateArea();
        // 结算面积公式：IF(AND(0<实际面积,实际面积<0.5),0.5,实际面积)
        // 如果实际面积大于0且小于0.5，则结算面积为0.5，否则为实际面积
        if (actualArea > 0 && actualArea < 0.5) {
            return 0.5;
        } else {
            return actualArea;
        }
    }

    // 计算订单面积
    calculateOrderArea() {
        // 订单面积 = 结算面积 × 数量
        const settlementArea = this.calculateSettlementArea();
        return settlementArea * this.quantity;
    }

    // 计算磨边周长
    calculateEdgingPerimeter() {
        // 磨边周长 = (普通磨边片数 + 45度磨边片数) × 周长（周长是长宽和乘二），单位换算为米
        const perimeter = (this.length + this.width) * 2 / 1000; // 从毫米转换为米
        const totalPieces = (parseFloat(this.edgingPerPiece) || 0) + (parseFloat(this.edging45Degree) || 0);
        const totalPerimeter = perimeter * totalPieces;
        return Math.round(totalPerimeter * 100) / 100; // 保留2位小数
    }

    // 计算45度磨边费用
    calculateEdging45DegreeFee() {
        // 45度磨边费用 = 45度磨边片数 × 单价（单价为40元/片）
        const edging45DegreeRate = 40; // 45度磨边单价
        return (parseFloat(this.edging45Degree) || 0) * edging45DegreeRate;
    }

    // 计算均质费用
    calculateHomogenizationFee() {
        // 均质费用计算方式：
        // 4平方米以内的玻璃 5元/mm/平方，每增加一平方米增加 1元/mm/平方
        // 均质费用 = (基础单价 + 增加单价) × 总厚度 × 订单面积

        if (this.homogenization !== 'needed') {
            return 0; // 不需要均质时返回0
        }

        const orderArea = this.calculateOrderArea(); // 订单面积
        if (orderArea <= 0) return 0;

        // 计算总厚度（G1 + G2 + G3 + G4 + G8的厚度）
        const totalThickness = this.getTotalGlassThickness();
        if (totalThickness <= 0) return 0;

        // 计算单价：4平方米以内5元/mm/平方，每增加1平方米增加1元/mm/平方
        let basePrice = 5; // 基础单价
        if (orderArea > 4) {
            const extraArea = Math.ceil(orderArea - 4); // 向上取整
            basePrice += extraArea; // 每增加1平方米增加1元
        }

        // 均质费用 = 单价 × 总厚度 × 订单面积
        const homogenizationFee = basePrice * totalThickness * orderArea;

        return Math.round(homogenizationFee * 100) / 100; // 保留2位小数
    }

    // 从玻璃类型字符串中提取厚度（毫米）
    extractThicknessFromGlassType(glassType) {
        if (!glassType) return 0;

        // 匹配数字开头的厚度，如 4CL, 6CL, 8CL, 10CL, 12CL, 15CL
        const thicknessMatch = glassType.match(/^(\d+)/);
        if (thicknessMatch) {
            return parseInt(thicknessMatch[1]);
        }

        return 0;
    }

    // 计算总玻璃厚度（G1 + G2 + G3 + G4 + G8）
    getTotalGlassThickness() {
        const g1Thickness = this.extractThicknessFromGlassType(this.g1);
        const g2Thickness = this.extractThicknessFromGlassType(this.g2);
        const g3Thickness = this.extractThicknessFromGlassType(this.g3);
        const g4Thickness = this.extractThicknessFromGlassType(this.g4);
        const g8Thickness = this.extractThicknessFromGlassType(this.g8);

        const totalThickness = g1Thickness + g2Thickness + g3Thickness + g4Thickness + g8Thickness;

        return totalThickness;
    }

    // 获取当前材质单价
    getUnitPrice() {
        // 单价 = 折扣单价 + 氩气 + 其他费用差价
        const discountPrice = this.calculateDiscountPrice();
        const argonGasFee = this.getArgonGasFee();
        const priceDifference = this.priceDifference || 0;
        return discountPrice + argonGasFee + priceDifference;
    }

    // 根据玻璃规格获取单价
    getGlassPrice(spec) {
        // 检查各种玻璃规格的单价
        if (clGlassPrices[spec]) {
            return clGlassPrices[spec];
        } else if (uclGlassPrices[spec]) {
            return uclGlassPrices[spec];
        } else if (lseGlassPrices[spec]) {
            return lseGlassPrices[spec];
        } else if (ulseGlassPrices[spec]) {
            return ulseGlassPrices[spec];
        } else if (uldeGlassPrices[spec]) {
            return uldeGlassPrices[spec];
        } else if (vacuumGlassPrices[spec]) {
            return vacuumGlassPrices[spec];
        } else if (cavityTSeriesPrices[spec]) {
            return cavityTSeriesPrices[spec];
        } else if (cavityTSeries73Prices[spec]) {
            return cavityTSeries73Prices[spec];
        } else if (cavityDSeriesPrices[spec]) {
            return cavityDSeriesPrices[spec];
        } else if (pPvbPrices[spec]) {
            return pPvbPrices[spec];
        } else if (sSgpPrices[spec]) {
            return sSgpPrices[spec];
        } else if (adhesiveFilmPrices[spec]) {
            return adhesiveFilmPrices[spec];
        } else if (eEvaPrices[spec]) {
            return eEvaPrices[spec];
        } else {
            return 0; // 如果规格不存在，返回0
        }
    }

    // 计算表单价
    calculateTablePrice() {
        // 获取所有选择的参数值
        const g1 = document.getElementById('g1')?.value || '';
        const pvb1 = document.getElementById('pvb1')?.value || '';
        const g2 = document.getElementById('g2')?.value || '';
        const cavity1 = document.getElementById('cavity1')?.value || '';
        const g3 = document.getElementById('g3')?.value || '';
        const pvb2 = document.getElementById('pvb2')?.value || '';
        const g4 = document.getElementById('g4')?.value || '';
        const g8 = document.getElementById('g8')?.value || '';

        // 计算表单价：所有选择参数的单价之和
        let tablePrice = 0;

        // 根据Excel公式：SUMPRODUCT逻辑
        if (g1) tablePrice += this.getGlassPrice(g1);
        if (pvb1) tablePrice += this.getGlassPrice(pvb1);
        if (g2) tablePrice += this.getGlassPrice(g2);
        if (cavity1) tablePrice += this.getGlassPrice(cavity1);
        if (g3) tablePrice += this.getGlassPrice(g3);
        if (pvb2) tablePrice += this.getGlassPrice(pvb2);
        if (g4) tablePrice += this.getGlassPrice(g4);
        if (g8) tablePrice += this.getGlassPrice(g8);

        return tablePrice;
    }

    // 计算超板单价
    calculateSuperBoardPrice() {
        const basePrice = this.calculateTablePrice();
        const superVersion = this.calculateSuperVersion();

        // 根据超版状态计算超板单价
        if (superVersion === "单超") {
            return basePrice * 1.5; // 单超：表单价 × 1.5
        } else if (superVersion === "双超") {
            return basePrice * 2.0; // 双超：表单价 × 2.0
        } else {
            return basePrice; // 不超：等于表单价
        }
    }

    // 计算异形单价
    calculateSpecialShapePrice() {
        const superBoardPrice = this.calculateSuperBoardPrice();

        // 根据玻璃形状计算异形单价（基于超板单价）
        switch (this.glassShape) {
            case 'irregular':
                return superBoardPrice * 1.1; // 异形：超板单价 × 1.1
            case 'right-triangle':
                return superBoardPrice * 1.5; // 直角三角形：超板单价 × 1.5
            case 'triangle':
                return superBoardPrice * 1.7; // 三角形：超板单价 × 1.7
            case 'curved':
                return superBoardPrice * 2.2; // 弯弧：超板单价 × 2.2
            case 'normal':
            default:
                return 0; // 标准形状：不收取异形费用
        }
    }

    // 计算折扣单价
    calculateDiscountPrice() {
        const specialShapePrice = this.calculateSpecialShapePrice();
        const superBoardPrice = this.calculateSuperBoardPrice();

        // 折扣单价=IF(异形单价="",超板单价*折扣率,异形单价*折扣率)
        if (specialShapePrice === 0 || specialShapePrice === "") {
            return superBoardPrice * this.discountRate;
        } else {
            return specialShapePrice * this.discountRate;
        }
    }

    // 计算总价格
    calculatePrice() {
        const settlementArea = this.calculateSettlementArea();
        const unitPrice = this.getUnitPrice();

        // 基础价格
        const basePrice = settlementArea * unitPrice * this.quantity;

        // 其他费用（按面积计算）
        const filmCoatingFee = this.getFilmCoatingFee();
        const otherFeesTotal = settlementArea * filmCoatingFee * this.quantity;

        // 护边护角费用（按订单面积计算）
        const orderArea = this.calculateOrderArea();
        const edgeProtectionFee = this.getEdgeProtectionFee();
        const edgeProtectionTotal = orderArea * edgeProtectionFee;

        // 木箱费用（如果需要）
        const woodenBoxFee = this.woodenBox === 'needed' ? 200 : 0; // 木箱费用200元

        // 新增费用
        const singlePerimeter = (this.length + this.width) * 2 / 1000; // 单片周长（米）
        const edgingRatePerMeter = (this.glassShape === 'normal') ? 8 : 12; // 标准8元/米，其他形状12元/米
        const edgingTotal = singlePerimeter * (parseFloat(this.edgingPerPiece) || 0) * edgingRatePerMeter; // 普通磨边费用
        const edging45DegreeTotal = this.calculateEdging45DegreeFee(); // 45度磨边费用
        const totalEdgingFee = edgingTotal + edging45DegreeTotal; // 磨边费用 + 45度磨边费用
        const homogenizationTotal = this.calculateHomogenizationFee(); // 均质费用
        const frostedTotal = this.calculateFrostedGlassFee(); // 磨砂玻璃费用
        const grilleVistaIGTotal = this.grilleVistaIG || 0; // 固定金额计费

        // 常规费用小计（不含其他费用项目）
        const regularSubtotal = basePrice;

        // 其他费用小计
        const otherSubtotal = this.packagingFee + otherFeesTotal + edgeProtectionTotal + totalEdgingFee + homogenizationTotal + frostedTotal + grilleVistaIGTotal + woodenBoxFee;

        // 总价 = 两个小计之和
        return regularSubtotal + otherSubtotal;
    }

    // 获取当前材质名称
    getGlassTypeName() {
        return glassTypes[this.glassType].name;
    }

    // 获取计算结果对象
    getCalculationResult() {
        return {
            length: this.length,
            width: this.width,
            quantity: this.quantity,
            packagingFee: this.packagingFee,
            glassShape: this.glassShape,
            discountRate: this.discountRate,
            priceDifference: this.priceDifference,
            argonGas: this.argonGas,
            filmCoating: this.filmCoating,
            edgeProtection: this.edgeProtection,
            woodenBox: this.woodenBox,
            edgingPerPiece: this.edgingPerPiece,
            edging45Degree: this.edging45Degree,
            homogenization: this.homogenization,
            frostedGlass: this.frostedGlass,
            grilleVistaIG: this.grilleVistaIG,
            superVersion: this.calculateSuperVersion(),
            area: this.calculateArea(),
            settlementArea: this.calculateSettlementArea(),
            orderArea: this.calculateOrderArea(),
            tablePrice: this.calculateTablePrice(),
            superBoardPrice: this.calculateSuperBoardPrice(),
            specialShapePrice: this.calculateSpecialShapePrice(),
            discountPrice: this.calculateDiscountPrice(),
            unitPrice: this.getUnitPrice(),
            totalPrice: this.calculatePrice(),
            // 添加可编辑的费用字段
            edgingPerimeter: this.calculateEdgingPerimeter(),
            filmCoatingTotal: this.calculateSettlementArea() * this.getFilmCoatingFee() * this.quantity,
            edgeProtectionTotal: this.calculateOrderArea() * this.getEdgeProtectionFee(),
            woodenBoxFee: this.woodenBox === 'needed' ? 200 : 0,
            frostedGlassTotal: this.calculateFrostedGlassFee(),
            grilleVistaIGTotal: this.grilleVistaIG || 0,
            edgingTotal: (this.length + this.width) * 2 / 1000 * (parseFloat(this.edgingPerPiece) || 0) * ((this.glassShape === 'normal') ? 8 : 12) + this.calculateEdging45DegreeFee(),
            homogenizationTotal: this.calculateHomogenizationFee()
        };
    }
}

// 输入验证和错误处理类
class InputValidator {
    constructor() {
        this.errors = new Map();
    }

    // 验证数字输入是否有效
    validateNumber(value, fieldName) {
        // 清除之前的错误
        this.clearError(fieldName);

        // 检查是否为空
        // if (!value || value.trim() === '') {
        //     return { isValid: false, error: '请输入数值' };
        // }

        // 检查是否为有效数字 - 使用正则表达式进行严格验证
        const trimmedValue = value.trim();

        // 使用正则表达式检查是否为有效的数字格式（包括小数）
        // if (!/^-?\d*\.?\d*$/.test(trimmedValue) || trimmedValue === '.' || trimmedValue === '-') {
        //     return { isValid: false, error: '请输入有效的数字' };
        // }

        const numValue = parseFloat(trimmedValue);
        // if (isNaN(numValue)) {
        //     return { isValid: false, error: '请输入有效的数字' };
        // }

        // 检查是否为正数（价格差价允许为负数或0）
        if (fieldName !== 'price-difference' && numValue <= 0) {
            return { isValid: false, error: '数值必须大于0' };
        }

        // 检查范围（1-50000毫米）
        // if (numValue < 1) {
        //     return { isValid: false, error: '最小值为1毫米' };
        // }

        // if (numValue > 50000) {
        //     return { isValid: false, error: '最大值为50000毫米' };
        // }

        // 检查小数位数（最多2位）
        const decimalPlaces = this.getDecimalPlaces(value);
        if (decimalPlaces > 2) {
            return { isValid: false, error: '小数点后最多2位' };
        }

        return { isValid: true, value: numValue };
    }

    // 获取小数位数
    getDecimalPlaces(value) {
        const str = value.toString();
        if (str.indexOf('.') !== -1) {
            return str.split('.')[1].length;
        }
        return 0;
    }

    // 显示错误提示
    showError(fieldName, errorMessage) {
        this.errors.set(fieldName, errorMessage);

        const inputElement = document.getElementById(fieldName);
        const errorElement = this.getOrCreateErrorElement(fieldName);

        if (inputElement && errorElement) {
            // 添加错误样式
            inputElement.classList.add('error');

            // 显示错误信息
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        }
    }

    // 清除错误提示
    clearError(fieldName) {
        this.errors.delete(fieldName);

        const inputElement = document.getElementById(fieldName);
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (inputElement) {
            inputElement.classList.remove('error');
        }

        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }

    // 获取或创建错误提示元素
    getOrCreateErrorElement(fieldName) {
        let errorElement = document.getElementById(`${fieldName}-error`);

        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.id = `${fieldName}-error`;
            errorElement.className = 'error-message';

            const inputElement = document.getElementById(fieldName);
            if (inputElement && inputElement.parentNode) {
                inputElement.parentNode.appendChild(errorElement);
            }
        }

        return errorElement;
    }

    // 清除所有错误
    clearAllErrors() {
        this.errors.clear();

        // 清除所有错误样式和消息
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(element => {
            element.style.display = 'none';
            element.textContent = '';
        });

        const inputElements = document.querySelectorAll('.input.error');
        inputElements.forEach(element => {
            element.classList.remove('error');
        });
    }

    // 检查是否有错误
    hasErrors() {
        return this.errors.size > 0;
    }

    // 获取所有错误
    getErrors() {
        return Array.from(this.errors.entries());
    }
}

// 数字格式化工具函数
class NumberFormatter {
    // 格式化价格显示（千分位分隔符）
    static formatPrice(price) {
        if (typeof price !== 'number' || isNaN(price)) {
            return '0.00';
        }
        return price.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // 格式化面积显示
    static formatArea(area) {
        if (typeof area !== 'number' || isNaN(area)) {
            return '0.00';
        }
        return area.toLocaleString('zh-CN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // 格式化尺寸显示
    static formatDimension(dimension) {
        if (typeof dimension !== 'number' || isNaN(dimension)) {
            return '0.00';
        }
        // 对于尺寸，如果是整数则不显示小数点，否则最多显示2位小数
        if (dimension % 1 === 0) {
            return dimension.toString();
        }
        return dimension.toFixed(2).replace(/\.?0+$/, '');
    }

    // 限制输入的小数位数
    static limitDecimalPlaces(value, maxPlaces = 2) {
        const num = parseFloat(value);
        if (isNaN(num)) return '';

        return num.toFixed(maxPlaces).replace(/\.?0+$/, '');
    }
}

// 实时价格计算器应用
class PriceCalculatorApp {
    constructor() {
        this.calculator = new GlassCalculator();
        this.validator = new InputValidator();
        this.parameterSetManager = new ParameterSetManager(); // 参数组管理器
        this.isCalculating = false;
        this.debounceTimer = null;
        this.displayUpdateTimer = null;
        this.domUpdateScheduled = false;

        // 性能优化相关
        this.animationFrameId = null;
        this.lastUpdateTime = 0;
        this.updateThrottle = 16; // 约60fps
        this.domCache = new Map(); // DOM元素缓存
        this.pendingUpdates = new Set(); // 待更新的元素集合

        // 数值动画相关
        this.animatingValues = new Map();
        this.animationDuration = 300; // 动画持续时间
        this.activeAnimations = new Map(); // 活跃的动画实例

        // 防抖优化配置
        this.debounceConfig = {
            input: 100,      // 输入防抖延迟 (ms)
            calculation: 50, // 计算防抖延迟 (ms)
            display: 16      // 显示更新防抖延迟 (ms, ~60fps)
        };

        // 性能监控
        this.performanceMetrics = {
            calculationCount: 0,
            averageCalculationTime: 0,
            lastCalculationTime: 0
        };

        // 结果覆写（用户编辑结果后生效）
        this.resultOverrides = {};

        this.initializeElements();
        this.bindEventListeners();
        this.parameterSetManager.init(); // 初始化参数组管理器
        this.updateDisplay();
    }

    // 初始化DOM元素引用
    initializeElements() {
        this.elements = {
            lengthInput: document.getElementById('length'),
            widthInput: document.getElementById('width'),
            quantityInput: document.getElementById('quantity'),
            packagingTypeSelect: document.getElementById('packaging-type'),
            packagingFeeInput: document.getElementById('packaging-fee'),
            glassShapeSelect: document.getElementById('glass-shape'),
            discountRateInput: document.getElementById('discount-rate'),
            priceDifferenceInput: document.getElementById('price-difference'),
            argonGasSelect: document.getElementById('argon-gas'),
            filmCoatingSelect: document.getElementById('film-coating'),
            edgeProtectionSelect: document.getElementById('edge-protection'),
            woodenBoxSelect: document.getElementById('wooden-box'),
            drillCutNotchSelect: document.getElementById('drill-cut-notch'),
            superVersionResult: document.getElementById('super-version-result'),
            areaResult: document.getElementById('area-result'),
            settlementAreaResult: document.getElementById('settlement-area-result'),
            orderAreaResult: document.getElementById('order-area-result'),
            tablePriceResult: document.getElementById('table-price-result'),
            superBoardPriceResult: document.getElementById('super-board-price-result'),
            specialShapePriceResult: document.getElementById('special-shape-price-result'),
            discountPriceResult: document.getElementById('discount-price-result'),
            unitPriceResult: document.getElementById('unit-price-result'),
            totalPriceResult: document.getElementById('total-price-result'),

            packagingFeeResult: document.getElementById('packaging-fee-result'),
            priceDifferenceResult: document.getElementById('price-difference-result'),
            argonGasResult: document.getElementById('argon-gas-result'),
            filmCoatingResult: document.getElementById('film-coating-result'),
            edgeProtectionResult: document.getElementById('edge-protection-result'),
            woodenBoxResult: document.getElementById('wooden-box-result'),
            edgingPerimeterResult: document.getElementById('edging-perimeter-result'),
            edgingPerPieceResult: document.getElementById('edging-per-piece-result'),
            edging45DegreeResult: document.getElementById('edging-45-degree-result'),
            homogenizationResult: document.getElementById('homogenization-result'),
            frostedGlassResult: document.getElementById('frosted-glass-result'),
            grilleVistaIgResult: document.getElementById('grille-vista-ig-result'),
            calculationInfo: document.getElementById('calculation-info')
        };
    }

    // 绑定参数组事件
    bindParameterSetEvents() {
        const parameterSelects = ['g1', 'pvb1', 'g2', 'cavity1', 'g3', 'pvb2', 'g4', 'g8'];
        const currentSet = document.querySelector('.parameter-set.active');

        if (currentSet) {
            parameterSelects.forEach(selectId => {
                const selectElement = currentSet.querySelector(`#${selectId}`);
                if (selectElement) {
                    // 移除旧的事件监听器
                    selectElement.removeEventListener('change', this.handleParameterChange);
                    // 添加新的事件监听器
                    selectElement.addEventListener('change', (e) => {
                        this.handleParameterChange(selectId, e.target.value);
                    });
                }
            });
        }
    }

    // 绑定事件监听器
    bindEventListeners() {
        const { lengthInput, widthInput, quantityInput } = this.elements;

        // 为所有参数下拉框添加事件监听器
        this.bindParameterSetEvents();

        // 玻璃形状选择事件监听器
        const { glassShapeSelect } = this.elements;
        if (glassShapeSelect) {
            glassShapeSelect.addEventListener('change', (e) => {
                this.handleGlassShapeChange(e.target.value);
            });
        }

        // 包装费相关事件监听器
        const { packagingTypeSelect, packagingFeeInput } = this.elements;

        if (packagingTypeSelect) {
            packagingTypeSelect.addEventListener('change', (e) => {
                this.handlePackagingTypeChange(e.target.value);
            });
        }

        if (packagingFeeInput) {
            packagingFeeInput.addEventListener('input', (e) => {
                this.handlePackagingFeeInput(e.target.value);
            });
            packagingFeeInput.addEventListener('blur', (e) => {
                this.handleInputBlur('packaging-fee', e.target.value);
            });
            packagingFeeInput.addEventListener('focus', (e) => {
                this.handleInputFocus('packaging-fee');
            });
        }

        // 其他费用相关事件监听器
        const { discountRateInput, priceDifferenceInput, argonGasSelect, filmCoatingSelect, edgeProtectionSelect, woodenBoxSelect, drillCutNotchSelect } = this.elements;

        // 新增其他费用输入
        const edgingPerPieceInput = document.getElementById('edging-per-piece');
        const edging45DegreeInput = document.getElementById('edging-45-degree');
        const grilleVistaIgInput = document.getElementById('grille-vista-ig');

        const otherFeesInputs = [
            { element: discountRateInput, id: 'discount-rate' },
            { element: priceDifferenceInput, id: 'price-difference' },
            { element: edgingPerPieceInput, id: 'edging-per-piece' },
            { element: edging45DegreeInput, id: 'edging-45-degree' },
            { element: grilleVistaIgInput, id: 'grille-vista-ig' }
        ];

        // 木箱下拉框事件监听器
        if (woodenBoxSelect) {
            woodenBoxSelect.addEventListener('change', (e) => {
                this.handleWoodenBoxChange(e.target.value);
            });
        }

        // 贴膜下拉框事件监听器
        if (filmCoatingSelect) {
            filmCoatingSelect.addEventListener('change', (e) => {
                this.handleFilmCoatingChange(e.target.value);
            });
        }

        // 护边护角下拉框事件监听器
        if (edgeProtectionSelect) {
            edgeProtectionSelect.addEventListener('change', (e) => {
                this.handleEdgeProtectionChange(e.target.value);
            });
        }

        // 氩气下拉框事件监听器
        if (argonGasSelect) {
            argonGasSelect.addEventListener('change', (e) => {
                this.handleArgonGasChange(e.target.value);
            });
        }

        // 均质下拉框事件监听器
        const homogenizationSelect = document.getElementById('homogenization');
        if (homogenizationSelect) {
            homogenizationSelect.addEventListener('change', (e) => {
                this.handleHomogenizationChange(e.target.value);
            });
        }

        // 磨砂玻璃下拉框事件监听器
        const frostedGlassSelect = document.getElementById('frosted-glass');
        if (frostedGlassSelect) {
            frostedGlassSelect.addEventListener('change', (e) => {
                this.handleFrostedGlassChange(e.target.value);
            });
        }

        // 打孔/切角/挖缺 下拉框事件监听器（仅刷新显示，不参与计算）
        const refreshOnly = () => this.debouncedUpdateDisplay();
        if (drillCutNotchSelect) drillCutNotchSelect.addEventListener('change', refreshOnly);

        // 结果值编辑提交（Enter键）
        this.bindEditableResults();

        otherFeesInputs.forEach(({ element, id }) => {
            if (element) {
                element.addEventListener('input', (e) => {
                    this.handleOtherFeesInput(id, e.target.value);
                });
                element.addEventListener('blur', (e) => {
                    this.handleInputBlur(id, e.target.value);
                });
                element.addEventListener('focus', (e) => {
                    this.handleInputFocus(id);
                });
            }
        });

        // 长度输入事件
        if (lengthInput) {
            lengthInput.addEventListener('input', (e) => {
                this.handleLengthInput(e.target.value);
            });
            lengthInput.addEventListener('blur', (e) => {
                this.handleInputBlur('length', e.target.value);
            });
            lengthInput.addEventListener('focus', (e) => {
                this.handleInputFocus('length');
            });
            lengthInput.addEventListener('keydown', (e) => {
                this.handleInputKeydown(e, 'length');
            });
            lengthInput.addEventListener('paste', (e) => {
                this.handleInputPaste(e, 'length');
            });
        }

        // 宽度输入事件
        if (widthInput) {
            widthInput.addEventListener('input', (e) => {
                this.handleWidthInput(e.target.value);
            });
            widthInput.addEventListener('blur', (e) => {
                this.handleInputBlur('width', e.target.value);
            });
            widthInput.addEventListener('focus', (e) => {
                this.handleInputFocus('width');
            });
            widthInput.addEventListener('keydown', (e) => {
                this.handleInputKeydown(e, 'width');
            });
            widthInput.addEventListener('paste', (e) => {
                this.handleInputPaste(e, 'width');
            });
        }

        // 数量输入事件
        if (quantityInput) {
            quantityInput.addEventListener('input', (e) => {
                this.handleQuantityInput(e.target.value);
            });
            quantityInput.addEventListener('blur', (e) => {
                this.handleInputBlur('quantity', e.target.value);
            });
            quantityInput.addEventListener('focus', (e) => {
                this.handleInputFocus('quantity');
            });
            quantityInput.addEventListener('keydown', (e) => {
                this.handleInputKeydown(e, 'quantity');
            });
            quantityInput.addEventListener('paste', (e) => {
                this.handleInputPaste(e, 'quantity');
            });
        }
    }

    // 处理参数变化
    handleParameterChange(parameterId, value) {
        // 根据参数ID设置对应的值到计算器
        switch (parameterId) {
            case 'g1':
                this.calculator.g1 = value;
                break;
            case 'pvb1':
                this.calculator.pvb1 = value;
                break;
            case 'g2':
                this.calculator.g2 = value;
                break;
            case 'cavity1':
                this.calculator.cavity1 = value;
                break;
            case 'g3':
                this.calculator.g3 = value;
                break;
            case 'pvb2':
                this.calculator.pvb2 = value;
                break;
            case 'g4':
                this.calculator.g4 = value;
                break;
            case 'g8':
                this.calculator.g8 = value;
                break;
        }

        // 参数变化时重新计算表单价
        this.debouncedCalculate();
    }

    // 处理包装类型变化
    handlePackagingTypeChange(packagingType) {
        // 根据包装类型设置默认费用
        let defaultFee = 0;
        switch (packagingType) {
            case 'standard':
                defaultFee = 50;
                break;
            case 'premium':
                defaultFee = 100;
                break;
            case 'custom':
                defaultFee = 200;
                break;
            default:
                defaultFee = 0;
        }

        // 更新包装费用输入框
        const { packagingFeeInput } = this.elements;
        if (packagingFeeInput && defaultFee > 0) {
            packagingFeeInput.value = defaultFee.toFixed(2);
        }

        // 重新计算总价
        this.debouncedCalculate();
    }

    // 处理包装费用输入
    handlePackagingFeeInput(value) {
        // 使用节流优化输入格式化
        this.throttledFormatInput('packaging-fee', value, (formattedValue) => {
            const isValid = this.validateInput('packaging-fee', formattedValue);
            if (isValid) {
                this.calculator.setPackagingFee(formattedValue);
                this.debouncedCalculate();
            } else {
                this.debouncedUpdateDisplay();
            }
        });
    }

    // 处理玻璃形状变化
    handleGlassShapeChange(glassShape) {
        // 设置玻璃形状并重新计算
        this.calculator.setGlassShape(glassShape);
        this.debouncedCalculate();
    }

    // 处理其他费用输入
    handleOtherFeesInput(fieldId, value) {
        // 使用节流优化输入格式化
        this.throttledFormatInput(fieldId, value, (formattedValue) => {
            const isValid = this.validateInput(fieldId, formattedValue);
            if (isValid) {
                // 设置对应的其他费用
                switch (fieldId) {
                    case 'discount-rate':
                        this.calculator.setDiscountRate(formattedValue);
                        break;
                    case 'price-difference':
                        this.calculator.setPriceDifference(formattedValue);
                        break;

                    case 'edging-per-piece':
                        this.calculator.setEdgingPerPiece(formattedValue);
                        break;
                    case 'edging-45-degree':
                        this.calculator.setEdging45Degree(formattedValue);
                        break;
                    case 'grille-vista-ig':
                        this.calculator.setGrilleVistaIG(formattedValue);
                        break;
                }
                this.debouncedCalculate();
            } else {
                this.debouncedUpdateDisplay();
            }
        });
    }

    // 处理木箱变化
    handleWoodenBoxChange(value) {
        // 设置木箱需求并重新计算
        this.calculator.setWoodenBox(value);
        this.debouncedCalculate();
    }

    // 处理贴膜变化
    handleFilmCoatingChange(value) {
        // 设置贴膜类型并重新计算
        this.calculator.setFilmCoating(value);
        this.debouncedCalculate();
    }

    // 处理护边护角变化
    handleEdgeProtectionChange(value) {
        // 设置护边护角类型并重新计算
        this.calculator.setEdgeProtection(value);
        this.debouncedCalculate();
    }

    // 处理氩气变化
    handleArgonGasChange(value) {
        // 设置氩气需求并重新计算
        this.calculator.setArgonGas(value);
        this.debouncedCalculate();
    }

    // 处理均质变化
    handleHomogenizationChange(value) {
        // 设置均质需求并重新计算
        this.calculator.setHomogenization(value);
        this.debouncedCalculate();
    }

    // 处理磨砂玻璃变化
    handleFrostedGlassChange(value) {
        // 设置磨砂玻璃类型并重新计算
        this.calculator.setFrostedGlass(value);
        this.debouncedCalculate();
    }



    // 处理长度输入（优化版本）
    handleLengthInput(value) {
        // 使用节流优化输入格式化
        this.throttledFormatInput('length', value, (formattedValue) => {
            const isValid = this.validateInput('length', formattedValue);
            if (isValid) {
                this.calculator.setLength(formattedValue);
                this.debouncedCalculate();
            } else {
                // 使用防抖更新显示，避免频繁DOM操作
                this.debouncedUpdateDisplay();
            }
        });
    }

    // 处理宽度输入（优化版本）
    handleWidthInput(value) {
        // 使用节流优化输入格式化
        this.throttledFormatInput('width', value, (formattedValue) => {
            const isValid = this.validateInput('width', formattedValue);
            if (isValid) {
                this.calculator.setWidth(formattedValue);
                this.debouncedCalculate();
            } else {
                // 使用防抖更新显示，避免频繁DOM操作
                this.debouncedUpdateDisplay();
            }
        });
    }

    // 处理数量输入（优化版本）
    handleQuantityInput(value) {
        // 使用节流优化输入格式化
        this.throttledFormatInput('quantity', value, (formattedValue) => {
            const isValid = this.validateInput('quantity', formattedValue);
            if (isValid) {
                this.calculator.setQuantity(formattedValue);
                this.debouncedCalculate();
            } else {
                // 使用防抖更新显示，避免频繁DOM操作
                this.debouncedUpdateDisplay();
            }
        });
    }

    // 节流输入格式化
    throttledFormatInput(fieldName, value, callback) {
        // 针对允许负数的字段（如 price-difference）保留负号
        let formattedValue;
        if (fieldName === 'price-difference') {
            if (!value || value.trim() === '') {
                formattedValue = '';
            } else {
                // 仅允许一个前导负号和一个小数点
                let cleaned = value.replace(/[^\d\.-]/g, '');
                // 处理多个负号：只保留首位负号
                const isNegative = cleaned.startsWith('-');
                cleaned = cleaned.replace(/-/g, '');
                cleaned = (isNegative ? '-' : '') + cleaned;
                // 确保只有一个小数点
                const parts = cleaned.split('.');
                if (parts.length > 2) {
                    cleaned = parts[0] + '.' + parts.slice(1).join('');
                }
                // 限制小数位数为2位
                const p = cleaned.split('.');
                if (p.length === 2 && p[1].length > 2) {
                    cleaned = p[0] + '.' + p[1].substring(0, 2);
                }
                formattedValue = cleaned;
            }
        } else {
            // 其他字段保持原有（不允许负号）的格式化
            formattedValue = this.formatDimensionInput(value);
        }

        // 只有当值真正改变时才更新DOM
        const inputElement = this.elements[fieldName + 'Input'];
        if (inputElement && formattedValue !== value) {
            // 使用批量DOM更新
            this.batchDOMUpdate(() => {
                inputElement.value = formattedValue;
            });
        }

        // 执行回调
        callback(formattedValue);
    }

    // 防抖显示更新
    debouncedUpdateDisplay() {
        if (this.displayUpdateTimer) {
            clearTimeout(this.displayUpdateTimer);
        }

        this.displayUpdateTimer = setTimeout(() => {
            this.updateDisplay();
        }, this.debounceConfig.display);
    }

    // 格式化尺寸输入
    formatDimensionInput(value) {
        if (!value || value.trim() === '') return '';

        // 移除非数字和小数点的字符
        let cleaned = value.replace(/[^\d.]/g, '');

        // 确保只有一个小数点
        const parts = cleaned.split('.');
        if (parts.length > 2) {
            cleaned = parts[0] + '.' + parts.slice(1).join('');
        }

        // 限制小数位数为2位
        if (parts.length === 2 && parts[1].length > 2) {
            cleaned = parts[0] + '.' + parts[1].substring(0, 2);
        }

        // 移除整数部分长度限制

        return cleaned;
    }



    // 处理输入框失去焦点
    handleInputBlur(fieldName, value) {
        const inputElement = document.getElementById(fieldName);
        if (inputElement) {
            // 移除焦点样式
            inputElement.classList.remove('focused');
        }

        const isValid = this.validateInput(fieldName, value);
        if (isValid && value) {
            // 格式化显示值（添加尾随零）
            const formattedValue = this.formatDisplayValue(value);
            if (inputElement && formattedValue !== value) {
                inputElement.value = formattedValue;
            }
        }
    }

    // 处理输入框获得焦点
    handleInputFocus(fieldName) {
        const inputElement = document.getElementById(fieldName);
        if (inputElement) {
            // 清除错误状态
            this.validator.clearError(fieldName);

            // 添加焦点样式
            inputElement.classList.add('focused');

            // 选中所有文本以便快速替换
            setTimeout(() => {
                inputElement.select();
            }, 50);
        }
    }

    // 处理键盘按键事件
    handleInputKeydown(event, fieldName) {
        const key = event.key;
        const inputElement = event.target;
        const currentValue = inputElement.value;

        // 允许的控制键
        const allowedKeys = [
            'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Home', 'End', 'PageUp', 'PageDown'
        ];

        // 允许 Ctrl/Cmd 组合键（复制、粘贴、全选等）
        if (event.ctrlKey || event.metaKey) {
            return;
        }

        // 允许控制键
        if (allowedKeys.includes(key)) {
            return;
        }

        // 只允许数字和小数点
        if (!/^[0-9.]$/.test(key)) {
            event.preventDefault();
            return;
        }

        // 限制小数点输入
        if (key === '.') {
            // 如果已经有小数点，阻止输入
            if (currentValue.includes('.')) {
                event.preventDefault();
                return;
            }
        }

        // 只限制小数部分长度为2位
        if (/^[0-9]$/.test(key)) {
            const parts = currentValue.split('.');

            // 限制小数部分长度
            if (parts.length === 2 && parts[1].length >= 2 && inputElement.selectionStart > parts[0].length) {
                event.preventDefault();
                return;
            }
        }
    }

    // 处理粘贴事件
    handleInputPaste(event, fieldName) {
        event.preventDefault();

        // 获取粘贴的文本
        const pastedText = (event.clipboardData || window.clipboardData).getData('text');

        // 格式化粘贴的文本
        const formattedValue = this.formatDimensionInput(pastedText);

        // 设置格式化后的值
        const inputElement = event.target;
        inputElement.value = formattedValue;

        // 触发输入事件
        if (fieldName === 'length') {
            this.handleLengthInput(formattedValue);
        } else if (fieldName === 'width') {
            this.handleWidthInput(formattedValue);
        }
    }

    // 格式化显示值（添加适当的小数位）
    formatDisplayValue(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return value;

        // 如果是整数，保持整数显示
        if (num % 1 === 0) {
            return num.toString();
        }

        // 如果有小数，最多显示2位
        return num.toFixed(2).replace(/\.?0+$/, '');
    }

    // 输入验证
    validateInput(fieldName, value) {
        const result = this.validator.validateNumber(value, fieldName);

        if (!result.isValid) {
            this.validator.showError(fieldName, result.error);
            return false;
        } else {
            this.validator.clearError(fieldName);
            return true;
        }
    }

    // 增强的防抖计算 - 避免频繁计算
    debouncedCalculate() {
        // 清除之前的定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // 使用优化的防抖延迟
        this.debounceTimer = setTimeout(() => {
            this.performanceOptimizedCalculate();
        }, this.debounceConfig.input);
    }

    // 性能优化的计算方法
    performanceOptimizedCalculate() {
        // 使用 requestAnimationFrame 确保在浏览器重绘前执行
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        this.animationFrameId = requestAnimationFrame(() => {
            const startTime = performance.now();

            this.calculateAndUpdate();

            // 更新性能指标
            const calculationTime = performance.now() - startTime;
            this.updatePerformanceMetrics(calculationTime);
        });
    }

    // 更新性能指标
    updatePerformanceMetrics(calculationTime) {
        this.performanceMetrics.calculationCount++;
        this.performanceMetrics.lastCalculationTime = calculationTime;

        // 计算平均计算时间
        const count = this.performanceMetrics.calculationCount;
        const avgTime = this.performanceMetrics.averageCalculationTime;
        this.performanceMetrics.averageCalculationTime =
            (avgTime * (count - 1) + calculationTime) / count;
    }

    // 立即计算（用于重要操作，如材质选择）
    immediateCalculate() {
        // 清除防抖定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        // 清除动画帧
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // 立即执行计算
        this.performanceOptimizedCalculate();
    }

    // 计算并更新显示
    calculateAndUpdate() {
        if (this.isCalculating) return;

        this.isCalculating = true;

        try {
            // 检查是否有输入错误
            if (this.validator.hasErrors()) {
                this.updateDisplay();
                return;
            }

            // 检查是否有必要的输入
            const { lengthInput, widthInput } = this.elements;
            const hasLength = lengthInput && lengthInput.value && parseFloat(lengthInput.value) > 0;
            const hasWidth = widthInput && widthInput.value && parseFloat(widthInput.value) > 0;

            if (!hasLength || !hasWidth) {
                this.updateDisplay();
                return;
            }

            // 执行计算
            const result = this.calculator.getCalculationResult();
            this.updateDisplayWithResult(result);

        } finally {
            this.isCalculating = false;
        }
    }

    // 更新显示（无结果状态）
    updateDisplay() {
        const { areaResult, unitPriceResult, totalPriceResult, calculationInfo } = this.elements;
        const { lengthInput, widthInput } = this.elements;

        // 检查输入状态
        const hasLength = lengthInput && lengthInput.value;
        const hasWidth = widthInput && widthInput.value;
        const hasErrors = this.validator.hasErrors();

        // 清除结果显示
        if (superVersionResult) superVersionResult.textContent = '--';
        if (areaResult) areaResult.textContent = '--';
        if (settlementAreaResult) settlementAreaResult.textContent = '--';
        if (orderAreaResult) orderAreaResult.textContent = '--';
        if (tablePriceResult) tablePriceResult.textContent = '--';
        if (superBoardPriceResult) superBoardPriceResult.textContent = '--';
        if (specialShapePriceResult) specialShapePriceResult.textContent = '--';
        if (discountPriceResult) discountPriceResult.textContent = '--';
        if (unitPriceResult) unitPriceResult.textContent = '--';
        if (totalPriceResult) totalPriceResult.textContent = '-- 元';
        if (packagingFeeResult) packagingFeeResult.textContent = '--';
        if (priceDifferenceResult) priceDifferenceResult.textContent = '--';
        if (argonGasResult) argonGasResult.textContent = '--';
        if (filmCoatingResult) filmCoatingResult.textContent = '--';
        if (edgeProtectionResult) edgeProtectionResult.textContent = '--';
        if (woodenBoxResult) woodenBoxResult.textContent = '--';
        if (edgingPerimeterResult) edgingPerimeterResult.textContent = '--';
        if (edgingPerPieceResult) edgingPerPieceResult.textContent = '--';
        if (homogenizationResult) homogenizationResult.textContent = '--';
        if (frostedGlassResult) frostedGlassResult.textContent = '--';
        if (grilleVistaIgResult) grilleVistaIgResult.textContent = '--';

        // 更新提示信息
        let infoText = '';
        if (hasErrors) {
            infoText = '请修正输入错误';
        } else if (!hasLength || !hasWidth) {
            infoText = '请输入完整的尺寸信息';
        } else {
            infoText = '请完善信息开始计算';
        }

        if (calculationInfo) {
            const infoElement = calculationInfo.querySelector('.info-text');
            if (infoElement) {
                infoElement.textContent = infoText;
            }
        }

        // 移除更新动画类
        this.removeUpdateAnimations();
    }

    // 应用覆写到结果对象
    applyResultOverrides(result) {
        if (!this.resultOverrides) return result;
        const merged = { ...result };
        Object.keys(this.resultOverrides).forEach((key) => {
            const val = this.resultOverrides[key];
            if (val !== undefined && val !== null && val !== '') {
                // 将可数字化的值转为数值
                const num = Number(val);
                merged[key] = isNaN(num) ? val : num;
            }
        });
        // 若面积被覆写，级联修正订单面积（若也被覆写则不动）
        if (this.resultOverrides.settlementArea !== undefined && this.resultOverrides.orderArea === undefined) {
            merged.orderArea = merged.settlementArea * merged.quantity;
        }
        return merged;
    }

    // 根据覆写结果重算依赖字段与总价
    recomputeWithOverrides(result) {
        const r = { ...result };
        const qty = r.quantity || 0;

        // 面积链：若覆写了area或settlementArea则按规则推导
        const over = this.resultOverrides || {};
        if (over.area !== undefined && over.settlementArea === undefined) {
            const area = Number(over.area) || 0;
            r.area = area;
            r.settlementArea = (area > 0 && area < 0.5) ? 0.5 : area;
        }
        if (over.settlementArea !== undefined) {
            r.settlementArea = Number(over.settlementArea) || 0;
        }
        if (over.orderArea !== undefined) {
            r.orderArea = Number(over.orderArea) || 0;
        } else {
            r.orderArea = (r.settlementArea || 0) * qty;
        }

        // 处理用户覆写
        if (over.tablePrice !== undefined) {
            r.tablePrice = Number(over.tablePrice) || 0;
        }
        if (over.discountPrice !== undefined) {
            r.discountPrice = Number(over.discountPrice) || 0;
        }
        if (over.unitPrice !== undefined) {
            r.unitPrice = Number(over.unitPrice) || 0;
        }

        // 超板与异性单价基于表单价/超版/形状重算（若用户也覆写了，优先覆写值）
        if (over.superBoardPrice === undefined) {
            const sv = r.superVersion;
            if (sv === '单超') r.superBoardPrice = r.tablePrice * 1.5;
            else if (sv === '双超') r.superBoardPrice = r.tablePrice * 2.0;
            else r.superBoardPrice = r.tablePrice; // 不超
        } else {
            r.superBoardPrice = Number(over.superBoardPrice) || 0;
        }
        if (over.specialShapePrice === undefined) {
            switch (r.glassShape) {
                case 'irregular': r.specialShapePrice = r.superBoardPrice * 1.1; break;
                case 'right-triangle': r.specialShapePrice = r.superBoardPrice * 1.5; break;
                case 'triangle': r.specialShapePrice = r.superBoardPrice * 1.7; break;
                case 'curved': r.specialShapePrice = r.superBoardPrice * 2.2; break;
                default: r.specialShapePrice = 0; break;
            }
        } else {
            r.specialShapePrice = Number(over.specialShapePrice) || 0;
        }
        if (over.discountPrice === undefined) {
            // 折扣单价 = IF(异形单价为空, 超板单价×折扣率, 异形单价×折扣率)
            const baseForDiscount = (r.specialShapePrice === 0 || r.specialShapePrice === "") ? r.superBoardPrice : r.specialShapePrice;
            r.discountPrice = baseForDiscount * (r.discountRate || 1);
        } else {
            r.discountPrice = Number(over.discountPrice) || 0;
        }

        // 费用与总价重算（按当前业务规则）
        const filmCoatingFee = this.calculator.getFilmCoatingFee();
        const otherFeesPerSqm = (this.calculator.getArgonGasFee() || 0) + filmCoatingFee;
        const otherFeesTotal = (r.settlementArea || 0) * otherFeesPerSqm * qty;
        const edgeFee = this.calculator.getEdgeProtectionFee();
        const edgeTotal = (r.orderArea || 0) * edgeFee;
        const singlePerimeter = (this.calculator.length + this.calculator.width) * 2 / 1000; // 单片周长（米）
        const edgingRatePerMeter = (r.glassShape === 'normal') ? 8 : 12;
        const edgingTotal = singlePerimeter * (Number(r.edgingPerPiece) || 0) * edgingRatePerMeter; // 普通磨边费用
        const edging45DegreeTotal = (Number(r.edging45Degree) || 0) * 40; // 45度磨边单价40元/片
        const totalEdgingFee = edgingTotal + edging45DegreeTotal; // 合并磨边费用
        const homogenizationTotal = this.calculator.calculateHomogenizationFee(); // 均质费用
        const frostedTotal = this.calculator.calculateFrostedGlassFee();
        const grilleTotal = Number(r.grilleVistaIG) || 0; // 固定金额
        const woodenBoxFee = (r.woodenBox === 'needed') ? 200 : 0;

        // 更新可编辑的费用字段
        r.filmCoatingTotal = over.filmCoatingTotal !== undefined ? Number(over.filmCoatingTotal) : (r.settlementArea || 0) * filmCoatingFee * qty;
        r.edgeProtectionTotal = over.edgeProtectionTotal !== undefined ? Number(over.edgeProtectionTotal) : edgeTotal;
        r.woodenBoxFee = over.woodenBoxFee !== undefined ? Number(over.woodenBoxFee) : woodenBoxFee;
        r.edgingPerimeter = over.edgingPerimeter !== undefined ? Number(over.edgingPerimeter) : this.calculator.calculateEdgingPerimeter();
        r.frostedGlassTotal = over.frostedGlassTotal !== undefined ? Number(over.frostedGlassTotal) : frostedTotal;
        r.grilleVistaIGTotal = over.grilleVistaIGTotal !== undefined ? Number(over.grilleVistaIGTotal) : grilleTotal;
        r.edgingTotal = over.edgingTotal !== undefined ? Number(over.edgingTotal) : totalEdgingFee;
        r.homogenizationTotal = over.homogenizationTotal !== undefined ? Number(over.homogenizationTotal) : homogenizationTotal;

        // 单价 = 折扣单价 + 氩气 + 其他费用差价（带符号相加）
        if (over.unitPrice === undefined) {
            const argonGasFee = this.calculator.getArgonGasFee();
            const priceDifference = Number(r.priceDifference) || 0;
            r.unitPrice = (Number(r.discountPrice) || 0) + argonGasFee + priceDifference;
        }
        const basePrice = (r.settlementArea || 0) * (r.unitPrice || 0) * qty;
        r.totalPrice = basePrice + (r.packagingFee || 0) + (r.priceDifference || 0)
            + otherFeesTotal + r.edgeProtectionTotal + totalEdgingFee + homogenizationTotal + r.frostedGlassTotal + r.grilleVistaIGTotal + r.woodenBoxFee;

        return r;
    }

    // 更新显示（有结果状态）
    updateDisplayWithResult(result) {
        const { areaResult, unitPriceResult, totalPriceResult, calculationInfo } = this.elements;

        // 先应用覆写并级联重算，确保后续显示全部基于最终结果
        result = this.applyResultOverrides(result);
        result = this.recomputeWithOverrides(result);

        // 添加更新动画
        this.addUpdateAnimations();

        // 更新超版显示组件
        this.updateSuperVersionDisplay(result.superVersion);

        // 更新面积显示组件
        this.updateAreaDisplay(result.area);

        // 更新结算面积显示组件
        this.updateSettlementAreaDisplay(result.settlementArea);

        // 更新订单面积显示组件
        this.updateOrderAreaDisplay(result.orderArea);

        // 更新各种单价显示组件（表单价→超板→异形→折扣→单价）
        this.updateTablePriceDisplay(result.tablePrice);
        this.updateSuperBoardPriceDisplay(result.superBoardPrice);
        this.updateSpecialShapePriceDisplay(result.specialShapePrice);
        this.updateDiscountPriceDisplay(result.discountPrice);
        this.updateUnitPriceDisplay(result.unitPrice);

        // 更新总价显示组件
        this.updateTotalPriceDisplay(result.totalPrice);

        // 更新其他费用显示组件
        this.updatePackagingFeeDisplay(result.packagingFee);
        this.updatePriceDifferenceDisplay(result.priceDifference);
        this.updateArgonGasDisplay(result.argonGas, result.settlementArea, result.quantity);
        this.updateFilmCoatingTotalDisplay(result.filmCoatingTotal);
        this.updateEdgeProtectionTotalDisplay(result.edgeProtectionTotal);
        this.updateWoodenBoxFeeDisplay(result.woodenBoxFee);
        this.updateEdgingPerimeterDisplay(result.edgingPerimeter);
        this.updateEdgingTotalDisplay(result.edgingTotal);
        this.updateHomogenizationDisplay(result.homogenizationTotal);
        this.updateFrostedGlassTotalDisplay(result.frostedGlassTotal);
        this.updateGrilleVistaIGTotalDisplay(result.grilleVistaIGTotal);

        // 更新计算过程透明度显示
        this.updateCalculationTransparency(result);
    }

    // 更新超版显示组件
    updateSuperVersionDisplay(superVersion) {
        const { superVersionResult } = this.elements;
        if (superVersionResult) {
            const newText = superVersion;

            // 只有当内容真正改变时才更新DOM
            if (superVersionResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(superVersionResult, newText, 'superVersion');
            }
        }
    }

    // 更新面积显示组件（优化版本）
    updateAreaDisplay(area) {
        const { areaResult } = this.elements;
        if (areaResult) {
            const formattedArea = NumberFormatter.formatArea(area);
            const newText = formattedArea;

            // 只有当内容真正改变时才更新DOM
            if (areaResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(areaResult, newText, 'area');

                // 批量DOM操作
                this.batchDOMUpdate(() => {
                    this.addAreaUnitHint(areaResult, area);
                });
            }
        }
    }

    // 更新结算面积显示组件
    updateSettlementAreaDisplay(settlementArea) {
        const { settlementAreaResult } = this.elements;
        if (settlementAreaResult) {
            const formattedArea = NumberFormatter.formatArea(settlementArea);
            const newText = formattedArea;

            // 只有当内容真正改变时才更新DOM
            if (settlementAreaResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(settlementAreaResult, newText, 'settlementArea');
            }
        }
    }

    // 更新订单面积显示组件
    updateOrderAreaDisplay(orderArea) {
        const { orderAreaResult } = this.elements;
        if (orderAreaResult) {
            const formattedArea = NumberFormatter.formatArea(orderArea);
            const newText = formattedArea;

            // 只有当内容真正改变时才更新DOM
            if (orderAreaResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(orderAreaResult, newText, 'orderArea');
            }
        }
    }

    // 更新表单价显示组件
    updateTablePriceDisplay(tablePrice) {
        const { tablePriceResult } = this.elements;
        if (tablePriceResult) {
            const formattedPrice = NumberFormatter.formatPrice(tablePrice);
            const newText = formattedPrice;

            // 只有当内容真正改变时才更新DOM
            if (tablePriceResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(tablePriceResult, newText, 'tablePrice');
            }
        }
    }

    // 更新超板单价显示组件
    updateSuperBoardPriceDisplay(superBoardPrice) {
        const { superBoardPriceResult } = this.elements;
        if (superBoardPriceResult) {
            let newText;
            const superVersion = this.calculator.calculateSuperVersion();

            // 找到单位span（同级的 span.unit）
            const unitSpan = superBoardPriceResult.parentElement?.querySelector('.unit');

            const hasNumericOverride = typeof superBoardPrice === 'number' && !isNaN(superBoardPrice) && superBoardPrice > 0;
            if (hasNumericOverride) {
                const formattedPrice = NumberFormatter.formatPrice(superBoardPrice);
                newText = formattedPrice;
                if (unitSpan) unitSpan.style.visibility = 'visible';
            } else if (superVersion === "不超") {
                newText = "不超";
                if (unitSpan) unitSpan.style.visibility = 'hidden';
            } else {
                const formattedPrice = NumberFormatter.formatPrice(superBoardPrice);
                newText = formattedPrice;
                if (unitSpan) unitSpan.style.visibility = 'visible';
            }

            // 根据文本是否为数字决定单位显示
            const showUnit = /\d/.test(newText);
            if (unitSpan) unitSpan.style.visibility = showUnit ? 'visible' : 'hidden';

            // 只有当内容真正改变时才更新DOM
            if (superBoardPriceResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(superBoardPriceResult, newText, 'superBoardPrice');
            }
        }
    }

    // 更新异形单价显示组件
    updateSpecialShapePriceDisplay(specialShapePrice) {
        const { specialShapePriceResult } = this.elements;
        if (specialShapePriceResult) {
            let newText;
            // 找到单位span（同级的 span.unit）
            const unitSpan = specialShapePriceResult.parentElement?.querySelector('.unit');
            const hasNumericOverride = typeof specialShapePrice === 'number' && !isNaN(specialShapePrice) && specialShapePrice > 0;
            if (hasNumericOverride) {
                const formattedPrice = NumberFormatter.formatPrice(specialShapePrice);
                newText = formattedPrice;
                if (unitSpan) unitSpan.style.visibility = 'visible';
            } else if (specialShapePrice === 0) {
                newText = "不收取";
                if (unitSpan) unitSpan.style.visibility = 'hidden';
            } else {
                const formattedPrice = NumberFormatter.formatPrice(specialShapePrice);
                newText = formattedPrice;
                if (unitSpan) unitSpan.style.visibility = 'visible';
            }

            // 根据文本是否为数字决定单位显示
            const showUnit = /\d/.test(newText);
            if (unitSpan) unitSpan.style.visibility = showUnit ? 'visible' : 'hidden';

            // 只有当内容真正改变时才更新DOM
            if (specialShapePriceResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(specialShapePriceResult, newText, 'specialShapePrice');
            }
        }
    }

    // 更新折扣单价显示组件
    updateDiscountPriceDisplay(discountPrice) {
        const { discountPriceResult } = this.elements;
        if (discountPriceResult) {
            const formattedPrice = NumberFormatter.formatPrice(discountPrice);
            const newText = formattedPrice;

            // 只有当内容真正改变时才更新DOM
            if (discountPriceResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(discountPriceResult, newText, 'discountPrice');
            }
        }
    }

    // 更新单价显示组件（优化版本）
    updateUnitPriceDisplay(unitPrice) {
        const { unitPriceResult } = this.elements;
        if (unitPriceResult) {
            const formattedPrice = NumberFormatter.formatPrice(unitPrice);
            const newText = formattedPrice;

            // 只有当内容真正改变时才更新DOM
            if (unitPriceResult.textContent !== newText) {
                // 使用平滑数值动画
                this.animateValueChange(unitPriceResult, newText, 'unitPrice');

                // 批量DOM操作
                this.batchDOMUpdate(() => {
                    unitPriceResult.setAttribute('title', `单价：¥${formattedPrice}/平方米`);
                });
            }
        }
    }



    // 更新总价显示组件（优化版本）
    updateTotalPriceDisplay(totalPrice) {
        const { totalPriceResult } = this.elements;
        if (totalPriceResult) {
            const formattedPrice = NumberFormatter.formatPrice(totalPrice);
            const newText = `¥ ${formattedPrice}`;

            // 只有当内容真正改变时才更新DOM
            if (totalPriceResult.textContent !== newText) {
                // 使用平滑数值动画，总价使用特殊的强调动画
                this.animateValueChange(totalPriceResult, newText, 'totalPrice', true);

                // 批量DOM操作
                this.batchDOMUpdate(() => {
                    // 价格等级提示已移除
                });
            }
        }
    }

    // 更新计算过程透明度显示
    updateCalculationTransparency(result) {
        const { calculationInfo } = this.elements;
        if (calculationInfo) {
            const infoElement = calculationInfo.querySelector('.info-text');
            if (infoElement) {
                // 创建详细的计算公式显示
                const calculationDetails = this.createCalculationDetails(result);
                infoElement.innerHTML = calculationDetails;

                // 添加计算过程动画
                calculationInfo.classList.add('highlight');
                setTimeout(() => {
                    calculationInfo.classList.remove('highlight');
                }, 800);
            }
        }
    }

    // 创建计算过程详细信息
    createCalculationDetails(result) {
        const { length, width, quantity, packagingFee, glassShape, discountRate, priceDifference, argonGas, filmCoating, edgeProtection, woodenBox, edgingPerPiece, edging45Degree, homogenization, frostedGlass, grilleVistaIG, superVersion, area, settlementArea, orderArea, tablePrice, superBoardPrice, specialShapePrice, discountPrice, unitPrice, totalPrice } = result;

        // 格式化数值
        const formattedLength = NumberFormatter.formatDimension(length);
        const formattedWidth = NumberFormatter.formatDimension(width);
        const formattedArea = NumberFormatter.formatArea(area);
        const formattedSettlementArea = NumberFormatter.formatArea(settlementArea);
        const formattedOrderArea = NumberFormatter.formatArea(orderArea);
        const formattedTablePrice = NumberFormatter.formatPrice(tablePrice);
        const formattedSuperBoardPrice = NumberFormatter.formatPrice(superBoardPrice);
        const formattedSpecialShapePrice = NumberFormatter.formatPrice(specialShapePrice);
        const formattedDiscountPrice = NumberFormatter.formatPrice(discountPrice);
        const formattedUnitPrice = NumberFormatter.formatPrice(unitPrice);
        const formattedPackagingFee = NumberFormatter.formatPrice(packagingFee);
        const formattedPriceDifference = NumberFormatter.formatPrice(priceDifference);
        const formattedArgonGas = NumberFormatter.formatPrice(this.calculator.getArgonGasFee());
        const filmCoatingFee = this.calculator.getFilmCoatingFee();
        const formattedFilmCoating = NumberFormatter.formatPrice(filmCoatingFee);
        const formattedEdgeProtection = NumberFormatter.formatPrice(edgeProtection);
        const woodenBoxFee = woodenBox === 'needed' ? 200 : 0;
        const formattedWoodenBoxFee = NumberFormatter.formatPrice(woodenBoxFee);

        // 新增费用格式化
        const singlePerimeter = (length + width) * 2 / 1000; // 单片周长（米）
        const totalEdgingPerimeter = singlePerimeter * ((parseFloat(edgingPerPiece) || 0) + (parseFloat(edging45Degree) || 0)); // 总磨边周长（米）
        const edgingRatePerMeter = (glassShape === 'normal') ? 8 : 12;
        const edgingTotal = singlePerimeter * (parseFloat(edgingPerPiece) || 0) * edgingRatePerMeter; // 普通磨边费用
        const edging45DegreeTotal = (parseFloat(edging45Degree) || 0) * 40; // 45度磨边费用
        const totalEdgingFee = edgingTotal + edging45DegreeTotal; // 合并磨边费用
        const frostedTotal = (parseFloat(settlementArea) || 0) * (parseFloat(frostedGlass) || 0) * (parseInt(quantity) || 0);
        const grilleVistaIGTotal = (parseFloat(settlementArea) || 0) * (parseFloat(grilleVistaIG) || 0) * (parseInt(quantity) || 0);
        const formattedEdgingRate = NumberFormatter.formatPrice(edgingRatePerMeter);
        const formattedEdgingTotal = NumberFormatter.formatPrice(edgingTotal);
        const formattedFrostedUnit = NumberFormatter.formatPrice(frostedGlass);
        const formattedFrostedTotal = NumberFormatter.formatPrice(frostedTotal);
        const formattedGrilleUnit = NumberFormatter.formatPrice(grilleVistaIG);
        const formattedGrilleTotal = NumberFormatter.formatPrice(grilleVistaIGTotal);

        const formattedTotalPrice = NumberFormatter.formatPrice(totalPrice);

        // 获取玻璃形状名称
        const getGlassShapeName = (shape) => {
            switch (shape) {
                case 'normal': return '标准形状';
                case 'irregular': return '异形';
                case 'curved': return '弯弧';
                case 'right-triangle': return '直角三角形';
                case 'triangle': return '三角形';
                default: return '标准形状';
            }
        };

        // 获取贴膜类型名称
        const getFilmCoatingName = (type) => {
            switch (type) {
                case 'customer-not-provide-single': return '客户不提供-单面贴膜';
                case 'customer-not-provide-double': return '客户不提供-双面贴膜';
                case 'customer-provide-single': return '客户提供-单面贴膜';
                case 'customer-provide-double': return '客户提供-双面贴膜';
                default: return '未选择';
            }
        };

        // 获取氩气状态名称
        const getArgonGasName = (need) => {
            return need === 'needed' ? '需要' : '不需要';
        };

        const glassShapeName = getGlassShapeName(glassShape);
        const filmCoatingName = getFilmCoatingName(filmCoating);
        const argonGasName = getArgonGasName(argonGas);

        return `
            <div class="calculation-formula">
                <div class="formula-title">
                    <strong>💡 计算过程：</strong>
                </div>
                <div class="formula-steps">
                    <div class="step">
                        <span class="step-label">1. 超版状态：</span>
                        <span class="step-formula">${formattedLength}mm × ${formattedWidth}mm → ${superVersion}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">2. 实际面积：</span>
                        <span class="step-formula">ROUND(${formattedLength}mm × ${formattedWidth}mm ÷ 1000000, 2) = ${formattedArea} 平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">3. 结算面积：</span>
                        <span class="step-formula">IF(AND(0<实际面积,实际面积<0.5), 0.5, 实际面积) = ${formattedSettlementArea} 平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">4. 订单面积：</span>
                        <span class="step-formula">${formattedSettlementArea} 平方米 × ${quantity}pcs = ${formattedOrderArea} 平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">5. 表单价：</span>
                        <span class="step-formula">所有组件价格之和 = ¥${formattedTablePrice}/平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">6. 超板单价：</span>
                        <span class="step-formula">${superVersion === "不超" ? "不超" : `表单价 × ${superVersion === "单超" ? "1.5" : "2.0"} = ¥${formattedSuperBoardPrice}/平方米`}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">7. 异形单价：</span>
                        <span class="step-formula">${glassShapeName === "标准形状" ? "不收取" : `超板单价 × ${glassShape === "irregular" ? "1.1" : glassShape === "right-triangle" ? "1.5" : glassShape === "triangle" ? "1.7" : "2.2"} = ¥${formattedSpecialShapePrice}/平方米`}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">8. 折扣单价：</span>
                        <span class="step-formula">表单价 × ${discountRate} = ¥${formattedDiscountPrice}/平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9. 其他费用（按面积）：</span>
                        <span class="step-formula">氩气(${argonGasName})¥${formattedArgonGas} + 贴膜(${filmCoatingName})¥${formattedFilmCoating} = ¥${NumberFormatter.formatPrice(this.calculator.getArgonGasFee() + filmCoatingFee)}/平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.1. 护边护角（按订单面积）：</span>
                        <span class="step-formula">订单面积 ${formattedOrderArea} × 单价(按类型) = ¥${NumberFormatter.formatPrice(orderArea * (this.calculator.getEdgeProtectionFee() || 0))}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.2. 单片周长：</span>
                        <span class="step-formula">(${length} + ${width}) × 2 = ${NumberFormatter.formatArea(singlePerimeter)} 米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.3. 磨边周长：</span>
                        <span class="step-formula">单片周长 ${NumberFormatter.formatArea(singlePerimeter)} 米 × 总片数 (${edgingPerPiece || 0} + ${edging45Degree || 0}) = ${NumberFormatter.formatArea(totalEdgingPerimeter)} 米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.4. 磨边费用：</span>
                        <span class="step-formula">单片周长 ${NumberFormatter.formatArea(singlePerimeter)} 米 × 普通磨边片数 ${edgingPerPiece || 0} × 单价¥${formattedEdgingRate}/米 = ¥${NumberFormatter.formatPrice(edgingTotal)}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.5. 45度磨边费用：</span>
                        <span class="step-formula">45度磨边片数 ${edging45Degree || 0} × 单价¥40/片 = ¥${NumberFormatter.formatPrice(edging45DegreeTotal)}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.6. 总磨边费用：</span>
                        <span class="step-formula">磨边费用¥${NumberFormatter.formatPrice(edgingTotal)} + 45度磨边费用¥${NumberFormatter.formatPrice(edging45DegreeTotal)} = ¥${NumberFormatter.formatPrice(totalEdgingFee)}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.7. 均质费用：</span>
                        <span class="step-formula">${homogenization === 'needed' ? `总厚度${this.calculator.getTotalGlassThickness()}mm × 单价¥${orderArea <= 4 ? 5 : 5 + Math.ceil(orderArea - 4)}/mm/㎡ × 订单面积${formattedOrderArea}㎡ = ¥${NumberFormatter.formatPrice(this.calculator.calculateHomogenizationFee())}` : '不需要均质 ¥0'}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.8. 磨砂玻璃费用：</span>
                        <span class="step-formula">${frostedGlass === '' ? '不需要磨砂 ¥0' : (this.calculator.getTotalGlassThickness() > 6 ? `总厚度${this.calculator.getTotalGlassThickness()}mm (超过6mm，不计算磨砂费用)` : `总厚度${this.calculator.getTotalGlassThickness()}mm (≤6mm) 单价¥20/㎡/面 × 订单面积${formattedOrderArea}㎡ × ${frostedGlass === 'single' ? '1面' : '2面'} = ¥${NumberFormatter.formatPrice(this.calculator.calculateFrostedGlassFee())}`)}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.9. 格栅/美景条中空（固定金额）：</span>
                        <span class="step-formula">用户输入固定金额 = ¥${formattedGrilleTotal}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">9.10. 木箱费用：</span>
                        <span class="step-formula">${woodenBox === 'needed' ? '需要木箱 ¥200' : '不需要木箱 ¥0'}</span>
                    </div>
                    <div class="step">
                        <span class="step-label">10. 最终单价：</span>
                        <span class="step-formula">表单价 = ¥${formattedUnitPrice}/平方米</span>
                    </div>
                    <div class="step">
                        <span class="step-label">11. 总价计算：</span>
                        <span class="step-formula">${formattedSettlementArea} 平方米 × ¥${formattedUnitPrice} × ${quantity}pcs + 包装费¥${formattedPackagingFee} + 贴膜费用¥${NumberFormatter.formatPrice(filmCoatingFee * settlementArea * quantity)} + 护边护角¥${NumberFormatter.formatPrice(orderArea * (this.calculator.getEdgeProtectionFee() || 0))} + 总磨边费用¥${NumberFormatter.formatPrice(totalEdgingFee)} + 均质费用¥${NumberFormatter.formatPrice(this.calculator.calculateHomogenizationFee())} + 磨砂¥${formattedFrostedTotal} + 格栅/美景条¥${formattedGrilleTotal} + 木箱¥${formattedWoodenBoxFee} = ¥${formattedTotalPrice}</span>
                    </div>
                </div>
                <div class="material-info-inline">
                    <small>📋 玻璃形状：${glassShapeName} | 超版：${superVersion} | 折扣率：${discountRate} | 包装费：¥${formattedPackagingFee} | 氩气：${argonGasName} | 贴膜：${filmCoatingName} | 木箱：${woodenBox === 'needed' ? '需要' : '不需要'} | 均质：${homogenization === 'needed' ? '需要' : '不需要'} | 磨砂玻璃：${frostedGlass === '' ? '不需要' : frostedGlass === 'single' ? '单面' : '双面'}</small>
                </div>
            </div>
        `;
    }

    // 添加面积单位提示
    addAreaUnitHint(element, area) {
        // 移除之前的提示
        const existingHint = element.parentNode.querySelector('.area-hint');
        if (existingHint) {
            existingHint.remove();
        }

        // 创建面积大小提示
        let hintText = '';
        if (area < 0.01) {
            hintText = '小面积';
        } else if (area < 0.1) {
            hintText = '中等面积';
        } else if (area < 1) {
            hintText = '大面积';
        } else {
            hintText = '超大面积';
        }

        const hintElement = document.createElement('small');
        hintElement.className = 'area-hint';
        hintElement.textContent = `(${hintText})`;
        hintElement.style.color = 'var(--text-hint)';
        hintElement.style.marginLeft = 'var(--spacing-xs)';

        element.appendChild(hintElement);
    }

    // 更新包装费显示组件
    updatePackagingFeeDisplay(packagingFee) {
        const { packagingFeeResult } = this.elements;
        if (packagingFeeResult) {
            const formattedFee = NumberFormatter.formatPrice(packagingFee);
            const newText = formattedFee;

            if (packagingFeeResult.textContent !== newText) {
                this.animateValueChange(packagingFeeResult, newText, 'packagingFee');
            }
        }
    }

    // 更新其他费用差价显示组件
    updatePriceDifferenceDisplay(priceDifference) {
        const { priceDifferenceResult } = this.elements;
        if (priceDifferenceResult) {
            const formattedDifference = NumberFormatter.formatPrice(priceDifference);
            const newText = formattedDifference;

            if (priceDifferenceResult.textContent !== newText) {
                this.animateValueChange(priceDifferenceResult, newText, 'priceDifference');
            }
        }
    }

    // 更新氩气费用显示组件
    updateArgonGasDisplay(argonGas, settlementArea, quantity) {
        const { argonGasResult } = this.elements;
        if (argonGasResult) {
            const argonGasFee = this.calculator.getArgonGasFee();
            const totalFee = settlementArea * argonGasFee * quantity;
            const formattedFee = NumberFormatter.formatPrice(totalFee);
            const newText = formattedFee;

            if (argonGasResult.textContent !== newText) {
                this.animateValueChange(argonGasResult, newText, 'argonGas');
            }
        }
    }

    // 更新贴膜费用显示组件
    updateFilmCoatingDisplay(filmCoating, settlementArea, quantity) {
        const { filmCoatingResult } = this.elements;
        if (filmCoatingResult) {
            const filmCoatingFee = this.calculator.getFilmCoatingFee();
            const totalFee = settlementArea * filmCoatingFee * quantity;
            const formattedFee = NumberFormatter.formatPrice(totalFee);
            const newText = `${formattedFee} 元`;

            if (filmCoatingResult.textContent !== newText) {
                this.animateValueChange(filmCoatingResult, newText, 'filmCoating');
            }
        }
    }

    // 更新护边护角费用显示组件
    updateEdgeProtectionDisplay(edgeProtection, orderArea) {
        const { edgeProtectionResult } = this.elements;
        if (edgeProtectionResult) {
            const edgeProtectionFee = this.calculator.getEdgeProtectionFee();
            const totalFee = orderArea * edgeProtectionFee;
            const formattedFee = NumberFormatter.formatPrice(totalFee);
            const newText = formattedFee;

            if (edgeProtectionResult.textContent !== newText) {
                this.animateValueChange(edgeProtectionResult, newText, 'edgeProtection');
            }
        }
    }

    // 更新木箱费用显示组件
    updateWoodenBoxDisplay(woodenBox) {
        const { woodenBoxResult } = this.elements;
        if (woodenBoxResult) {
            const woodenBoxFee = woodenBox === 'needed' ? 200 : 0;
            const formattedFee = NumberFormatter.formatPrice(woodenBoxFee);
            const newText = formattedFee;

            if (woodenBoxResult.textContent !== newText) {
                this.animateValueChange(woodenBoxResult, newText, 'woodenBox');
            }
        }
    }

    // 更新磨边费用显示
    updateEdgingPerPieceDisplay(edgingPerPiece, quantity) {
        const { edgingPerPieceResult } = this.elements;
        if (edgingPerPieceResult) {
            const edgingPerimeter = this.calculator.calculateEdgingPerimeter();
            const edgingRatePerMeter = (this.calculator.glassShape === 'normal') ? 8 : 12;
            const total = edgingPerimeter * (parseFloat(edgingPerPiece) || 0) * edgingRatePerMeter;
            const formattedFee = NumberFormatter.formatPrice(total);
            const newText = formattedFee;
            if (edgingPerPieceResult.textContent !== newText) {
                this.animateValueChange(edgingPerPieceResult, newText, 'edgingPerPiece');
            }
        }
    }

    // 更新磨边周长显示
    updateEdgingPerimeterDisplay(edgingPerimeter) {
        const { edgingPerimeterResult } = this.elements;
        if (edgingPerimeterResult) {
            const formattedPerimeter = NumberFormatter.formatArea(edgingPerimeter || 0);
            const newText = formattedPerimeter;
            if (edgingPerimeterResult.textContent !== newText) {
                this.animateValueChange(edgingPerimeterResult, newText, 'edgingPerimeter');
            }
        }
    }

    // 更新磨边费用总价显示
    updateEdgingTotalDisplay(edgingTotal) {
        const { edgingPerPieceResult } = this.elements;
        if (edgingPerPieceResult) {
            const formattedFee = NumberFormatter.formatPrice(edgingTotal || 0);
            const newText = formattedFee;
            if (edgingPerPieceResult.textContent !== newText) {
                this.animateValueChange(edgingPerPieceResult, newText, 'edgingTotal');
            }
        }
    }

    // 更新45度磨边费用显示
    updateEdging45DegreeDisplay(edging45DegreeTotal) {
        const { edging45DegreeResult } = this.elements;
        if (edging45DegreeResult) {
            const formattedFee = NumberFormatter.formatPrice(edging45DegreeTotal || 0);
            const newText = formattedFee;
            if (edging45DegreeResult.textContent !== newText) {
                this.animateValueChange(edging45DegreeResult, newText, 'edging45DegreeTotal');
            }
        }
    }

    // 更新均质费用显示
    updateHomogenizationDisplay(homogenizationTotal) {
        const { homogenizationResult } = this.elements;
        if (homogenizationResult) {
            const formattedFee = NumberFormatter.formatPrice(homogenizationTotal || 0);
            const newText = formattedFee;
            if (homogenizationResult.textContent !== newText) {
                this.animateValueChange(homogenizationResult, newText, 'homogenizationTotal');
            }
        }
    }

    // 更新磨砂玻璃费用显示
    updateFrostedGlassDisplay(frostedGlass, settlementArea, quantity) {
        const { frostedGlassResult } = this.elements;
        if (frostedGlassResult) {
            const total = (parseFloat(frostedGlass) || 0) * (parseFloat(settlementArea) || 0) * (parseInt(quantity) || 0);
            const formattedFee = NumberFormatter.formatPrice(total);
            const newText = formattedFee;
            if (frostedGlassResult.textContent !== newText) {
                this.animateValueChange(frostedGlassResult, newText, 'frostedGlass');
            }
        }
    }

    // 更新格栅/美景条中空费用显示
    updateGrilleVistaIGDisplay(grilleVistaIG, settlementArea, quantity) {
        const { grilleVistaIgResult } = this.elements;
        if (grilleVistaIgResult) {
            const total = (parseFloat(grilleVistaIG) || 0) * (parseFloat(settlementArea) || 0) * (parseInt(quantity) || 0);
            const formattedFee = NumberFormatter.formatPrice(total);
            const newText = formattedFee;
            if (grilleVistaIgResult.textContent !== newText) {
                this.animateValueChange(grilleVistaIgResult, newText, 'grilleVistaIG');
            }
        }
    }

    // 更新贴膜费用总价显示
    updateFilmCoatingTotalDisplay(filmCoatingTotal) {
        const { filmCoatingResult } = this.elements;
        if (filmCoatingResult) {
            const formattedFee = NumberFormatter.formatPrice(filmCoatingTotal || 0);
            const newText = formattedFee;
            if (filmCoatingResult.textContent !== newText) {
                this.animateValueChange(filmCoatingResult, newText, 'filmCoatingTotal');
            }
        }
    }

    // 更新护边护角费用总价显示
    updateEdgeProtectionTotalDisplay(edgeProtectionTotal) {
        const { edgeProtectionResult } = this.elements;
        if (edgeProtectionResult) {
            const formattedFee = NumberFormatter.formatPrice(edgeProtectionTotal || 0);
            const newText = formattedFee;
            if (edgeProtectionResult.textContent !== newText) {
                this.animateValueChange(edgeProtectionResult, newText, 'edgeProtectionTotal');
            }
        }
    }

    // 更新木箱费用显示
    updateWoodenBoxFeeDisplay(woodenBoxFee) {
        const { woodenBoxResult } = this.elements;
        if (woodenBoxResult) {
            const formattedFee = NumberFormatter.formatPrice(woodenBoxFee || 0);
            const newText = formattedFee;
            if (woodenBoxResult.textContent !== newText) {
                this.animateValueChange(woodenBoxResult, newText, 'woodenBoxFee');
            }
        }
    }

    // 更新磨砂费用总价显示
    updateFrostedGlassTotalDisplay(frostedGlassTotal) {
        const { frostedGlassResult } = this.elements;
        if (frostedGlassResult) {
            // 若选择了磨砂且总厚度>6mm，费用不计，结果显示"超出"
            const frostedType = this.calculator.frostedGlass; // '' | 'single' | 'double'
            const overThickness = this.calculator.getTotalGlassThickness() > 6;
            const shouldShowOver = frostedType && overThickness && (!frostedGlassTotal || Number(frostedGlassTotal) === 0);

            const newText = shouldShowOver
                ? '超出'
                : NumberFormatter.formatPrice(frostedGlassTotal || 0);

            if (frostedGlassResult.textContent !== newText) {
                this.animateValueChange(frostedGlassResult, newText, 'frostedGlassTotal');
            }
        }
    }

    // 更新格栅/美景条中空费用总价显示
    updateGrilleVistaIGTotalDisplay(grilleVistaIGTotal) {
        const { grilleVistaIgResult } = this.elements;
        if (grilleVistaIgResult) {
            const formattedFee = NumberFormatter.formatPrice(grilleVistaIGTotal || 0);
            const newText = formattedFee;
            if (grilleVistaIgResult.textContent !== newText) {
                this.animateValueChange(grilleVistaIgResult, newText, 'grilleVistaIGTotal');
            }
        }
    }



    // 添加更新动画
    addUpdateAnimations() {
        const resultValues = document.querySelectorAll('.result-value');

        resultValues.forEach(value => {
            value.classList.add('updating');
            setTimeout(() => {
                value.classList.remove('updating');
            }, 300);
        });
    }

    // 移除更新动画
    removeUpdateAnimations() {
        const resultValues = document.querySelectorAll('.result-value');

        resultValues.forEach(value => {
            value.classList.remove('updating');
        });
    }

    // 绑定可编辑结果字段的回车提交
    bindEditableResults() {
        // 绑定所有可编辑结果节点（内层数字span带有 contenteditable 和 data-override）
        const editableNodes = document.querySelectorAll('[contenteditable="true"][data-override]');
        editableNodes.forEach(node => {
            let originalContent = '';
            let isEditing = false;

            // 聚焦时保存原始内容并只显示数字
            node.addEventListener('focus', (e) => {
                if (!isEditing) {
                    originalContent = node.textContent;
                    isEditing = true;
                    // 只显示数字部分，隐藏单位
                    const match = originalContent.match(/[-+]?\d*\.?\d+/);
                    if (match) {
                        node.textContent = match[0];
                        // 选中所有文本
                        const range = document.createRange();
                        range.selectNodeContents(node);
                        const selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            });

            // 失去焦点时恢复原始内容
            node.addEventListener('blur', (e) => {
                if (isEditing) {
                    isEditing = false;
                    // 恢复原始内容（包含单位）
                    node.textContent = originalContent;
                }
            });

            // 键盘事件处理
            node.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const field = node.getAttribute('data-override');
                    const raw = node.textContent.trim();
                    // 提取数字（允许小数）
                    const match = raw.match(/[-+]?\d*\.?\d+/);
                    const value = match ? parseFloat(match[0]) : 0;
                    this.resultOverrides[field] = value;
                    // 刷新显示
                    this.calculateAndUpdate();
                    // 取消选区
                    node.blur();
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    // 取消编辑，恢复原始内容
                    node.blur();
                }
            });

            // 输入过滤，只允许数字、小数点和负号
            node.addEventListener('input', (e) => {
                if (isEditing) {
                    const text = e.target.textContent;
                    // 只保留数字、小数点和负号
                    const cleaned = text.replace(/[^\d.-]/g, '');
                    // 确保只有一个小数点
                    const parts = cleaned.split('.');
                    if (parts.length > 2) {
                        e.target.textContent = parts[0] + '.' + parts.slice(1).join('');
                    } else {
                        e.target.textContent = cleaned;
                    }
                }
            });
        });
    }





    // 平滑数值变化动画
    animateValueChange(element, newText, animationType = 'default', isHighlight = false) {
        // 取消之前的动画
        if (this.activeAnimations.has(element)) {
            this.activeAnimations.get(element).cancel();
        }

        // 创建动画配置
        const animationConfig = {
            duration: this.animationDuration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill: 'forwards'
        };

        // 根据动画类型调整配置
        if (isHighlight) {
            animationConfig.duration = 400;
            animationConfig.easing = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // 弹性效果
        }

        // 创建淡出动画
        const fadeOut = element.animate([
            { opacity: 1, transform: 'scale(1)' },
            { opacity: 0.3, transform: 'scale(0.95)' }
        ], {
            duration: animationConfig.duration / 2,
            easing: animationConfig.easing,
            fill: 'forwards'
        });

        // 动画完成后更新文本并淡入
        fadeOut.addEventListener('finish', () => {
            // 更新文本内容
            element.textContent = newText;

            // 创建淡入动画
            const fadeIn = element.animate([
                { opacity: 0.3, transform: 'scale(0.95)' },
                { opacity: 1, transform: isHighlight ? 'scale(1.05)' : 'scale(1)' }
            ], {
                duration: animationConfig.duration / 2,
                easing: animationConfig.easing,
                fill: 'forwards'
            });

            // 如果是高亮动画，添加额外的弹跳效果
            if (isHighlight) {
                fadeIn.addEventListener('finish', () => {
                    const bounce = element.animate([
                        { transform: 'scale(1.05)' },
                        { transform: 'scale(1)' }
                    ], {
                        duration: 200,
                        easing: 'ease-out',
                        fill: 'forwards'
                    });

                    this.activeAnimations.set(element, bounce);
                });
            }

            this.activeAnimations.set(element, fadeIn);
        });

        this.activeAnimations.set(element, fadeOut);
    }

    // 批量DOM更新优化
    batchDOMUpdate(updateFunction) {
        // 将DOM更新添加到待处理队列
        this.pendingUpdates.add(updateFunction);

        // 使用 requestAnimationFrame 批量处理DOM更新
        if (!this.domUpdateScheduled) {
            this.domUpdateScheduled = true;

            requestAnimationFrame(() => {
                // 执行所有待处理的DOM更新
                this.pendingUpdates.forEach(update => {
                    try {
                        update();
                    } catch (error) {
                        console.warn('DOM更新错误:', error);
                    }
                });

                // 清空队列
                this.pendingUpdates.clear();
                this.domUpdateScheduled = false;
            });
        }
    }

    // 优化的DOM查询缓存
    getCachedElement(selector) {
        if (!this.domCache.has(selector)) {
            const element = document.querySelector(selector);
            this.domCache.set(selector, element);
        }
        return this.domCache.get(selector);
    }

    // 清理DOM缓存
    clearDOMCache() {
        this.domCache.clear();
    }

    // 节流函数 - 限制函数执行频率
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 获取性能指标
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            activeAnimations: this.activeAnimations.size,
            pendingUpdates: this.pendingUpdates.size,
            domCacheSize: this.domCache.size
        };
    }

    // 格式化价格显示（人民币格式）
    static formatCurrency(amount) {
        return NumberFormatter.formatPrice(amount);
    }

    // 手动触发计算（供外部调用）
    recalculate() {
        this.calculateAndUpdate();
    }

    // 重置计算器（优化版本）
    reset() {
        // 清理所有定时器和动画
        this.cleanup();

        // 批量清除输入
        this.batchDOMUpdate(() => {
            Object.values(this.elements).forEach(element => {
                if (element && (element.tagName === 'INPUT' || element.tagName === 'SELECT')) {
                    element.value = '';
                    element.classList.remove('success', 'error', 'focused', 'has-value');
                }
            });
        });

        // 重置计算器状态
        this.calculator = new GlassCalculator();

        // 清除所有错误
        this.validator.clearAllErrors();

        // 重置性能指标
        this.performanceMetrics = {
            calculationCount: 0,
            averageCalculationTime: 0,
            lastCalculationTime: 0
        };

        // 更新显示
        this.updateDisplay();
    }

    // 清理资源
    cleanup() {
        // 清除所有定时器
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;
        }

        if (this.displayUpdateTimer) {
            clearTimeout(this.displayUpdateTimer);
            this.displayUpdateTimer = null;
        }

        // 清除动画帧
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // 取消所有活跃的动画
        this.activeAnimations.forEach(animation => {
            try {
                animation.cancel();
            } catch (error) {
                // 忽略已经完成的动画错误
            }
        });
        this.activeAnimations.clear();

        // 清空待处理的更新
        this.pendingUpdates.clear();
        this.domUpdateScheduled = false;

        // 清理DOM缓存
        this.clearDOMCache();
    }

    // 销毁实例
    destroy() {
        this.cleanup();

        // 移除事件监听器
        Object.values(this.elements).forEach(element => {
            if (element) {
                element.removeEventListener('input', this.handleLengthInput);
                element.removeEventListener('input', this.handleWidthInput);
                element.removeEventListener('change', this.handleGlassTypeChange);
                element.removeEventListener('blur', this.handleInputBlur);
                element.removeEventListener('focus', this.handleInputFocus);
                element.removeEventListener('keydown', this.handleInputKeydown);
                element.removeEventListener('paste', this.handleInputPaste);
            }
        });

        // 清空引用
        this.elements = null;
        this.calculator = null;
        this.validator = null;
    }
}

// 初始化应用程序
document.addEventListener('DOMContentLoaded', function () {
    // 创建应用实例
    window.priceCalculatorApp = new PriceCalculatorApp();

    // 添加页面加载动画
    document.body.classList.add('page-loading');
});

// 输入验证函数
function validateInput(fieldName, value, validator) {
    const result = validator.validateNumber(value, fieldName);

    if (!result.isValid) {
        validator.showError(fieldName, result.error);
        return false;
    } else {
        validator.clearError(fieldName);
        return true;
    }
}

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GlassCalculator,
        glassTypes,
        InputValidator,
        NumberFormatter,
        validateInput
    };
}