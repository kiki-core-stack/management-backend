# management-backend 架構

總管理後台 API（`/api/admin/*`），在 base-backend（[docs/base-backend.md](./base-backend.md)）之上增加管理員、身分組與權限、email／sms、平台設定。框架核心見 [docs/auto-hono.md](./auto-hono.md)，共用規則（錯誤碼、多語系、權限）見 [pack docs](https://github.com/kiki-core-stack/pack/blob/main/docs/pack.md)。以下只說明本 repo 增加的部分。

## 啟動

1. 複製 `.env.development` 為 `.env.development.local`，填入 `ADMIN_AUTH_ORIGIN`（admin-frontend 的 origin）、金鑰（`AUTH_SECRET_ENCRYPTION_KEYS`、`COOKIE_SESSION_KEYS`，格式見檔內註解）與 ws.io-server 連線（`WS_IO_SERVER_BASE_URL`；`WS_IO_AUTH_KEY`、`WS_IO_INTROSPECTION_TOKEN` 須與 ws.io-server 的 `MANAGEMENT_BACKEND_AUTH_KEY`、`MANAGEMENT_BACKEND_API_INTROSPECTION_TOKEN` 相同，後者至少 32 bytes），並確認 `MONGODB_URI`（需 replica set）、`REDIS_URL`。正式環境的 `.env.production.local`（範例 `.env.production`，建置時複製進 image）需要 `COOKIE_SESSION_KEYS`；其餘由 main 的 compose 提供（`ADMIN_AUTH_ORIGIN`、`WS_IO_SERVER_BASE_URL` 為環境變數，秘密為 compose secret，值都寫在 main 的 `.env`）。
2. `bun run dev`。啟動時會建立預設管理員與平台設定（pack `init`）、檢查路由與權限的對應（見下方），並連線 ws.io-server。

系統初始化（pack `initializeSystem`）只由本服務執行，其他服務不執行：正式環境由 `docker-entrypoint.sh` 在啟動 supervisor 前以 `index.js --initialize-only` 執行一次，失敗則不啟動；workers（`--is-subprocess`）不執行；開發時由單一行程直接執行。

## 結構

- routes/api/admin/：總後台路由，依領域分資料夾。
  - CRUD 慣例：`list.get.ts`、`index.post.ts`（匯出 `jsonSchema`，有設定變體的服務商則匯出 `jsonSchemaShape`，供更新共用）、`[id]/index.put.ts`（見下方「更新」）、`[id]/index.delete.ts`、`[id]/enabled.patch.ts`（`{ enabled }`）。
  - `*.dev.ts` 只在開發環境載入，例如前端 codegen 使用的 `admin/permission/list.get.dev.ts`。
- routes/api/internal/ws-io/：ws.io-server 呼叫的內部路由（見 main 的 docs），gateway 不對外開放；以 `x-ws-io-introspection-token` 標頭比對 `WS_IO_INTROSPECTION_TOKEN`，不經平台 IP 存取規則。
- constants/：權限 catalog（`permissions/`）、admin realm（`admin/auth.ts`）、路由共用的 zod schema（`common-zod-schemas/`，自動匯入為 `commonZodSchemas`）。
- middlewares/：平台 IP 存取規則（只查 system scope，各 realm 驗證工作階段時另查自己的）、admin 工作階段驗證（設定 `ctx.adminId`）與權限檢查、內部路由的 token 檢查。
- libs/：admin auth 路由轉接、管理員權限快取（Redis versioned cache；變更管理員的身分組或刪除管理員時要清除該管理員的快取，更新身分組時要清除全部）、開發時的路由權限檢查。
- globals/：自動匯入的 helper（分頁、查詢參數、更新、`wsIoClient`）；刪除單筆資料直接用 `Model.findByRouteIdOrThrowNotFoundError(ctx)` 後 `deleteOne()`。
- setups/：`ctx.getAdmin()`，並啟用 pack 的 `findByRouteIdOrThrowNotFoundError`。
- types/route.ts：`RouteMeta` 的 `permission` 必填，並繼承 pack 的 `AuthRouteMeta`。

## 新增路由與權限

1. 在 `routes/api/admin/<領域>/` 新增路由檔，`defineRoute({ permission: adminPermissions.<...> })`；不需權限的寫 `'ignore'`。
2. 新權限加在 `constants/permissions/admin/<領域>.ts`：`label` 用 `permissionActionLabels` 或自訂的 `LocalizedMessages`；動作需要其他權限才能使用時寫 `requires`（同層動作名稱或其他節點的完整 key）。新領域另加檔案並列入 `admin/index.ts`。
3. 輸入驗證用 `apiValidator('json', schema)`；需要訊息的自訂規則用 `z.i18nIssue({...})`；多個路由共用的 schema 放進 `constants/common-zod-schemas/<領域>.ts`。
4. 前端重新跑 dev（或其產生腳本）取得新的權限與錯誤碼。

## 更新

PUT 路由以 `updatedAt` 防止同時編輯時互相覆蓋：

```ts
apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
async (ctx) => {
    const doc = await XxxModel.findByRouteIdOrThrowNotFoundError(ctx); // 404 與需要查資料的檢查
    const { updatedAt, ...data } = ctx.req.valid('json');
    await doc.assertUpdateIfNotModified(updatedAt, { $set: data });
}
```

`assertUpdateIfNotModified`（pack）在同一個 `updateOne` 比對 `updatedAt` 並寫入，資料已被他人修改或刪除時回 `conflict`；任何經由 mongoose 的寫入都會更新 `updatedAt`。mongoose 會略過 `undefined` 的欄位，所以清空選填欄位要用 `buildUpdateQuery(data, ['欄位'])` 產生 `$unset`；沒有要清空的欄位就直接 `{ $set: data }`。`PATCH /:id/enabled` 這類單一欄位設定不需要比對。

## 登入與身分驗證

使用 pack 的 auth（[pack docs/auth.md](https://github.com/kiki-core-stack/pack/blob/main/docs/auth.md)），本 repo 只定義 realm 與轉接路由：

- `adminAuthRealm`（`constants/admin/auth.ts`）：origin 取自 `ADMIN_AUTH_ORIGIN`；工作階段被撤銷時以 `wsIoClient` 通知 ws.io-server 讓對應連線登出。沒有寄送通道（`messenger`）：不支援驗證碼與未登入的重設密碼（未轉接 `passwordReset`；`verification/send-code` 回 `verificationCodeUnavailable`，補上 `messenger` 即可使用），變更密碼必須輸入目前密碼。
- 路由檔只有一行轉接，例如 `export default defineAdminAuthRoute(adminAuth.routes.logout)`；權限預設 `'ignore'`。
- 管理管理員安全性的路由（`routes/api/admin/admin/[id]/security/`，用 `defineAdminAuthManagementRoute`）需要 `admin.account.manageSecurity`，對象可以是自己；操作者需在自己的工作階段驗證身分；非 unrestricted 的管理員不能管理超級管理員（找不到時回 `notFound`）。
- 安全性紀錄列表（兩個 `security/event/list.get.ts`）是本 repo 自己的路由，查詢條件強制限定為目標管理員的事件。
- `profile` 回傳 `restricted`，前端據此在受限工作階段（需要雙重驗證但尚未綁定）只顯示綁定畫面。
- 管理端編輯管理員（`admin/[id]/index.put.ts`）變更密碼或停用時，以 `revokeAllAuthSessionsAround(adminAuthRealm, id, change)` 包住寫入，變更密碼另寫入 `PasswordReset` 事件（操作者為目前管理員）；只切換啟用狀態（`enabled.patch.ts`）停用時呼叫 `revokeAllAuthSessions(adminAuthRealm, id)`；刪除管理員時呼叫 `deleteAuthPrincipalData(adminAuthRealm, id)`。
- 自訂需要驗證身分的路由：在 `defineRoute` 的 meta 寫 `verification: '<操作名稱>'`（或以 `ctx` 產生帶目標 ID 的名稱），或在 handler 內呼叫 `adminAuth.assertVerification(ctx, operation)`。

## 新增身分

在 `constants/permissions/<principal>/` 建立該身分的權限 catalog，列入 `constants/permissions/index.ts` 的 `permissionCatalogs`；路由放在 `routes/api/<principal>/`。登入比照 admin：以 `defineAuthRealm` 定義 realm（scope 需有含 `auth` 區塊的平台設定）、`createHonoAuth` 取得綁定、在 `/api/<principal>/*` 的 route middleware 呼叫 `authenticate`，並轉接路由。需要驗證碼、未登入的重設密碼、無密碼帳號或外部身分登入時，見 pack `docs/auth.md` 的 `messenger`、`passwordReset` 路由與 `loginWithExternalIdentity`。
