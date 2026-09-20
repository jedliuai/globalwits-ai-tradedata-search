# 维护与发布

本项目同时是公开产品入口和可安装的 Codex Skill。维护时优先保证真实能力、README 承诺、自动测试与 Release 四者一致。

## 本地验证

需要 Node.js 20 或更高版本。仓库不依赖第三方运行时包。

```powershell
npm test
npm run validate
npm run check
```

- `npm test` 验证筛选与价格计算的关键行为；
- `npm run validate` 检查 Skill 元数据、必要文件和文档相对链接；
- `npm run check` 依次执行上述两项。

若本机安装了 Codex 内置 `skill-creator`，发布前再运行它提供的 `quick_validate.py`，确认 Skill 结构满足最新规范。

## 修改筛选规则

新增产品、语言变体或排除规则时：

1. 先把业务语义写入 `references/screening-rules.md`；
2. 对可以确定性判断的部分更新 `scripts/filter_and_price.mjs`；
3. 为误纳入和误排除各补一个最小测试；
4. 确认 README 没有承诺脚本或浏览器流程尚未具备的能力。

不要用通用关键词覆盖专业判断。否定表达必须先于肯定关键词匹配，单位无法可靠换算时必须排除。

## 发布版本

面向用户的行为、安装方式或交付契约发生变化时创建 Release；只改拼写或内部注释不需要为“活跃度”单独发布。

Release 说明至少包含：

- 用户能感知的新能力或修复；
- 是否改变筛选或价格口径；
- 升级方式与已知边界；
- 对应测试状态。

版本号遵循语义化版本。需要可重复执行时，引用 Release 标签或完整 commit SHA。

## 长期可发现性

仓库 About、Topics、README 首屏和 Release 标题应保持同一定位：Globalwits GTIS 贸易数据查询、严格多语言产品筛选、价格换算和可追溯交付。只有实际能力发生变化时才调整关键词，避免为了搜索排名堆砌无关 Topics。
