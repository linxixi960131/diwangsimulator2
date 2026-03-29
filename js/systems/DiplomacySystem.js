/**
 * 帝王模拟器2 - 外交系统类
 * 管理外交关系、贸易、联盟等
 */

class DiplomacySystem {
    constructor() {
        // 国家列表
        this.nations = [];
        
        // 外交关系
        this.relations = {};
        
        // 贸易协定
        this.tradeAgreements = [];
        
        // 军事同盟
        this.alliances = [];
        
        // 外交历史
        this.diplomacyHistory = [];
        
        // 初始化国家
        this.initNations();
    }
    
    /**
     * 初始化国家
     */
    initNations() {
        this.nations = [
            { id: 'turkic', name: '突厥', strength: 80, relation: -20, trade: false },
            { id: 'goryeo', name: '高丽', strength: 50, relation: 30, trade: true },
            { id: 'tibet', name: '吐蕃', strength: 60, relation: -10, trade: false },
            { id: 'nanzhao', name: '南诏', strength: 40, relation: 10, trade: true },
            { id: 'japan', name: '日本', strength: 45, relation: 20, trade: true }
        ];
    }
    
    /**
     * 初始化外交系统
     */
    init() {
        console.log('外交系统初始化完成，当前邻国数量:', this.nations.length);
    }
    
    /**
     * 改善关系
     */
    improveRelation(nationId, amount = 10) {
        const nation = this.nations.find(n => n.id === nationId);
        if (!nation) {
            return { success: false, message: '国家不存在' };
        }
        
        nation.relation = Math.min(100, nation.relation + amount);
        
        this.diplomacyHistory.push({
            type: 'improve_relation',
            nation: nation.name,
            amount: amount,
            date: game ? game.getDateString() : ''
        });
        
        return { success: true, message: `与${nation.name}的关系改善了${amount}点` };
    }
    
    /**
     * 恶化关系
     */
    worsenRelation(nationId, amount = 10) {
        const nation = this.nations.find(n => n.id === nationId);
        if (!nation) {
            return { success: false, message: '国家不存在' };
        }
        
        nation.relation = Math.max(-100, nation.relation - amount);
        
        this.diplomacyHistory.push({
            type: 'worsen_relation',
            nation: nation.name,
            amount: amount,
            date: game ? game.getDateString() : ''
        });
        
        return { success: true, message: `与${nation.name}的关系恶化了${amount}点` };
    }
    
    /**
     * 建立贸易关系
     */
    establishTrade(nationId) {
        const nation = this.nations.find(n => n.id === nationId);
        if (!nation) {
            return { success: false, message: '国家不存在' };
        }
        
        if (nation.trade) {
            return { success: false, message: '已经与该国家建立贸易关系' };
        }
        
        if (nation.relation < 0) {
            return { success: false, message: '关系不佳，无法建立贸易关系' };
        }
        
        nation.trade = true;
        
        // 贸易收入
        if (game && game.resources) {
            const tradeIncome = 500000 + Math.floor(Math.random() * 500000);
            game.resources.money += tradeIncome;
        }
        
        this.diplomacyHistory.push({
            type: 'establish_trade',
            nation: nation.name,
            date: game ? game.getDateString() : ''
        });
        
        return { success: true, message: `与${nation.name}建立贸易关系，获得贸易收入` };
    }
    
    /**
     * 缔结同盟
     */
    formAlliance(nationId) {
        const nation = this.nations.find(n => n.id === nationId);
        if (!nation) {
            return { success: false, message: '国家不存在' };
        }
        
        if (this.alliances.includes(nationId)) {
            return { success: false, message: '已经与该国家缔结同盟' };
        }
        
        if (nation.relation < 50) {
            return { success: false, message: '关系不够友好，无法缔结同盟' };
        }
        
        this.alliances.push(nationId);
        
        this.diplomacyHistory.push({
            type: 'form_alliance',
            nation: nation.name,
            date: game ? game.getDateString() : ''
        });
        
        return { success: true, message: `与${nation.name}缔结军事同盟` };
    }
    
    /**
     * 回合结束处理
     */
    onTurnEnd() {
        // 贸易收入
        this.nations.forEach(nation => {
            if (nation.trade && game && game.resources) {
                const income = 50000 + Math.floor(Math.random() * 50000);
                game.resources.money += income;
            }
        });
        
        // 关系自然变化
        this.nations.forEach(nation => {
            const change = Math.random() < 0.5 ? 1 : -1;
            nation.relation = Math.max(-100, Math.min(100, nation.relation + change));
        });
    }
    
    /**
     * 获取数据（用于保存）
     */
    getData() {
        return {
            nations: this.nations,
            relations: this.relations,
            tradeAgreements: this.tradeAgreements,
            alliances: this.alliances,
            diplomacyHistory: this.diplomacyHistory
        };
    }
    
    /**
     * 加载数据
     */
    loadData(data) {
        if (data.nations) this.nations = data.nations;
        if (data.relations) this.relations = data.relations;
        if (data.tradeAgreements) this.tradeAgreements = data.tradeAgreements;
        if (data.alliances) this.alliances = data.alliances;
        if (data.diplomacyHistory) this.diplomacyHistory = data.diplomacyHistory;
    }
}

// 为了兼容性
if (typeof window !== 'undefined') {
    window.DiplomacySystem = DiplomacySystem;
}
