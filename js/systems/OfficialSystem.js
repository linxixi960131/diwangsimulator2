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
                // 忠诚度低，可能发生叛变
                if (Math.random() < 0.1) {
                    console.log(`${official.name} 忠诚度太低，有叛变风险！`);
                    // 这里可以触发叛变事件
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
