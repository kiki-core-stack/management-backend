# management-backend 架構

總管理後台 API（`/api/admin/*`），在 base-backend（[docs/base-backend.md](./base-backend.md)）之上增加管理員、身分組與權限、email／sms、平台設定。框架核心見 [docs/auto-hono.md](./auto-hono.md)，共用規則（錯誤碼、多語系、權限）見 pack README。以下只說明本 repo 增加的部分。

## 啟動

1. 複製 `.env.development` 為 `.env.development.local`，填入金鑰（`ADMIN_AUTHENTICATION_SESSION_TOKEN_HMAC_KEY`、`COOKIE_SESSION_KEYS`，格式見檔內註解），並確認 `MONGODB_URI`（需 replica set）、`REDIS_URL`。
2. `bun run dev`。啟動時會建立預設管理員與平台設定（pack `init`），並檢查路由與權限的對應（見下方）。

## 結構

- routes/api/admin/：總後台路由，依領域分資料夾（`admin`、`auth`、`email`、`home`、`platform`、`profile`、`sms`）。
  - CRUD 慣例：`list.get.ts`、`index.post.ts`（匯出 `jsonSchema` 供更新共用）、`[id]/index.put.ts`（帶讀取時的 `updatedAt`，見下方「更新」）、`[id]/index.delete.ts`、`[id]/enabled.patch.ts`（`{ enabled }`）。
  - `*.dev.ts`：只在開發環境載入，例如前端 codegen 使用的 `admin/permission/list.get.dev.ts`。
- constants/permissions/：權限定義。
  - admin/：總後台的權限樹，每個領域一個檔案，在 `admin/index.ts` 以 `definePermissions` 組成 `adminPermissionCatalog`。
  - action.ts：共用的動作名稱（`permissionActionLabels`）。
  - index.ts：`permissionCatalogs`，以路由的身分段（`/api/<principal>/*`）為 key 彙整各身分的 catalog。
- middlewares/：
  - security/ip-access-policy.ts：IP 存取規則。
  - admin/index.ts：登入驗證（`noLoginRequired` 的路由可略過）。
  - admin/permission.ts：依路由 `meta.permission` 檢查權限。
- libs/：
  - admin/：登入流程、權限快取。
  - permission.ts：`checkRoutePermissionWiring`，開發時檢查路由權限都在對應身分的 catalog 內，並列出沒有路由使用的權限。
- globals/：自動匯入的 helper。
  - libs/update.ts：`notModifiedInputShape`（更新輸入的 `updatedAt`）、`buildUpdateQuery`（清空的選填欄位會 `$unset`）。
  - libs/validation.ts：`throwFieldValidationError`（需要查資料才能判斷的欄位錯誤）。
  - libs/model.ts、request.ts、response.ts：分頁、查詢參數解析與回應。
  - re-exports.ts：`adminPermissions`、`apiErrors`、`z` 等。
- setups/：`admin-context.ts`（`ctx.getAdmin()`）；`index.ts` 另啟用 pack 的 `findByRouteIdOrThrowNotFoundError`。
- types/route.ts：`RouteMeta` 擴充（`permission` 必填、`noLoginRequired`）。
- api-errors/：本 repo 的錯誤碼命名空間（`auth`、`common` 由 pack 提供）。

## 新增路由與權限

1. 在 `routes/api/admin/<領域>/` 新增路由檔，`defineRoute({ permission: adminPermissions.<...> })`；不需權限的寫 `'ignore'`。
2. 新權限加在 `constants/permissions/admin/<領域>.ts`：`label` 用 `permissionActionLabels` 或自訂的 `LocalizedMessages`；動作需要其他權限才能使用時寫 `requires`（同層動作名稱或其他節點的完整 key）。新領域另加檔案並列入 `admin/index.ts`。
3. 輸入驗證用 `apiValidator('json', schema)`；需要訊息的自訂規則用 `z.i18nIssue({...})`。
4. 前端重新跑 dev（或其產生腳本）取得新的權限與錯誤碼。

## 更新

PUT 路由以 `updatedAt` 防止同時編輯時互相覆蓋：

```ts
apiValidator('json', jsonSchema.extend(notModifiedInputShape)),
async (ctx) => {
    const doc = await XxxModel.findByRouteIdOrThrowNotFoundError(ctx); // 404 與需要查資料的檢查
    const { updatedAt, ...data } = ctx.req.valid('json');
    await doc.assertUpdateIfNotModified(updatedAt, buildUpdateQuery(data));
}
```

`assertUpdateIfNotModified`（pack）在同一個 `updateOne` 比對 `updatedAt` 並寫入，資料已被他人修改或刪除時回 `conflict`；任何經由 mongoose 的寫入都會更新 `updatedAt`。`PATCH /:id/enabled` 這類單一欄位設定不需要比對。

## 新增身分

在 `constants/permissions/<principal>/` 建立該身分的權限 catalog，列入 `constants/permissions/index.ts` 的 `permissionCatalogs`；路由放在 `routes/api/<principal>/`。登入與 session 的部分尚待 auth 重寫後補充。
