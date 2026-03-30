/**
 * 帝王模拟器2 - 玩家类
 * 管理皇帝的所有属性和状态
 */

class Player {
    constructor() {
        // 基本信息
        this.dynastyName = '';
        this.emperorTitle = '';
        this.emperorName = '';
        this.avatar = 0; // 头像索引
        this.age = 20;
        this.maxAge = 62; // 默认寿命
        
        // 属性
        this.attributes = {
            literature: 20,  // 文学
            martial: 20,     // 武术
            talent: 20,      // 才艺
            stamina: 20,     // 体能
            morality: 50     // 道德
        };
        
        // 状态
        this.health = 100;
        this.maxHealth = 100;
        this.stamina = 100;
        this.maxStamina = 100;
        
        // 经验值
        this.experience = {
            ruling: 0,      // 执政经验
            military: 0,    // 军事经验
            diplomacy: 0    // 外交经验
        };
        
        // 成就
        this.achievements = [];
        
        // 历史记录
        this.history = {
            battles: [],
            decrees: [],
            events: []
        };
    }
    
    /**
     * 初始化玩家数据
     */
    init(data) {
        this.dynastyName = data.dynastyName || '大明';
        this.emperorTitle = data.emperorTitle || '永乐';
        this.emperorName = data.emperorName || '朱棣';
        this.avatar = data.avatar || 0;
        this.age = data.age || 20;
        
        if (data.attributes) {
            this.attributes = {
                literature: data.attributes.literature || 20,
                martial: data.attributes.martial || 20,
                talent: data.attributes.talent || 20,
                stamina: data.attributes.stamina || 20,
                morality: data.attributes.morality || 50
            };
        }
        
        // 根据体能属性设置最大体力
        this.maxStamina = 50 + this.attributes.stamina;
        this.stamina = this.maxStamina;
        
        // 根据年龄设置最大寿命
        this.maxAge = 60 + Math.floor(this.attributes.martial / 10);
        
        console.log('玩家数据初始化完成:', this);
    }
    
    /**
     * 获取玩家数据（用于保存）
     */
    getData() {
        return {
            dynastyName: this.dynastyName,
            emperorTitle: this.emperorTitle,
            emperorName: this.emperorName,
            avatar: this.avatar,
            age: this.age,
            maxAge: this.maxAge,
            attributes: { ...this.attributes },
            health: this.health,
            maxHealth: this.maxHealth,
            stamina: this.stamina,
            maxStamina: this.maxStamina,
            experience: { ...this.experience },
            achievements: [...this.achievements],
            history: {
                battles: [...this.history.battles],
                decrees: [...this.history.decrees],
                events: [...this.history.events]
            }
        };
    }
    
    /**
     * 加载玩家数据
     */
    loadData(data) {
        this.dynastyName = data.dynastyName || '大明';
        this.emperorTitle = data.emperorTitle || '永乐';
        this.emperorName = data.emperorName || '朱棣';
        this.avatar = data.avatar || 0;
        this.age = data.age || 20;
        this.maxAge = data.maxAge || 62;
        
        this.attributes = data.attributes || {
            literature: 20,
            martial: 20,
            talent: 20,
            stamina: 20,
            morality: 50
        };
        
        this.health = data.health || 100;
        this.maxHealth = data.maxHealth || 100;
        this.stamina = data.stamina || 100;
        this.maxStamina = data.maxStamina || 100;
        
        this.experience = data.experience || { ruling: 0, military: 0, diplomacy: 0 };
        this.achievements = data.achievements || [];
        this.history = data.history || { battles: [], decrees: [], events: [] };
    }
    
    /**
     * 增加年龄
     */
    increaseAge(years = 1) {
        this.age += years;
        
        // 随着年龄增长，健康会下降
        const healthDecay = years * (1 + Math.floor(this.age / 10));
        this.health = Math.max(0, this.health - healthDecay);
        
        // 检查是否超过寿命
        if (this.age >= this.maxAge) {
            return 'died';
        }
        
        return 'alive';
    }
    
    /**
     * 增加属性
     */
    increaseAttribute(attribute, amount) {
        if (this.attributes[attribute] !== undefined) {
            this.attributes[attribute] = Math.min(100, this.attributes[attribute] + amount);
            
            // 如果增加的是体能，更新最大体力
            if (attribute === 'stamina') {
                this.maxStamina = 50 + this.attributes.stamina;
            }
            
            return true;
        }
        return false;
    }
    
    /**
     * 恢复体力
     */
    restoreStamina(amount) {
        this.stamina = Math.min(this.maxStamina, this.stamina + amount);
    }
    
    /**
     * 消耗体力
     */
    consumeStamina(amount) {
        if (this.stamina >= amount) {
            this.stamina -= amount;
            return true;
        }
        return false;
    }
    
    /**
     * 恢复健康
     */
    restoreHealth(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
    }
    
    /**
     * 受到伤害
     */
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        
        if (this.health <= 0) {
            return 'died';
        }
        return 'alive';
    }
    
    /**
     * 增加经验
     */
    addExperience(type, amount) {
        if (this.experience[type] !== undefined) {
            this.experience[type] += amount;
        }
    }
    
    /**
     * 解锁成就
     */
    unlockAchievement(achievement) {
        if (!this.achievements.includes(achievement)) {
            this.achievements.push(achievement);
            return true;
        }
        return false;
    }
    
    /**
     * 记录历史事件
     */
    recordHistory(type, event) {
        if (this.history[type]) {
            this.history[type].push({
                ...event,
                turn: game.state.turn,
                date: game.getDateString()
            });
        }
    }
    
    /**
     * 获取综合评价
     */
    getEvaluation() {
        const avgAttribute = (
            this.attributes.literature +
            this.attributes.martial +
            this.attributes.talent +
            this.attributes.stamina +
            this.attributes.morality
        ) / 5;
        
        if (avgAttribute >= 80) return '千古一帝';
        if (avgAttribute >= 70) return '明君圣主';
        if (avgAttribute >= 60) return '守成之君';
        if (avgAttribute >= 50) return '平庸之主';
        return '昏庸之君';
    }
}
