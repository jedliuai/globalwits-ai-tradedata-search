> **专业Chatgpt代充：[aishopvip.com](https://aishopvip.com)**
> 环球慧思开通会员，请加微信：aasexgirl

<div align="center">

<h1>环球慧思贸易数据 AI 智能查询</h1>

<p><strong>把一句查询需求，变成经过严格筛选、价格换算且可追溯的贸易数据结果。</strong></p>

<p>
  面向环球慧思 Globalwits GTIS 的 Codex Skill<br>
  Microsoft Edge 自动化 · 多语言货描筛选 · 进出口价格分析 · Excel 交付
</p>

<p>
  <a href="https://github.com/jedliuai/globalwits-ai-tradedata-search/releases/latest"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/jedliuai/globalwits-ai-tradedata-search?display_name=tag&style=flat-square&color=7c3aed"></a>
  <a href="https://github.com/jedliuai/globalwits-ai-tradedata-search/actions/workflows/validate.yml"><img alt="Validation" src="https://img.shields.io/github/actions/workflow/status/jedliuai/globalwits-ai-tradedata-search/validate.yml?branch=main&style=flat-square&label=validation"></a>
  <a href="https://github.com/jedliuai/globalwits-ai-tradedata-search"><img alt="Codex Skill" src="https://img.shields.io/badge/Codex-Skill-111827?style=flat-square"></a>
  <img alt="Microsoft Edge only" src="https://img.shields.io/badge/browser-Microsoft%20Edge-0ea5e9?style=flat-square">
</p>

<p>
  <a href="#quick-start">三步开始</a> ·
  <a href="#results">结果示例</a> ·
  <a href="#trust">可信与边界</a> ·
  <a href="#docs">使用文档</a>
</p>

</div>

---

你提出产品、时间范围和价格口径；登录时扫码一次；其余搜索、翻页、去重、筛选、换算和交付由 Skill 继续完成。它适合药品原料、化工品等对名称、盐型、级别或用途要求严格的海关与进出口贸易数据查询。

## 最值得用它的四个理由

- **先扩大召回，再严格收口。** 自动补查英文、西语、葡语和历史拼写，同时要求每条保留记录满足全部限定条件，减少“搜不到”和“搜得太杂”这两类常见问题。
- **理解否定语义，而不只是命中关键词。** `NO ESTERIL` 虽然包含 `ESTERIL`，仍会被识别为“非无菌”；不同盐型、成品制剂、试剂和不可换算单位也会按规则排除。
- **结果能复核，不是黑盒摘要。** 保留原始货描、国家、日期、公司、数量、单位、来源与筛选备注；按需生成公式驱动的 Excel 和逐条文字结果。
- **只在必须时打断你。** 扫码登录、验证码/多因素认证、可能扣费的导出和真正改变查询口径的选择由用户完成，其余步骤自动继续。

<a id="quick-start"></a>

## 三步开始

需要：Codex、Microsoft Edge、可访问环球慧思 GTIS 的账号，以及本机可运行的 Node.js / `npx`。

**1. 安装 Skill**

```powershell
git clone https://github.com/jedliuai/globalwits-ai-tradedata-search.git "$env:USERPROFILE\.codex\skills\globalwits-ai-tradedata-search"
```

**2. 重新打开 Codex，直接描述结果**

```text
$globalwits-ai-tradedata-search 查询最近3个月磷霉素钠无菌原料的价格，
汇率6.8，含税系数1.13，拿不准的直接移除，输出Excel和逐条文字结果。
```

**3. Edge 打开登录页后扫码**

登录完成即可交回给 Codex。若页面出现验证码、多因素认证或付费导出确认，按提示再介入一次；无需自己填写搜索条件或逐页复制数据。

> 首次使用想看完整说明？从 [5 分钟上手指南](docs/GETTING_STARTED.md) 开始。

<a id="results"></a>

## 你会拿到什么

一份可追溯的明细表，以及符合指定句式的结果。例如，按汇率 `6.8`、含税系数 `1.13` 计算：

```text
2026年8月印度出口印度尼西亚，页面美金单价280美元/kg，
折合人民币1904元/kg，含税人民币2151.52元/kg，数量25kg。
```

只有来源字段或数据说明能够支持 FOB 时，结果才标注为 FOB；否则保留“页面美金单价”，避免把价格口径写得比证据更确定。

<a id="trust"></a>

## 可信与边界

- **可验证：** 仓库内的确定性测试覆盖正常纳入、`NO ESTERIL` 否定优先和非公斤单位排除；每次推送都会运行自动验证。
- **可追溯：** 查询周期、搜索词、筛选口径、汇率、含税系数、数据源和排除原因随结果交付。
- **账号安全：** Skill 不索取或保存密码、Cookie、Token、二维码和浏览器配置，也不绕过 CAPTCHA、MFA、访问权限、额度或付费限制。
- **能力边界：** 需要用户拥有可用的环球慧思账号；站点字段、可见国家和数据月份取决于账号权限与当时的数据源。

<a id="docs"></a>

## 文档与维护

- [5 分钟上手指南](docs/GETTING_STARTED.md)：安装、第一次查询、升级和常见阻塞点。
- [Skill 执行契约](SKILL.md)：自动化必须遵守的安全边界与交付标准。
- [筛选规则](references/screening-rules.md) 与 [字段/价格口径](references/field-map.md)：判断一条记录为什么保留或移除。
- [维护与发布](docs/MAINTENANCE.md)：测试、版本与元数据维护方式。

## 关注与引用

如果它帮你省下了逐页复制和人工排错的时间，可以 [Star 收藏](https://github.com/jedliuai/globalwits-ai-tradedata-search)、Watch 版本更新，或把仓库分享给需要做进出口价格与供应链研究的人。

反馈与真实案例请提交到 [GitHub Issues](https://github.com/jedliuai/globalwits-ai-tradedata-search/issues)。需要固定复现能力时，请引用具体 [Release](https://github.com/jedliuai/globalwits-ai-tradedata-search/releases) 或 commit，而不是只写“最新版”。

由 [jedliuai](https://github.com/jedliuai) 持续维护。

<sub><strong>English overview:</strong> A Codex skill for authenticated Globalwits GTIS trade-data search, customs and import-export research, multilingual product screening, price normalization, and auditable Excel delivery through Microsoft Edge.</sub>
