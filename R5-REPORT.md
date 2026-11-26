# V17.10 R5 环境隔离测试
基于 Language R4 ZIP。正式站点保留 hr-fluent-v5；/hr-fluent-staging/ 使用 hr-fluent-v5:staging，不自动复制或删除旧共享数据。测试站升级后可能显示空记录，可从事先导出的测试备份恢复。缓存按 ROOT.pathname 命名，旧共享缓存不删除；新缓存使用 hrf-scope: 前缀，避开已知旧版 hr-fluent- 清理规则；旧共享缓存仍可能受旧 worker 影响。手动更新不再直接删除缓存。
实际执行：node --check 三个 JS；audit.cjs、test-refresh-safety.cjs、test-build-compat.cjs、test-isolation.cjs 均退出 0。隔离测试为 Node VM 模拟，不是真实浏览器。词库及图标未修改。词典核验本轮未执行，未部署，未真机复测。
