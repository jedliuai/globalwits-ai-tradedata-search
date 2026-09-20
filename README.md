# globalwits-ai-tradedata-search

**环球慧思贸易数据 AI 智能查询**：通过 Microsoft Edge 操作环球慧思 GTIS，完成登录后的贸易数据检索、全分页提取、严格产品筛选、汇率与含税价格计算，以及 Excel/文字交付。

## 适用场景

- 查询某个原料、产品或 HS 编码的近期进出口记录；
- 只保留满足盐型、无菌、级别、用途等严格条件的记录；
- 将美元单价按指定汇率折算成人民币，并计算含税价；
- 生成可追溯的 Excel 和逐条文字摘要。

## 用户何时需要操作

用户只在以下情况介入：

1. Edge 打开登录页后扫码或登录；
2. 完成 CAPTCHA、MFA 或设备风控确认；
3. 确认会消耗额度、积分或费用的导出；
4. 在查询口径确实无法从原请求判断时作出选择。

登录之后的搜索、翻页、筛选、计算和文件生成由 Skill 自动继续。

## 关键规则

- 浏览器只使用 Microsoft Edge，不启动 Chrome。
- 默认排除不确定记录。
- 先识别 `NO ESTERIL`、`NON-STERILE` 等否定语义，再判断“无菌”。
- 不把钙盐、氨丁三醇盐、成品制剂、实验室试剂或单位不可换算的数据混入目标原料。
- 不在仓库中保存账号、Cookie、Token、二维码、浏览器配置或查询结果。

## 安装

将仓库克隆到 Codex 的 skills 目录：

```powershell
git clone https://github.com/jedliuai/globalwits-ai-tradedata-search.git "$env:USERPROFILE\.codex\skills\globalwits-ai-tradedata-search"
```

重新打开 Codex 后，可显式调用：

```text
$globalwits-ai-tradedata-search 查询最近3个月磷霉素钠无菌原料的价格，汇率6.8，含税系数1.13，输出Excel。
```

## 本地验证

```powershell
npm test
python C:\Users\<用户>\.codex\skills\.system\skill-creator\scripts\quick_validate.py .
```

核心说明见 [SKILL.md](SKILL.md)，详细流程和用户介入节点位于 `references/`。
