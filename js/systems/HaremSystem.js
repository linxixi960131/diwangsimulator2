/**
 * 帝王模拟器2 - 后宫系统类
 * 管理妃子、选秀、子嗣等
 */

class HaremSystem {
    constructor() {
        // 妃子列表
        this.concubines = [];
        
        // 子嗣列表
        this.children = [];
        
        // 姓氏库
        this.surnames = ['李', '王', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴', 
                        '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗',
                        '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹'];
        
        // 妃子名字库
        this.femaleNames = ['婉儿', '玉儿', '婉儿', '如烟', '如梦', '诗诗', '梦琪', '语嫣', 
                           '思思', '雨婷', '梦瑶', '紫萱', '若曦', '晴川', '静姝', '柔嘉',
                           '芳华', '丽华', '淑妃', '贤妃', '德妃', '丽妃', '惠妃', '宜妃'];
        
        // 皇子名字库
        this.maleNames = ['承乾', '承泽', '承恩', '承志', '承业', '承平', '承安', '承康',
                         '永琪', '永瑢', '永璇', '永瑆', '永琰', '永璘', '永瑋', '永琮',
                         '弘历', '弘昼', '弘晓', '弘皎', '弘昌', '弘曕', '弘昶', '弘暄'];
        
        // 公主名字库
        this.princessNames = ['安康', '安宁', '安平', '安宜', '安和', '安悦', '安娴', '安雅',
                             '长乐', '长平', '长宁', '长宜', '长君', '长清', '长华', '长秀',
                             '晋阳', '平阳', '高阳', '临川', '兰陵', '义阳', '浔阳', '寿阳'];
    }
    
    /**
     * 初始化后宫系统
     */
    init() {
        // 生成一个初始皇后
        this.generateConcubine(80, true);
        
        // 生成几个初始妃子
        for (let i = 0; i < 3; i++) {
            this.generateConcubine(60);
        }
        
        console.log('后宫系统初始化完成，当前妃子数量:', this.concubines.length);
    }
    
    /**
     * 生成妃子
     */
    generateConcubine(emperorTalent = 50, isEmpress = false) {
        const surname = this.surnames[Math.floor(Math.random() * this.surnames.length)];
        const name = this.femaleNames[Math.floor(Math.random() * this.femaleNames.length)];
        
        // 容貌受皇帝才艺属性影响
        const baseBeauty = Math.floor(Math.random() * 40) + 40;
        const beautyBonus = Math.floor(emperorTalent / 10);
        const beauty = Math.min(100, baseBeauty + beautyBonus);
        
        // 宠爱值
        const favor = isEmpress ? 80 : Math.floor(Math.random() * 30) + 20;
        
        // 性格
        const personalities = ['温柔', '贤淑', '聪慧', '活泼', '端庄', '娇媚', '清雅', '大方'];
        const personality = personalities[Math.floor(Math.random() * personalities.length)];
        
        const concubine = {
            id: Date.now() + Math.random(),
            name: surname + name,
            title: isEmpress ? '皇后' : '妃子',
            beauty: beauty,
            favor: favor,
            personality: personality,
            age: Math.floor(Math.random() * 15) + 16,
            isEmpress: isEmpress,
            children: [],
            pregnant: false,
            pregnantTurn: 0
        };
        
        this.concubines.push(concubine);
        return concubine;
    }
    
    /**
     * 获取妃子列表HTML
     */
    getConcubinesList() {
        if (this.concubines.length === 0) {
            return '<div class="empty-list">暂无妃子</div>';
        }
        
        return this.concubines.map(concubine => `
            <div class="concubine-card">
                <div class="concubine-name">${concubine.name} <span class="title">${concubine.title}</span></div>
                <div class="concubine-info">
                    <span>容貌: ${concubine.beauty}</span>
                    <span>宠爱: ${concubine.favor}</span>
                    <span>性格: ${concubine.personality}</span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 获取子嗣列表HTML
     */
    getChildrenList() {
        if (this.children.length === 0) {
            return '<div class="empty-list">暂无子嗣</div>';
        }
        
        return this.children.map(child => `
            <div class="child-card">
                <div class="child-name">${child.name} <span class="gender">${child.gender === 'male' ? '皇子' : '公主'}</span></div>
                <div class="child-info">
                    <span>年龄: ${child.age}岁</span>
                    <span>母亲: ${child.motherName}</span>
                    <span>智力: ${child.intelligence}</span>
                    <span>体质: ${child.constitution}</span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 添加妃子
     */
    addConcubine(concubine) {
        this.concubines.push(concubine);
    }
    
    /**
     * 回合结束处理
     */
    onTurnEnd() {
        // 处理怀孕
        this.concubines.forEach(concubine => {
            if (concubine.pregnant) {
                concubine.pregnantTurn++;
                
                // 10个月后生产
                if (concubine.pregnantTurn >= 10) {
                    this.giveBirth(concubine);
                }
            }
        });
        
        // 增加子嗣年龄
        this.children.forEach(child => {
            child.age++;
        });
    }
    
    /**
     * 生产
     */
    giveBirth(concubine) {
        concubine.pregnant = false;
        concubine.pregnantTurn = 0;
        
        const isMale = Math.random() < 0.5;
        const name = isMale 
            ? this.maleNames[Math.floor(Math.random() * this.maleNames.length)]
            : this.princessNames[Math.floor(Math.random() * this.princessNames.length)];
        
        const child = {
            id: Date.now() + Math.random(),
            name: name,
            gender: isMale ? 'male' : 'female',
            age: 0,
            motherId: concubine.id,
            motherName: concubine.name,
            intelligence: Math.floor(Math.random() * 40) + 40,
            constitution: Math.floor(Math.random() * 40) + 40,
            charm: Math.floor(Math.random() * 40) + 40,
            morality: Math.floor(Math.random() * 40) + 40
        };
        
        this.children.push(child);
        concubine.children.push(child.id);
        
        if (game) {
            game.showNotification(`${concubine.name} 诞下${isMale ? '皇子' : '公主'}！`, 'success');
        }
    }
    
    /**
     * 获取数据（用于保存）
     */
    getData() {
        return {
            concubines: this.concubines,
            children: this.children
        };
    }
    
    /**
     * 加载数据
     */
    loadData(data) {
        if (data.concubines) {
            this.concubines = data.concubines;
        }
        if (data.children) {
            this.children = data.children;
        }
    }
}

// 为了兼容性
if (typeof window !== 'undefined') {
    window.HaremSystem = HaremSystem;
}
