import express from 'express';
import { requireAuth, requireFolderPermissionRoles } from '../../middlewares/rbac.middlewares';
import addPermission from './add-permission';
import deletePermission from './delete-permission';
import getPermission from './get-permissions';

const router = new express.Router();

router.route('/api/folders/:id/permissions')
  .get([requireAuth, requireFolderPermissionRoles(['admin']), getPermission])
  .put([requireAuth, requireFolderPermissionRoles(['admin']), addPermission]);

router.route('/api/folders/:id/permissions/:userId')
  .delete([requireAuth, requireFolderPermissionRoles(['admin']), deletePermission]);

export default router;
