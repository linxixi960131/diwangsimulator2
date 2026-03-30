/**
 * 帝王模拟器2 - 帝王头像数据
 * 8个不同风格的SVG帝王头像
 */

const EMPEROR_AVATARS = [
    {
        id: 0,
        name: '威严帝王',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a1a3e"/><stop offset="100%" stop-color="#1a0a2e"/></linearGradient>
    <linearGradient id="crown0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#B8860B"/></linearGradient>
    <linearGradient id="robe0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8B0000"/><stop offset="100%" stop-color="#4a0000"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg0)" stroke="#FFD700" stroke-width="2"/>
  <!-- 龙袍 -->
  <path d="M30 95 Q40 78 60 75 Q80 78 90 95 L95 120 L25 120Z" fill="url(#robe0)"/>
  <path d="M45 85 Q60 82 75 85" stroke="#FFD700" stroke-width="1" fill="none"/>
  <path d="M42 92 Q60 88 78 92" stroke="#FFD700" stroke-width="1" fill="none"/>
  <!-- 脖子 -->
  <rect x="52" y="68" width="16" height="10" rx="3" fill="#F5DEB3"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="52" rx="22" ry="26" fill="#F5DEB3"/>
  <!-- 眉毛 -->
  <path d="M44 44 Q50 40 56 43" stroke="#2a1a0a" stroke-width="2" fill="none"/>
  <path d="M64 43 Q70 40 76 44" stroke="#2a1a0a" stroke-width="2" fill="none"/>
  <!-- 眼睛 -->
  <ellipse cx="50" cy="48" rx="4" ry="3" fill="#1a1a1a"/>
  <ellipse cx="70" cy="48" rx="4" ry="3" fill="#1a1a1a"/>
  <circle cx="51" cy="47" r="1" fill="#fff"/>
  <circle cx="71" cy="47" r="1" fill="#fff"/>
  <!-- 鼻子 -->
  <path d="M58 50 Q60 56 62 50" stroke="#D2B48C" stroke-width="1.5" fill="none"/>
  <!-- 嘴 -->
  <path d="M53 60 Q60 64 67 60" stroke="#8B4513" stroke-width="1.5" fill="none"/>
  <!-- 胡须 -->
  <path d="M48 62 Q45 72 40 78" stroke="#2a1a0a" stroke-width="1.5" fill="none"/>
  <path d="M72 62 Q75 72 80 78" stroke="#2a1a0a" stroke-width="1.5" fill="none"/>
  <path d="M55 64 Q58 74 56 80" stroke="#2a1a0a" stroke-width="1" fill="none"/>
  <path d="M65 64 Q62 74 64 80" stroke="#2a1a0a" stroke-width="1" fill="none"/>
  <!-- 冕冠 -->
  <rect x="35" y="24" width="50" height="8" rx="2" fill="url(#crown0)"/>
  <rect x="38" y="18" width="44" height="8" rx="2" fill="#1a0a2e" stroke="#FFD700" stroke-width="1"/>
  <polygon points="42,18 45,8 48,18" fill="url(#crown0)"/>
  <polygon points="52,18 55,6 58,18" fill="url(#crown0)"/>
  <polygon points="62,18 65,6 68,18" fill="url(#crown0)"/>
  <polygon points="72,18 75,8 78,18" fill="url(#crown0)"/>
  <!-- 冕旒 -->
  <line x1="36" y1="25" x2="36" y2="35" stroke="#FFD700" stroke-width="0.8"/>
  <circle cx="36" cy="28" r="1.5" fill="#ff0000"/>
  <circle cx="36" cy="32" r="1.5" fill="#fff"/>
  <circle cx="36" cy="35" r="1.5" fill="#4169E1"/>
  <line x1="84" y1="25" x2="84" y2="35" stroke="#FFD700" stroke-width="0.8"/>
  <circle cx="84" cy="28" r="1.5" fill="#ff0000"/>
  <circle cx="84" cy="32" r="1.5" fill="#fff"/>
  <circle cx="84" cy="35" r="1.5" fill="#4169E1"/>
</svg>`
    },
    {
        id: 1,
        name: '文雅君主',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2e3e"/><stop offset="100%" stop-color="#0a1e2e"/></linearGradient>
    <linearGradient id="robe1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a4a6e"/><stop offset="100%" stop-color="#0a2a4e"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg1)" stroke="#87CEEB" stroke-width="2"/>
  <!-- 儒雅长袍 -->
  <path d="M30 95 Q40 80 60 76 Q80 80 90 95 L95 120 L25 120Z" fill="url(#robe1)"/>
  <path d="M50 80 L50 100" stroke="#87CEEB" stroke-width="0.8"/>
  <path d="M70 80 L70 100" stroke="#87CEEB" stroke-width="0.8"/>
  <rect x="52" y="68" width="16" height="10" rx="3" fill="#F5DEB3"/>
  <!-- 脸 -->
  <ellipse cx="60" cy="52" rx="21" ry="25" fill="#FAEBD7"/>
  <!-- 细眉 -->
  <path d="M43 43 Q50 39 57 42" stroke="#3a2a1a" stroke-width="1.5" fill="none"/>
  <path d="M63 42 Q70 39 77 43" stroke="#3a2a1a" stroke-width="1.5" fill="none"/>
  <!-- 温和眼睛 -->
  <ellipse cx="50" cy="48" rx="3.5" ry="2.5" fill="#2a2a2a"/>
  <ellipse cx="70" cy="48" rx="3.5" ry="2.5" fill="#2a2a2a"/>
  <circle cx="51" cy="47" r="1" fill="#fff"/>
  <circle cx="71" cy="47" r="1" fill="#fff"/>
  <!-- 鼻子 -->
  <path d="M58 50 Q60 55 62 50" stroke="#D2B48C" stroke-width="1.2" fill="none"/>
  <!-- 微笑 -->
  <path d="M52 59 Q60 63 68 59" stroke="#8B6343" stroke-width="1.5" fill="none"/>
  <!-- 短须 -->
  <path d="M52 63 Q50 68 48 72" stroke="#3a2a1a" stroke-width="1" fill="none"/>
  <path d="M68 63 Q70 68 72 72" stroke="#3a2a1a" stroke-width="1" fill="none"/>
  <!-- 文冠 -->
  <ellipse cx="60" cy="28" rx="20" ry="10" fill="#1a1a2e" stroke="#87CEEB" stroke-width="1.5"/>
  <rect x="42" y="24" width="36" height="6" rx="3" fill="#1a2a4e" stroke="#87CEEB" stroke-width="1"/>
  <line x1="60" y1="18" x2="60" y2="10" stroke="#87CEEB" stroke-width="1.5"/>
  <circle cx="60" cy="8" r="3" fill="#87CEEB" opacity="0.8"/>
  <!-- 发簪 -->
  <line x1="40" y1="28" x2="80" y2="28" stroke="#C0C0C0" stroke-width="1"/>
  <circle cx="40" cy="28" r="2" fill="#87CEEB"/>
  <circle cx="80" cy="28" r="2" fill="#87CEEB"/>
</svg>`
    },
    {
        id: 2,
        name: '武将帝王',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3e2a1a"/><stop offset="100%" stop-color="#2e1a0a"/></linearGradient>
    <linearGradient id="armor2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8B7355"/><stop offset="100%" stop-color="#5a4a35"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg2)" stroke="#CD853F" stroke-width="2"/>
  <!-- 铠甲 -->
  <path d="M28 95 Q38 76 60 72 Q82 76 92 95 L97 120 L23 120Z" fill="url(#armor2)"/>
  <path d="M40 82 L40 100" stroke="#CD853F" stroke-width="1.5"/>
  <path d="M60 78 L60 100" stroke="#CD853F" stroke-width="1.5"/>
  <path d="M80 82 L80 100" stroke="#CD853F" stroke-width="1.5"/>
  <circle cx="60" cy="82" r="4" fill="#CD853F" stroke="#FFD700" stroke-width="1"/>
  <rect x="50" y="68" width="20" height="8" rx="3" fill="#DEB887"/>
  <!-- 宽脸 -->
  <ellipse cx="60" cy="52" rx="24" ry="25" fill="#DEB887"/>
  <!-- 粗眉 -->
  <path d="M42 42 Q50 37 58 41" stroke="#1a0a00" stroke-width="3" fill="none"/>
  <path d="M62 41 Q70 37 78 42" stroke="#1a0a00" stroke-width="3" fill="none"/>
  <!-- 锐利眼睛 -->
  <path d="M44 47 L50 45 L56 47 L50 49Z" fill="#1a1a1a"/>
  <path d="M64 47 L70 45 L76 47 L70 49Z" fill="#1a1a1a"/>
  <circle cx="50" cy="47" r="1" fill="#fff"/>
  <circle cx="70" cy="47" r="1" fill="#fff"/>
  <!-- 鼻子 -->
  <path d="M57 49 Q60 56 63 49" stroke="#C4A882" stroke-width="1.5" fill="none"/>
  <!-- 紧闭的嘴 -->
  <line x1="52" y1="60" x2="68" y2="60" stroke="#6B4226" stroke-width="2"/>
  <!-- 络腮胡 -->
  <path d="M38 55 Q36 65 38 75 Q45 72 50 64" stroke="#1a0a00" stroke-width="1.5" fill="none"/>
  <path d="M82 55 Q84 65 82 75 Q75 72 70 64" stroke="#1a0a00" stroke-width="1.5" fill="none"/>
  <path d="M50 64 Q60 70 70 64" stroke="#1a0a00" stroke-width="1" fill="none"/>
  <!-- 战盔 -->
  <path d="M34 38 Q60 10 86 38" fill="#5a4a35" stroke="#CD853F" stroke-width="1.5"/>
  <path d="M34 38 L86 38" stroke="#CD853F" stroke-width="2"/>
  <rect x="55" y="12" width="10" height="20" rx="2" fill="#CD853F"/>
  <path d="M50 14 L60 5 L70 14" fill="#ff3300" opacity="0.8"/>
  <!-- 护颊 -->
  <path d="M34 38 L30 55" stroke="#5a4a35" stroke-width="4"/>
  <path d="M86 38 L90 55" stroke="#5a4a35" stroke-width="4"/>
</svg>`
    },
    {
        id: 3,
        name: '老成帝王',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2e2e1a"/><stop offset="100%" stop-color="#1e1e0a"/></linearGradient>
    <linearGradient id="robe3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#6B4226"/><stop offset="100%" stop-color="#3a2216"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg3)" stroke="#DAA520" stroke-width="2"/>
  <!-- 朝服 -->
  <path d="M30 95 Q40 80 60 76 Q80 80 90 95 L95 120 L25 120Z" fill="url(#robe3)"/>
  <path d="M45 84 Q60 80 75 84" stroke="#DAA520" stroke-width="1"/>
  <rect x="52" y="68" width="16" height="10" rx="3" fill="#D2B48C"/>
  <!-- 瘦脸 -->
  <ellipse cx="60" cy="52" rx="20" ry="26" fill="#D2B48C"/>
  <!-- 皱纹 -->
  <path d="M42 40 Q46 38 50 40" stroke="#B8A080" stroke-width="0.8" fill="none"/>
  <path d="M70 40 Q74 38 78 40" stroke="#B8A080" stroke-width="0.8" fill="none"/>
  <path d="M44 56 Q46 55 48 56" stroke="#B8A080" stroke-width="0.5" fill="none"/>
  <path d="M72 56 Q74 55 76 56" stroke="#B8A080" stroke-width="0.5" fill="none"/>
  <!-- 深邃眉毛 -->
  <path d="M43 43 Q50 40 56 43" stroke="#888" stroke-width="1.5" fill="none"/>
  <path d="M64 43 Q70 40 77 43" stroke="#888" stroke-width="1.5" fill="none"/>
  <!-- 半闭眼睛-深沉 -->
  <path d="M45 48 Q50 46 55 48" stroke="#1a1a1a" stroke-width="2" fill="none"/>
  <path d="M65 48 Q70 46 75 48" stroke="#1a1a1a" stroke-width="2" fill="none"/>
  <circle cx="50" cy="48" r="1.5" fill="#1a1a1a"/>
  <circle cx="70" cy="48" r="1.5" fill="#1a1a1a"/>
  <!-- 鼻子 -->
  <path d="M58 50 Q60 56 62 50" stroke="#B8A080" stroke-width="1.2" fill="none"/>
  <!-- 沉稳嘴 -->
  <path d="M53 60 Q60 62 67 60" stroke="#8B6343" stroke-width="1.2" fill="none"/>
  <!-- 长白须 -->
  <path d="M48 63 Q44 78 38 90" stroke="#ccc" stroke-width="1.5" fill="none"/>
  <path d="M53 64 Q50 80 46 92" stroke="#ccc" stroke-width="1" fill="none"/>
  <path d="M60 65 Q60 82 58 94" stroke="#ccc" stroke-width="1" fill="none"/>
  <path d="M67 64 Q70 80 74 92" stroke="#ccc" stroke-width="1" fill="none"/>
  <path d="M72 63 Q76 78 82 90" stroke="#ccc" stroke-width="1.5" fill="none"/>
  <!-- 平天冠 -->
  <rect x="38" y="22" width="44" height="10" rx="2" fill="#2a2a1a" stroke="#DAA520" stroke-width="1.5"/>
  <rect x="42" y="14" width="36" height="10" rx="2" fill="#2a2a1a" stroke="#DAA520" stroke-width="1"/>
  <circle cx="60" cy="19" r="3" fill="#DAA520"/>
</svg>`
    },
    {
        id: 4,
        name: '少年天子',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a3e"/><stop offset="100%" stop-color="#2a1a4e"/></linearGradient>
    <linearGradient id="robe4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B22222"/><stop offset="100%" stop-color="#6a1111"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg4)" stroke="#FF6347" stroke-width="2"/>
  <!-- 轻便龙袍 -->
  <path d="M32 95 Q42 80 60 77 Q78 80 88 95 L93 120 L27 120Z" fill="url(#robe4)"/>
  <path d="M48 84 Q60 81 72 84" stroke="#FFD700" stroke-width="1"/>
  <rect x="53" y="69" width="14" height="9" rx="3" fill="#FFE4C4"/>
  <!-- 年轻圆脸 -->
  <ellipse cx="60" cy="53" rx="21" ry="23" fill="#FFE4C4"/>
  <!-- 英气眉 -->
  <path d="M44 44 Q50 41 55 44" stroke="#2a1a0a" stroke-width="1.8" fill="none"/>
  <path d="M65 44 Q70 41 76 44" stroke="#2a1a0a" stroke-width="1.8" fill="none"/>
  <!-- 大眼睛 -->
  <ellipse cx="50" cy="49" rx="4.5" ry="4" fill="#fff"/>
  <ellipse cx="70" cy="49" rx="4.5" ry="4" fill="#fff"/>
  <circle cx="50" cy="49" r="2.5" fill="#1a1a1a"/>
  <circle cx="70" cy="49" r="2.5" fill="#1a1a1a"/>
  <circle cx="51" cy="48" r="1" fill="#fff"/>
  <circle cx="71" cy="48" r="1" fill="#fff"/>
  <!-- 鼻子 -->
  <path d="M58 51 Q60 55 62 51" stroke="#D2B48C" stroke-width="1" fill="none"/>
  <!-- 自信微笑 -->
  <path d="M52 60 Q60 65 68 60" stroke="#C4756B" stroke-width="1.5" fill="none"/>
  <!-- 无胡须-年轻 -->
  <!-- 少年发型 -->
  <path d="M38 45 Q38 22 60 18 Q82 22 82 45" fill="#1a0a00"/>
  <path d="M38 45 Q38 35 42 30" stroke="#2a1a0a" stroke-width="0.5" fill="none"/>
  <path d="M82 45 Q82 35 78 30" stroke="#2a1a0a" stroke-width="0.5" fill="none"/>
  <!-- 金冠 -->
  <rect x="44" y="20" width="32" height="6" rx="3" fill="#FFD700"/>
  <circle cx="60" cy="18" r="4" fill="#FF6347" stroke="#FFD700" stroke-width="1.5"/>
  <polygon points="56,16 60,10 64,16" fill="#FFD700"/>
</svg>`
    },
    {
        id: 5,
        name: '冷酷帝王',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a1a1a"/><stop offset="100%" stop-color="#0a0a0a"/></linearGradient>
    <linearGradient id="robe5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2a2a2a"/><stop offset="100%" stop-color="#1a1a1a"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg5)" stroke="#808080" stroke-width="2"/>
  <!-- 暗色龙袍 -->
  <path d="M30 95 Q40 78 60 75 Q80 78 90 95 L95 120 L25 120Z" fill="url(#robe5)"/>
  <path d="M45 84 Q60 80 75 84" stroke="#555" stroke-width="1"/>
  <path d="M42 92 Q60 87 78 92" stroke="#555" stroke-width="1"/>
  <rect x="52" y="68" width="16" height="10" rx="3" fill="#E8D5B7"/>
  <!-- 棱角脸 -->
  <path d="M38 45 Q38 30 60 28 Q82 30 82 45 L78 68 Q60 78 42 68Z" fill="#E8D5B7"/>
  <!-- 冷峻眉 -->
  <path d="M42 42 Q48 38 56 42" stroke="#1a1a1a" stroke-width="2.5" fill="none"/>
  <path d="M64 42 Q72 38 78 42" stroke="#1a1a1a" stroke-width="2.5" fill="none"/>
  <!-- 冷锐眼睛 -->
  <path d="M44 47 L50 45 L56 48" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
  <path d="M64 48 L70 45 L76 47" stroke="#1a1a1a" stroke-width="1.5" fill="none"/>
  <circle cx="50" cy="47" r="2" fill="#1a1a1a"/>
  <circle cx="70" cy="47" r="2" fill="#1a1a1a"/>
  <circle cx="50.5" cy="46.5" r="0.8" fill="#666"/>
  <circle cx="70.5" cy="46.5" r="0.8" fill="#666"/>
  <!-- 鼻子 -->
  <path d="M58 49 L60 56 L62 49" stroke="#C4A48C" stroke-width="1.2" fill="none"/>
  <!-- 薄唇 -->
  <line x1="53" y1="61" x2="67" y2="61" stroke="#8B6B53" stroke-width="1.5"/>
  <!-- 短须 -->
  <path d="M50 63 Q48 67 46 70" stroke="#2a2a2a" stroke-width="1" fill="none"/>
  <path d="M70 63 Q72 67 74 70" stroke="#2a2a2a" stroke-width="1" fill="none"/>
  <!-- 黑头发 -->
  <path d="M36 45 Q36 20 60 16 Q84 20 84 45" fill="#0a0a0a"/>
  <!-- 铁冠 -->
  <rect x="40" y="20" width="40" height="8" rx="2" fill="#333" stroke="#808080" stroke-width="1.5"/>
  <polygon points="50,20 53,12 56,20" fill="#808080"/>
  <polygon points="57,20 60,10 63,20" fill="#808080"/>
  <polygon points="64,20 67,12 70,20" fill="#808080"/>
  <circle cx="60" cy="24" r="2" fill="#808080"/>
</svg>`
    },
    {
        id: 6,
        name: '仁慈帝王',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1a2e1a"/><stop offset="100%" stop-color="#0a1e0a"/></linearGradient>
    <linearGradient id="robe6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2E8B57"/><stop offset="100%" stop-color="#1a5a37"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg6)" stroke="#90EE90" stroke-width="2"/>
  <!-- 绿色龙袍 -->
  <path d="M30 95 Q40 80 60 76 Q80 80 90 95 L95 120 L25 120Z" fill="url(#robe6)"/>
  <path d="M46 85 Q60 81 74 85" stroke="#90EE90" stroke-width="1"/>
  <circle cx="60" cy="82" r="3" fill="#FFD700"/>
  <rect x="52" y="68" width="16" height="10" rx="3" fill="#FAEBD7"/>
  <!-- 圆润脸 -->
  <ellipse cx="60" cy="52" rx="23" ry="25" fill="#FAEBD7"/>
  <!-- 慈眉 -->
  <path d="M43 44 Q50 41 56 44" stroke="#4a3a2a" stroke-width="1.5" fill="none"/>
  <path d="M64 44 Q70 41 77 44" stroke="#4a3a2a" stroke-width="1.5" fill="none"/>
  <!-- 温和眼睛 -->
  <path d="M45 48 Q50 45 55 48" stroke="#2a2a2a" stroke-width="1.5" fill="none"/>
  <path d="M65 48 Q70 45 75 48" stroke="#2a2a2a" stroke-width="1.5" fill="none"/>
  <ellipse cx="50" cy="49" rx="3" ry="2.5" fill="#2a2a2a"/>
  <ellipse cx="70" cy="49" rx="3" ry="2.5" fill="#2a2a2a"/>
  <circle cx="51" cy="48" r="1" fill="#fff"/>
  <circle cx="71" cy="48" r="1" fill="#fff"/>
  <!-- 鼻子 -->
  <path d="M58 51 Q60 56 62 51" stroke="#D2B48C" stroke-width="1.2" fill="none"/>
  <!-- 和蔼微笑 -->
  <path d="M50 59 Q60 66 70 59" stroke="#A0522D" stroke-width="1.5" fill="none"/>
  <!-- 美须 -->
  <path d="M50 63 Q46 73 42 80" stroke="#4a3a2a" stroke-width="1.2" fill="none"/>
  <path d="M56 65 Q54 76 52 84" stroke="#4a3a2a" stroke-width="1" fill="none"/>
  <path d="M64 65 Q66 76 68 84" stroke="#4a3a2a" stroke-width="1" fill="none"/>
  <path d="M70 63 Q74 73 78 80" stroke="#4a3a2a" stroke-width="1.2" fill="none"/>
  <!-- 通天冠 -->
  <rect x="42" y="24" width="36" height="8" rx="2" fill="#1a3a1a" stroke="#90EE90" stroke-width="1"/>
  <path d="M45 24 Q60 8 75 24" fill="#1a3a1a" stroke="#90EE90" stroke-width="1"/>
  <circle cx="60" cy="16" r="3" fill="#FFD700"/>
  <line x1="60" y1="13" x2="60" y2="8" stroke="#FFD700" stroke-width="1.5"/>
  <circle cx="60" cy="7" r="2" fill="#90EE90"/>
</svg>`
    },
    {
        id: 7,
        name: '霸气帝王',
        svg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#3e1a1a"/><stop offset="100%" stop-color="#2e0a0a"/></linearGradient>
    <linearGradient id="robe7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8B0000"/><stop offset="100%" stop-color="#5a0000"/></linearGradient>
    <linearGradient id="crown7" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#FFD700"/><stop offset="100%" stop-color="#DAA520"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="58" fill="url(#bg7)" stroke="#FF4500" stroke-width="2"/>
  <!-- 华丽龙袍 -->
  <path d="M28 95 Q38 76 60 72 Q82 76 92 95 L97 120 L23 120Z" fill="url(#robe7)"/>
  <path d="M40 82 Q60 76 80 82" stroke="#FFD700" stroke-width="1.5"/>
  <path d="M38 90 Q60 84 82 90" stroke="#FFD700" stroke-width="1"/>
  <!-- 龙纹 -->
  <path d="M50 85 Q55 82 60 85 Q65 88 70 85" stroke="#FFD700" stroke-width="0.8" fill="none"/>
  <circle cx="60" cy="80" r="3" fill="#FFD700"/>
  <rect x="50" y="68" width="20" height="8" rx="3" fill="#DEB887"/>
  <!-- 方脸 -->
  <path d="M38 45 Q38 28 60 26 Q82 28 82 45 L80 65 Q60 75 40 65Z" fill="#DEB887"/>
  <!-- 浓眉 -->
  <path d="M41 41 Q48 36 57 41" stroke="#0a0a00" stroke-width="2.5" fill="none"/>
  <path d="M63 41 Q72 36 79 41" stroke="#0a0a00" stroke-width="2.5" fill="none"/>
  <!-- 虎目 -->
  <ellipse cx="50" cy="47" rx="5" ry="3.5" fill="#fff"/>
  <ellipse cx="70" cy="47" rx="5" ry="3.5" fill="#fff"/>
  <circle cx="50" cy="47" r="2.5" fill="#1a0a00"/>
  <circle cx="70" cy="47" r="2.5" fill="#1a0a00"/>
  <circle cx="51" cy="46" r="1" fill="#fff"/>
  <circle cx="71" cy="46" r="1" fill="#fff"/>
  <!-- 鼻子 -->
  <path d="M57 49 Q60 57 63 49" stroke="#C4A882" stroke-width="1.5" fill="none"/>
  <!-- 嘴 -->
  <path d="M52 61 Q60 64 68 61" stroke="#6B3A2a" stroke-width="2" fill="none"/>
  <!-- 虬髯 -->
  <path d="M42 58 Q38 68 34 80" stroke="#0a0a00" stroke-width="2" fill="none"/>
  <path d="M46 62 Q42 72 38 82" stroke="#0a0a00" stroke-width="1.5" fill="none"/>
  <path d="M78 58 Q82 68 86 80" stroke="#0a0a00" stroke-width="2" fill="none"/>
  <path d="M74 62 Q78 72 82 82" stroke="#0a0a00" stroke-width="1.5" fill="none"/>
  <path d="M54 65 Q52 74 50 82" stroke="#0a0a00" stroke-width="1" fill="none"/>
  <path d="M66 65 Q68 74 70 82" stroke="#0a0a00" stroke-width="1" fill="none"/>
  <!-- 黑发 -->
  <path d="M36 45 Q36 18 60 14 Q84 18 84 45" fill="#0a0a00"/>
  <!-- 霸气金冠 -->
  <rect x="36" y="22" width="48" height="8" rx="2" fill="url(#crown7)"/>
  <polygon points="40,22 44,10 48,22" fill="url(#crown7)"/>
  <polygon points="52,22 56,8 60,22" fill="url(#crown7)"/>
  <polygon points="60,22 64,8 68,22" fill="url(#crown7)"/>
  <polygon points="72,22 76,10 80,22" fill="url(#crown7)"/>
  <circle cx="44" cy="16" r="2" fill="#FF4500"/>
  <circle cx="60" cy="14" r="2.5" fill="#FF0000"/>
  <circle cx="76" cy="16" r="2" fill="#FF4500"/>
</svg>`
    }
];
