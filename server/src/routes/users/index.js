import express from 'express';
import { requireAuth, requireRoles } from '../../middlewares/rbac.middlewares';
import inviteUser from './invite-user';
import listUsers from './list-users';
import deleteUser from './delete-user';
import updateUser from './update-user';

const router = new express.Router();

router.route('/api/users')
  .get([requireAuth, requireRoles(['admin']), listUsers])
  .post([requireAuth, requireRoles(['admin']), inviteUser]);

router.route('/api/users/:id')
  .patch([requireAuth, requireRoles(['admin']), updateUser])
  .delete([requireAuth, requireRoles(['admin']), deleteUser]);

export default router;
