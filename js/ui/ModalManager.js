/**
 * 帝王模拟器2 - 模态框管理类
 * 负责游戏内各种弹窗和对话框的管理
 */

class ModalManager {
    constructor() {
        // 模态框容器
        this.container = document.getElementById('modal-container');
        
        // 当前打开的模态框
        this.currentModal = null;
        
        // 模态框历史（用于返回）
        this.modalHistory = [];

        // 关闭动画定时器（用于取消pending的close）
        this._closeTimer = null;

        // 初始化
        this.init();
    }
    
    /**
     * 初始化模态框管理器
     */
    init() {
        // 点击背景关闭模态框
        if (this.container) {
            this.container.addEventListener('click', (e) => {
                if (e.target === this.container) {
                    // 如果点击的是背景，可以选择关闭
                    // this.close();
                }
            });
        }
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.close();
            }
        });
    }
    
    /**
     * 打开模态框
     * @param {string} title - 标题
     * @param {string} content - HTML内容
     * @param {Array} buttons - 按钮配置数组 [{text, action, class}]
     * @param {Object} options - 其他选项
     */
    open(title, content, buttons = [], options = {}) {
        // 取消任何pending的close定时器，防止新modal被旧close摧毁
        if (this._closeTimer) {
            clearTimeout(this._closeTimer);
            this._closeTimer = null;
        }

        // 保存当前模态框到历史
        if (this.currentModal) {
            this.modalHistory.push(this.currentModal);
        }
        
        // 默认按钮
        if (buttons.length === 0) {
            buttons = [{ text: '确定', action: () => this.close() }];
        }
        
        // 构建按钮HTML
        const buttonsHtml = buttons.map((btn, index) => {
            const className = btn.class || (index === 0 ? 'btn-primary' : 'btn-secondary');
            return `<button class="modal-btn ${className}" data-index="${index}">${btn.text}</button>`;
        }).join('');
        
        // 构建模态框HTML
        const modalHtml = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttonsHtml}
                </div>
            </div>
        `;
        
        // 显示模态框
        if (this.container) {
            this.container.innerHTML = modalHtml;
            this.container.classList.remove('hidden');
            
            // 绑定按钮事件
            buttons.forEach((btn, index) => {
                const buttonEl = this.container.querySelector(`[data-index="${index}"]`);
                if (buttonEl) {
                    buttonEl.addEventListener('click', () => {
                        if (btn.action) {
                            btn.action();
                        }
                    });
                }
            });
            
            // 绑定关闭按钮事件
            const closeBtn = this.container.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
        }
        
        // 保存当前模态框信息
        this.currentModal = {
            title,
            content,
            buttons,
            options
        };
        
        // 添加打开动画
        if (this.container) {
            const modalContent = this.container.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.add('animate-scaleIn');
            }
        }
    }
    
    /**
     * 关闭当前模态框
     */
    close() {
        // 添加关闭动画
        if (this.container) {
            const modalContent = this.container.querySelector('.modal-content');
            if (modalContent) {
                modalContent.classList.remove('animate-scaleIn');
                modalContent.classList.add('animate-scaleOut');
                
                // 动画完成后隐藏
                this._closeTimer = setTimeout(() => {
                    this._closeTimer = null;
                    this.container.classList.add('hidden');
                    this.container.innerHTML = '';
                }, 300);
            } else {
                this.container.classList.add('hidden');
                this.container.innerHTML = '';
            }
        }
        
        // 从历史中恢复上一个模态框（如果有）
        if (this.modalHistory.length > 0) {
            this.currentModal = this.modalHistory.pop();
        } else {
            this.currentModal = null;
        }
    }
    
    /**
     * 关闭所有模态框
     */
    closeAll() {
        this.modalHistory = [];
        this.close();
    }
    
    /**
     * 显示确认对话框
     */
    confirm(message, onConfirm, onCancel = null) {
        this.open('确认', `<p>${message}</p>`, [
            { text: '取消', action: () => { this.close(); if (onCancel) onCancel(); }, class: 'btn-secondary' },
            { text: '确定', action: () => { this.close(); if (onConfirm) onConfirm(); }, class: 'btn-primary' }
        ]);
    }
    
    /**
     * 显示提示信息
     */
    alert(message, callback = null) {
        this.open('提示', `<p>${message}</p>`, [
            { text: '确定', action: () => { this.close(); if (callback) callback(); }, class: 'btn-primary' }
        ]);
    }
    
    /**
     * 显示输入对话框
     */
    prompt(title, defaultValue = '', onConfirm = null, onCancel = null) {
        const content = `
            <input type="text" id="modal-input" value="${defaultValue}" 
                   style="width: 100%; padding: 10px; font-size: 16px; border: 1px solid #D4AF37; border-radius: 5px; background: rgba(0,0,0,0.3); color: #f5f5f5;">
        `;
        
        this.open(title, content, [
            { text: '取消', action: () => { this.close(); if (onCancel) onCancel(); }, class: 'btn-secondary' },
            { text: '确定', action: () => { 
                const input = document.getElementById('modal-input');
                const value = input ? input.value : '';
                this.close(); 
                if (onConfirm) onConfirm(value); 
            }, class: 'btn-primary' }
        ]);
    }
    
    /**
     * 是否正在显示模态框
     */
    isOpen() {
        return this.currentModal !== null;
    }
}

// 为了兼容性，确保ModalManager可用
if (typeof window !== 'undefined') {
    window.ModalManager = ModalManager;
}
