# V18.0 Beta review（仅开发预览）

650词，原589词字段和23组情景不变，四个图标字节一致。合并累计证据，更新61条记录。历史证据未全部重新查证。本轮剑桥词典复核 centralization、decentralization 英美音标及 broadbanding 英音（美音未提供）：https://dictionary.cambridge.org/dictionary/english/broadbanding；https://dictionary.cambridge.org/dictionary/chinese-simplified-english/集中 。

61词历史状态：{'部分组成词已核验（assignment）；完整术语待核验': 6, '部分组成词已核验（briefing）；完整术语待核验': 2, '未核验': 46, '部分组成词已核验（payroll）；完整术语待核验': 1, '仅完整词条英音已核验': 1, '组成词 Vesting 英音 ˈvestɪŋ；完整术语待核验': 1, '完整词条英美IPA已核验': 3, '组成词 Cohort: UK ˈkəʊ.hɔːt; US ˈkoʊ.hɔːrt；完整术语待核验': 1}。V17.10 48词历史清单附带，未关闭。未进行浏览器、试听、真机验收。仅 /hr-fluent-dev/ 部署，未修改线上。

## 实际测试
```
$ node audit.cjs
PASS 650 words, 48 additions, 23 scenarios, unique IDs, required fields, asset references
exit=0
$ node test-build-compat.cjs
PASS version manifest, HTML, updater, SW build identifiers match; refresh guard checks build and save status
exit=0
$ node test-isolation.cjs
PASS dev key and SW path guard
exit=0
$ node test-refresh-safety.cjs
PASS save failure blocks navigation; PASS save success permits navigation
exit=0
$ node --check app-v17-10.js
exit=0
$ node --check sw.js
exit=0
$ node --check update-v17-10.js
exit=0
```
