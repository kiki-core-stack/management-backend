# management-backend 架構

## 啟動與初始化

系統初始化（pack `initializeSystem`）只由本服務執行，其他服務不執行：正式環境由 `docker-entrypoint.sh` 在啟動 supervisor 前以 `index.js --initialize-only` 執行一次，失敗則不啟動；workers（`--is-subprocess`）不執行；開發時由單一行程直接執行。

## 設計要點

- 圖片上傳回傳 `{ id, path }`。只存 File id 的欄位（例如列表縮圖）以 `/api/file/redirect/<id>` 顯示，301 轉到 `/files/<key>` 並可被瀏覽器快取；富文字等直接寫進內容的網址存回傳的 `path`，不經過 redirect。
- `routes/api/internal/ws-io/` 是 ws.io-server 呼叫的內部路由，gateway 不對外開放；以 `x-ws-io-introspection-token` 標頭比對 `WS_IO_INTROSPECTION_TOKEN`。
- 管理員權限快取（Redis versioned cache）：變更管理員的身分組或刪除管理員時要清除該管理員的快取，更新身分組時要清除全部。

## 新增路由與權限

1. 在 `routes/api/admin/<領域>/` 新增路由檔，`defineRoute({ permission: adminPermissions.<...> })`；不需權限的寫 `'ignore'`。
2. 新權限加在 `constants/permissions/admin/<領域>.ts`，動作需要其他權限才能使用時寫 `requires`；新領域另加檔案並列入 `admin/index.ts`。名稱加在 `i18n/messages/<locale>.ts` 的 `permissions.admin`，共用動作用檔案內的 `permissionActions`。
3. 輸入驗證用 `apiValidator('json', schema)`，自訂規則的訊息加在 `i18n/messages/<locale>.ts`；多個路由共用的 schema 放進 `constants/common-zod-schemas/<領域>.ts`。
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

本 repo 只定義 realm 與轉接路由，其餘是 pack 的 auth：

- `adminAuthRealm`（`constants/admin/auth.ts`）：origin 取自 `ADMIN_AUTH_ORIGIN`；工作階段被撤銷時以 `wsIoClient` 通知 ws.io-server 讓對應連線登出。沒有寄送通道（`messenger`）：不支援驗證碼與未登入的重設密碼（未轉接 `passwordReset`；`verification/send-code` 回 `verificationCodeUnavailable`，補上 `messenger` 即可使用），變更密碼必須輸入目前密碼。
- 管理管理員安全性的路由（`routes/api/admin/admin/[id]/security/`，用 `defineAdminAuthManagementRoute`）需要 `admin.account.manageSecurity`，對象可以是自己；操作者需在自己的工作階段驗證身分。
- 安全性紀錄列表（兩個 `security/event/list.get.ts`）是本 repo 自己的路由，查詢條件強制限定為目標管理員的事件。
- `profile` 回傳 `restricted`，前端據此在受限工作階段（需要雙重驗證但尚未綁定）只顯示綁定畫面。
- 管理端變更管理員密碼時另寫入 `PasswordReset` 事件，操作者為目前管理員。

## 新增身分

在 `constants/permissions/<principal>/` 建立該身分的權限 catalog，列入 `constants/permissions/index.ts` 的 `permissionCatalogs`；路由放在 `routes/api/<principal>/`。登入比照 admin：以 `defineAuthRealm` 定義 realm、`createHonoAuth` 取得綁定、在 `/api/<principal>/*` 的 route middleware 呼叫 `authenticate`，並轉接路由。
