/**
 * 帝王模拟器2 - UI管理类
 * 负责游戏界面更新和交互管理
 */

class UIManager {
    constructor(game) {
        this.game = game;
        
        // UI元素缓存
        this.elements = {};
        
        // 初始化UI元素引用
        this.initElements();
    }
    
    /**
     * 初始化UI元素引用
     */
    initElements() {
        // 顶部信息栏
        this.elements.dynasty = document.getElementById('display-dynasty');
        this.elements.emperor = document.getElementById('display-emperor');
        this.elements.gameDate = document.getElementById('game-date');
        this.elements.emperorAge = document.getElementById('emperor-age');
        
        // 资源面板
        this.elements.resMoney = document.getElementById('res-money');
        this.elements.resFood = document.getElementById('res-food');
        this.elements.resArmy = document.getElementById('res-army');
        this.elements.resPeople = document.getElementById('res-people');
        this.elements.resOrder = document.getElementById('res-order');
        
        // 皇帝状态
        this.elements.healthBar = document.getElementById('health-bar');
        this.elements.healthValue = document.getElementById('health-value');
        this.elements.staminaBar = document.getElementById('stamina-bar');
        this.elements.staminaValue = document.getElementById('stamina-value');
        
        // 属性显示
        this.elements.attrLit = document.getElementById('attr-lit-display');
        this.elements.attrMar = document.getElementById('attr-mar-display');
        this.elements.attrTal = document.getElementById('attr-tal-display');
        this.elements.attrMor = document.getElementById('attr-mor-display');
        
        // 场景显示
        this.elements.sceneText = document.getElementById('scene-text');

        // 头像显示
        this.elements.gameAvatar = document.getElementById('game-avatar');
    }
    
    /**
     * 更新所有UI
     */
    updateAll() {
        this.updateHeader();
        this.updateResources();
        this.updateEmperorStatus();
        this.updateAttributes();
        this.updateDate();
        this.updateAvatar();
    }
    
    /**
     * 更新顶部信息栏
     */
    updateHeader() {
        if (this.game.player) {
            if (this.elements.dynasty) {
                this.elements.dynasty.textContent = this.game.player.dynastyName;
            }
            if (this.elements.emperor) {
                this.elements.emperor.textContent = this.game.player.emperorTitle + '帝';
            }
        }
    }
    
    /**
     * 更新日期显示
     */
    updateDate() {
        if (this.elements.gameDate) {
            this.elements.gameDate.textContent = this.game.getDateString();
        }
        
        if (this.elements.emperorAge && this.game.player) {
            this.elements.emperorAge.textContent = `年龄: ${this.game.player.age}岁`;
        }
    }
    
    /**
     * 更新资源面板
     */
    updateResources() {
        if (!this.game.resources) return;
        
        const r = this.game.resources;
        
        if (this.elements.resMoney) {
            this.elements.resMoney.textContent = this.formatNumber(r.money);
        }
        if (this.elements.resFood) {
            this.elements.resFood.textContent = this.formatNumber(r.food);
        }
        if (this.elements.resArmy) {
            this.elements.resArmy.textContent = this.formatNumber(r.army);
        }
        if (this.elements.resPeople) {
            this.elements.resPeople.textContent = r.people;
        }
        if (this.elements.resOrder) {
            this.elements.resOrder.textContent = `${r.order}/${r.maxOrder}`;
        }
    }
    
    /**
     * 更新皇帝状态
     */
    updateEmperorStatus() {
        if (!this.game.player) return;
        
        const p = this.game.player;
        
        // 健康值
        if (this.elements.healthBar) {
            this.elements.healthBar.style.width = `${(p.health / p.maxHealth) * 100}%`;
        }
        if (this.elements.healthValue) {
            this.elements.healthValue.textContent = p.health;
        }
        
        // 体力值
        if (this.elements.staminaBar) {
            this.elements.staminaBar.style.width = `${(p.stamina / p.maxStamina) * 100}%`;
        }
        if (this.elements.staminaValue) {
            this.elements.staminaValue.textContent = p.stamina;
        }
    }
    
    /**
     * 更新属性显示
     */
    updateAttributes() {
        if (!this.game.player) return;
        
        const attr = this.game.player.attributes;
        
        if (this.elements.attrLit) {
            this.elements.attrLit.textContent = attr.literature;
        }
        if (this.elements.attrMar) {
            this.elements.attrMar.textContent = attr.martial;
        }
        if (this.elements.attrTal) {
            this.elements.attrTal.textContent = attr.talent;
        }
        if (this.elements.attrMor) {
            this.elements.attrMor.textContent = attr.morality;
        }
    }
    
    /**
     * 更新头像显示
     */
    updateAvatar() {
        if (!this.elements.gameAvatar || !this.game.player) return;
        const avatarIndex = this.game.player.avatar || 0;
        if (typeof EMPEROR_AVATARS !== 'undefined' && EMPEROR_AVATARS[avatarIndex]) {
            this.elements.gameAvatar.innerHTML = EMPEROR_AVATARS[avatarIndex].svg;
        }
    }

    /**
     * 设置场景文本
     */
    setSceneText(text, speaker = null) {
        if (this.elements.sceneText) {
            if (speaker) {
                this.elements.sceneText.innerHTML = `<p><span class="speaker">${speaker}:</span>${text}</p>`;
            } else {
                this.elements.sceneText.innerHTML = `<p>${text}</p>`;
            }
        }
    }
    
    /**
     * 添加场景文本（追加）
     */
    appendSceneText(text, speaker = null) {
        if (this.elements.sceneText) {
            const existingContent = this.elements.sceneText.innerHTML;
            if (speaker) {
                this.elements.sceneText.innerHTML = existingContent + `<p><span class="speaker">${speaker}:</span>${text}</p>`;
            } else {
                this.elements.sceneText.innerHTML = existingContent + `<p>${text}</p>`;
            }
            
            // 滚动到底部
            this.elements.sceneText.scrollTop = this.elements.sceneText.scrollHeight;
        }
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
     * 显示通知
     */
    showNotification(message, type = 'info', duration = 3000) {
        if (this.game && this.game.showNotification) {
            this.game.showNotification(message, type);
        }
    }
    
    /**
     * 更新官员列表
     */
    updateOfficialsList(officials) {
        const listElement = document.getElementById('officials-list');
        if (!listElement || !officials) return;
        
        listElement.innerHTML = officials.map(official => `
            <div class="official-card">
                <div class="official-name">${official.name}</div>
                <div class="official-position">${official.position || '未任命'}</div>
                <div class="official-stats">
                    <span>能力: ${official.ability}</span>
                    <span>忠诚: ${official.loyalty}</span>
                </div>
            </div>
        `).join('');
    }
    
    /**
     * 更新事件列表
     */
    updateEventsList(events) {
        const listElement = document.getElementById('events-list');
        if (!listElement || !events) return;
        
        listElement.innerHTML = events.map(event => `
            <div class="event-card">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date || ''}</div>
                <div class="event-desc">${event.description}</div>
            </div>
        `).join('');
    }
}
