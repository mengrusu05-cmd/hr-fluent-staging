# HR Fluent V17.10 最终候选构建审校与测试报告

- 构建标识：`hr-fluent-v17-10-rc-language-20261126`
- 状态：**候选版；未通过全部发布门槛**
- 来源：本地已存在的 V17.10 final-audit-r1 实际源码。

## 实际修订
- 按剑桥词典核对 `orientation` 组成词的英美卷舌区别并更新审校说明；整短语未直接查证。
- 按剑桥词典 `insurance` 名词英美发音修订原先的音标。
- 核实 `contractor` 的英美重音差异并记录来源。
- 统一 HTML、版本清单、更新脚本、Service Worker 构建标识。
- 未修改词条 ID、词条数量、学习记录存储键、口语和情景数据，也未修改 Marketing Fluent。

## 自动化测试
- PASS — app-v17-10.js syntax
- PASS — update-v17-10.js syntax
- PASS — sw.js syntax
- PASS — audit.cjs：PASS 589 words, 48 additions, 23 scenarios, unique IDs, required fields, asset references
- PASS — test-refresh-safety.cjs：PASS save failure blocks navigation; PASS save success permits navigation
- PASS — test-build-compat.cjs：PASS version manifest, HTML, updater, SW build identifiers match; refresh guard checks build and save status
- PASS — 589 IDs/order/terms and 23 scenarios unchanged

## 语言审校证据与限制
- 新增词条总数：48；字段完整性：48/48。
- 本轮外部词典直接核对：contractor、insurance、orientation 三个词或组成词；不将其他45项标为权威词典核验通过。
- 已逐条导出48词的中文、短语、例句和对话字段供审校；字段齐全不等于翻译专业性终审通过。
- 多词短语的整条 IPA 通常由组成词组合，不能冒称词典直接给出。
- 没有进行真实音频试听、HTTPS PWA 或此构建的 iPhone 真机复测。
- 用户此前报告12/12真机通过属于先前构建，不自动适用于此候选包。

## 发布阻断项
1. 余下45项权威词典核验和48项逐句双语终审尚未取得逐条证据。
2. 本候选构建的美音播放、更新和数据保护需针对性真机复测。
3. 不得将本候选版标记为稳定正式发布。
