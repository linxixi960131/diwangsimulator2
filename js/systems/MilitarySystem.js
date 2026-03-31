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

        // 将领姓名库
        this.generalSurnames = ['李', '王', '张', '赵', '陈', '卫', '霍', '岳', '韩', '白'];
        this.generalNames = ['靖', '翦', '良', '信', '飞', '青', '去病', '忠', '广', '起'];
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

        // 难度系数影响胜率和奖励
        const difficultyMap = {
            '北方匈奴': { modifier: -0.1, rewardMultiplier: 1.5, lossMultiplier: 1.2 },
            '西域小国': { modifier: 0.15, rewardMultiplier: 0.8, lossMultiplier: 0.7 },
            '南方蛮族': { modifier: 0, rewardMultiplier: 1.0, lossMultiplier: 1.0 },
            '东海倭寇': { modifier: -0.2, rewardMultiplier: 2.0, lossMultiplier: 1.5 }
        };
        const diff = difficultyMap[target] || { modifier: 0, rewardMultiplier: 1.0, lossMultiplier: 1.0 };

        // 胜率 = 基础0.4 + 训练度/200 + 难度修正 + 兵力优势修正 + 将领加成 + 装备加成
        const training = this.armies[0]?.training || 50;
        const sizeBonus = Math.min(0.1, armySize / 1000000 * 0.05);
        const generalBonus = this.getGeneralBonus();
        const equipBonus = this.getFacilityBonuses().equipmentBonus / 100;
        const winProbability = Math.max(0.05, Math.min(0.95, 0.4 + training / 200 + diff.modifier + sizeBonus + generalBonus + equipBonus));
        const isWin = Math.random() < winProbability;

        // 计算损失（受难度影响）
        const baseLossRate = isWin ? (0.05 + Math.random() * 0.1) : (0.15 + Math.random() * 0.2);
        const losses = Math.floor(armySize * baseLossRate * diff.lossMultiplier);
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
            const baseReward = 1000000 + Math.floor(Math.random() * 2000000);
            const reward = Math.floor(baseReward * diff.rewardMultiplier);
            game.resources.money += reward;
            game.resources.prestige = Math.min(100, (game.resources.prestige || 0) + Math.floor(10 * diff.rewardMultiplier));
            game.resources.people = Math.min(100, game.resources.people + 3);

            return { success: true, message: `征讨${target}大捷！获得${game.formatNumber(reward)}两白银，声望+${Math.floor(10 * diff.rewardMultiplier)}`, isWin: true };
        } else {
            game.resources.prestige = Math.max(0, (game.resources.prestige || 0) - 8);
            game.resources.people = Math.max(0, game.resources.people - 3);
            return { success: false, message: `征讨${target}失败，损失惨重。声望-8，民心-3`, isWin: false };
        }
    }
    
    /**
     * 生成随机将领
     */
    generateGeneral() {
        const surname = this.generalSurnames[Math.floor(Math.random() * this.generalSurnames.length)];
        const name = this.generalNames[Math.floor(Math.random() * this.generalNames.length)];
        return {
            id: Date.now() + Math.random(),
            name: surname + name,
            command: Math.floor(Math.random() * 40) + 40, // 统帅 40-80
            strength: Math.floor(Math.random() * 40) + 40, // 武力 40-80
            intelligence: Math.floor(Math.random() * 40) + 40, // 智力 40-80
            loyalty: Math.floor(Math.random() * 30) + 60, // 忠诚 60-90
            age: Math.floor(Math.random() * 25) + 25,
            assigned: false
        };
    }

    /**
     * 招募将领
     */
    recruitGeneral() {
        const general = this.generateGeneral();
        this.generals.push(general);
        return general;
    }

    /**
     * 获取将领对战争的加成
     */
    getGeneralBonus() {
        const assignedGeneral = this.generals.find(g => g.assigned);
        if (!assignedGeneral) return 0;
        return (assignedGeneral.command + assignedGeneral.strength + assignedGeneral.intelligence) / 600; // 最高约0.4
    }

    /**
     * 升级军事设施
     */
    upgradeFacility(type) {
        if (!game || !game.resources) return { success: false, message: '系统错误' };

        const costs = {
            barracks: 500000,
            trainingGround: 800000,
            blacksmith: 1000000,
            stables: 1200000
        };
        const names = {
            barracks: '兵营', trainingGround: '训练场', blacksmith: '铁匠铺', stables: '马厩'
        };

        const cost = costs[type];
        if (!cost) return { success: false, message: '未知设施' };
        if (this.facilities[type] >= 5) return { success: false, message: `${names[type]}已达最高等级` };
        if (game.resources.money < cost) return { success: false, message: '国库不足' };

        game.resources.money -= cost;
        this.facilities[type]++;

        return { success: true, message: `${names[type]}升至${this.facilities[type]}级！` };
    }

    /**
     * 获取设施加成
     */
    getFacilityBonuses() {
        return {
            recruitCap: this.facilities.barracks * 50000, // 兵营：增加招募上限
            trainingBonus: this.facilities.trainingGround * 3, // 训练场：训练效率
            equipmentBonus: this.facilities.blacksmith * 5, // 铁匠铺：装备加成
            moraleBonus: this.facilities.stables * 2 // 马厩：士气保持
        };
    }

    /**
     * 回合结束处理
     */
    onTurnEnd() {
        const bonuses = this.getFacilityBonuses();

        // 军队自然损耗（兵营减少损耗）
        this.armies.forEach(army => {
            const decayRate = Math.max(0.001, 0.005 - this.facilities.barracks * 0.0005);
            const decay = Math.floor(army.size * decayRate);
            army.size = Math.max(0, army.size - decay);
        });

        // 士气自然下降（马厩减缓下降）
        this.armies.forEach(army => {
            const moraleDecay = Math.max(0, 2 - bonuses.moraleBonus);
            army.morale = Math.max(0, army.morale - moraleDecay);
        });

        // 10%概率发现将领（最多5个）
        if (this.generals.length < 5 && Math.random() < 0.1) {
            const general = this.generateGeneral();
            this.generals.push(general);
            if (game) {
                game.showNotification(`发现将才：${general.name}（统帅${general.command}）`, 'info');
            }
        }
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
