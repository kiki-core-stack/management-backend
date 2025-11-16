/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */

export type AdminPermission =
  | 'admin.create'
  | 'admin.delete'
  | 'admin.list'
  | 'admin.log.list'
  | 'admin.role.create'
  | 'admin.role.delete'
  | 'admin.role.list'
  | 'admin.role.update'
  | 'admin.toggle'
  | 'admin.update'
  | 'email.platform.create'
  | 'email.platform.delete'
  | 'email.platform.list'
  | 'email.platform.toggle'
  | 'email.platform.update'
  | 'email.sendRecord.list'
  | 'email.senderIdentity.create'
  | 'email.senderIdentity.delete'
  | 'email.senderIdentity.list'
  | 'email.senderIdentity.toggle'
  | 'email.senderIdentity.update'
  | 'home.dashboard.view';

export type AdminPermissionGroup =
  | 'admin'
  | 'admin.log'
  | 'admin.role'
  | 'email'
  | 'email.platform'
  | 'email.sendRecord'
  | 'email.senderIdentity'
  | 'home'
  | 'home.dashboard';
