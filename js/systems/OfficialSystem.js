/**
 * 帝王模拟器2 - 官员系统类
 * 管理官员招募、任命、属性等
 */

class OfficialSystem {
    constructor() {
        // 官员列表
        this.officials = [];
        
        // 职位列表
        this.positions = [
            { id: 'chancellor', name: '丞相', salary: 50000 },
            { id: 'war_minister', name: '兵部尚书', salary: 40000 },
            { id: 'revenue_minister', name: '户部尚书', salary: 40000 },
            { id: 'personnel_minister', name: '吏部尚书', salary: 40000 },
            { id: 'rites_minister', name: '礼部尚书', salary: 40000 },
            { id: 'punishments_minister', name: '刑部尚书', salary: 40000 },
            { id: 'works_minister', name: '工部尚书', salary: 40000 }
        ];
        
        // 姓氏库
        this.surnames = ['李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', 
                        '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗'];
        
        // 名字库
        this.names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋',
                     '勇', '艳', '杰', '娟', '涛', '明', '超', '秀英', '华', '鹏'];
    }
    
    /**
     * 初始化官员系统
     */
    init() {
        // 生成一些初始官员
        for (let i = 0; i < 5; i++) {
            this.generateOfficial(50);
        }
        
        console.log('官员系统初始化完成，当前官员数量:', this.officials.length);
    }
    
    /**
     * 生成随机官员
     */
    generateOfficial(emperorLiterature = 50) {
        const surname = this.surnames[Math.floor(Math.random() * this.surnames.length)];
        const name = this.names[Math.floor(Math.random() * this.names.length)];
        
        // 能力受皇帝文学属性影响
        const baseAbility = Math.floor(Math.random() * 40) + 30;
        const abilityBonus = Math.floor(emperorLiterature / 10);
        const ability = Math.min(100, baseAbility + abilityBonus);
        
        // 忠诚度
        const loyalty = Math.floor(Math.random() * 40) + 50;
        
        // 野心（高野心容易造反）
        const ambition = Math.floor(Math.random() * 50) + 20;
        
        const official = {
            id: Date.now() + Math.random(),
            name: surname + name,
            ability: ability,
            loyalty: loyalty,
            ambition: ambition,
            position: null,
            salary: 10000 + (ability * 200),
            age: Math.floor(Math.random() * 30) + 20,
            hired: false
        };
        
        this.officials.push(official);
        return official;
    }
    
    /**
     * 获取所有官员
     */
    getAllOfficials() {
        return this.officials;
    }
    
    /**
     * 获取已任命的官员
     */
    getHiredOfficials() {
        return this.officials.filter(o => o.hired);
    }
    
    /**
     * 获取未任命的官员
     */
    getUnhiredOfficials() {
        return this.officials.filter(o => !o.hired);
    }
    
    /**
     * 任命官员
     */
    hireOfficial(officialId, positionId) {
        const official = this.officials.find(o => o.id === officialId);
        const position = this.positions.find(p => p.id === positionId);
        
        if (!official || !position) {
            return { success: false, message: '官员或职位不存在' };
        }
        
        // 检查职位是否已被占用
        const currentOccupant = this.officials.find(o => o.position === position.name);
        if (currentOccupant) {
            currentOccupant.position = null;
            currentOccupant.hired = false;
        }
        
        official.position = position.name;
        official.hired = true;
        official.salary = position.salary;
        
        return { success: true, message: `${official.name} 被任命为 ${position.name}` };
    }
    
    /**
     * 解雇官员
     */
    fireOfficial(officialId) {
        const official = this.officials.find(o => o.id === officialId);
        
        if (!official) {
            return { success: false, message: '官员不存在' };
        }
        
        official.position = null;
        official.hired = false;
        
        return { success: true, message: `${official.name} 已被解雇` };
    }
    
    /**
     * 计算总俸禄
     */
    getTotalSalary() {
        return this.officials
            .filter(o => o.hired)
            .reduce((total, o) => total + o.salary, 0);
    }
    
    /**
     * 获取官员数量
     */
    getOfficialCount() {
        return {
            total: this.officials.length,
            hired: this.officials.filter(o => o.hired).length,
            unhired: this.officials.filter(o => !o.hired).length
        };
    }
    
    /**
     * 回合结束处理
     */
    onTurnEnd() {
        // 检查官员忠诚度
        this.officials.forEach(official => {
            if (official.hired && official.loyalty < 30) {
                // 忠诚度低+野心高=叛变概率更大
                const rebellionChance = 0.05 + (official.ambition / 500);
                if (Math.random() < rebellionChance) {
                    this.triggerRebellion(official);
                }
            }
        });
        
        // 随机生成新人才
        if (Math.random() < 0.3) {
            const emperorLiterature = this.game && this.game.player ? this.game.player.attributes.literature : 50;
            this.generateOfficial(emperorLiterature);
        }
    }
    
    /**
     * 触发官员叛变事件
     */
    triggerRebellion(official) {
        if (!game || !game.modalManager) return;

        const isChancellor = official.position === '丞相';
        const title = isChancellor ? '权臣谋反！' : '官员叛变！';
        const desc = isChancellor
            ? `丞相${official.name}（忠诚:${official.loyalty}，野心:${official.ambition}）暗中勾结朝臣，意图谋反篡位！情况万分危急！`
            : `${official.position || '待命'}${official.name}（忠诚:${official.loyalty}，野心:${official.ambition}）公然发动叛乱！`;

        // 叛变规模取决于职位和野心
        const severity = isChancellor ? 3 : (official.position ? 2 : 1);

        game.modalManager.open(title, `
            <div style="text-align:center;">
                <p style="font-size:2rem;">⚔️</p>
                <p style="margin:10px 0;color:#f44336;">${desc}</p>
                <p style="color:#aaa;font-size:0.85em;">请陛下速速决断！</p>
            </div>
        `, [
            {
                text: `武力镇压（消耗${severity * 100000}军队）`,
                action: () => {
                    const armyCost = severity * 100000;
                    if (game.resources.army < armyCost) {
                        game.showNotification('军队不足以镇压叛乱！', 'error');
                        // 镇压失败，严重后果
                        game.resources.stability = Math.max(0, (game.resources.stability || 50) - 20);
                        game.resources.people = Math.max(0, game.resources.people - 15);
                        game.showNotification('叛军肆虐，朝局动荡！稳定-20，民心-15', 'error');
                    } else {
                        game.resources.army -= armyCost;
                        game.resources.stability = Math.max(0, (game.resources.stability || 50) - 5);
                        game.showNotification(`成功镇压${official.name}的叛乱！声望+5`, 'success');
                        game.resources.prestige = Math.min(100, (game.resources.prestige || 50) + 5);
                    }
                    // 处决叛臣
                    this.officials = this.officials.filter(o => o.id !== official.id);
                    game.uiManager.updateAll();
                    game.modalManager.close();
                }
            },
            {
                text: `花钱安抚（消耗${severity * 500000}两）`,
                action: () => {
                    const moneyCost = severity * 500000;
                    if (game.resources.money < moneyCost) {
                        game.showNotification('国库不足以安抚叛臣！', 'error');
                        game.resources.stability = Math.max(0, (game.resources.stability || 50) - 15);
                        game.resources.people = Math.max(0, game.resources.people - 10);
                    } else {
                        game.resources.money -= moneyCost;
                        official.loyalty = 60;
                        official.ambition = Math.max(10, official.ambition - 20);
                        game.showNotification(`${official.name}被安抚，忠诚度恢复。但朝臣们议论纷纷...`, 'warning');
                        game.resources.prestige = Math.max(0, (game.resources.prestige || 50) - 5);
                    }
                    game.uiManager.updateAll();
                    game.modalManager.close();
                }
            },
            {
                text: '放任不管',
                action: () => {
                    game.resources.stability = Math.max(0, (game.resources.stability || 50) - (severity * 10));
                    game.resources.people = Math.max(0, game.resources.people - (severity * 5));
                    game.resources.money -= severity * 200000;
                    if (game.resources.money < 0) game.resources.money = 0;
                    official.loyalty = Math.max(0, official.loyalty - 20);
                    game.showNotification(`${official.name}的叛乱愈演愈烈！稳定度和民心大幅下降！`, 'error');
                    game.uiManager.updateAll();
                    game.modalManager.close();
                }
            }
        ]);
    }

    /**
     * 获取数据（用于保存）
     */
    getData() {
        return {
            officials: this.officials,
            positions: this.positions
        };
    }
    
    /**
     * 加载数据
     */
    loadData(data) {
        if (data.officials) {
            this.officials = data.officials;
        }
        if (data.positions) {
            this.positions = data.positions;
        }
    }
    
    /**
     * 添加官员（用于外部添加）
     */
    addOfficial(official) {
        this.officials.push(official);
    }
}

// 为了兼容性
if (typeof window !== 'undefined') {
    window.OfficialSystem = OfficialSystem;
}
