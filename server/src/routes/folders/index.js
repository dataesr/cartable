import express from 'express';
import { requireAuth, requireRoles } from '../../middlewares/rbac.middlewares';
import createFolder from './create-folder';
import listFolders from './list-folders';
import updateFolder from './update-folder';

const router = new express.Router();

router.route('/api/folders')
  .get(listFolders)
  .post([requireAuth, requireRoles(['admin']), createFolder]);

router.route('/api/folders/:id')
  .patch([requireAuth, requireRoles(['admin']), updateFolder]);
export default router;
