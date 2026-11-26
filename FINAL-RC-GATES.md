# V18.0 Final RC preparation — NOT approved for production
Build: hr-fluent-v18-0-final-rc-gated-20261126

Changes: staging/dev paths enabled, production page and service worker gated, path-scoped update attempt key, original production storage key reserved; staging and dev retain their respective keys. Database unchanged from Beta Review; four icon files byte-identical. No online deployment.

Executed: node audit.cjs; node test-build-compat.cjs; node test-isolation.cjs; node test-refresh-safety.cjs; node --check for all three JS files. All exited 0. Isolation and refresh tests use mocked environments, not real browsers.

Language: 3/61 new entries have both IPA fields, 1 has UK only, 57 have neither. Historical dictionary evidence not independently reverified. V17.10 language gates remain open. No new dictionary verification, audio listening or real-device testing performed in this run.

Staging only: deploy runtime files to /hr-fluent-staging/ after backup. Old closeout-r3 worker may delete legacy hr-fluent-* caches on activation; new worker only cleans its path prefix. Production release requires a separate explicit gate removal after language and device acceptance. Do not overwrite production.
