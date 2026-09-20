# 严格筛选规则

## 通用原则

将产品要求拆成若干“必须全部满足”的概念组。每个概念组可以有多种语言或拼写；一条记录需要在每个组内至少命中一个肯定词，同时不能命中任何排除词。

处理顺序：

1. 规范化大小写、重音符号、连字符和多余空格；
2. 检查明确否定表达；
3. 检查产品主体；
4. 检查盐型、无菌、级别、原料/制剂等限定词；
5. 检查单位和价格是否可比较；
6. 人工复核最终保留行。

否定表达优先级最高。含有 `ESTERIL` 的 `NO ESTERIL` 不能当作无菌；同理处理 `NON-STERILE`、`NOT STERILE`、`NONSTERILE` 和“非无菌”。

## 磷霉素钠无菌原料示例

必须同时满足：

- 产品主体：`FOSFOMYCIN`、`FOSFOMICINA`、`PHOSPHOMYCIN` 或可靠中文等价词；
- 钠盐：`SODIUM`、`SODICA`、`SODIO`、`SODIQUE`、`NATRIUM` 或“钠”；
- 无菌：`STERILE`、`ESTERIL`、`STERIL`、`ASEPTIC` 或“无菌”；
- 若用户要求原料：货描应支持 API、raw material、active ingredient、principio activo 等原料语义，或至少不能显示为成品制剂。

明确排除：

- `NO ESTERIL`、`NON-STERILE`、`NOT STERILE`、`NONSTERILE`、`非无菌`；
- `FOSFOMYCIN CALCIUM` 等不同盐型；
- `FOSFOMYCIN TROMETAMOL/TROMETHAMINE`，除非用户查询的就是该盐型；
- 片剂、颗粒剂、注射剂成品、口服液等成品制剂；
- 实验室试剂、标准品、小毫克包装；
- 只写 `FOSFOMYCIN`、未明确写钠盐和无菌的记录；
- 单价为零、数量为零、币种或单位无法确认的记录。

## 不确定记录

用户要求“拿不准直接移除”时，把不确定记录放入内部排除列表并记录简短原因，不要放入交付明细。只有用户明确要求复核边界样本时才单独输出它们。
