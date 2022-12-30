import 'dotenv/config';
import path from 'path';
import YAML from 'yamljs';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import multer from 'multer';
import * as OAV from 'express-openapi-validator';
import { ObjectId } from 'mongodb';

import { handleErrors } from './middlewares/handle-errors.middlewares';
import { authenticate } from './middlewares/rbac.middlewares';
import authRoutes from './routes/auth';
import meRoutes from './routes/me';
import usersRoutes from './routes/users';
import foldersRoutes from './routes/folders';
import filesRoutes from './routes/files';
import permissionsRoutes from './routes/permissions';

const apiSpec = 'src/openapi/api.yml';
const apiDocument = YAML.load(apiSpec);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.disable('x-powered-by');
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] }));
}

app.get('/api/health', (req, res) => res.json({ ok: 1 }));
app.get('/docs/specs', (req, res) => { res.status(200).json(apiDocument); });

app.use(OAV.middleware({
  apiSpec,
  validateRequests: {
    removeAdditional: true,
  },
  validateResponses: true,
  fileUploader: { storage: multer.memoryStorage() },
  ignoreUndocumented: true,
  unknownFormats: ['mongo-objectid', 'email'],
  serDes: [{
    format: 'mongo-objectid',
    deserialize: (s) => new ObjectId(s),
    serialize: (o) => o.toString(),
  }],
}));

app.use(authenticate);

// API ROUTES
app.use(authRoutes);
app.use(meRoutes);
app.use(usersRoutes);
app.use(foldersRoutes);
app.use(filesRoutes);
app.use(permissionsRoutes);

// SERVE REACT BUILD
app.use(express.static(path.join(path.resolve(), 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(path.resolve(), 'dist/index.html'));
});

app.use(handleErrors);

export default app;
