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
                { id: 'good_harvest', title: '五谷丰登', description: '今年风调雨顺，粮食大丰收！', effects: { food: 5000000, people: 5 }, probability: 0.1 },
                { id: 'discover_talent', title: '人才辈出', description: '地方推荐了一位奇才！', effects: { prestige: 10 }, probability: 0.08, special: 'recruit_official' },
                { id: 'foreign_tribute', title: '外邦来朝', description: '周边小国派遣使臣进贡！', effects: { money: 2000000, prestige: 15 }, probability: 0.05 },
                { id: 'golden_mine', title: '发现金矿', description: '某地发现大型金矿，国库充盈！', effects: { money: 3000000 }, probability: 0.04 },
                { id: 'baby_boom', title: '人丁兴旺', description: '国泰民安，各地人口大增！', effects: { people: 8 }, probability: 0.07 },
                { id: 'border_peace', title: '边境安宁', description: '四方来贺，边境久无战事。', effects: { prestige: 8, stability: 5 }, probability: 0.06 },
                { id: 'literary_golden_age', title: '文坛盛事', description: '涌现大批文学巨匠，文风鼎盛！', effects: { prestige: 10 }, probability: 0.05 },
                { id: 'trade_boom', title: '商贸繁荣', description: '商路畅通，各地贸易空前繁荣！', effects: { money: 1500000, people: 3 }, probability: 0.06 },
                { id: 'divine_sign', title: '祥瑞降世', description: '天降祥瑞，民间传为圣君之兆！', effects: { prestige: 15, people: 5 }, probability: 0.03 },
                { id: 'military_hero', title: '名将归心', description: '一位名将慕名来投！', effects: { prestige: 5 }, probability: 0.05, special: 'recruit_general' }
            ],

            // 负面事件
            negative: [
                { id: 'natural_disaster', title: '天灾降临', description: '某地发生严重自然灾害！', effects: { food: -3000000, people: -10, stability: -5 }, probability: 0.1 },
                { id: 'bandit_uprising', title: '匪患丛生', description: '某地出现大规模匪患！', effects: { stability: -10, people: -5 }, probability: 0.08 },
                { id: 'corruption_scandal', title: '贪腐案曝光', description: '查出一桩重大贪腐案件！', effects: { prestige: -10, people: -5 }, probability: 0.07 },
                { id: 'plague', title: '瘟疫爆发', description: '一场可怕的瘟疫在各地蔓延！', effects: { people: -12, stability: -8 }, probability: 0.05 },
                { id: 'flood', title: '洪水泛滥', description: '黄河决堤，沿岸百姓苦不堪言！', effects: { food: -4000000, people: -8 }, probability: 0.06 },
                { id: 'drought', title: '大旱之年', description: '连续数月无雨，田地龟裂！', effects: { food: -3000000, people: -5 }, probability: 0.07 },
                { id: 'earthquake', title: '地动山摇', description: '某地发生强烈地震！', effects: { money: -1000000, people: -8, stability: -5 }, probability: 0.04 },
                { id: 'military_mutiny', title: '哗变', description: '边境军队因欠饷发生哗变！', effects: { stability: -10 }, probability: 0.05 },
                { id: 'royal_scandal', title: '宫闱丑闻', description: '后宫传出丑闻，朝野震惊！', effects: { prestige: -15, people: -3 }, probability: 0.04 },
                { id: 'locust_plague', title: '蝗灾来袭', description: '铺天盖地的蝗虫吞噬庄稼！', effects: { food: -5000000, people: -5 }, probability: 0.05 },
                { id: 'fire_palace', title: '宫殿走水', description: '皇宫某殿失火，损失惨重！', effects: { money: -2000000 }, probability: 0.04 },
                { id: 'spy_discovered', title: '细作暴露', description: '发现敌国安插在朝中的间谍！', effects: { stability: -5, prestige: -5 }, probability: 0.05 }
            ],
            
            // 中性事件
            neutral: [
                {
                    id: 'traveling_scholar',
                    title: '游学才子',
                    description: '一位才子路过京城，要求觐见。此人才学过人，如何处置？',
                    effects: {},
                    probability: 0.1,
                    choice: true,
                    choices: [
                        { text: '重用此人', effects: { prestige: 5 }, message: '才子感恩，入朝为官。声望+5', special: 'recruit_official' },
                        { text: '赏赐礼送', effects: { money: -100000 }, message: '才子感念圣恩，为朝廷扬名。' },
                        { text: '冷落不见', effects: { prestige: -5 }, message: '才子失望而去，朝野议论纷纷。声望-5' }
                    ]
                },
                {
                    id: 'merchant_guild',
                    title: '商会请愿',
                    description: '商会代表联名请求减免商税，声称税负过重导致商路萧条。',
                    effects: {},
                    probability: 0.08,
                    choice: true,
                    choices: [
                        { text: '同意减税', effects: { people: 8, money: -500000 }, message: '商人们欢欣鼓舞，贸易繁荣。民心+8' },
                        { text: '部分减免', effects: { people: 3, money: -200000 }, message: '适度减免，各方勉强接受。民心+3' },
                        { text: '驳回请愿', effects: { people: -5, money: 300000 }, message: '商人们怨声载道，但国库充盈。民心-5' }
                    ]
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
        // 如果是选择事件且有选项，弹出选择界面
        if (event.choice && event.choices && game && game.modalManager) {
            // 记录事件
            this.eventHistory.push({
                ...event,
                turn: game.state.turn,
                date: game.getDateString()
            });

            const buttons = event.choices.map(choice => ({
                text: choice.text,
                action: () => {
                    if (choice.effects) {
                        this.applyEventEffects(choice.effects);
                    }
                    if (choice.special) {
                        this.handleSpecialEvent(choice.special);
                    }
                    game.uiManager.updateAll();
                    game.showResult(choice.message, 'info');
                }
            }));

            game.modalManager.open(event.title, `
                <div style="text-align:center;">
                    <p style="margin:10px 0;">${event.description}</p>
                </div>
            `, buttons);

            return event;
        }

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
            const positiveIds = ['good_harvest', 'discover_talent', 'foreign_tribute'];
            const negativeIds = ['natural_disaster', 'bandit_uprising', 'corruption_scandal'];
            let type = 'info';
            if (positiveIds.includes(event.id)) {
                type = 'success';
            } else if (negativeIds.includes(event.id)) {
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
                if (game && game.officialSystem) {
                    const official = game.officialSystem.generateOfficial(80);
                    game.officialSystem.addOfficial(official);
                    game.showNotification(`获得人才: ${official.name} (能力${official.ability})`, 'success');
                }
                break;
            case 'recruit_general':
                if (game && game.militarySystem && game.militarySystem.generals.length < 5) {
                    const general = game.militarySystem.recruitGeneral();
                    game.showNotification(`名将来投: ${general.name} (统帅${general.command})`, 'success');
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
     * 主线剧情定义
     */
    getStoryChapters() {
        return [
            {
                id: 0, title: '第一章：初登大宝', triggerYear: 1, triggerMonth: 6,
                description: '登基半年，朝中暗流涌动。前朝余孽不甘失败，密谋复辟...',
                choices: [
                    { text: '严查前朝余孽', effects: { stability: 10, prestige: 5 }, message: '雷厉风行铲除隐患，朝局稳固！稳定+10，声望+5' },
                    { text: '怀柔安抚旧臣', effects: { people: 10 }, message: '以德服人，旧臣归心。民心+10' },
                    { text: '暗中监视', effects: { stability: 5 }, message: '按兵不动，暗中布局。稳定+5' }
                ]
            },
            {
                id: 1, title: '第二章：权臣当道', triggerYear: 3, triggerMonth: 1,
                description: '丞相势力日益壮大，朝中大臣纷纷依附。是制衡、是铲除、还是利用？',
                choices: [
                    { text: '削弱丞相权力', effects: { stability: -5, prestige: 10 }, message: '削权成功，但朝中震动。声望+10，稳定-5' },
                    { text: '扶持新人制衡', effects: { stability: 5 }, message: '巧妙布局，形成平衡。稳定+5', special: 'recruit_official' },
                    { text: '借力打力', effects: { prestige: 5, people: 3 }, message: '利用丞相推行新政。声望+5，民心+3' }
                ]
            },
            {
                id: 2, title: '第三章：边疆烽火', triggerYear: 5, triggerMonth: 6,
                description: '北方游牧部落统一，集结十万铁骑南下！这是本朝最大的军事危机...',
                choices: [
                    { text: '御驾亲征', effects: { prestige: 20, people: 10 }, message: '御驾亲征，大破敌军！威名远播！声望+20，民心+10', special: 'recruit_general' },
                    { text: '派遣大将迎战', effects: { prestige: 10, stability: 5 }, message: '大将率军击退敌军。声望+10，稳定+5' },
                    { text: '和亲求和', effects: { stability: 10, prestige: -10 }, message: '以和亲换和平，朝野议论纷纷。稳定+10，声望-10' }
                ]
            },
            {
                id: 3, title: '第四章：盛世华章', triggerYear: 8, triggerMonth: 1,
                description: '经过多年励精图治，国家渐入盛世。此时面临抉择：继续扩张还是安享太平？',
                choices: [
                    { text: '开疆拓土', effects: { prestige: 15, people: -5 }, message: '大军远征，开疆万里！声望+15，但百姓劳苦。民心-5' },
                    { text: '发展文教', effects: { prestige: 10, people: 10 }, message: '兴文教、修典籍，文化昌盛！声望+10，民心+10' },
                    { text: '均衡发展', effects: { prestige: 8, people: 5, stability: 5 }, message: '文武并重，国泰民安。声望+8，民心+5，稳定+5' }
                ]
            },
            {
                id: 4, title: '第五章：储位之争', triggerYear: 12, triggerMonth: 6,
                description: '皇帝年事渐高，太子之位悬而未决。诸皇子暗中较量，朝臣各站阵营...',
                choices: [
                    { text: '立长子为太子', effects: { stability: 10, people: 5 }, message: '立长立嫡，朝野归心。稳定+10，民心+5' },
                    { text: '择贤而立', effects: { stability: -5, prestige: 10 }, message: '不拘长幼，选贤任能。声望+10，但引发争议。稳定-5' },
                    { text: '推迟决定', effects: { stability: -10 }, message: '悬而不决，朝中人心浮动。稳定-10' }
                ]
            }
        ];
    }

    /**
     * 检查主线剧情触发
     */
    checkStoryTrigger(year, month) {
        const chapters = this.getStoryChapters();
        const nextChapter = chapters[this.storyProgress.main];

        if (!nextChapter) return; // 所有章节已完成

        if (year >= nextChapter.triggerYear && month >= nextChapter.triggerMonth) {
            this.triggerStoryEvent(nextChapter);
        }
    }

    /**
     * 触发主线剧情事件
     */
    triggerStoryEvent(chapter) {
        if (!game || !game.modalManager) return;

        const buttons = chapter.choices.map(choice => ({
            text: choice.text,
            action: () => {
                if (choice.effects) {
                    this.applyEventEffects(choice.effects);
                }
                if (choice.special) {
                    this.handleSpecialEvent(choice.special);
                }
                this.storyProgress.main++;

                // 记录剧情事件
                this.eventHistory.push({
                    id: 'story_' + chapter.id,
                    title: chapter.title,
                    description: chapter.description,
                    turn: game.state.turn,
                    date: game.getDateString()
                });

                game.uiManager.updateAll();
                game.showResult(choice.message, 'success');
            }
        }));

        game.modalManager.open(`📖 ${chapter.title}`, `
            <div style="text-align:center;">
                <p style="color:#FFD700;font-size:0.9em;margin-bottom:8px;">主线剧情</p>
                <p style="margin:10px 0;line-height:1.6;">${chapter.description}</p>
            </div>
        `, buttons);
    }

    /**
     * 回合结束处理
     */
    onTurnEnd() {
        // 更新冷却时间
        this.updateCooldowns();

        // 检查主线剧情
        if (game) {
            this.checkStoryTrigger(game.state.year, game.state.month);
        }

        // 尝试触发随机事件
        if (Math.random() < 0.3) {
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
