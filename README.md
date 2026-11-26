# management-backend

KCS 的總管理後台 API（`/api/admin/*`）：管理員、身分組與權限、email／sms、平台設定。

- 框架架構：[docs/auto-hono](./docs/auto-hono/README.md)（由 auto-hono 合併而來）。
- 後端範本：[docs/kcs/base-backend.md](./docs/kcs/base-backend.md)（由 base-backend 合併而來）。
- 本 repo 增加的部分：[docs/kcs/management-backend.md](./docs/kcs/management-backend.md)。

下游 repo 以 `fetch-and-merge.sh` 合併本專案；自己的說明寫在 `docs/<專案名>/`，不修改上游的 docs，以免合併衝突。
