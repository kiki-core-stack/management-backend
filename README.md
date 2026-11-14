# management-backend

KCS 的總管理後台 API（`/api/admin/*`）：管理員、身分組與權限、email／sms、平台設定。

- 框架架構：[docs/auto-hono.md](./docs/auto-hono.md)（由 auto-hono 合併而來）。
- 後端範本：[docs/base-backend.md](./docs/base-backend.md)（由 base-backend 合併而來）。
- 本 repo 增加的部分：[docs/management-backend.md](./docs/management-backend.md)。

下游 repo 以 `fetch-and-merge.sh` 合併本專案；自己的說明寫在新的檔案（例如 `docs/<repo>.md`），不修改上游的 docs，以免合併衝突。
