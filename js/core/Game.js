/**
 * 帝王模拟器2 - 游戏核心类
 * 负责游戏状态管理、场景切换、核心逻辑
 */

class Game {
    constructor() {
        // 游戏状态
        this.state = {
            screen: 'splash-screen',
            isPlaying: false,
            isPaused: false,
            turn: 1,
            year: 1,
            month: 1,
            day: 1
        };
        
        // 子系统
        this.player = null;
        this.resources = null;
        this.eventSystem = null;
        this.officialSystem = null;
        this.haremSystem = null;
        this.militarySystem = null;
        this.diplomacySystem = null;
        
        // UI管理
        this.uiManager = null;
        this.modalManager = null;
        
        // 初始化
        this.init();
    }
    
    /**
     * 初始化游戏
     */
    init() {
        console.log('帝王模拟器2 - 初始化中...');
        
        try {
            // 初始化子系统
            console.log('初始化 Player...');
            this.player = new Player();
            
            console.log('初始化 Resources...');
            this.resources = new Resources();
            
            console.log('初始化 EventSystem...');
            this.eventSystem = new EventSystem();
            
            console.log('初始化 OfficialSystem...');
            this.officialSystem = new OfficialSystem();
            
            console.log('初始化 HaremSystem...');
            this.haremSystem = new HaremSystem();
            
            console.log('初始化 MilitarySystem...');
            this.militarySystem = new MilitarySystem();
            
            console.log('初始化 DiplomacySystem...');
            this.diplomacySystem = new DiplomacySystem();
            
            console.log('所有子系统初始化成功！');
        } catch (error) {
            console.error('初始化子系统时出错:', error);
            console.error('错误堆栈:', error.stack);
            throw error;
        }
        
        // 初始化UI管理
        this.uiManager = new UIManager(this);
        this.modalManager = new ModalManager();
        
        // 设置属性滑块监听
        this.setupAttributeSliders();

        // 设置标签页切换
        this.setupTabs();

        // 渲染头像选择网格
        this.renderAvatarGrid();

        console.log('帝王模拟器2 - 初始化完成！');
    }
    
    /**
     * 设置属性滑块监听
     */
    setupAttributeSliders() {
        const attributes = ['literature', 'martial', 'talent', 'stamina'];
        const totalPoints = 30;
        const baseValue = 20;
        
        attributes.forEach(attr => {
            const slider = document.getElementById(`attr-${attr}`);
            const valueDisplay = document.getElementById(`val-${attr}`);
            
            if (slider && valueDisplay) {
                slider.addEventListener('input', () => {
                    const value = parseInt(slider.value);
                    valueDisplay.textContent = value;
                    this.updateRemainingPoints();
                });
            }
        });
    }
    
    /**
     * 更新剩余点数显示
     */
    updateRemainingPoints() {
        const attributes = ['literature', 'martial', 'talent', 'stamina'];
        const baseValue = 20;
        const totalPoints = 30;
        
        let usedPoints = 0;
        attributes.forEach(attr => {
            const slider = document.getElementById(`attr-${attr}`);
            if (slider) {
                usedPoints += parseInt(slider.value) - baseValue;
            }
        });
        
        const remaining = totalPoints - usedPoints;
        const pointsDisplay = document.getElementById('points-left');
        if (pointsDisplay) {
            pointsDisplay.textContent = remaining;
            pointsDisplay.style.color = remaining < 0 ? '#f44336' : '#FFD700';
        }
    }
    
    /**
     * 设置标签页切换
     */
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });
    }
    
    /**
     * 渲染头像选择网格
     */
    renderAvatarGrid() {
        this.selectedAvatar = 0;
        const grid = document.getElementById('avatar-grid');
        if (!grid) return;

        grid.innerHTML = '';
        EMPEROR_AVATARS.forEach((avatar, index) => {
            const option = document.createElement('div');
            option.className = 'avatar-option' + (index === 0 ? ' selected' : '');
            option.dataset.index = index;
            option.innerHTML = `
                <div class="avatar-svg">${avatar.svg}</div>
                <span class="avatar-name">${avatar.name}</span>
            `;
            option.addEventListener('click', () => {
                grid.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedAvatar = index;
            });
            grid.appendChild(option);
        });
    }

    /**
     * 切换标签页
     */
    switchTab(tabName) {
        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });
        
        // 更新内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        const activeContent = document.getElementById(`tab-${tabName}`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }
    }
    
    /**
     * 显示指定屏幕
     */
    showScreen(screenId) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 显示目标屏幕
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.screen = screenId;
        }
    }
    
    /**
     * 开始新游戏
     */
    startNewGame() {
        console.log('开始新游戏...');
        this.showScreen('character-creation');
    }
    
    /**
     * 确认创建角色
     */
    confirmCreation() {
        // 获取输入值
        const dynastyName = document.getElementById('dynasty-name').value || '大明';
        const emperorTitle = document.getElementById('emperor-title').value || '永乐';
        const emperorName = document.getElementById('emperor-name').value || '朱棣';
        const startAge = parseInt(document.getElementById('start-age').value) || 20;
        
        // 获取属性值
        const literature = parseInt(document.getElementById('attr-literature').value) || 20;
        const martial = parseInt(document.getElementById('attr-martial').value) || 20;
        const talent = parseInt(document.getElementById('attr-talent').value) || 20;
        const stamina = parseInt(document.getElementById('attr-stamina').value) || 20;
        
        // 检查点数分配
        const totalUsed = (literature + martial + talent + stamina) - 80;
        if (totalUsed > 30) {
            alert('属性点分配超出限制！请重新分配。');
            return;
        }
        
        // 初始化玩家数据
        this.player.init({
            dynastyName,
            emperorTitle,
            emperorName,
            avatar: this.selectedAvatar || 0,
            age: startAge,
            attributes: {
                literature,
                martial,
                talent,
                stamina,
                morality: 50
            }
        });
        
        // 初始化资源
        this.resources.init({
            money: 5000000,
            food: 10000000,
            army: 500000,
            people: 80,
            order: 10
        });
        
        // 初始化科技树
        this.techTree = {
            agriculture: 0,  // 农业科技 0-5
            military: 0,     // 军事科技 0-5
            culture: 0,      // 文化科技 0-5
            economy: 0       // 经济科技 0-5
        };

        // 初始化游戏时间
        this.state.year = 1;
        this.state.month = 1;
        this.state.day = 1;
        this.state.turn = 1;
        
        // 初始化子系统
        this.officialSystem.init();
        this.haremSystem.init();
        this.militarySystem.init();
        this.diplomacySystem.init();
        
        // 进入主游戏界面
        this.showScreen('main-game');
        this.isPlaying = true;
        this.state.isPlaying = true;
        
        // 更新UI
        this.uiManager.updateAll();
        
        // 显示欢迎消息
        this.showNotification('欢迎来到帝王模拟器2！', 'success');
        
        // 触发初始事件
        this.eventSystem.triggerEvent('game_start');
        
        console.log('角色创建完成，游戏开始！');
    }
    
    /**
     * 保存游戏
     */
    saveGame() {
        if (!this.isPlaying) {
            this.showNotification('请先开始游戏！', 'warning');
            return;
        }

        const saveData = {
            player: this.player.getData(),
            resources: this.resources.getData(),
            state: this.state,
            officials: this.officialSystem.getData(),
            harem: this.haremSystem.getData(),
            military: this.militarySystem.getData(),
            diplomacy: this.diplomacySystem.getData(),
            events: this.eventSystem.getData(),
            techTree: this.techTree || { agriculture: 0, military: 0, culture: 0, economy: 0 },
            crownPrince: this._crownPrince || null,
            timestamp: new Date().toISOString()
        };

        // 读取3个存档位的信息
        const slotInfo = [];
        for (let i = 1; i <= 3; i++) {
            const raw = localStorage.getItem('diwangsimulator2_slot' + i);
            if (raw) {
                try {
                    const d = JSON.parse(raw);
                    const t = new Date(d.timestamp);
                    const dateStr = t.getFullYear() + '/' + (t.getMonth()+1) + '/' + t.getDate() + ' ' + ('0'+t.getHours()).slice(-2) + ':' + ('0'+t.getMinutes()).slice(-2);
                    slotInfo.push({ slot: i, dynasty: d.player.dynastyName, title: d.player.emperorTitle, date: dateStr });
                } catch(e) {
                    slotInfo.push({ slot: i, dynasty: '', title: '', date: '' });
                }
            } else {
                slotInfo.push(null);
            }
        }

        const btnStyle = 'display:block;width:100%;padding:12px;margin:6px 0;border-radius:8px;border:1px solid #D4AF37;background:rgba(255,215,0,0.08);color:#fff;cursor:pointer;font-size:0.95em;text-align:left;';
        let slotsHtml = '';
        for (let i = 0; i < 3; i++) {
            const s = slotInfo[i];
            const label = s
                ? `<span style="color:#FFD700;">存档${i+1}</span> <span style="color:#aaa;">| ${s.dynasty} · ${s.title}帝 | ${s.date}</span>`
                : `<span style="color:#FFD700;">存档${i+1}</span> <span style="color:#666;">（空）</span>`;
            slotsHtml += `<button style="${btnStyle}" onclick="game.doSave(${i+1})">${label}</button>`;
        }

        this.modalManager.open('选择存档位', `
            <div>
                <p style="color:#aaa;font-size:0.85em;margin-bottom:8px;">选择存档位保存，已有数据将被覆盖</p>
                ${slotsHtml}
            </div>
        `, [
            { text: '取消', action: () => this.modalManager.close() }
        ]);

        // 暂存数据供 doSave 使用
        this._pendingSaveData = saveData;
    }

    /**
     * 执行保存到指定存档位
     */
    doSave(slot) {
        if (!this._pendingSaveData) return;
        localStorage.setItem('diwangsimulator2_slot' + slot, JSON.stringify(this._pendingSaveData));
        this._pendingSaveData = null;
        this._lastSaveSlot = slot;
        this.modalManager.close();
        this.showNotification('已保存到存档' + slot + '！', 'success');
    }

    /**
     * 静默自动保存（用于页面关闭时）
     */
    autoSave() {
        if (!this.isPlaying) return;
        const saveData = {
            player: this.player.getData(),
            resources: this.resources.getData(),
            state: this.state,
            officials: this.officialSystem.getData(),
            harem: this.haremSystem.getData(),
            military: this.militarySystem.getData(),
            diplomacy: this.diplomacySystem.getData(),
            events: this.eventSystem.getData(),
            techTree: this.techTree || { agriculture: 0, military: 0, culture: 0, economy: 0 },
            crownPrince: this._crownPrince || null,
            timestamp: new Date().toISOString()
        };
        const slot = this._lastSaveSlot || 1;
        localStorage.setItem('diwangsimulator2_slot' + slot, JSON.stringify(saveData));
    }

    /**
     * 显示加载界面（存档列表）
     */
    showLoadScreen() {
        // 迁移旧版单存档到存档位1
        const oldSave = localStorage.getItem('diwangsimulator2_save');
        if (oldSave && !localStorage.getItem('diwangsimulator2_slot1')) {
            localStorage.setItem('diwangsimulator2_slot1', oldSave);
            localStorage.removeItem('diwangsimulator2_save');
        }

        const slotInfo = [];
        for (let i = 1; i <= 3; i++) {
            const raw = localStorage.getItem('diwangsimulator2_slot' + i);
            if (raw) {
                try {
                    const d = JSON.parse(raw);
                    const t = new Date(d.timestamp);
                    const dateStr = t.getFullYear() + '/' + (t.getMonth()+1) + '/' + t.getDate() + ' ' + ('0'+t.getHours()).slice(-2) + ':' + ('0'+t.getMinutes()).slice(-2);
                    slotInfo.push({ slot: i, dynasty: d.player.dynastyName, title: d.player.emperorTitle, year: d.state.year, date: dateStr });
                } catch(e) {
                    slotInfo.push(null);
                }
            } else {
                slotInfo.push(null);
            }
        }

        const hasAnySave = slotInfo.some(s => s !== null);
        if (!hasAnySave) {
            this.showNotification('没有找到任何存档！', 'warning');
            return;
        }

        const btnStyle = 'display:block;width:100%;padding:12px;margin:6px 0;border-radius:8px;border:1px solid #D4AF37;background:rgba(255,215,0,0.08);color:#fff;cursor:pointer;font-size:0.95em;text-align:left;';
        const disabledStyle = 'display:block;width:100%;padding:12px;margin:6px 0;border-radius:8px;border:1px solid #333;background:rgba(255,255,255,0.03);color:#555;font-size:0.95em;text-align:left;cursor:default;';
        let slotsHtml = '';
        for (let i = 0; i < 3; i++) {
            const s = slotInfo[i];
            if (s) {
                slotsHtml += `<button style="${btnStyle}" onclick="game.doLoad(${s.slot})">
                    <span style="color:#FFD700;">存档${s.slot}</span>
                    <span style="color:#ccc;"> | ${s.dynasty} · ${s.title}帝 | 在位${s.year}年</span>
                    <div style="font-size:0.8em;color:#888;margin-top:2px;">${s.date}</div>
                </button>`;
            } else {
                slotsHtml += `<div style="${disabledStyle}"><span style="color:#555;">存档${i+1}</span> <span style="color:#444;">（空）</span></div>`;
            }
        }

        this.modalManager.open('读取存档', `
            <div>${slotsHtml}</div>
        `, [
            { text: '取消', action: () => this.modalManager.close() }
        ]);
    }

    /**
     * 执行加载指定存档
     */
    doLoad(slot) {
        const saveData = localStorage.getItem('diwangsimulator2_slot' + slot);
        if (!saveData) {
            this.showNotification('存档' + slot + '为空！', 'warning');
            return;
        }

        try {
            const data = JSON.parse(saveData);

            this.state = data.state;
            this.player.loadData(data.player);
            this.resources.loadData(data.resources);
            this.officialSystem.loadData(data.officials);
            this.haremSystem.loadData(data.harem);
            this.militarySystem.loadData(data.military);
            this.diplomacySystem.loadData(data.diplomacy);
            this.eventSystem.loadData(data.events);
            this.techTree = data.techTree || { agriculture: 0, military: 0, culture: 0, economy: 0 };
            this._crownPrince = data.crownPrince || null;

            this.isPlaying = true;
            this.state.isPlaying = true;
            this.modalManager.closeAll();

            setTimeout(() => {
                this.showScreen('main-game');
                this.uiManager.updateAll();
                this.showNotification('存档' + slot + '加载成功！', 'success');
            }, 350);

            console.log('游戏加载成功，存档位:', slot);
            return true;
        } catch (error) {
            console.error('加载游戏失败:', error);
            this.showNotification('加载存档失败！', 'error');
            return false;
        }
    }

    /**
     * 显示设置
     */
    showSettings() {
        const savedInterval = localStorage.getItem('diwangsimulator2_autosave_interval') || '10';

        this.modalManager.open('设置', `
            <div class="settings-options">
                <div class="setting-item" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.1);">
                    <label style="color:#FFD700;">自动保存</label>
                    <select id="setting-autosave" style="padding:6px 10px;border-radius:6px;border:1px solid #555;background:#1a1a2e;color:#fff;">
                        <option value="5" ${savedInterval === '5' ? 'selected' : ''}>每5分钟</option>
                        <option value="10" ${savedInterval === '10' ? 'selected' : ''}>每10分钟</option>
                        <option value="30" ${savedInterval === '30' ? 'selected' : ''}>每30分钟</option>
                        <option value="0" ${savedInterval === '0' ? 'selected' : ''}>关闭</option>
                    </select>
                </div>
                <p style="color:#666;font-size:0.8em;margin-top:8px;">音效功能开发中，敬请期待...</p>
            </div>
        `, [
            { text: '取消', action: () => this.modalManager.close() },
            { text: '保存', action: () => {
                const interval = document.getElementById('setting-autosave').value;
                localStorage.setItem('diwangsimulator2_autosave_interval', interval);
                this.setupAutoSave(parseInt(interval));
                this.showNotification('设置已保存！', 'success');
                this.modalManager.close();
            }}
        ]);
    }

    /**
     * 设置自动保存定时器
     */
    setupAutoSave(intervalMinutes) {
        if (this._autoSaveTimer) {
            clearInterval(this._autoSaveTimer);
            this._autoSaveTimer = null;
        }
        if (intervalMinutes > 0) {
            this._autoSaveTimer = setInterval(() => {
                this.autoSave();
            }, intervalMinutes * 60 * 1000);
        }
    }
    
    /**
     * 显示帮助
     */
    showHelp() {
        this.modalManager.open('游戏帮助', `
            <div class="help-content">
                <h4>基础操作</h4>
                <ul>
                    <li><strong>上朝议政：</strong>处理政务、任命官员、批阅奏折</li>
                    <li><strong>后宫：</strong>管理妃子、培养子嗣</li>
                    <li><strong>军事：</strong>招募军队、发动战争</li>
                    <li><strong>出巡：</strong>巡视地方、了解民情</li>
                    <li><strong>休息：</strong>恢复健康和体力</li>
                </ul>
                <h4>属性说明</h4>
                <ul>
                    <li><strong>文学：</strong>影响招揽名臣的概率</li>
                    <li><strong>武术：</strong>影响遇刺时的存活率</li>
                    <li><strong>才艺：</strong>影响邂逅名妃的概率</li>
                    <li><strong>体能：</strong>影响每日可处理的政务量</li>
                    <li><strong>道德：</strong>影响民心和大臣忠诚度</li>
                </ul>
                <h4>小贴士</h4>
                <ul>
                    <li>保持国库充盈，避免财政危机</li>
                    <li>平衡各方势力，防止权臣篡位</li>
                    <li>关注民心，避免民变</li>
                    <li>培养继承人，确保王朝延续</li>
                </ul>
            </div>
        `, [
            { text: '知道了', action: () => this.modalManager.close() }
        ]);
    }
    
    /**
     * 返回主菜单
     */
    returnToMenu() {
        this.modalManager.open('确认返回', '返回主菜单将丢失未保存的进度，是否继续？', [
            { text: '取消', action: () => this.modalManager.close() },
            { text: '返回', action: () => {
                this.modalManager.closeAll();
                this.isPlaying = false;
                this.state.isPlaying = false;
                setTimeout(() => {
                    this.showScreen('splash-screen');
                }, 350);
            }}
        ]);
    }
    
    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let title = '提示';
        switch (type) {
            case 'success': title = '成功'; break;
            case 'warning': title = '警告'; break;
            case 'error': title = '错误'; break;
        }
        
        notification.innerHTML = `
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        `;
        
        container.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    /**
     * 进入下一回合（下一个月）
     */
    nextTurn() {
        // 更新日期
        this.state.month++;
        if (this.state.month > 12) {
            this.state.month = 1;
            this.state.year++;
            
            // 每年增加年龄
            this.player.age++;
            
            // 检查寿命
            if (this.player.age >= this.player.maxAge) {
                this.triggerGameOver('寿命已尽');
                return;
            }
        }
        
        // 重置每日政令
        this.resources.order = this.resources.maxOrder;
        
        // 恢复体力
        this.player.stamina = Math.min(
            this.player.maxStamina,
            this.player.stamina + 30
        );
        
        // 计算月度收支
        this.calculateMonthlyFinance();
        
        // 更新各系统
        this.officialSystem.onTurnEnd();
        this.haremSystem.onTurnEnd();
        this.militarySystem.onTurnEnd();
        this.diplomacySystem.onTurnEnd();
        
        // 触发随机事件
        this.eventSystem.triggerRandomEvent();

        // 检查危机事件
        this.checkCrisis();

        // 检查成就
        this.checkAchievements();

        // 检查健康死亡
        if (this.player.health <= 0) {
            this.triggerGameOver('积劳成疾，龙体不支');
            return;
        }

        // 更新UI
        this.uiManager.updateAll();

        // 显示回合信息
        this.showNotification(`${this.getDateString()}，新的一月开始了！`, 'info');

        this.state.turn++;
    }
    
    /**
     * 计算月度财务
     */
    calculateMonthlyFinance() {
        // 科技树加成
        const tech = this.techTree || { agriculture: 0, military: 0, culture: 0, economy: 0 };

        // 官员职位加成
        const officialBonuses = this.getOfficialBonuses();

        // 税收收入（户部尚书加成 + 经济科技加成）
        const taxMultiplier = 1 + (officialBonuses.revenue / 200) + (tech.economy * 0.1);
        const taxIncome = this.resources.people * 1000 * (this.player.attributes.morality / 100) * taxMultiplier;

        // 贸易收入（显示在财务中）
        const tradeIncome = this.diplomacySystem.nations.filter(n => n.trade).length * 75000;

        // 军队开支（兵部尚书降低军费）
        const armyDiscount = 1 - (officialBonuses.war / 400);
        const armyExpense = this.resources.army * 5 * armyDiscount;

        // 官员俸禄
        const officialExpense = this.officialSystem.getTotalSalary();

        // 净收入
        const netIncome = taxIncome + tradeIncome - armyExpense - officialExpense;

        this.resources.money += netIncome;

        // 农业科技加成：每月增加粮食
        this.resources.food += tech.agriculture * 500000;

        // 工部尚书加成：每月少量增加粮食
        if (officialBonuses.works > 0) {
            this.resources.food += officialBonuses.works * 5000;
        }

        // 文化科技加成：每月增加声望
        if (tech.culture > 0) {
            this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + Math.floor(tech.culture / 2));
        }

        // 礼部尚书加成：每月少量增加声望
        if (officialBonuses.rites > 0 && Math.random() < 0.3) {
            this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + 1);
        }

        // 刑部尚书加成：每月少量增加稳定
        if (officialBonuses.punishments > 0 && Math.random() < 0.3) {
            this.resources.stability = Math.min(100, (this.resources.stability || 50) + 1);
        }

        // 吏部尚书加成：提升所有官员忠诚
        if (officialBonuses.personnel > 0 && Math.random() < 0.2) {
            this.officialSystem.officials.forEach(o => {
                if (o.hired) o.loyalty = Math.min(100, o.loyalty + 1);
            });
        }

        // 检查国库是否空虚
        if (this.resources.money < 0) {
            this.resources.money = 0;
            this.eventSystem.triggerEvent('financial_crisis');
        }
    }

    /**
     * 获取各职位官员能力加成
     */
    getOfficialBonuses() {
        const bonuses = { chancellor: 0, war: 0, revenue: 0, personnel: 0, rites: 0, punishments: 0, works: 0 };
        const posMap = {
            '丞相': 'chancellor', '兵部尚书': 'war', '户部尚书': 'revenue',
            '吏部尚书': 'personnel', '礼部尚书': 'rites', '刑部尚书': 'punishments', '工部尚书': 'works'
        };

        this.officialSystem.officials.forEach(o => {
            if (o.hired && o.position && posMap[o.position]) {
                bonuses[posMap[o.position]] = o.ability;
            }
        });

        return bonuses;
    }
    
    /**
     * 获取日期字符串
     */
    getDateString() {
        const yearName = this.player.emperorTitle;
        const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月',
                           '七月', '八月', '九月', '十月', '十一月', '腊月'];
        const chineseNums = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十',
                            '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                            '二十一', '二十二', '二十三', '二十四', '二十五', '二十六', '二十七', '二十八', '二十九', '三十',
                            '三十一', '三十二', '三十三', '三十四', '三十五', '三十六', '三十七', '三十八', '三十九', '四十',
                            '四十一', '四十二', '四十三', '四十四', '四十五', '四十六', '四十七', '四十八', '四十九', '五十'];
        const yearStr = this.state.year === 1 ? '元' : (chineseNums[this.state.year] || this.state.year);
        return `${yearName}${yearStr}年 ${monthNames[this.state.month - 1]}`;
    }
    
    /**
     * 上朝议政
     */
    goToCourt() {
        if (this.player.stamina < 10) {
            this.showNotification('体力不足，请先休息！', 'warning');
            return;
        }
        
        this.player.stamina -= 10;
        this.uiManager.updateEmperorStatus();
        
        // 显示上朝界面
        this.modalManager.open('金銮殿', `
            <div class="court-session">
                <div class="court-header">
                    <h4>🏛️ 早朝</h4>
                    <p>文武百官已列队等候，请陛下处理政务</p>
                </div>
                <div class="court-actions">
                    <button class="court-btn" onclick="game.reviewMemorials()">
                        <span class="icon">📜</span>
                        <span class="text">批阅奏折</span>
                    </button>
                    <button class="court-btn" onclick="game.appointOfficials()">
                        <span class="icon">👔</span>
                        <span class="text">任免官员</span>
                    </button>
                    <button class="court-btn" onclick="game.issueDecree()">
                        <span class="icon">📋</span>
                        <span class="text">颁布政令</span>
                    </button>
                    <button class="court-btn" onclick="game.holdExamination()">
                        <span class="icon">📝</span>
                        <span class="text">科举考试</span>
                    </button>
                    <button class="court-btn" onclick="game.openDiplomacy()">
                        <span class="icon">🌍</span>
                        <span class="text">外交事务</span>
                    </button>
                    <button class="court-btn" onclick="game.showTechTree()">
                        <span class="icon">🔬</span>
                        <span class="text">科技研发</span>
                    </button>
                </div>
            </div>
        `, [
            { text: '退朝', action: () => this.modalManager.close() }
        ]);
    }
    
    /**
     * 批阅奏折
     */
    reviewMemorials() {
        if (this.resources.order < 2) {
            this.showNotification('政令不足！', 'warning');
            return;
        }
        
        this.resources.order -= 2;
        
        // 根据游戏状态生成奏折池
        const allMemorials = [
            { title: '江南水灾', content: '江南地区暴雨成灾，农田被淹，百姓流离失所，请求朝廷拨款赈灾。', options: ['拨款100万两', '减免赋税', '暂不处理'] },
            { title: '边境急报', content: '北方游牧民族蠢蠢欲动，频繁骚扰边境村庄，请陛下决断。', options: ['加强边防', '派使谈判', '先发制人'] },
            { title: '科举建议', content: '今年科举考生众多，建议增加录取名额，为国家选拔更多人才。', options: ['同意', '维持原额', '减少名额'] },
            { title: '地方旱灾', content: '西北地区数月无雨，庄稼枯萎，百姓饥荒，请求朝廷调拨粮食。', options: ['调拨200万石粮食', '派官赈灾', '让地方自行解决'] },
            { title: '盐铁之议', content: '户部建议将盐铁收归国有专卖，可大幅增加国库收入，但商人们强烈反对。', options: ['实行盐铁专卖', '维持现状', '适度加税'] },
            { title: '宦官干政', content: '朝中大臣联名上书，弹劾内廷宦官干预朝政，请求陛下严查。', options: ['严查宦官', '各打五十大板', '驳回弹劾'] },
            { title: '将领请战', content: '边境大将上书请求主动出击，认为当前军力足以一战定乾坤。', options: ['准许出战', '按兵不动', '调将回京'], condition: () => this.resources.army > 300000 },
            { title: '藩王不臣', content: '某地藩王近来大肆招兵买马，行事越来越跋扈，地方官员不敢过问。', options: ['削藩', '安抚赐赏', '派密探监视'] },
            { title: '商路繁荣', content: '丝绸之路贸易日益繁荣，沿途各国商贾云集，户部建议设立通商口岸。', options: ['设立口岸', '加征关税', '维持现状'] },
            { title: '天象异变', content: '钦天监奏报夜现彗星，朝野议论纷纷，民间流言四起。', options: ['下罪己诏', '祭天祈福', '不予理会'] },
            { title: '百姓请愿', content: '京城百姓聚集宫门外请愿，要求减轻赋税负担。', options: ['接见百姓减税', '派官安抚', '驱散人群'], condition: () => this.resources.people < 60 },
            { title: '名医献方', content: '一位民间名医进献延年益寿之方，声称可延龄十年。', options: ['重赏纳方', '召入太医院', '恐为骗术拒绝'] },
            { title: '修缮长城', content: '兵部上书请修缮年久失修的北方长城，以防匈奴入侵。', options: ['拨款300万两修缮', '部分修缮', '暂缓'] },
            { title: '文人上书', content: '翰林学士联名建议编修国史，彰显本朝文治武功。', options: ['批准修史', '暂不考虑', '先编百科全书'] },
            { title: '粮仓火灾', content: '京郊官仓突发大火，损失大量储粮，疑为人为纵火。', options: ['严查真凶', '紧急调粮', '不追究只补损'] },
            { title: '海盗猖獗', content: '东南沿海海盗横行，商船频遭劫掠，地方水师无力应对。', options: ['增派水师', '招安海盗', '禁海锁国'] },
            { title: '太后寿辰', content: '太后寿辰将至，礼部请示该如何操办。', options: ['大办寿宴(100万两)', '简办', '按祖制办理'] },
            { title: '瘟疫蔓延', content: '某地突发瘟疫，已有数千人感染，恐将蔓延至其他州府。', options: ['派太医院全力救治', '封锁疫区', '发放草药自救'] }
        ];

        // 过滤掉有条件且不满足条件的奏折
        const memorials = allMemorials.filter(m => !m.condition || m.condition());
        const memorial = memorials[Math.floor(Math.random() * memorials.length)];
        
        this.modalManager.open(memorial.title, `
            <div class="memorial-content">
                <p>${memorial.content}</p>
            </div>
        `, memorial.options.map((option, index) => ({
            text: option,
            action: () => {
                this.handleMemorialChoice(memorial.title, index);
                this.modalManager.close();
            }
        })));
    }
    
    /**
     * 处理奏折选择
     */
    handleMemorialChoice(title, choice) {
        let message = '';
        let type = 'success';

        const effects = {
            '江南水灾': [
                () => { this.resources.money -= 1000000; this.resources.people += 5; return '拨款赈灾，百姓感恩戴德！民心+5'; },
                () => { this.resources.people += 3; return '减免赋税，百姓负担减轻。民心+3'; },
                () => { this.resources.people -= 5; type = 'warning'; return '不处理灾情，民怨沸腾！民心-5'; }
            ],
            '边境急报': [
                () => { this.resources.army += 50000; this.resources.money -= 500000; return '加强边防，边境稳固。军队+5万'; },
                () => { return '派使谈判，双方达成暂时和平。'; },
                () => { this.resources.army -= 30000; this.resources.money -= 300000; type = 'warning'; return '先发制人，虽获胜但损失不小。'; }
            ],
            '科举建议': [
                () => { this.holdExamination(); return '同意增加名额，人才涌入朝堂！'; },
                () => { return '维持原额，中规中矩。'; },
                () => { this.resources.prestige = Math.max(0, (this.resources.prestige || 50) - 5); type = 'warning'; return '减少名额，读书人心生不满。声望-5'; }
            ],
            '地方旱灾': [
                () => { this.resources.food -= 2000000; this.resources.people += 8; return '调拨粮食救灾，百姓感念圣恩！民心+8'; },
                () => { this.resources.money -= 500000; this.resources.people += 3; return '派官赈灾，略有成效。民心+3'; },
                () => { this.resources.people -= 8; type = 'warning'; return '放任灾情，饿殍遍野！民心-8'; }
            ],
            '盐铁之议': [
                () => { this.resources.money += 2000000; this.resources.people -= 5; return '盐铁专卖，国库充盈！但百姓负担加重。国库+200万，民心-5'; },
                () => { return '维持现状，各方平稳。'; },
                () => { this.resources.money += 800000; this.resources.people -= 2; return '适度加税，温和增收。国库+80万'; }
            ],
            '宦官干政': [
                () => { this.resources.stability = Math.min(100, (this.resources.stability || 50) + 10); this.resources.prestige += 5; return '严查宦官，朝纲整肃！稳定+10'; },
                () => { this.resources.stability = Math.min(100, (this.resources.stability || 50) + 3); return '各打五十大板，暂时平息争端。'; },
                () => { this.resources.stability = Math.max(0, (this.resources.stability || 50) - 5); type = 'warning'; return '驳回弹劾，朝臣心寒。稳定-5'; }
            ],
            '将领请战': [
                () => { this.resources.army -= 20000; this.resources.prestige += 8; this.resources.money += 1000000; return '大军出征，获得大胜！声望+8'; },
                () => { return '按兵不动，保存实力。'; },
                () => { this.resources.stability += 5; type = 'warning'; return '调将回京，避免将领拥兵自重。稳定+5'; }
            ],
            '藩王不臣': [
                () => { this.resources.army -= 50000; this.resources.money -= 1000000; this.resources.stability += 15; return '削藩成功！朝廷威信大增。稳定+15'; },
                () => { this.resources.money -= 500000; return '赏赐安抚，暂时稳住局面。'; },
                () => { return '派密探监视，静观其变。'; }
            ],
            '商路繁荣': [
                () => { this.resources.money += 1500000; this.resources.prestige += 5; return '设立口岸，商贸繁荣！国库+150万，声望+5'; },
                () => { this.resources.money += 800000; this.resources.people -= 3; return '加征关税，国库有收但商人不满。'; },
                () => { return '维持现状，平稳度日。'; }
            ],
            '天象异变': [
                () => { this.resources.people += 10; this.player.attributes.morality += 3; return '下罪己诏，天下感动！民心+10，道德+3'; },
                () => { this.resources.money -= 500000; this.resources.people += 5; return '祭天祈福，人心稍安。民心+5'; },
                () => { this.resources.people -= 3; type = 'warning'; return '不予理会，流言四起。民心-3'; }
            ],
            '百姓请愿': [
                () => { this.resources.people += 15; this.resources.money -= 500000; return '接见百姓并减税，万民称颂！民心+15'; },
                () => { this.resources.people += 5; return '派官安抚，百姓暂时散去。民心+5'; },
                () => { this.resources.people -= 10; this.resources.stability -= 5; type = 'error'; return '驱散人群！百姓怨恨加深！民心-10，稳定-5'; }
            ],
            '名医献方': [
                () => { this.player.health = Math.min(100, this.player.health + 20); this.resources.money -= 200000; return '服用妙方，龙体大安！健康+20'; },
                () => { this.player.health = Math.min(100, this.player.health + 10); return '名医入太医院，日后调养。健康+10'; },
                () => { return '谨慎拒绝，以防不测。'; }
            ],
            '修缮长城': [
                () => { this.resources.money -= 3000000; this.resources.stability += 10; this.resources.prestige += 10; return '长城修缮完毕！边防稳固。稳定+10，声望+10'; },
                () => { this.resources.money -= 1000000; this.resources.stability += 5; return '部分修缮，聊胜于无。稳定+5'; },
                () => { type = 'warning'; return '暂缓修缮，但边防隐患依旧。'; }
            ],
            '文人上书': [
                () => { this.resources.money -= 1000000; this.resources.prestige += 15; this.player.attributes.literature += 3; return '修史大业启动！文治昌盛。声望+15，文学+3'; },
                () => { return '暂不考虑，集中精力处理国政。'; },
                () => { this.resources.money -= 2000000; this.resources.prestige += 20; return '编修百科全书！名扬四海。声望+20'; }
            ],
            '粮仓火灾': [
                () => { this.resources.stability += 5; this.resources.food -= 1000000; return '严查真凶，以儆效尤。稳定+5'; },
                () => { this.resources.food -= 500000; this.resources.money -= 500000; return '紧急调粮补充，京城无虞。'; },
                () => { this.resources.food -= 2000000; type = 'warning'; return '不追究，但粮食损失惨重。'; }
            ],
            '海盗猖獗': [
                () => { this.resources.army += 20000; this.resources.money -= 1000000; this.resources.prestige += 5; return '增派水师，沿海渐安。声望+5'; },
                () => { this.resources.stability -= 3; return '招安海盗，化敌为友，但朝臣议论。'; },
                () => { this.resources.people -= 5; this.resources.money -= 500000; type = 'warning'; return '禁海锁国，商贸萧条。民心-5'; }
            ],
            '太后寿辰': [
                () => { this.resources.money -= 1000000; this.player.attributes.morality += 5; this.resources.people += 3; return '大办寿宴，天下称孝！道德+5，民心+3'; },
                () => { return '简办寿宴，节约国库。'; },
                () => { this.resources.money -= 300000; this.player.attributes.morality += 2; return '按祖制办理，合乎礼法。道德+2'; }
            ],
            '瘟疫蔓延': [
                () => { this.resources.money -= 1500000; this.resources.people += 10; return '太医院全力救治，疫情得控！民心+10'; },
                () => { this.resources.people -= 5; this.resources.stability -= 5; type = 'warning'; return '封锁疫区，死伤不少但未扩散。民心-5'; },
                () => { this.resources.people -= 10; this.resources.food -= 500000; type = 'warning'; return '发放草药效果有限，疫情持续。民心-10'; }
            ]
        };

        const handler = effects[title];
        if (handler && handler[choice]) {
            message = handler[choice]();
        } else {
            message = '奏折已批阅。';
        }

        this.showNotification(message, type);
        this.uiManager.updateResources();
    }
    
    /**
     * 任免官员
     */
    appointOfficials() {
        const officials = this.officialSystem.getAllOfficials();
        const positions = this.officialSystem.positions;

        let officialsHtml = '<div class="officials-manage-list">';
        officials.forEach(official => {
            const posOptions = positions.map(p =>
                `<option value="${p.id}">${p.name}</option>`
            ).join('');

            officialsHtml += `
                <div class="official-manage-item" style="display:flex;justify-content:space-between;align-items:center;padding:8px;margin:4px 0;background:rgba(255,255,255,0.05);border-radius:8px;flex-wrap:wrap;gap:6px;">
                    <div style="min-width:120px;">
                        <div style="color:#FFD700;font-weight:bold;">${official.name}</div>
                        <div style="font-size:0.8em;color:#aaa;">能力:${official.ability} 忠诚:${official.loyalty}</div>
                    </div>
                    <div style="color:${official.position ? '#90EE90' : '#888'};">
                        ${official.position || '待命'}
                    </div>
                    <div style="display:flex;gap:4px;align-items:center;">
                        ${!official.hired ? `
                            <select id="pos-${official.id}" style="padding:4px;border-radius:4px;border:1px solid #555;background:#1a1a2e;color:#fff;font-size:0.8em;">
                                ${posOptions}
                            </select>
                            <button onclick="game.doHireOfficial(${JSON.stringify(official.id).replace(/"/g, '&quot;')})" style="padding:4px 10px;border-radius:4px;border:1px solid #4CAF50;background:rgba(76,175,80,0.2);color:#4CAF50;cursor:pointer;font-size:0.8em;">任命</button>
                        ` : `
                            <button onclick="game.doFireOfficial(${JSON.stringify(official.id).replace(/"/g, '&quot;')})" style="padding:4px 10px;border-radius:4px;border:1px solid #f44336;background:rgba(244,67,54,0.2);color:#f44336;cursor:pointer;font-size:0.8em;">免职</button>
                        `}
                    </div>
                </div>
            `;
        });
        officialsHtml += '</div>';

        this.modalManager.open('任免官员', officialsHtml, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    /**
     * 执行任命官员
     */
    doHireOfficial(officialId) {
        const selectEl = document.getElementById('pos-' + officialId);
        if (!selectEl) return;
        const positionId = selectEl.value;
        const result = this.officialSystem.hireOfficial(officialId, positionId);
        this.showNotification(result.message, result.success ? 'success' : 'warning');
        if (result.success) {
            this.uiManager.updateResources();
            this.appointOfficials(); // 刷新列表
        }
    }

    /**
     * 执行免职官员
     */
    doFireOfficial(officialId) {
        const result = this.officialSystem.fireOfficial(officialId);
        this.showNotification(result.message, result.success ? 'success' : 'warning');
        if (result.success) {
            this.uiManager.updateResources();
            this.appointOfficials(); // 刷新列表
        }
    }
    
    /**
     * 颁布政令
     */
    issueDecree() {
        if (this.resources.order < 5) {
            this.showNotification('政令不足！', 'warning');
            return;
        }
        
        const decrees = [
            { id: 'tax_cut', title: '减免赋税', desc: '民心+10', icon: '💰' },
            { id: 'conscription', title: '扩充军队', desc: '军队+10万，国库-200万', icon: '⚔️' },
            { id: 'infrastructure', title: '兴修水利', desc: '粮食+200万石，国库-300万', icon: '🌊' },
            { id: 'amnesty', title: '大赦天下', desc: '民心+20', icon: '🕊️' },
            { id: 'encourage_farming', title: '劝课农桑', desc: '粮食+100万石，民心+5', icon: '🌾' },
            { id: 'open_trade', title: '开放互市', desc: '国库+100万，声望+5', icon: '🏪', condition: this.diplomacySystem.nations.some(n => n.trade) },
            { id: 'build_academy', title: '兴办学堂', desc: '文学+3，声望+5，国库-150万', icon: '📖', condition: this.player.attributes.literature >= 40 },
            { id: 'military_reform', title: '军事改革', desc: '军队训练+10，国库-200万', icon: '🏹', condition: this.resources.army >= 200000 },
            { id: 'anti_corruption', title: '肃清吏治', desc: '稳定+10，声望+5', icon: '⚖️' },
            { id: 'celebrate', title: '大兴庆典', desc: '民心+15，声望+10，国库-500万', icon: '🎉' }
        ];

        const decreeButtons = decrees
            .filter(d => d.condition === undefined || d.condition)
            .map(d => `
                <button class="decree-btn" onclick="game.executeDecree('${d.id}')">
                    <span class="title">${d.icon} ${d.title}</span>
                    <span class="desc">${d.desc}</span>
                </button>
            `).join('');

        this.modalManager.open('颁布政令', `
            <div class="decree-options" style="max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <p style="color:#aaa;font-size:0.85em;margin-bottom:8px;">每道政令消耗5点政令</p>
                ${decreeButtons}
            </div>
        `, [
            { text: '取消', action: () => this.modalManager.close() }
        ]);
    }
    
    /**
     * 执行政令
     */
    executeDecree(decreeType) {
        if (this.resources.order < 5) {
            this.showNotification('政令不足！', 'warning');
            return;
        }
        
        this.resources.order -= 5;
        
        let message = '';
        switch (decreeType) {
            case 'tax_cut':
                this.resources.people += 10;
                message = '减免赋税，百姓欢呼！民心+10';
                break;
            case 'conscription':
                this.resources.army += 100000;
                this.resources.money -= 2000000;
                message = '扩充军队，国力增强！军队+10万';
                break;
            case 'infrastructure':
                this.resources.food += 2000000;
                this.resources.money -= 3000000;
                message = '兴修水利，农业丰收！粮食+200万石';
                break;
            case 'amnesty':
                this.resources.people += 20;
                message = '大赦天下，万民称颂！民心+20';
                break;
            case 'encourage_farming':
                this.resources.food += 1000000;
                this.resources.people += 5;
                message = '劝课农桑，五谷丰登！粮食+100万石，民心+5';
                break;
            case 'open_trade':
                this.resources.money += 1000000;
                this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + 5);
                message = '开放互市，商贸繁荣！国库+100万，声望+5';
                break;
            case 'build_academy':
                this.resources.money -= 1500000;
                this.player.attributes.literature = Math.min(100, this.player.attributes.literature + 3);
                this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + 5);
                message = '兴办学堂，文风鼎盛！文学+3，声望+5';
                break;
            case 'military_reform':
                this.resources.money -= 2000000;
                if (this.militarySystem.armies[0]) {
                    this.militarySystem.armies[0].training = Math.min(100, this.militarySystem.armies[0].training + 10);
                }
                message = '军事改革，强军利国！军队训练+10';
                break;
            case 'anti_corruption':
                this.resources.stability = Math.min(100, (this.resources.stability || 50) + 10);
                this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + 5);
                // 随机惩罚一个低忠诚官员
                const corrupt = this.officialSystem.officials.find(o => o.hired && o.loyalty < 50);
                if (corrupt) {
                    this.resources.money += corrupt.salary * 12; // 追缴贪款
                    corrupt.loyalty = Math.min(100, corrupt.loyalty + 20);
                    message = `肃清吏治，查处${corrupt.name}贪腐！稳定+10，声望+5`;
                } else {
                    message = '肃清吏治，吏治清明！稳定+10，声望+5';
                }
                break;
            case 'celebrate':
                this.resources.money -= 5000000;
                this.resources.people += 15;
                this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + 10);
                message = '大兴庆典，举国欢腾！民心+15，声望+10';
                break;
        }
        
        this.showNotification(message, 'success');
        this.uiManager.updateResources();
        this.modalManager.close();
    }
    
    /**
     * 举行科举
     */
    holdExamination() {
        if (this.resources.order < 3) {
            this.showNotification('政令不足！', 'warning');
            return;
        }
        
        if (this.resources.money < 500000) {
            this.showNotification('国库资金不足！', 'warning');
            return;
        }
        
        this.resources.order -= 3;
        this.resources.money -= 500000;
        
        // 根据皇帝文学属性决定人才质量
        const literature = this.player.attributes.literature;
        const recruitCount = Math.floor(Math.random() * 3) + 1;
        
        let message = `科举考试结束，录取${recruitCount}名进士：\n`;
        
        for (let i = 0; i < recruitCount; i++) {
            const official = this.officialSystem.generateOfficial(literature);
            message += `• ${official.name} - 能力${official.ability}，忠诚${official.loyalty}\n`;
        }
        
        this.showNotification(message, 'success');
        this.uiManager.updateResources();
    }
    
    /**
     * 访问后宫
     */
    visitHarem() {
        if (this.player.stamina < 15) {
            this.showNotification('体力不足，请先休息！', 'warning');
            return;
        }
        
        this.player.stamina -= 15;
        this.uiManager.updateEmperorStatus();
        
        this.modalManager.open('后宫', `
            <div class="harem-content">
                <div class="harem-tabs">
                    <button class="harem-tab active" data-harem-tab="concubines">妃子</button>
                    <button class="harem-tab" data-harem-tab="children">子嗣</button>
                    <button class="harem-tab" data-harem-tab="selection">选秀</button>
                </div>
                <div class="harem-panel" id="harem-concubines">
                    ${this.haremSystem.getConcubinesList()}
                </div>
                <div class="harem-panel hidden" id="harem-children">
                    ${this.haremSystem.getChildrenList()}
                    ${this.haremSystem.children.some(c => c.gender === 'male' && c.age >= 12) ?
                        '<button onclick="game.setCrownPrince()" style="display:block;width:100%;padding:10px;margin-top:10px;border-radius:6px;border:1px solid #FFD700;background:rgba(255,215,0,0.1);color:#FFD700;cursor:pointer;">👑 立储</button>' : ''}
                </div>
                <div class="harem-panel hidden" id="harem-selection">
                    <button class="selection-btn" onclick="game.holdSelection()">
                        举行选秀（消耗100万两）
                    </button>
                </div>
            </div>
        `, [
            { text: '离开', action: () => this.modalManager.close() }
        ]);
        
        // 绑定后宫标签页切换
        setTimeout(() => {
            document.querySelectorAll('.harem-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    const tabName = tab.dataset.haremTab;
                    document.querySelectorAll('.harem-tab').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.harem-panel').forEach(p => p.classList.add('hidden'));
                    tab.classList.add('active');
                    document.getElementById(`harem-${tabName}`).classList.remove('hidden');
                });
            });
        }, 100);
    }
    
    /**
     * 举行选秀
     */
    holdSelection() {
        if (this.resources.money < 1000000) {
            this.showNotification('国库资金不足！', 'warning');
            return;
        }
        
        this.resources.money -= 1000000;
        
        // 根据才艺属性决定遇到名妃的概率
        const talent = this.player.attributes.talent;
        const concubine = this.haremSystem.generateConcubine(talent);
        
        this.haremSystem.addConcubine(concubine);
        
        this.showNotification(`选秀结束！纳${concubine.name}入宫，宠爱值${concubine.favor}`, 'success');
        this.uiManager.updateResources();
        this.modalManager.close();
    }
    
    /**
     * 外交事务
     */
    openDiplomacy() {
        if (this.resources.order < 2) {
            this.showNotification('政令不足！', 'warning');
            return;
        }

        const nations = this.diplomacySystem.nations;
        const alliances = this.diplomacySystem.alliances || [];

        let nationsHtml = nations.map(nation => {
            const relationColor = nation.relation >= 50 ? '#4CAF50' : nation.relation >= 0 ? '#FFD700' : nation.relation >= -50 ? '#FF9800' : '#f44336';
            const relationText = nation.relation >= 50 ? '友好' : nation.relation >= 0 ? '中立' : nation.relation >= -50 ? '冷淡' : '敌对';
            const isAllied = alliances.includes(nation.id);

            return `
                <div style="padding:10px;margin:6px 0;background:rgba(255,255,255,0.05);border-radius:8px;border-left:3px solid ${relationColor};">
                    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:6px;">
                        <div>
                            <span style="color:#FFD700;font-weight:bold;">${nation.name}</span>
                            <span style="color:#aaa;font-size:0.85em;"> 国力:${nation.strength}</span>
                            ${isAllied ? '<span style="color:#4CAF50;font-size:0.8em;"> [同盟]</span>' : ''}
                        </div>
                        <div>
                            <span style="color:${relationColor};font-size:0.9em;">${relationText}(${nation.relation})</span>
                            <span style="color:${nation.trade ? '#4CAF50' : '#888'};font-size:0.85em;margin-left:8px;">${nation.trade ? '🤝贸易中' : '无贸易'}</span>
                        </div>
                    </div>
                    <div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">
                        <button onclick="game.doDiplomacy('improve','${nation.id}')" style="padding:3px 8px;border-radius:4px;border:1px solid #4CAF50;background:rgba(76,175,80,0.15);color:#4CAF50;cursor:pointer;font-size:0.8em;">派遣使者</button>
                        ${!nation.trade ? `<button onclick="game.doDiplomacy('trade','${nation.id}')" style="padding:3px 8px;border-radius:4px;border:1px solid #2196F3;background:rgba(33,150,243,0.15);color:#2196F3;cursor:pointer;font-size:0.8em;">建立贸易</button>` : ''}
                        ${!isAllied ? `<button onclick="game.doDiplomacy('alliance','${nation.id}')" style="padding:3px 8px;border-radius:4px;border:1px solid #9C27B0;background:rgba(156,39,176,0.15);color:#9C27B0;cursor:pointer;font-size:0.8em;">缔结同盟</button>` : ''}
                        <button onclick="game.doDiplomacy('threaten','${nation.id}')" style="padding:3px 8px;border-radius:4px;border:1px solid #f44336;background:rgba(244,67,54,0.15);color:#f44336;cursor:pointer;font-size:0.8em;">武力威慑</button>
                    </div>
                </div>
            `;
        }).join('');

        this.modalManager.open('外交事务', `
            <div style="max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <p style="color:#aaa;font-size:0.85em;margin-bottom:8px;">每次外交行动消耗2点政令</p>
                ${nationsHtml}
            </div>
        `, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    /**
     * 执行外交操作
     */
    doDiplomacy(action, nationId) {
        if (this.resources.order < 2) {
            this.showNotification('政令不足！', 'warning');
            return;
        }

        this.resources.order -= 2;
        let result;

        switch (action) {
            case 'improve':
                result = this.diplomacySystem.improveRelation(nationId, 10 + Math.floor(Math.random() * 10));
                break;
            case 'trade':
                result = this.diplomacySystem.establishTrade(nationId);
                break;
            case 'alliance':
                result = this.diplomacySystem.formAlliance(nationId);
                break;
            case 'threaten': {
                const nation = this.diplomacySystem.nations.find(n => n.id === nationId);
                if (nation) {
                    // 武力威慑：军队多则成功改善关系，否则适得其反
                    if (this.resources.army > nation.strength * 10000) {
                        nation.relation = Math.min(100, nation.relation + 5);
                        result = { success: true, message: `${nation.name}慑于我朝军威，态度有所改善` };
                    } else {
                        nation.relation = Math.max(-100, nation.relation - 10);
                        result = { success: false, message: `${nation.name}不以为意，关系反而恶化` };
                    }
                } else {
                    result = { success: false, message: '国家不存在' };
                }
                break;
            }
        }

        this.showNotification(result.message, result.success ? 'success' : 'warning');
        this.uiManager.updateResources();

        // 刷新外交界面
        this.openDiplomacy();
    }

    /**
     * 侍寝妃子
     */
    visitConcubine(concubineId) {
        if (this.player.stamina < 10) {
            this.showNotification('体力不足！', 'warning');
            return;
        }

        const concubine = this.haremSystem.concubines.find(c => c.id === concubineId);
        if (!concubine) return;

        if (concubine.pregnant) {
            this.showNotification('该妃子已有身孕！', 'warning');
            return;
        }

        this.player.stamina -= 10;

        // 增加宠爱值
        concubine.favor = Math.min(100, concubine.favor + 5);

        // 怀孕概率：基础10% + 宠爱值/200 + 容貌/200，最高40%
        const pregnancyChance = Math.min(0.4, 0.1 + concubine.favor / 200 + concubine.beauty / 200);
        if (Math.random() < pregnancyChance) {
            concubine.pregnant = true;
            concubine.pregnantTurn = 0;
            this.showNotification(`${concubine.name}有喜了！宠爱+5`, 'success');
        } else {
            this.showNotification(`与${concubine.name}共度良宵，宠爱+5`, 'info');
        }

        this.uiManager.updateEmperorStatus();

        // 刷新后宫界面
        const concubinesPanel = document.getElementById('harem-concubines');
        if (concubinesPanel) {
            concubinesPanel.innerHTML = this.haremSystem.getConcubinesList();
        }
    }

    /**
     * 管理军事
     */
    manageMilitary() {
        if (this.player.stamina < 10) {
            this.showNotification('体力不足，请先休息！', 'warning');
            return;
        }
        
        this.player.stamina -= 10;
        this.uiManager.updateEmperorStatus();
        
        const army = this.militarySystem.armies[0] || {};
        const fac = this.militarySystem.facilities;
        const generals = this.militarySystem.generals;

        let generalsHtml = generals.length > 0 ? generals.map(g => `
            <div style="padding:4px 8px;margin:2px 0;background:rgba(255,255,255,0.04);border-radius:4px;display:flex;justify-content:space-between;align-items:center;font-size:0.85em;">
                <span>${g.name} 统:${g.command} 武:${g.strength} 智:${g.intelligence}</span>
                <button onclick="game.assignGeneral(${JSON.stringify(g.id).replace(/"/g,'&quot;')})" style="padding:2px 8px;border-radius:3px;border:1px solid ${g.assigned ? '#4CAF50' : '#555'};background:${g.assigned ? 'rgba(76,175,80,0.2)' : 'transparent'};color:${g.assigned ? '#4CAF50' : '#aaa'};cursor:pointer;font-size:0.8em;">${g.assigned ? '出征中' : '指派'}</button>
            </div>
        `).join('') : '<p style="color:#666;font-size:0.85em;">暂无将领</p>';

        this.modalManager.open('军事', `
            <div class="military-content" style="max-height:60vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <div class="military-info" style="margin-bottom:10px;">
                    <div style="display:flex;gap:12px;flex-wrap:wrap;font-size:0.9em;">
                        <span>军队：${this.formatNumber(this.resources.army)}</span>
                        <span>训练：${army.training || 0}</span>
                        <span>士气：${army.morale || 0}</span>
                        <span>月费：${this.formatNumber(this.resources.army * 5)}两</span>
                    </div>
                </div>
                <div style="margin-bottom:10px;">
                    <p style="color:#FFD700;font-size:0.9em;margin-bottom:4px;">将领</p>
                    ${generalsHtml}
                    ${generals.length < 5 ? `<button onclick="game.doRecruitGeneral()" style="display:block;width:100%;padding:6px;margin-top:4px;border-radius:4px;border:1px solid #555;background:transparent;color:#aaa;cursor:pointer;font-size:0.85em;">招募将领（50万两）</button>` : ''}
                </div>
                <div style="margin-bottom:10px;">
                    <p style="color:#FFD700;font-size:0.9em;margin-bottom:4px;">军事设施</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                        <button onclick="game.doUpgradeFacility('barracks')" style="padding:6px;border-radius:4px;border:1px solid #555;background:rgba(255,255,255,0.03);color:#ccc;cursor:pointer;font-size:0.8em;">兵营 Lv.${fac.barracks}<br><span style="color:#888;">减少损耗</span></button>
                        <button onclick="game.doUpgradeFacility('trainingGround')" style="padding:6px;border-radius:4px;border:1px solid #555;background:rgba(255,255,255,0.03);color:#ccc;cursor:pointer;font-size:0.8em;">训练场 Lv.${fac.trainingGround}<br><span style="color:#888;">训练效率</span></button>
                        <button onclick="game.doUpgradeFacility('blacksmith')" style="padding:6px;border-radius:4px;border:1px solid #555;background:rgba(255,255,255,0.03);color:#ccc;cursor:pointer;font-size:0.8em;">铁匠铺 Lv.${fac.blacksmith}<br><span style="color:#888;">装备加成</span></button>
                        <button onclick="game.doUpgradeFacility('stables')" style="padding:6px;border-radius:4px;border:1px solid #555;background:rgba(255,255,255,0.03);color:#ccc;cursor:pointer;font-size:0.8em;">马厩 Lv.${fac.stables}<br><span style="color:#888;">士气保持</span></button>
                    </div>
                </div>
                <div class="military-actions">
                    <button class="military-btn" onclick="game.recruitArmy()">
                        <span class="title">招募士兵</span>
                        <span class="desc">每万士兵消耗10万两</span>
                    </button>
                    <button class="military-btn" onclick="game.trainArmy()">
                        <span class="title">训练军队</span>
                        <span class="desc">提升军队战斗力</span>
                    </button>
                    <button class="military-btn" onclick="game.launchCampaign()">
                        <span class="title">发动战争</span>
                        <span class="desc">征服其他国家</span>
                    </button>
                </div>
            </div>
        `, [
            { text: '离开', action: () => this.modalManager.close() }
        ]);
    }
    
    /**
     * 招募军队
     */
    recruitArmy() {
        const costPerUnit = 10;
        const maxRecruit = Math.floor(this.resources.money / 100000);
        
        if (maxRecruit <= 0) {
            this.showNotification('国库资金不足！', 'warning');
            return;
        }
        
        this.modalManager.open('招募士兵', `
            <div class="recruit-dialog">
                <p>当前国库：${this.formatNumber(this.resources.money)}两</p>
                <p>每万士兵招募费用：10万两</p>
                <p>最大可招募：${maxRecruit}万</p>
                <div class="recruit-input">
                    <label>招募数量（万）：</label>
                    <input type="number" id="recruit-amount" min="1" max="${maxRecruit}" value="1">
                </div>
            </div>
        `, [
            { text: '取消', action: () => this.modalManager.close() },
            { text: '确认招募', action: () => {
                const amount = parseInt(document.getElementById('recruit-amount').value) || 0;
                if (amount > 0 && amount <= maxRecruit) {
                    this.resources.army += amount * 10000;
                    this.resources.money -= amount * 100000;
                    this.showNotification(`成功招募${amount}万士兵！`, 'success');
                    this.uiManager.updateResources();
                    this.modalManager.close();
                }
            }}
        ]);
    }
    
    /**
     * 训练军队
     */
    trainArmy() {
        const result = this.militarySystem.trainArmy();
        if (result.success) {
            this.showNotification(result.message, 'success');
        } else {
            this.showNotification(result.message, 'warning');
        }
        this.uiManager.updateResources();
        this.modalManager.close();
    }

    /**
     * 招募将领
     */
    doRecruitGeneral() {
        if (this.resources.money < 500000) {
            this.showNotification('国库不足！', 'warning');
            return;
        }
        this.resources.money -= 500000;
        const general = this.militarySystem.recruitGeneral();
        this.showNotification(`招募到将领：${general.name}（统帅${general.command}，武力${general.strength}，智力${general.intelligence}）`, 'success');
        this.uiManager.updateResources();
        this.modalManager.close();
        this.manageMilitary(); // 刷新
    }

    /**
     * 指派将领出征
     */
    assignGeneral(generalId) {
        this.militarySystem.generals.forEach(g => g.assigned = false);
        const general = this.militarySystem.generals.find(g => g.id === generalId);
        if (general) {
            general.assigned = true;
            this.showNotification(`${general.name}被指派为出征统帅！`, 'success');
        }
        this.modalManager.close();
        this.manageMilitary();
    }

    /**
     * 升级军事设施
     */
    doUpgradeFacility(type) {
        const result = this.militarySystem.upgradeFacility(type);
        this.showNotification(result.message, result.success ? 'success' : 'warning');
        if (result.success) {
            this.uiManager.updateResources();
            this.modalManager.close();
            this.manageMilitary();
        }
    }

    /**
     * 发动战争
     */
    launchCampaign() {
        const targets = [
            { name: '北方匈奴', difficulty: '较难', color: '#FF9800' },
            { name: '西域小国', difficulty: '简单', color: '#4CAF50' },
            { name: '南方蛮族', difficulty: '普通', color: '#FFD700' },
            { name: '东海倭寇', difficulty: '困难', color: '#f44336' }
        ];
        const maxArmy = Math.floor(this.resources.army / 10000);

        if (maxArmy <= 0) {
            this.showNotification('军队数量不足！', 'warning');
            return;
        }

        let targetsHtml = targets.map(t =>
            `<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;">
                <input type="radio" name="war-target" value="${t.name}" style="accent-color:#FFD700;">
                <span>${t.name}</span><span style="color:${t.color || '#aaa'};font-size:0.85em;">（${t.difficulty}）</span>
            </label>`
        ).join('');

        this.modalManager.open('发动战争', `
            <div class="war-dialog">
                <div style="margin-bottom:12px;">
                    <p style="color:#FFD700;margin-bottom:6px;">选择目标：</p>
                    ${targetsHtml}
                </div>
                <div style="margin-bottom:8px;">
                    <p>可用军队：${maxArmy}万</p>
                    <label>出兵数量（万）：</label>
                    <input type="number" id="war-army-size" min="1" max="${maxArmy}" value="${Math.min(10, maxArmy)}" style="width:80px;padding:4px;border-radius:4px;border:1px solid #555;background:#1a1a2e;color:#fff;">
                </div>
            </div>
        `, [
            { text: '取消', action: () => this.modalManager.close() },
            { text: '出征！', action: () => {
                const targetEl = document.querySelector('input[name="war-target"]:checked');
                if (!targetEl) {
                    this.showNotification('请选择目标！', 'warning');
                    return;
                }
                const armySize = (parseInt(document.getElementById('war-army-size').value) || 0) * 10000;
                if (armySize <= 0) {
                    this.showNotification('请输入出兵数量！', 'warning');
                    return;
                }
                const result = this.militarySystem.launchWar(targetEl.value, armySize);
                const losses = Math.floor(armySize * (0.1 + Math.random() * 0.2));
                this.modalManager.close();
                this.modalManager.open(result.isWin ? '大捷！' : '战败', `
                    <div style="text-align:center;">
                        <p style="font-size:2rem;">${result.isWin ? '🎉' : '😞'}</p>
                        <p style="margin:10px 0;">${result.message}</p>
                        <p style="color:#aaa;">损失兵力：${this.formatNumber(losses)}</p>
                    </div>
                `, [
                    { text: '知道了', action: () => this.modalManager.close() }
                ]);
                this.uiManager.updateResources();
            }}
        ]);
    }

    /**
     * 出巡
     */
    visitCity() {
        if (this.player.stamina < 20) {
            this.showNotification('体力不足，请先休息！', 'warning');
            return;
        }

        // 选择出巡目的地
        const destinations = [
            { name: '京城', desc: '巡视京师百姓生活', icon: '🏯' },
            { name: '江南', desc: '鱼米之乡，文风鼎盛', icon: '🌊' },
            { name: '边疆', desc: '巡查边防军务', icon: '🏔️' },
            { name: '西域', desc: '丝路要塞，商贾云集', icon: '🏜️' },
            { name: '民间', desc: '微服私访，体察民情', icon: '🏘️' }
        ];

        let destHtml = destinations.map(d => `
            <button onclick="game.doVisitCity('${d.name}')" style="display:block;width:100%;padding:10px;margin:4px 0;border-radius:6px;border:1px solid #D4AF37;background:rgba(255,215,0,0.06);color:#fff;cursor:pointer;text-align:left;font-size:0.9em;">
                <span style="font-size:1.2em;">${d.icon}</span>
                <span style="color:#FFD700;font-weight:bold;margin-left:6px;">${d.name}</span>
                <span style="color:#aaa;margin-left:8px;">${d.desc}</span>
            </button>
        `).join('');

        this.modalManager.open('出巡（消耗20体力）', `
            <div>${destHtml}</div>
        `, [
            { text: '取消', action: () => this.modalManager.close() }
        ]);
    }

    doVisitCity(destination) {
        this.player.stamina -= 20;
        this.uiManager.updateEmperorStatus();
        this.modalManager.close();

        const eventPools = {
            '京城': [
                { desc: '微服私访，看到百姓安居乐业，龙心大悦！', effect: 'people+5', message: '民心+5' },
                { desc: '路遇贪官欺压百姓，当场处决贪官！', effect: 'people+10,morality+5', message: '民心+10，道德+5' },
                { desc: '在京城发现一位能工巧匠，召入宫中。', effect: 'people+3', message: '民心+3' },
                { desc: '遭遇刺客袭击！', effect: 'health-10', message: '健康-10' }
            ],
            '江南': [
                { desc: '访问白鹿洞书院，与才子们吟诗作对。', effect: 'literature+3', message: '文学+3' },
                { desc: '游览西湖美景，偶遇才女。', effect: 'literature+2', message: '文学+2', special: 'meet_concubine' },
                { desc: '品尝江南美食，龙心大悦。', effect: 'health+5', message: '健康+5' },
                { desc: '见证江南繁华，对国力信心倍增。', effect: 'people+5', message: '民心+5' }
            ],
            '边疆': [
                { desc: '巡查军营，检阅部队，军心大振！', effect: 'martial+3', message: '武术+3' },
                { desc: '发现边防漏洞，及时修补。', effect: 'martial+2', message: '武术+2' },
                { desc: '偶遇敌军小股骑兵，与侍卫奋勇击退！', effect: 'martial+3,health-5', message: '武术+3，健康-5' },
                { desc: '遭遇敌军伏击！', effect: 'health-15', message: '健康-15' }
            ],
            '西域': [
                { desc: '与西域商人交流，获得稀世珍宝。', effect: 'people+3', message: '民心+3', special: 'trade_bonus' },
                { desc: '参观古城遗迹，感悟历史兴衰。', effect: 'morality+3', message: '道德+3' },
                { desc: '品尝异域美酒佳肴，拓宽视野。', effect: 'health+3', message: '健康+3' },
                { desc: '遭遇沙匪袭击！', effect: 'health-8', message: '健康-8' }
            ],
            '民间': [
                { desc: '深入民间，了解百姓疾苦，颁布惠民之策。', effect: 'people+8,morality+3', message: '民心+8，道德+3' },
                { desc: '发现民间奇才，推荐入朝。', effect: 'people+3', message: '民心+3', special: 'discover_talent' },
                { desc: '目睹民间技艺，才艺有所提升。', effect: 'people+3', message: '民心+3' },
                { desc: '被百姓认出身份，万民跪拜。', effect: 'people+5,morality+2', message: '民心+5，道德+2' },
                { desc: '遭遇刺客暗算！', effect: 'health-12', message: '健康-12' }
            ]
        };

        const events = eventPools[destination] || eventPools['京城'];
        const event = events[Math.floor(Math.random() * events.length)];

        // 武术高可以减少遇刺伤害
        if (event.effect.includes('health-') && this.player.attributes.martial > 60) {
            const reducedEffect = event.effect.replace(/health-(\d+)/, (_, num) => {
                const reduced = Math.max(3, parseInt(num) - Math.floor(this.player.attributes.martial / 20));
                return `health-${reduced}`;
            });
            event.effect = reducedEffect;
            event.message += '（武术高，伤害减轻）';
        }

        this.applyEventEffects(event.effect);

        // 处理特殊效果
        if (event.special === 'discover_talent') {
            const official = this.officialSystem.generateOfficial(80);
            this.showNotification(`发现民间奇才${official.name}（能力${official.ability}）！`, 'success');
        }
        if (event.special === 'meet_concubine') {
            const concubine = this.haremSystem.generateConcubine(this.player.attributes.talent + 20);
            this.showNotification(`偶遇才女${concubine.name}，纳入后宫！`, 'success');
        }
        if (event.special === 'trade_bonus') {
            this.resources.money += 500000;
        }

        this.modalManager.open(`出巡 · ${destination}`, `
            <div class="visit-content" style="text-align:center;">
                <p style="margin:10px 0;">${event.desc}</p>
                <p style="color:#FFD700;">效果：${event.message}</p>
            </div>
        `, [
            { text: '继续', action: () => this.modalManager.close() }
        ]);

        this.uiManager.updateAll();
    }
    
    /**
     * 应用事件效果
     */
    applyEventEffects(effectString) {
        const effects = effectString.split(',');
        effects.forEach(effect => {
            const match = effect.match(/^(\w+)([+-])(\d+)$/);
            if (!match) return;
            const key = match[1];
            const numValue = match[2] === '+' ? parseInt(match[3]) : -parseInt(match[3]);
            
            switch (key) {
                case 'people':
                    this.resources.people = Math.max(0, Math.min(100, this.resources.people + numValue));
                    break;
                case 'morality':
                    this.player.attributes.morality = Math.max(0, Math.min(100, this.player.attributes.morality + numValue));
                    break;
                case 'literature':
                    this.player.attributes.literature = Math.max(0, this.player.attributes.literature + numValue);
                    break;
                case 'martial':
                    this.player.attributes.martial = Math.max(0, this.player.attributes.martial + numValue);
                    break;
                case 'health':
                    this.player.health = Math.max(0, Math.min(100, this.player.health + numValue));
                    break;
            }
        });
    }
    
    /**
     * 休息
     */
    rest() {
        // 恢复体力和健康
        this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 50);
        this.player.health = Math.min(100, this.player.health + 5);
        
        this.showNotification('休息了一夜，体力和健康有所恢复！', 'success');
        this.uiManager.updateEmperorStatus();
    }
    
    /**
     * 格式化数字
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
    
    /**
     * 游戏结束
     */
    triggerGameOver(reason) {
        const stats = this.getDetailedStats();
        const evaluation = this.getFinalEvaluation();

        this.modalManager.open('游戏结束', `
            <div class="game-over" style="text-align:center;">
                <h3 style="color:#FFD700;margin-bottom:4px;">${this.player.dynastyName} · ${this.player.emperorTitle}帝驾崩</h3>
                <p>在位${this.state.year}年，享年${this.player.age}岁</p>
                <p style="color:#aaa;">死因：${reason}</p>
                <div style="margin:12px 0;padding:12px;background:rgba(255,215,0,0.1);border-radius:8px;border:1px solid #D4AF37;">
                    <p style="font-size:1.3em;color:#FFD700;font-weight:bold;">谥号：${evaluation}</p>
                </div>
                <div style="text-align:left;font-size:0.85em;color:#ccc;padding:8px;background:rgba(255,255,255,0.05);border-radius:8px;">
                    <p>📊 <strong>本朝实录</strong></p>
                    <p>⚔️ 战争 ${stats.warCount} 次，胜利 ${stats.warWins} 次</p>
                    <p>👶 子嗣 ${stats.childrenCount} 人</p>
                    <p>👔 在任官员 ${stats.officialsCount} 人</p>
                    <p>🤝 贸易国家 ${stats.tradingNations} 个</p>
                    <p>📜 经历事件 ${stats.eventCount} 次</p>
                    <p>💰 最终国库 ${this.formatNumber(this.resources.money)}两</p>
                    <p>❤️ 最终民心 ${this.resources.people}</p>
                </div>
            </div>
        `, this.buildGameOverButtons());

        this.isPlaying = false;
    }

    /**
     * 构建游戏结束按钮（含传位选项）
     */
    buildGameOverButtons() {
        const hasHeir = this.haremSystem.children.some(c => c.gender === 'male' && c.age >= 12);
        const buttons = [];

        if (hasHeir) {
            buttons.push({
                text: '传位太子（继续游戏）',
                action: () => {
                    const heir = this.succeedThrone();
                    if (heir) {
                        this.isPlaying = true;
                        this.state.isPlaying = true;
                        this.modalManager.closeAll();
                        this.uiManager.updateAll();
                        this.showNotification(`${heir.name}继承大统！新帝登基！`, 'success');
                    }
                }
            });
        }

        buttons.push({ text: '重新开始', action: () => location.reload() });
        buttons.push({ text: '返回主菜单', action: () => location.reload() });

        return buttons;
    }
    
    /**
     * 获取最终评价
     */
    getFinalEvaluation() {
        // 综合多维度评分
        const people = this.resources.people || 0;
        const morality = this.player.attributes.morality || 0;
        const prestige = this.resources.prestige || 0;
        const stability = this.resources.stability || 50;
        const avgAttr = (this.player.attributes.literature + this.player.attributes.martial +
                        this.player.attributes.talent + this.player.attributes.morality) / 4;
        const yearsReigned = this.state.year || 1;
        const warWins = this.militarySystem.warHistory.filter(w => w.result === 'win').length;
        const childrenCount = this.haremSystem.children.length;

        // 加权综合分（满分100）
        const score = (people * 0.25) + (morality * 0.15) + (prestige * 0.15) +
                      (stability * 0.1) + (avgAttr * 0.15) +
                      (Math.min(30, yearsReigned) * 0.2) + // 在位年数最多加6分
                      (warWins * 2) + (childrenCount * 1);

        // 根据执政风格给予特殊称号
        if (this.player.attributes.martial > 80 && warWins >= 3) {
            if (score >= 75) return '千古一帝·武功盖世';
            return '铁血帝王';
        }
        if (this.player.attributes.literature > 80 && prestige >= 70) {
            if (score >= 75) return '千古一帝·文治天下';
            return '文化帝王';
        }
        if (people >= 90 && morality >= 80) {
            if (score >= 75) return '千古一帝·仁德圣君';
            return '仁德明君';
        }

        if (score >= 80) return '千古一帝';
        if (score >= 65) return '明君圣主';
        if (score >= 50) return '守成之君';
        if (score >= 35) return '平庸之主';
        return '昏庸之君';
    }

    /**
     * 获取详细统计数据
     */
    getDetailedStats() {
        return {
            yearsReigned: this.state.year,
            warCount: this.militarySystem.warHistory.length,
            warWins: this.militarySystem.warHistory.filter(w => w.result === 'win').length,
            childrenCount: this.haremSystem.children.length,
            officialsCount: this.officialSystem.getHiredOfficials().length,
            tradingNations: this.diplomacySystem.nations.filter(n => n.trade).length,
            eventCount: this.eventSystem.eventHistory.length
        };
    }

    /**
     * 检查成就解锁
     */
    checkAchievements() {
        const unlock = (id) => {
            if (this.player.unlockAchievement(id)) {
                const ach = Player.ACHIEVEMENTS.find(a => a.id === id);
                if (ach) {
                    this.showNotification(`🏆 成就解锁：${ach.icon} ${ach.name} — ${ach.desc}`, 'success');
                }
            }
        };

        if (this.state.year >= 2) unlock('first_year');
        if (this.state.year >= 5) unlock('five_years');
        if (this.state.year >= 10) unlock('ten_years');

        const warHistory = this.militarySystem.warHistory;
        if (warHistory.some(w => w.result === 'win')) unlock('first_war_win');
        const wonTargets = new Set(warHistory.filter(w => w.result === 'win').map(w => w.target));
        if (wonTargets.size >= 4) unlock('conquer_all');

        if (this.haremSystem.children.length >= 1) unlock('first_child');
        if (this.haremSystem.children.length >= 10) unlock('many_children');

        if (this.player.attributes.literature >= 80) unlock('high_literature');
        if (this.player.attributes.martial >= 80) unlock('high_martial');
        if (this.player.attributes.literature >= 80 && this.player.attributes.martial >= 80) unlock('both_high');

        if (this.resources.money >= 50000000) unlock('rich');
        if (this.resources.money >= 100000000) unlock('super_rich');
        if (this.resources.people >= 100) unlock('beloved');

        if (this.diplomacySystem.nations.every(n => n.trade)) unlock('trader');
        if ((this.diplomacySystem.alliances || []).length >= 2) unlock('diplomat');

        if (this.officialSystem.officials.filter(o => o.hired).length >= 7) unlock('full_court');

        if (this.player.health >= 50 && this._wasLowHealth) {
            unlock('survivor');
            this._wasLowHealth = false;
        }
        if (this.player.health < 10) this._wasLowHealth = true;

        // 贤君：民心和道德都>90
        if (this.resources.people > 90 && this.player.attributes.morality > 90) {
            if (!this._wiseRulerMonths) this._wiseRulerMonths = 0;
            this._wiseRulerMonths++;
            if (this._wiseRulerMonths >= 6) unlock('wise_ruler');
        } else {
            this._wiseRulerMonths = 0;
        }
    }

    /**
     * 显示成就面板
     */
    showAchievements() {
        const allAchs = Player.ACHIEVEMENTS;
        const unlocked = this.player.achievements || [];

        let html = allAchs.map(ach => {
            const isUnlocked = unlocked.includes(ach.id);
            return `
                <div style="padding:8px;margin:4px 0;background:rgba(255,255,255,${isUnlocked ? '0.08' : '0.02'});border-radius:6px;border:1px solid ${isUnlocked ? '#FFD700' : '#333'};opacity:${isUnlocked ? '1' : '0.5'};">
                    <span style="font-size:1.2em;">${ach.icon}</span>
                    <span style="color:${isUnlocked ? '#FFD700' : '#666'};font-weight:bold;margin-left:6px;">${ach.name}</span>
                    <span style="color:#aaa;font-size:0.85em;margin-left:8px;">${ach.desc}</span>
                    ${isUnlocked ? '<span style="color:#4CAF50;float:right;">✓</span>' : ''}
                </div>
            `;
        }).join('');

        this.modalManager.open(`成就（${unlocked.length}/${allAchs.length}）`, `
            <div style="max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                ${html}
            </div>
        `, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    /**
     * 显示编年史
     */
    showChronicle() {
        const events = this.eventSystem.getEventHistory();
        const wars = this.militarySystem.warHistory;
        const diplomacy = this.diplomacySystem.diplomacyHistory || [];

        // 合并所有事件并按时间排序
        let allEvents = [];
        events.forEach(e => allEvents.push({ date: e.date || '', text: `📜 ${e.title}: ${e.description}`, type: 'event' }));
        wars.forEach(w => allEvents.push({ date: w.date || '', text: `⚔️ 征讨${w.target}: ${w.result === 'win' ? '大捷' : '战败'}，出兵${(w.armySize/10000).toFixed(0)}万，损失${(w.losses/10000).toFixed(0)}万`, type: 'war' }));
        diplomacy.forEach(d => {
            const typeText = { 'improve_relation': '🤝 派遣使者', 'establish_trade': '💰 建立贸易', 'form_alliance': '🏳️ 缔结同盟' };
            allEvents.push({ date: d.date || '', text: `${typeText[d.type] || '🌍 外交'} — ${d.nation}`, type: 'diplomacy' });
        });

        // 按倒序排列
        allEvents.reverse();

        if (allEvents.length === 0) {
            allEvents.push({ date: '', text: '暂无记录', type: 'none' });
        }

        let html = allEvents.slice(0, 50).map(e => `
            <div style="padding:6px 8px;margin:2px 0;background:rgba(255,255,255,0.03);border-radius:4px;font-size:0.85em;">
                <span style="color:#888;">${e.date}</span>
                <span style="color:#ddd;margin-left:8px;">${e.text}</span>
            </div>
        `).join('');

        this.modalManager.open('起居注', `
            <div style="max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <p style="color:#aaa;font-size:0.8em;margin-bottom:8px;">${this.player.dynastyName} · ${this.player.emperorTitle}帝编年史（最近50条）</p>
                ${html}
            </div>
        `, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    /**
     * 科技树界面
     */
    showTechTree() {
        if (!this.techTree) {
            this.techTree = { agriculture: 0, military: 0, culture: 0, economy: 0 };
        }

        const techs = [
            {
                id: 'agriculture', name: '农业', icon: '🌾', level: this.techTree.agriculture,
                levels: ['水利灌溉', '曲辕犁', '轮作制', '粮仓体系', '农学著作'],
                effect: '每级：粮食月产+50万石',
                cost: (lv) => 1000000 + lv * 500000
            },
            {
                id: 'military', name: '军事', icon: '⚔️', level: this.techTree.military,
                levels: ['铁制兵器', '弩机改良', '骑兵战术', '火药应用', '攻城利器'],
                effect: '每级：战争胜率+5%',
                cost: (lv) => 1500000 + lv * 700000
            },
            {
                id: 'culture', name: '文化', icon: '📚', level: this.techTree.culture,
                levels: ['兴办学堂', '印刷术', '科举改良', '百科编修', '太学扩建'],
                effect: '每级：声望月增+1，官员质量提升',
                cost: (lv) => 800000 + lv * 400000
            },
            {
                id: 'economy', name: '经济', icon: '💰', level: this.techTree.economy,
                levels: ['统一度量衡', '铸币标准', '漕运改革', '盐铁官营', '海上贸易'],
                effect: '每级：税收+10%',
                cost: (lv) => 1200000 + lv * 600000
            }
        ];

        let html = techs.map(tech => {
            const nextLevel = tech.levels[tech.level];
            const isMaxed = tech.level >= 5;
            const cost = isMaxed ? 0 : tech.cost(tech.level);

            let progressBar = '';
            for (let i = 0; i < 5; i++) {
                progressBar += `<span style="display:inline-block;width:18%;height:8px;margin:1px;border-radius:3px;background:${i < tech.level ? '#FFD700' : '#333'};"></span>`;
            }

            return `
                <div style="padding:10px;margin:6px 0;background:rgba(255,255,255,0.05);border-radius:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:1.2em;">${tech.icon} <span style="color:#FFD700;font-weight:bold;">${tech.name}</span> <span style="color:#aaa;">Lv.${tech.level}</span></span>
                    </div>
                    <div style="margin:6px 0;">${progressBar}</div>
                    <p style="color:#888;font-size:0.8em;">${tech.effect}</p>
                    ${isMaxed
                        ? '<p style="color:#4CAF50;font-size:0.85em;">已达最高等级</p>'
                        : `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
                            <span style="color:#ccc;font-size:0.85em;">下一级：${nextLevel}（${this.formatNumber(cost)}两）</span>
                            <button onclick="game.researchTech('${tech.id}')" style="padding:4px 12px;border-radius:4px;border:1px solid #FFD700;background:rgba(255,215,0,0.1);color:#FFD700;cursor:pointer;font-size:0.85em;">研发</button>
                          </div>`
                    }
                </div>
            `;
        }).join('');

        this.modalManager.open('科技树', `
            <div style="max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <p style="color:#aaa;font-size:0.85em;margin-bottom:8px;">投入资金研发科技，提升国力</p>
                ${html}
            </div>
        `, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    researchTech(techId) {
        if (!this.techTree) this.techTree = { agriculture: 0, military: 0, culture: 0, economy: 0 };

        const costs = {
            agriculture: (lv) => 1000000 + lv * 500000,
            military: (lv) => 1500000 + lv * 700000,
            culture: (lv) => 800000 + lv * 400000,
            economy: (lv) => 1200000 + lv * 600000
        };

        const level = this.techTree[techId];
        if (level >= 5) {
            this.showNotification('已达最高等级！', 'warning');
            return;
        }

        const cost = costs[techId](level);
        if (this.resources.money < cost) {
            this.showNotification('国库不足！', 'warning');
            return;
        }

        this.resources.money -= cost;
        this.techTree[techId]++;

        const names = { agriculture: '农业', military: '军事', culture: '文化', economy: '经济' };
        this.showNotification(`${names[techId]}科技升至${this.techTree[techId]}级！`, 'success');
        this.uiManager.updateResources();
        this.modalManager.close();
        this.showTechTree();
    }

    /**
     * 检查危机事件
     */
    checkCrisis() {
        // 追踪低民心持续月数
        if (!this._lowPeopleMonths) this._lowPeopleMonths = 0;
        if (this.resources.people < 20) {
            this._lowPeopleMonths++;
        } else {
            this._lowPeopleMonths = 0;
        }

        // 民变起义：民心<20持续3个月
        if (this._lowPeopleMonths >= 3 && Math.random() < 0.5) {
            this._lowPeopleMonths = 0;
            this.triggerPeasantRevolt();
            return;
        }

        // 外敌入侵：某国关系<-80
        const hostileNation = this.diplomacySystem.nations.find(n => n.relation <= -80);
        if (hostileNation && Math.random() < 0.15) {
            this.triggerForeignInvasion(hostileNation);
            return;
        }

        // 年龄健康衰减
        if (this.player.age >= 50) {
            const decay = Math.floor((this.player.age - 45) / 5);
            this.player.health = Math.max(0, this.player.health - decay);
        }
    }

    /**
     * 农民起义
     */
    triggerPeasantRevolt() {
        const revoltSize = 50000 + Math.floor(Math.random() * 150000);
        this.modalManager.open('农民起义！', `
            <div style="text-align:center;">
                <p style="font-size:2rem;">🔥</p>
                <p style="color:#f44336;margin:10px 0;">民心低迷已久，各地百姓揭竿而起！</p>
                <p style="color:#aaa;">叛军约${this.formatNumber(revoltSize)}人，声势浩大！</p>
            </div>
        `, [
            {
                text: `派兵镇压（需${this.formatNumber(revoltSize)}军队）`,
                action: () => {
                    if (this.resources.army >= revoltSize) {
                        this.resources.army -= Math.floor(revoltSize * 0.3);
                        this.resources.stability = Math.max(0, (this.resources.stability || 50) - 10);
                        this.resources.people = Math.min(100, this.resources.people + 5);
                        this.showNotification('起义被镇压，但民间怨恨犹存。', 'warning');
                    } else {
                        this.resources.army = Math.floor(this.resources.army * 0.5);
                        this.resources.stability = Math.max(0, (this.resources.stability || 50) - 30);
                        this.resources.people = Math.max(0, this.resources.people - 10);
                        this.showNotification('军队不足！镇压失败，局势急剧恶化！', 'error');
                    }
                    this.uiManager.updateAll();
                    this.modalManager.close();
                }
            },
            {
                text: '安抚百姓（减税+赈灾，消耗200万两）',
                action: () => {
                    if (this.resources.money >= 2000000) {
                        this.resources.money -= 2000000;
                        this.resources.people = Math.min(100, this.resources.people + 20);
                        this.resources.stability = Math.min(100, (this.resources.stability || 50) + 5);
                        this.showNotification('朝廷赈灾安民，起义逐渐平息。民心大幅回升！', 'success');
                    } else {
                        this.resources.people = Math.max(0, this.resources.people - 5);
                        this.resources.stability = Math.max(0, (this.resources.stability || 50) - 15);
                        this.showNotification('国库空虚无力安抚！起义愈演愈烈！', 'error');
                    }
                    this.uiManager.updateAll();
                    this.modalManager.close();
                }
            }
        ]);
    }

    /**
     * 外敌入侵
     */
    triggerForeignInvasion(nation) {
        const invadeSize = nation.strength * 1000;
        this.modalManager.open('外敌入侵！', `
            <div style="text-align:center;">
                <p style="font-size:2rem;">⚔️</p>
                <p style="color:#f44336;margin:10px 0;">${nation.name}集结大军入侵边境！</p>
                <p style="color:#aaa;">敌军约${this.formatNumber(invadeSize)}人</p>
            </div>
        `, [
            {
                text: '迎战',
                action: () => {
                    const training = this.militarySystem.armies[0]?.training || 50;
                    const ourPower = this.resources.army * (training / 100);
                    const theirPower = invadeSize * (nation.strength / 100);
                    if (ourPower > theirPower) {
                        const losses = Math.floor(invadeSize * 0.3);
                        this.resources.army -= losses;
                        this.resources.prestige = Math.min(100, (this.resources.prestige || 50) + 10);
                        nation.relation = Math.min(100, nation.relation + 20);
                        this.showNotification(`成功击退${nation.name}入侵！${nation.name}被迫求和。声望+10`, 'success');
                    } else {
                        const losses = Math.floor(this.resources.army * 0.3);
                        this.resources.army -= losses;
                        this.resources.money -= 1000000;
                        if (this.resources.money < 0) this.resources.money = 0;
                        this.resources.prestige = Math.max(0, (this.resources.prestige || 50) - 15);
                        this.resources.people = Math.max(0, this.resources.people - 10);
                        this.showNotification(`抵御${nation.name}入侵失败！边境城池沦陷，损失惨重！`, 'error');
                    }
                    this.uiManager.updateAll();
                    this.modalManager.close();
                }
            },
            {
                text: '求和（赔款100万两）',
                action: () => {
                    if (this.resources.money >= 1000000) {
                        this.resources.money -= 1000000;
                        nation.relation = Math.min(100, nation.relation + 30);
                        this.resources.prestige = Math.max(0, (this.resources.prestige || 50) - 10);
                        this.showNotification(`与${nation.name}签订和约，以金钱换和平。声望-10`, 'warning');
                    } else {
                        this.resources.prestige = Math.max(0, (this.resources.prestige || 50) - 20);
                        nation.relation += 10;
                        this.showNotification(`国库不足赔款，${nation.name}蹂躏边境后退兵。声望大跌！`, 'error');
                    }
                    this.uiManager.updateAll();
                    this.modalManager.close();
                }
            }
        ]);
    }

    /**
     * 继承人系统 - 立储
     */
    setCrownPrince() {
        const adultSons = this.haremSystem.children.filter(c => c.gender === 'male' && c.age >= 12);
        if (adultSons.length === 0) {
            this.showNotification('没有年满12岁的皇子可以立为太子！', 'warning');
            return;
        }

        let sonsHtml = adultSons.map(son => {
            const isCurrent = this._crownPrince === son.id;
            return `
                <div style="padding:8px;margin:4px 0;background:rgba(255,255,255,0.05);border-radius:8px;display:flex;justify-content:space-between;align-items:center;border:1px solid ${isCurrent ? '#FFD700' : 'transparent'};">
                    <div>
                        <span style="color:#FFD700;font-weight:bold;">${son.name}</span>
                        <span style="color:#aaa;font-size:0.85em;"> ${son.age}岁 母:${son.motherName}</span>
                        ${isCurrent ? '<span style="color:#FFD700;font-size:0.8em;"> [太子]</span>' : ''}
                        <div style="font-size:0.8em;color:#ccc;">智:${son.intelligence} 体:${son.constitution} 魅:${son.charm} 德:${son.morality}</div>
                    </div>
                    <button onclick="game.doSetCrownPrince(${JSON.stringify(son.id).replace(/"/g, '&quot;')})" style="padding:4px 10px;border-radius:4px;border:1px solid #FFD700;background:rgba(255,215,0,0.15);color:#FFD700;cursor:pointer;font-size:0.85em;">
                        ${isCurrent ? '已立储' : '立为太子'}
                    </button>
                </div>
            `;
        }).join('');

        this.modalManager.open('立储', `
            <div style="max-height:50vh;overflow-y:auto;">
                <p style="color:#aaa;font-size:0.85em;margin-bottom:8px;">选择一位皇子立为太子，太子属性可提供治国加成</p>
                ${sonsHtml}
            </div>
        `, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    doSetCrownPrince(childId) {
        const child = this.haremSystem.children.find(c => c.id === childId);
        if (!child) return;

        this._crownPrince = childId;
        this.showNotification(`${child.name}被立为太子！`, 'success');
        this.modalManager.close();
        this.setCrownPrince(); // 刷新界面
    }

    /**
     * 驾崩后传位（多代模式）
     */
    succeedThrone() {
        const crownPrince = this._crownPrince
            ? this.haremSystem.children.find(c => c.id === this._crownPrince)
            : null;

        // 如果有太子且还活着（年龄合理），可以传位
        const heir = crownPrince || this.haremSystem.children.find(c => c.gender === 'male' && c.age >= 12);

        if (!heir) return false;

        // 保存老皇帝信息
        const oldEmperor = this.player.emperorTitle;

        // 新皇帝继位
        this.player.age = heir.age;
        this.player.maxAge = 60 + Math.floor(heir.constitution / 10);
        this.player.health = Math.min(100, 60 + heir.constitution / 2);
        this.player.attributes.literature = Math.floor(heir.intelligence * 0.7);
        this.player.attributes.martial = Math.floor(heir.constitution * 0.5);
        this.player.attributes.talent = Math.floor(heir.charm * 0.6);
        this.player.attributes.morality = heir.morality;
        this.player.maxStamina = 50 + this.player.attributes.stamina;
        this.player.stamina = this.player.maxStamina;
        this.player.emperorName = heir.name;
        this._crownPrince = null;
        this.state.year = 1;
        this.state.month = 1;

        // 清空子嗣（新一代）
        this.haremSystem.children = [];
        // 保留部分妃子或清空
        this.haremSystem.concubines = [];
        this.haremSystem.init();

        // 继位后民心和稳定度有一定波动
        this.resources.people = Math.max(30, this.resources.people - 10);
        this.resources.stability = Math.max(30, (this.resources.stability || 50) - 10);

        return heir;
    }

    /**
     * 作弊面板
     */
    showCheatPanel() {
        const btnStyle = 'display:block;width:100%;padding:8px;margin:4px 0;border-radius:6px;border:1px solid #FFD700;background:rgba(255,215,0,0.1);color:#FFD700;cursor:pointer;font-size:0.9em;text-align:left;';
        this.modalManager.open('秘籍面板', `
            <div style="max-height:55vh;overflow-y:auto;-webkit-overflow-scrolling:touch;">
                <p style="color:#aaa;font-size:0.8em;margin-bottom:8px;">点击按钮立即生效</p>
                <div style="margin-bottom:10px;">
                    <div style="color:#FFD700;font-weight:bold;margin-bottom:4px;">资源</div>
                    <button style="${btnStyle}" onclick="game.cheat('money')">💰 国库 +500万两</button>
                    <button style="${btnStyle}" onclick="game.cheat('food')">🌾 粮食 +500万石</button>
                    <button style="${btnStyle}" onclick="game.cheat('army')">⚔️ 军队 +10万</button>
                    <button style="${btnStyle}" onclick="game.cheat('people')">❤️ 民心 +20</button>
                    <button style="${btnStyle}" onclick="game.cheat('order')">📜 政令恢复满</button>
                </div>
                <div style="margin-bottom:10px;">
                    <div style="color:#FFD700;font-weight:bold;margin-bottom:4px;">状态</div>
                    <button style="${btnStyle}" onclick="game.cheat('health')">💊 健康恢复满</button>
                    <button style="${btnStyle}" onclick="game.cheat('stamina')">⚡ 体力恢复满</button>
                </div>
                <div>
                    <div style="color:#FFD700;font-weight:bold;margin-bottom:4px;">属性</div>
                    <button style="${btnStyle}" onclick="game.cheat('literature')">📚 文学 +10</button>
                    <button style="${btnStyle}" onclick="game.cheat('martial')">⚔️ 武术 +10</button>
                    <button style="${btnStyle}" onclick="game.cheat('talent')">🎨 才艺 +10</button>
                    <button style="${btnStyle}" onclick="game.cheat('morality')">👑 道德 +10</button>
                    <button style="${btnStyle}" onclick="game.cheat('all')">🔥 全部属性 +10</button>
                </div>
            </div>
        `, [
            { text: '关闭', action: () => this.modalManager.close() }
        ]);
    }

    /**
     * 执行作弊
     */
    cheat(type) {
        if (!this.isPlaying) {
            this.showNotification('请先开始游戏！', 'warning');
            return;
        }
        switch (type) {
            case 'money':
                this.resources.money += 5000000;
                this.showNotification('国库 +500万两', 'success');
                break;
            case 'food':
                this.resources.food += 5000000;
                this.showNotification('粮食 +500万石', 'success');
                break;
            case 'army':
                this.resources.army += 100000;
                this.showNotification('军队 +10万', 'success');
                break;
            case 'people':
                this.resources.people = Math.min(100, this.resources.people + 20);
                this.showNotification('民心 +20', 'success');
                break;
            case 'order':
                this.resources.order = this.resources.maxOrder;
                this.showNotification('政令已恢复满', 'success');
                break;
            case 'health':
                this.player.health = this.player.maxHealth;
                this.showNotification('健康已恢复满', 'success');
                break;
            case 'stamina':
                this.player.stamina = this.player.maxStamina;
                this.showNotification('体力已恢复满', 'success');
                break;
            case 'literature':
                this.player.attributes.literature = Math.min(100, this.player.attributes.literature + 10);
                this.showNotification('文学 +10', 'success');
                break;
            case 'martial':
                this.player.attributes.martial = Math.min(100, this.player.attributes.martial + 10);
                this.showNotification('武术 +10', 'success');
                break;
            case 'talent':
                this.player.attributes.talent = Math.min(100, this.player.attributes.talent + 10);
                this.showNotification('才艺 +10', 'success');
                break;
            case 'morality':
                this.player.attributes.morality = Math.min(100, this.player.attributes.morality + 10);
                this.showNotification('道德 +10', 'success');
                break;
            case 'all':
                ['literature', 'martial', 'talent', 'morality'].forEach(attr => {
                    this.player.attributes[attr] = Math.min(100, this.player.attributes[attr] + 10);
                });
                this.showNotification('全部属性 +10', 'success');
                break;
        }
        this.uiManager.updateAll();
    }
}
