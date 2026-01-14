# PWA 测试指南

## 准备工作

1. **构建项目**:
```bash
npm run build
```

2. **启动预览服务器**:
```bash
npm run preview
```
访问 http://localhost:4173

## PWA 功能测试

### 1. 安装 PWA
在支持的浏览器中（Chrome, Edge, Safari）:
- **桌面端**: 右上角会出现"安装"图标或地址栏提示
- **移动端**:
  - Android: 浏览器菜单中的"添加到主屏幕"
  - iOS Safari: 分享按钮 → "添加到主屏幕"

### 2. 离线模式测试
1. 打开 PWA 应用
2. 确认游戏可以正常加载和运行
3. 断开网络连接（关闭 WiFi/移动数据）
4. 刷新页面或重新打开应用
5. **预期结果**: 应用仍然可以运行，所有功能正常

### 3. 添加到主屏幕测试
1. 在移动浏览器中打开应用
2. 使用"添加到主屏幕"功能
3. **预期结果**:
   - 应用图标出现在主屏幕
   - 点击图标打开应用（standalone 模式，无浏览器地址栏）
   - 全屏显示，沉浸式体验

### 4. Service Worker 检查
在浏览器开发者工具中:
1. 打开 **Application** 标签
2. 左侧找到 **Service Workers**
3. **预期结果**:
   - Service Worker 状态为 "Activated" 或 "Running"
   - 查看缓存内容，确认游戏资源已缓存

### 5. Manifest 验证
1. 在 **Application** 标签中找到 **Manifest**
2. **预期结果**:
   - Name: "猎人与狼"
   - Display: "standalone"
   - Icons: 显示 192x192 和 512x512 图标
   - Theme color: #3B82F6 (蓝色)

## 测试清单

- [ ] PWA 可以在浏览器中正常安装
- [ ] 应用图标显示正确
- [ ] 离线模式下游戏可以运行
- [ ] 离线模式可以玩完整游戏
- [ ] 添加到主屏幕后以独立应用模式运行
- [ ] Service Worker 正常工作并缓存资源
- [ ] 页面刷新后游戏状态不丢失（如需要）
- [ ] 响应式设计在不同设备上正常显示

## 常见问题

### Q: PWA 无法安装
**A**:
- 确保使用 HTTPS 或 localhost（http:// 不能安装 PWA）
- 检查 manifest.json 是否正确加载
- 尝试清除浏览器缓存后重试

### Q: 离线模式无法运行
**A**:
- 确认 Service Worker 已激活
- 检查 Network 标签，确认资源从 Service Worker 加载
- 重新构建项目确保资源正确生成

### Q: 图标不显示
**A**:
- 清除浏览器缓存
- 检查图标文件是否存在（public/pwa-192x192.svg, public/pwa-512x512.svg）
- 确认 manifest.json 中的图标路径正确

## 性能验证

使用 Lighthouse 测试 PWA:
1. Chrome DevTools → **Lighthouse** 标签
2. 选择 **Progressive Web App** 类别
3. 点击 **Analyze page load**

**目标分数**:
- PWA: 90+
- Performance: 80+
- Best Practices: 90+

## 自动化测试（可选）

使用 Lighthouse CI:
```bash
npm install -g @lhci/cli
lhci autorun
```

配置文件 `lighthouserc.json`:
```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist"
    },
    "assert": {
      "preset": "lighthouse:recommended"
    }
  }
}
```

## 生产部署

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### GitHub Pages
1. 在 `vite.config.ts` 中配置 `base: '/your-repo/'`
2. 构建项目
3. 将 `dist` 目录推送到 `gh-pages` 分支
