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
     * 显示加载界面
     */
    showLoadScreen() {
        this.loadGame();
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
        const saveData = {
            player: this.player.getData(),
            resources: this.resources.getData(),
            state: this.state,
            officials: this.officialSystem.getData(),
            harem: this.haremSystem.getData(),
            military: this.militarySystem.getData(),
            diplomacy: this.diplomacySystem.getData(),
            events: this.eventSystem.getData(),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('diwangsimulator2_save', JSON.stringify(saveData));
        this.showNotification('游戏已保存！', 'success');
        console.log('游戏已保存');
    }
    
    /**
     * 加载游戏
     */
    loadGame() {
        const saveData = localStorage.getItem('diwangsimulator2_save');
        if (!saveData) {
            this.showNotification('没有找到存档！', 'warning');
            return false;
        }
        
        try {
            const data = JSON.parse(saveData);
            
            // 恢复游戏状态
            this.state = data.state;
            this.player.loadData(data.player);
            this.resources.loadData(data.resources);
            this.officialSystem.loadData(data.officials);
            this.haremSystem.loadData(data.harem);
            this.militarySystem.loadData(data.military);
            this.diplomacySystem.loadData(data.diplomacy);
            this.eventSystem.loadData(data.events);
            
            // 进入游戏主界面
            this.showScreen('main-game');
            this.isPlaying = true;
            
            // 更新UI
            this.uiManager.updateAll();
            
            this.showNotification('游戏加载成功！', 'success');
            console.log('游戏加载成功');
            return true;
        } catch (error) {
            console.error('加载游戏失败:', error);
            this.showNotification('加载游戏失败！', 'error');
            return false;
        }
    }
    
    /**
     * 显示设置
     */
    showSettings() {
        this.modalManager.open('设置', `
            <div class="settings-options">
                <div class="setting-item">
                    <label>音效音量</label>
                    <input type="range" min="0" max="100" value="50">
                </div>
                <div class="setting-item">
                    <label>背景音乐</label>
                    <input type="range" min="0" max="100" value="30">
                </div>
                <div class="setting-item">
                    <label>自动保存</label>
                    <select>
                        <option value="5">每5分钟</option>
                        <option value="10" selected>每10分钟</option>
                        <option value="30">每30分钟</option>
                        <option value="0">关闭</option>
                    </select>
                </div>
            </div>
        `, [
            { text: '取消', action: () => this.modalManager.close() },
            { text: '保存', action: () => {
                this.showNotification('设置已保存！', 'success');
                this.modalManager.close();
            }}
        ]);
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
                this.isPlaying = false;
                this.showScreen('splash-screen');
                this.modalManager.close();
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
        // 税收收入
        const taxIncome = this.resources.people * 1000 * (this.player.attributes.morality / 100);
        
        // 军队开支
        const armyExpense = this.resources.army * 5;
        
        // 官员俸禄
        const officialExpense = this.officialSystem.getTotalSalary();
        
        // 净收入
        const netIncome = taxIncome - armyExpense - officialExpense;
        
        this.resources.money += netIncome;
        
        // 检查国库是否空虚
        if (this.resources.money < 0) {
            this.resources.money = 0;
            this.eventSystem.triggerEvent('financial_crisis');
        }
    }
    
    /**
     * 获取日期字符串
     */
    getDateString() {
        const yearName = this.player.emperorTitle;
        const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月', 
                           '七月', '八月', '九月', '十月', '十一月', '腊月'];
        return `${yearName}元年 ${monthNames[this.state.month - 1]}`;
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
        
        // 生成随机奏折
        const memorials = [
            { title: '江南水灾', content: '江南地区暴雨成灾，农田被淹，百姓流离失所，请求朝廷拨款赈灾。', options: ['拨款100万两', '减免赋税', '暂不处理'] },
            { title: '边境急报', content: '北方游牧民族蠢蠢欲动，频繁骚扰边境村庄，请陛下决断。', options: ['加强边防', '派使谈判', '先发制人'] },
            { title: '科举建议', content: '今年科举考生众多，建议增加录取名额，为国家选拔更多人才。', options: ['同意', '维持原额', '减少名额'] }
        ];
        
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
        // 根据不同选择产生不同效果
        let message = '';
        switch (title) {
            case '江南水灾':
                if (choice === 0) {
                    this.resources.money -= 1000000;
                    this.resources.people += 5;
                    message = '拨款赈灾，百姓感恩戴德，民心提升！';
                } else if (choice === 1) {
                    this.resources.people += 3;
                    message = '减免赋税，百姓负担减轻。';
                } else {
                    this.resources.people -= 5;
                    message = '不处理灾情，民怨沸腾！';
                }
                break;
            case '边境急报':
                if (choice === 0) {
                    this.resources.army += 50000;
                    this.resources.money -= 500000;
                    message = '加强边防，边境稳固。';
                } else if (choice === 1) {
                    message = '派使谈判，双方达成暂时和平。';
                } else {
                    this.resources.army -= 30000;
                    this.resources.money -= 300000;
                    message = '先发制人，虽获胜但损失不小。';
                }
                break;
        }
        
        this.showNotification(message, choice === 2 ? 'warning' : 'success');
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
        
        this.modalManager.open('颁布政令', `
            <div class="decree-options">
                <button class="decree-btn" onclick="game.executeDecree('tax_cut')">
                    <span class="title">减免赋税</span>
                    <span class="desc">民心+10，国库收入-20%</span>
                </button>
                <button class="decree-btn" onclick="game.executeDecree('conscription')">
                    <span class="title">扩充军队</span>
                    <span class="desc">军队+10万，国库-200万</span>
                </button>
                <button class="decree-btn" onclick="game.executeDecree('infrastructure')">
                    <span class="title">兴修水利</span>
                    <span class="desc">粮食产量+20%，国库-300万</span>
                </button>
                <button class="decree-btn" onclick="game.executeDecree('amnesty')">
                    <span class="title">大赦天下</span>
                    <span class="desc">民心+20，治安-10</span>
                </button>
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
     * 管理军事
     */
    manageMilitary() {
        if (this.player.stamina < 10) {
            this.showNotification('体力不足，请先休息！', 'warning');
            return;
        }
        
        this.player.stamina -= 10;
        this.uiManager.updateEmperorStatus();
        
        this.modalManager.open('军事', `
            <div class="military-content">
                <div class="military-info">
                    <div class="info-item">
                        <span class="label">现役军队：</span>
                        <span class="value">${this.formatNumber(this.resources.army)}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">每月军费：</span>
                        <span class="value">${this.formatNumber(this.resources.army * 5)}两</span>
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
     * 发动战争
     */
    launchCampaign() {
        const targets = [
            { name: '北方匈奴', difficulty: '普通' },
            { name: '西域小国', difficulty: '简单' },
            { name: '南方蛮族', difficulty: '普通' },
            { name: '东海倭寇', difficulty: '困难' }
        ];
        const maxArmy = Math.floor(this.resources.army / 10000);

        if (maxArmy <= 0) {
            this.showNotification('军队数量不足！', 'warning');
            return;
        }

        let targetsHtml = targets.map(t =>
            `<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;">
                <input type="radio" name="war-target" value="${t.name}" style="accent-color:#FFD700;">
                <span>${t.name}</span><span style="color:#aaa;font-size:0.85em;">（${t.difficulty}）</span>
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
        
        this.player.stamina -= 20;
        this.uiManager.updateEmperorStatus();
        
        // 随机事件
        const events = [
            { desc: '微服私访，看到百姓安居乐业，龙心大悦！', effect: 'people+5', message: '民心+5' },
            { desc: '路遇贪官欺压百姓，当场处决贪官！', effect: 'people+10,morality+5', message: '民心+10，道德+5' },
            { desc: '访问书院，与才子们吟诗作对。', effect: 'literature+2', message: '文学+2' },
            { desc: '巡查军营，检阅部队。', effect: 'martial+2', message: '武术+2' },
            { desc: '遭遇刺客袭击！', effect: 'health-10', message: '健康-10' }
        ];
        
        const event = events[Math.floor(Math.random() * events.length)];
        
        // 应用效果
        this.applyEventEffects(event.effect);
        
        this.modalManager.open('出巡', `
            <div class="visit-content">
                <p class="visit-desc">${event.desc}</p>
                <p class="visit-effect">效果：${event.message}</p>
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
        this.modalManager.open('游戏结束', `
            <div class="game-over">
                <h3>${this.player.emperorTitle}驾崩</h3>
                <p>在位${this.state.year}年，享年${this.player.age}岁</p>
                <p>死因：${reason}</p>
                <div class="final-stats">
                    <p>最终评价：${this.getFinalEvaluation()}</p>
                </div>
            </div>
        `, [
            { text: '重新开始', action: () => location.reload() },
            { text: '返回主菜单', action: () => location.reload() }
        ]);
        
        this.isPlaying = false;
    }
    
    /**
     * 获取最终评价
     */
    getFinalEvaluation() {
        const score = this.resources.people + this.player.attributes.morality;
        if (score >= 150) return '千古一帝';
        if (score >= 120) return '明君圣主';
        if (score >= 90) return '守成之君';
        if (score >= 60) return '平庸之主';
        return '昏庸之君';
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
