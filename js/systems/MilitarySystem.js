/**
 * 帝王模拟器2 - 军事系统类
 * 管理军队、战争、将领等
 */

class MilitarySystem {
    constructor() {
        // 军队列表
        this.armies = [];
        
        // 将领列表
        this.generals = [];
        
        // 军事设施
        this.facilities = {
            barracks: 0,      // 兵营
            trainingGround: 0, // 训练场
            blacksmith: 0,    // 铁匠铺
            stables: 0        // 马厩
        };
        
        // 战争历史
        this.warHistory = [];
    }
    
    /**
     * 初始化军事系统
     */
    init() {
        // 创建初始军队
        this.armies.push({
            id: 'army_1',
            name: '禁卫军',
            size: 100000,
            morale: 80,
            training: 70,
            equipment: 60,
            general: null
        });
        
        console.log('军事系统初始化完成');
    }
    
    /**
     * 招募士兵
     */
    recruitSoldiers(amount) {
        if (!game || !game.resources) return { success: false, message: '系统错误' };
        
        const cost = amount * 10; // 每人10两
        
        if (game.resources.money < cost) {
            return { success: false, message: '国库资金不足' };
        }
        
        game.resources.money -= cost;
        game.resources.army += amount;
        
        return { success: true, message: `成功招募${amount}名士兵` };
    }
    
    /**
     * 训练军队
     */
    trainArmy() {
        if (!game || !game.resources) return { success: false, message: '系统错误' };
        
        const cost = 100000; // 训练费用
        
        if (game.resources.money < cost) {
            return { success: false, message: '国库资金不足' };
        }
        
        game.resources.money -= cost;
        
        // 提升军队士气
        this.armies.forEach(army => {
            army.morale = Math.min(100, army.morale + 10);
            army.training = Math.min(100, army.training + 5);
        });
        
        return { success: true, message: '军队训练完成，士气提升' };
    }
    
    /**
     * 发动战争
     */
    launchWar(target, armySize) {
        if (!game || !game.resources) return { success: false, message: '系统错误' };
        
        if (game.resources.army < armySize) {
            return { success: false, message: '军队数量不足' };
        }
        
        // 模拟战争结果
        const winProbability = 0.5 + (this.armies[0]?.training || 50) / 200;
        const isWin = Math.random() < winProbability;
        
        // 计算损失
        const losses = Math.floor(armySize * (0.1 + Math.random() * 0.2));
        game.resources.army -= losses;
        
        // 记录战争
        this.warHistory.push({
            target: target,
            result: isWin ? 'win' : 'lose',
            armySize: armySize,
            losses: losses,
            date: game.getDateString()
        });
        
        if (isWin) {
            // 胜利奖励
            const reward = 1000000 + Math.floor(Math.random() * 2000000);
            game.resources.money += reward;
            game.resources.prestige = (game.resources.prestige || 0) + 10;
            
            return { success: true, message: `战争胜利！获得${reward}两白银，声望+10`, isWin: true };
        } else {
            game.resources.prestige = Math.max(0, (game.resources.prestige || 0) - 5);
            return { success: false, message: '战争失败，损失惨重', isWin: false };
        }
    }
    
    /**
     * 回合结束处理
     */
    onTurnEnd() {
        // 军队自然损耗
        this.armies.forEach(army => {
            const decay = Math.floor(army.size * 0.005); // 每月0.5%损耗
            army.size = Math.max(0, army.size - decay);
        });
        
        // 士气自然下降
        this.armies.forEach(army => {
            army.morale = Math.max(0, army.morale - 2);
        });
    }
    
    /**
     * 获取数据（用于保存）
     */
    getData() {
        return {
            armies: this.armies,
            generals: this.generals,
            facilities: this.facilities,
            warHistory: this.warHistory
        };
    }
    
    /**
     * 加载数据
     */
    loadData(data) {
        if (data.armies) this.armies = data.armies;
        if (data.generals) this.generals = data.generals;
        if (data.facilities) this.facilities = data.facilities;
        if (data.warHistory) this.warHistory = data.warHistory;
    }
}

// 为了兼容性
if (typeof window !== 'undefined') {
    window.MilitarySystem = MilitarySystem;
}
