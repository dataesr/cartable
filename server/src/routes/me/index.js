import express from 'express';
import { requireAuth } from '../../middlewares/rbac.middlewares';
import getMe from './get-me';

const router = new express.Router();

router.route('/api/me')
  .get(requireAuth, getMe);

export default router;
