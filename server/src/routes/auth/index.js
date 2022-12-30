import express from 'express';
import rateLimit from 'express-rate-limit';

import refreshAccessToken from './tokens';
import resetPassword from './passwordless';
import signout from './signout';
import signin from './signin';

const authRoutes = new express.Router();

const maxRequestsPerHour = (max) => rateLimit({
  windowMs: 60 * 60 * 1000,
  max,
  message: 'Trop de requêtes, essayez à nouveau dans une heure.',
});

authRoutes.post('/api/signout', [signout]);
authRoutes.post('/api/tokens', [refreshAccessToken]);
authRoutes.post('/api/passwordless', [maxRequestsPerHour(6), resetPassword]);
authRoutes.post('/api/signin', [maxRequestsPerHour(100), signin]);

export default authRoutes;
