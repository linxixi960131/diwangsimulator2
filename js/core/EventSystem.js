/**
 * 帝王模拟器2 - 事件系统类
 * 管理游戏中的各种随机事件和剧情事件
 */

class EventSystem {
    constructor() {
        // 事件历史
        this.eventHistory = [];
        
        // 当前活跃的事件
        this.activeEvents = [];
        
        // 事件冷却时间
        this.eventCooldowns = {};
        
        // 剧情进度
        this.storyProgress = {
            main: 0,
            side: []
        };
        
        // 初始化事件模板
        this.initEventTemplates();
    }
    
    /**
     * 初始化事件模板
     */
    initEventTemplates() {
        this.eventTemplates = {
            // 正面事件
            positive: [
                {
                    id: 'good_harvest',
                    title: '五谷丰登',
                    description: '今年风调雨顺，粮食大丰收！',
                    effects: { food: 5000000, people: 5 },
                    probability: 0.1
                },
                {
                    id: 'discover_talent',
                    title: '人才辈出',
                    description: '地方推荐了一位奇才！',
                    effects: { prestige: 10 },
                    probability: 0.08,
                    special: 'recruit_official'
                },
                {
                    id: 'foreign_tribute',
                    title: '外邦来朝',
                    description: '周边小国派遣使臣进贡！',
                    effects: { money: 2000000, prestige: 15 },
                    probability: 0.05
                }
            ],
            
            // 负面事件
            negative: [
                {
                    id: 'natural_disaster',
                    title: '天灾降临',
                    description: '某地发生严重自然灾害！',
                    effects: { food: -3000000, people: -10, stability: -5 },
                    probability: 0.1
                },
                {
                    id: 'bandit_uprising',
                    title: '匪患丛生',
                    description: '某地出现大规模匪患！',
                    effects: { stability: -10, people: -5 },
                    probability: 0.08
                },
                {
                    id: 'corruption_scandal',
                    title: '贪腐案曝光',
                    description: '查出一桩重大贪腐案件！',
                    effects: { prestige: -10, people: -5 },
                    probability: 0.07
                }
            ],
            
            // 中性事件
            neutral: [
                {
                    id: 'traveling_scholar',
                    title: '游学才子',
                    description: '一位才子路过京城，要求觐见。',
                    effects: {},
                    probability: 0.1,
                    choice: true
                },
                {
                    id: 'merchant_guild',
                    title: '商会请愿',
                    description: '商会代表请求减免商税。',
                    effects: {},
                    probability: 0.08,
                    choice: true
                }
            ]
        };
    }
    
    /**
     * 触发随机事件
     */
    triggerRandomEvent() {
        // 检查是否处于冷却期
        if (this.isOnCooldown('random_event')) {
            return null;
        }
        
        // 设置冷却时间
        this.setCooldown('random_event', 3); // 3回合内不再触发随机事件
        
        // 随机选择事件类型
        const rand = Math.random();
        let eventType;
        if (rand < 0.3) {
            eventType = 'positive';
        } else if (rand < 0.6) {
            eventType = 'negative';
        } else {
            eventType = 'neutral';
        }
        
        // 从该类型中随机选择一个事件
        const events = this.eventTemplates[eventType];
        const event = events[Math.floor(Math.random() * events.length)];
        
        // 检查概率
        if (Math.random() > event.probability) {
            return null;
        }
        
        // 触发事件
        return this.executeEvent(event);
    }
    
    /**
     * 执行特定ID的事件
     */
    triggerEvent(eventId) {
        // 在所有事件模板中查找
        for (const type in this.eventTemplates) {
            const event = this.eventTemplates[type].find(e => e.id === eventId);
            if (event) {
                return this.executeEvent(event);
            }
        }
        
        console.warn(`未找到事件: ${eventId}`);
        return null;
    }
    
    /**
     * 执行事件
     */
    executeEvent(event) {
        // 应用事件效果
        if (event.effects) {
            this.applyEventEffects(event.effects);
        }
        
        // 如果有特殊处理
        if (event.special) {
            this.handleSpecialEvent(event.special);
        }
        
        // 记录事件
        this.eventHistory.push({
            ...event,
            turn: game ? game.state.turn : 0,
            date: game ? game.getDateString() : ''
        });
        
        // 显示事件通知
        if (game) {
            let type = 'info';
            if (event.id in ['good_harvest', 'discover_talent', 'foreign_tribute']) {
                type = 'success';
            } else if (event.id in ['natural_disaster', 'bandit_uprising', 'corruption_scandal']) {
                type = 'warning';
            }
            
            game.showNotification(`事件: ${event.title} - ${event.description}`, type);
        }
        
        console.log(`事件触发: ${event.title}`);
        return event;
    }
    
    /**
     * 应用事件效果
     */
    applyEventEffects(effects) {
        for (const [key, value] of Object.entries(effects)) {
            if (game && game.resources) {
                game.resources.add(key, value);
            }
            
            // 同时影响玩家属性
            if (game && game.player) {
                switch (key) {
                    case 'people':
                        // 民心影响人民支持度
                        break;
                    case 'stability':
                        // 稳定度影响国家稳定
                        break;
                }
            }
        }
    }
    
    /**
     * 处理特殊事件
     */
    handleSpecialEvent(specialType) {
        switch (specialType) {
            case 'recruit_official':
                // 生成一个高质量官员
                if (game && game.officialSystem) {
                    const official = game.officialSystem.generateOfficial(80);
                    game.officialSystem.addOfficial(official);
                    game.showNotification(`获得人才: ${official.name} (能力${official.ability})`, 'success');
                }
                break;
        }
    }
    
    /**
     * 检查事件是否在冷却期
     */
    isOnCooldown(eventId) {
        if (this.eventCooldowns[eventId]) {
            return this.eventCooldowns[eventId] > 0;
        }
        return false;
    }
    
    /**
     * 设置事件冷却
     */
    setCooldown(eventId, turns) {
        this.eventCooldowns[eventId] = turns;
    }
    
    /**
     * 更新冷却时间
     */
    updateCooldowns() {
        for (const eventId in this.eventCooldowns) {
            if (this.eventCooldowns[eventId] > 0) {
                this.eventCooldowns[eventId]--;
            }
        }
    }
    
    /**
     * 获取事件历史
     */
    getEventHistory(limit = 50) {
        return this.eventHistory.slice(-limit);
    }
    
    /**
     * 获取活跃事件
     */
    getActiveEvents() {
        return this.activeEvents;
    }
    
    /**
     * 回合结束处理
     */
    onTurnEnd() {
        // 更新冷却时间
        this.updateCooldowns();
        
        // 尝试触发随机事件
        if (Math.random() < 0.3) { // 30%概率触发事件
            this.triggerRandomEvent();
        }
    }
    
    /**
     * 获取数据（用于保存）
     */
    getData() {
        return {
            eventHistory: this.eventHistory,
            activeEvents: this.activeEvents,
            eventCooldowns: this.eventCooldowns,
            storyProgress: this.storyProgress
        };
    }
    
    /**
     * 加载数据
     */
    loadData(data) {
        this.eventHistory = data.eventHistory || [];
        this.activeEvents = data.activeEvents || [];
        this.eventCooldowns = data.eventCooldowns || {};
        this.storyProgress = data.storyProgress || { main: 0, side: [] };
    }
}
