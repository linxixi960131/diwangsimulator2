/**
 * 帝王模拟器2 - 资源类
 * 管理国家资源：国库、粮食、军队、民心等
 */

class Resources {
    constructor() {
        // 基础资源
        this.money = 0;        // 国库银两
        this.food = 0;         // 粮食储备
        this.army = 0;         // 军队数量
        this.people = 0;       // 民心指数 (0-100)
        
        // 特殊资源
        this.order = 0;        // 政令点数
        this.maxOrder = 10;    // 最大政令点数
        this.prestige = 0;     // 声望
        this.stability = 50;   // 国家稳定度 (0-100)
        
        // 月度收支记录
        this.monthlyIncome = {
            tax: 0,
            trade: 0,
            other: 0
        };
        this.monthlyExpense = {
            army: 0,
            official: 0,
            project: 0,
            other: 0
        };
        
        // 资源历史记录
        this.history = [];
    }
    
    /**
     * 初始化资源
     */
    init(data) {
        this.money = data.money || 5000000;
        this.food = data.food || 10000000;
        this.army = data.army || 500000;
        this.people = data.people || 80;
        this.order = data.order || 10;
        this.prestige = data.prestige || 50;
        this.stability = data.stability || 50;
        
        console.log('资源初始化完成:', this.getData());
    }
    
    /**
     * 获取资源数据（用于保存）
     */
    getData() {
        return {
            money: this.money,
            food: this.food,
            army: this.army,
            people: this.people,
            order: this.order,
            maxOrder: this.maxOrder,
            prestige: this.prestige,
            stability: this.stability,
            monthlyIncome: { ...this.monthlyIncome },
            monthlyExpense: { ...this.monthlyExpense }
        };
    }
    
    /**
     * 加载资源数据
     */
    loadData(data) {
        this.money = data.money || 0;
        this.food = data.food || 0;
        this.army = data.army || 0;
        this.people = data.people || 50;
        this.order = data.order || 10;
        this.maxOrder = data.maxOrder || 10;
        this.prestige = data.prestige || 0;
        this.stability = data.stability || 50;
        this.monthlyIncome = data.monthlyIncome || { tax: 0, trade: 0, other: 0 };
        this.monthlyExpense = data.monthlyExpense || { army: 0, official: 0, project: 0, other: 0 };
    }
    
    /**
     * 增加资源
     */
    add(resource, amount) {
        if (this[resource] !== undefined) {
            this[resource] += amount;
            
            // 限制某些资源的上限
            if (resource === 'people') {
                this[resource] = Math.min(100, Math.max(0, this[resource]));
            } else if (resource === 'stability') {
                this[resource] = Math.min(100, Math.max(0, this[resource]));
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * 消耗资源
     */
    consume(resource, amount) {
        if (this[resource] !== undefined && this[resource] >= amount) {
            this[resource] -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * 检查资源是否足够
     */
    hasEnough(resource, amount) {
        return this[resource] !== undefined && this[resource] >= amount;
    }
    
    /**
     * 设置资源值
     */
    set(resource, value) {
        if (this[resource] !== undefined) {
            this[resource] = value;
            return true;
        }
        return false;
    }
    
    /**
     * 获取资源值
     */
    get(resource) {
        return this[resource];
    }
    
    /**
     * 计算月度收入
     */
    calculateMonthlyIncome() {
        // 税收收入 = 民心指数 * 基础税率 * 人口系数
        const taxIncome = this.people * 1000 * (this.people / 100);
        
        // 贸易收入（基于声望）
        const tradeIncome = this.prestige * 100;
        
        // 其他收入
        const otherIncome = 0;
        
        this.monthlyIncome = {
            tax: taxIncome,
            trade: tradeIncome,
            other: otherIncome
        };
        
        return taxIncome + tradeIncome + otherIncome;
    }
    
    /**
     * 计算月度支出
     */
    calculateMonthlyExpense() {
        // 军队开支 = 军队数量 * 每人军费
        const armyExpense = this.army * 5;
        
        // 官员俸禄（需要官员系统数据）
        const officialExpense = game ? game.officialSystem.getTotalSalary() : 0;
        
        // 工程开支
        const projectExpense = 0;
        
        // 其他开支
        const otherExpense = 0;
        
        this.monthlyExpense = {
            army: armyExpense,
            official: officialExpense,
            project: projectExpense,
            other: otherExpense
        };
        
        return armyExpense + officialExpense + projectExpense + otherExpense;
    }
    
    /**
     * 月度结算
     */
    monthlySettlement() {
        // 计算收支
        const income = this.calculateMonthlyIncome();
        const expense = this.calculateMonthlyExpense();
        const netIncome = income - expense;
        
        // 更新国库
        this.money += netIncome;
        
        // 记录历史
        this.history.push({
            turn: game ? game.state.turn : 0,
            income: { ...this.monthlyIncome },
            expense: { ...this.monthlyExpense },
            netIncome: netIncome,
            resources: this.getData()
        });
        
        // 限制历史记录长度
        if (this.history.length > 120) {
            this.history.shift();
        }
        
        return {
            income,
            expense,
            netIncome
        };
    }
    
    /**
     * 重置政令
     */
    resetOrder() {
        this.order = this.maxOrder;
    }
    
    /**
     * 使用政令
     */
    useOrder(amount = 1) {
        if (this.order >= amount) {
            this.order -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * 检查资源状况
     */
    checkResourceStatus() {
        const status = {
            money: 'normal',
            food: 'normal',
            people: 'normal',
            stability: 'normal'
        };
        
        // 检查国库
        if (this.money < 0) {
            status.money = 'critical';
        } else if (this.money < 1000000) {
            status.money = 'low';
        }
        
        // 检查民心
        if (this.people < 30) {
            status.people = 'critical';
        } else if (this.people < 50) {
            status.people = 'low';
        }
        
        // 检查稳定度
        if (this.stability < 30) {
            status.stability = 'critical';
        } else if (this.stability < 50) {
            status.stability = 'low';
        }
        
        return status;
    }
    
    /**
     * 格式化数字显示
     */
    formatNumber(num) {
        if (num >= 100000000) {
            return (num / 100000000).toFixed(1) + '亿';
        } else if (num >= 10000) {
            return (num / 10000).toFixed(1) + '万';
        } else {
            return num.toString();
        }
    }
}
