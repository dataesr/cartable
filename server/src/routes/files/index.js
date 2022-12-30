import express from 'express';
import {
  requireFolderPermissionRoles,
  requirePrivateFolderPermission,
  requireAuth,
} from '../../middlewares/rbac.middlewares';
import createFile from './create-file';
import listFiles from './list-files';
import deleteFile from './delete-file';
import getFile from './get-file';

const router = new express.Router();

router.route('/api/folders/:id/files')
  .get([requirePrivateFolderPermission, listFiles])
  .post([requireAuth, requireFolderPermissionRoles(['editor', 'admin']), createFile]);

router.route('/api/folders/:id/files/:fileName')
  .get([requireAuth, requireFolderPermissionRoles(['viewer', 'editor', 'admin']), getFile])
  .delete([requireAuth, requireFolderPermissionRoles(['admin']), deleteFile]);

export default router;
