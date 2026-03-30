/**
 * 帝王模拟器2 - 主入口文件
 * 游戏启动和初始化
 */

// ============ 移动端调试面板 ============
(function() {
    var debugLogs = [];
    var debugPanel = null;
    var debugBtn = null;
    var isVisible = false;

    function createDebugUI() {
        // 浮动按钮
        debugBtn = document.createElement('div');
        debugBtn.id = 'debug-btn';
        debugBtn.textContent = '0';
        debugBtn.style.cssText = 'position:fixed;bottom:80px;right:10px;z-index:99999;width:36px;height:36px;border-radius:50%;background:#e74c3c;color:#fff;font-size:14px;font-weight:bold;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:pointer;-webkit-tap-highlight-color:transparent;opacity:0.85;';
        debugBtn.addEventListener('click', function() {
            isVisible = !isVisible;
            debugPanel.style.display = isVisible ? 'block' : 'none';
        });
        document.body.appendChild(debugBtn);

        // 日志面板
        debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = 'display:none;position:fixed;bottom:120px;right:10px;left:10px;z-index:99998;max-height:50vh;background:rgba(0,0,0,0.92);color:#0f0;font-family:monospace;font-size:12px;border-radius:8px;border:1px solid #444;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:8px;word-break:break-all;';
        // 关闭和清除按钮
        var toolbar = document.createElement('div');
        toolbar.style.cssText = 'display:flex;justify-content:space-between;margin-bottom:6px;';
        toolbar.innerHTML = '<span style="color:#FFD700;font-weight:bold;">Debug Console</span><span id="debug-clear" style="color:#f44;cursor:pointer;">清除</span>';
        debugPanel.appendChild(toolbar);
        document.body.appendChild(debugPanel);

        document.getElementById('debug-clear').addEventListener('click', function() {
            debugLogs = [];
            updatePanel();
        });
    }

    function updatePanel() {
        if (!debugPanel) return;
        // 保留 toolbar，清除后面的内容
        while (debugPanel.childNodes.length > 1) {
            debugPanel.removeChild(debugPanel.lastChild);
        }
        debugLogs.forEach(function(log) {
            var line = document.createElement('div');
            line.style.cssText = 'border-bottom:1px solid #333;padding:4px 0;color:' + log.color + ';';
            line.textContent = '[' + log.time + '] ' + log.type + ': ' + log.msg;
            debugPanel.appendChild(line);
        });
        debugPanel.scrollTop = debugPanel.scrollHeight;
        if (debugBtn) {
            var errCount = debugLogs.filter(function(l){ return l.type === 'ERROR'; }).length;
            debugBtn.textContent = errCount;
            debugBtn.style.background = errCount > 0 ? '#e74c3c' : '#27ae60';
        }
    }

    function addLog(type, msg, color) {
        var now = new Date();
        var time = ('0'+now.getHours()).slice(-2)+':'+('0'+now.getMinutes()).slice(-2)+':'+('0'+now.getSeconds()).slice(-2);
        debugLogs.push({type: type, msg: String(msg).substring(0, 500), time: time, color: color});
        if (debugLogs.length > 50) debugLogs.shift();
        updatePanel();
    }

    // 捕获全局错误（脚本加载错误等）
    window.addEventListener('error', function(e) {
        var msg = e.message || '';
        if (e.filename) msg += ' (' + e.filename.split('/').pop() + ':' + e.lineno + ':' + e.colno + ')';
        addLog('ERROR', msg, '#f44');
    });

    // 捕获 Promise 错误
    window.addEventListener('unhandledrejection', function(e) {
        addLog('PROMISE', e.reason, '#f90');
    });

    // 劫持 console 方法
    var origError = console.error;
    var origWarn = console.warn;
    var origLog = console.log;
    console.error = function() {
        addLog('ERROR', Array.prototype.slice.call(arguments).join(' '), '#f44');
        origError.apply(console, arguments);
    };
    console.warn = function() {
        addLog('WARN', Array.prototype.slice.call(arguments).join(' '), '#fa0');
        origWarn.apply(console, arguments);
    };
    console.log = function() {
        addLog('LOG', Array.prototype.slice.call(arguments).join(' '), '#0f0');
        origLog.apply(console, arguments);
    };

    // DOM 就绪后创建 UI
    if (document.body) {
        createDebugUI();
    } else {
        document.addEventListener('DOMContentLoaded', createDebugUI);
    }
})();
// ============ 调试面板结束 ============

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
        'CSS Grid': typeof CSS !== 'undefined' && CSS.supports ? CSS.supports('display', 'grid') : true,
        'CSS Flexbox': typeof CSS !== 'undefined' && CSS.supports ? CSS.supports('display', 'flex') : true,
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
 * 全局错误处理（通过调试面板捕获）
 */
window.onerror = function(message, source, lineno, colno, error) {
    // 调试面板已通过 addEventListener('error') 捕获
    // 此处保留游戏内通知
    if (window.game && window.game.showNotification) {
        window.game.showNotification('发生错误: ' + message, 'error');
    }
    return false;
};

/**
 * 未处理的Promise错误（通过调试面板捕获）
 */
window.addEventListener('unhandledrejection', function(event) {
    // 调试面板已通过 addEventListener('unhandledrejection') 捕获
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
    // 如果游戏正在进行中，静默自动保存
    if (window.game && game.isPlaying) {
        try {
            game.autoSave();
            console.log('自动保存完成');
        } catch (e) {
            console.error('自动保存失败:', e);
        }
    }
});
