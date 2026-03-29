/**
 * 帝王模拟器2 - 主入口文件
 * 游戏启动和初始化
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
    console.log('=================================');
    console.log('    帝王模拟器2 - 启动中...');
    console.log('=================================');
    
    // 检查浏览器兼容性
    if (!checkBrowserCompatibility()) {
        showCompatibilityError();
        return;
    }
    
    // 检查localStorage支持
    if (!checkLocalStorageSupport()) {
        showStorageError();
        return;
    }
    
    // 初始化游戏
    try {
        console.log('正在调用 initGame...');
        initGame();
        console.log('initGame 调用完成');
    } catch (error) {
        console.error('游戏初始化失败:', error);
        console.error('错误堆栈:', error.stack);
        showInitError(error);
    }
});

/**
 * 检查浏览器兼容性
 */
function checkBrowserCompatibility() {
    const requirements = {
        'Promise': typeof Promise !== 'undefined',
        'Fetch API': typeof fetch !== 'undefined',
        'localStorage': typeof Storage !== 'undefined',
        'CSS Grid': CSS.supports('display', 'grid'),
        'CSS Flexbox': CSS.supports('display', 'flex'),
        'ES6 Classes': (() => {
            try {
                eval('class Test {}');
                return true;
            } catch (e) {
                return false;
            }
        })()
    };
    
    const failed = Object.entries(requirements)
        .filter(([_, supported]) => !supported)
        .map(([feature]) => feature);
    
    if (failed.length > 0) {
        console.warn('浏览器不支持以下功能:', failed);
    }
    
    return failed.length === 0;
}

/**
 * 检查localStorage支持
 */
function checkLocalStorageSupport() {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * 显示兼容性错误
 */
function showCompatibilityError() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #f5f5f5;
            font-family: 'Microsoft YaHei', sans-serif;
            text-align: center;
            padding: 20px;
        ">
            <div>
                <h1 style="color: #FFD700; margin-bottom: 20px;">⚠️ 浏览器不兼容</h1>
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
                    您的浏览器版本过低，无法运行本游戏。<br>
                    请使用以下现代浏览器之一：
                </p>
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 30px;">🌐</div>
                        <div>Chrome 80+</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 30px;">🦊</div>
                        <div>Firefox 75+</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px;">
                        <div style="font-size: 30px;">🧭</div>
                        <div>Edge 80+</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 显示存储错误
 */
function showStorageError() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #f5f5f5;
            font-family: 'Microsoft YaHei', sans-serif;
            text-align: center;
            padding: 20px;
        ">
            <div>
                <h1 style="color: #FFD700; margin-bottom: 20px;">💾 存储错误</h1>
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
                    无法访问本地存储，游戏进度将无法保存。<br>
                    请检查以下设置：
                </p>
                <ul style="text-align: left; display: inline-block; line-height: 2;">
                    <li>浏览器是否开启了"无痕/隐私模式"</li>
                    <li>浏览器设置中是否禁用了Cookie/本地存储</li>
                    <li>磁盘空间是否已满</li>
                </ul>
                <p style="margin-top: 20px;">
                    <button onclick="location.reload()" style="
                        padding: 10px 30px;
                        font-size: 16px;
                        background: linear-gradient(45deg, #8B0000, #A52A2A);
                        color: #FFD700;
                        border: 2px solid #D4AF37;
                        border-radius: 25px;
                        cursor: pointer;
                    ">重新加载</button>
                </p>
            </div>
        </div>
    `;
}

/**
 * 显示初始化错误
 */
function showInitError(error) {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: #f5f5f5;
            font-family: 'Microsoft YaHei', sans-serif;
            text-align: center;
            padding: 20px;
        ">
            <div>
                <h1 style="color: #FFD700; margin-bottom: 20px;">❌ 初始化失败</h1>
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
                    游戏初始化过程中发生错误。<br>
                    错误信息：
                </p>
                <div style="background: rgba(255,0,0,0.1); border: 1px solid #f44336; border-radius: 5px; padding: 15px; margin: 20px 0; text-align: left; font-family: monospace;">
                    ${error.message || 'Unknown error'}
                </div>
                <p style="margin-top: 20px;">
                    <button onclick="location.reload()" style="
                        padding: 10px 30px;
                        font-size: 16px;
                        background: linear-gradient(45deg, #8B0000, #A52A2A);
                        color: #FFD700;
                        border: 2px solid #D4AF37;
                        border-radius: 25px;
                        cursor: pointer;
                    ">重新加载</button>
                    <button onclick="localStorage.clear(); location.reload();" style="
                        padding: 10px 30px;
                        font-size: 16px;
                        background: transparent;
                        color: #f44336;
                        border: 2px solid #f44336;
                        border-radius: 25px;
                        cursor: pointer;
                        margin-left: 10px;
                    ">清除缓存</button>
                </p>
            </div>
        </div>
    `;
}

/**
 * 初始化游戏
 */
function initGame() {
    console.log('正在初始化游戏...');
    
    try {
        // 创建全局游戏实例
        window.game = new Game();
        
        // 显示启动画面
        console.log('=================================');
        console.log('    帝王模拟器2 - 启动成功！');
        console.log('=================================');
        console.log('当前版本: 2.0.0');
        console.log('游戏状态:', window.game.state);
    } catch (error) {
        console.error('游戏初始化失败:', error);
        console.error('错误堆栈:', error.stack);
        showInitError(error);
    }
}

/**
 * 全局错误处理
 */
window.onerror = function(message, source, lineno, colno, error) {
    console.error('全局错误:', { message, source, lineno, colno, error });
    
    // 如果在游戏已经初始化的情况下出错，显示错误通知
    if (window.game && window.game.showNotification) {
        window.game.showNotification('发生错误: ' + message, 'error');
    }
    
    return false;
};

/**
 * 未处理的Promise错误
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise错误:', event.reason);
    
    if (window.game && game.showNotification) {
        game.showNotification('异步操作错误', 'error');
    }
});

/**
 * 页面可见性变化处理（处理后台运行）
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('页面进入后台运行');
        // 可以在这里暂停某些动画或音频
    } else {
        console.log('页面回到前台');
        // 恢复运行
    }
});

/**
 * 页面加载完成后的额外初始化
 */
window.addEventListener('load', function() {
    console.log('页面资源加载完成');
    
    // 可以在这里添加额外的初始化逻辑
    // 例如：预加载资源、初始化第三方库等
});

/**
 * 页面卸载前的清理
 */
window.addEventListener('beforeunload', function(event) {
    // 如果游戏正在进行中，提示用户保存
    if (window.game && game.isPlaying) {
        // 自动保存
        try {
            game.saveGame();
            console.log('自动保存完成');
        } catch (e) {
            console.error('自动保存失败:', e);
        }
        
        // 返回提示信息（某些浏览器可能不支持）
        // return '游戏进度已自动保存。确定要离开吗？';
    }
});
