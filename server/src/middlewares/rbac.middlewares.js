import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { ForbiddenError, ServerError, UnauthorizedError } from '../errors';
import { db } from '../services/mongo.service';
import config from '../config';

const { jwtSecret } = config;

export async function authenticate(req, res, next) {
  const { authorization } = req.headers;
  req.currentUser = {};
  if (authorization) {
    try {
      const token = authorization.replace('Bearer ', '');
      const decodedToken = jwt.verify(token, jwtSecret);
      req.currentUser = decodedToken.user;
      req.currentUser._id = new ObjectId(decodedToken.user._id);
    } catch (e) {
      return next();
    }
  }
  return next();
}

export function requireAuth(req, res, next) {
  if (!req.path.startsWith('/api')) return next();
  if (['/api/signup', '/api/signin', '/api/tokens', '/api/passwordless', '/api/folders'].includes(req.path)) return next();
  if (!req.currentUser._id) {
    throw new UnauthorizedError('Vous devez être connecté');
  }
  if (req.currentUser.isDeleted) {
    throw new ForbiddenError('Utilisateur inactif');
  }
  if ((req.method !== 'GET') && (req.currentUser.role === 'viewer')) {
    throw new ForbiddenError('Droits insuffisants');
  }
  return next();
}

export function requireFolderPermissionRoles(roles) {
  return (req, res, next) => {
    const { id } = req.params;
    const allowed = db.collection('folders').findOne({
      $and: [
        { _id: id },
        {
          $or: [
            { 'permissions.userId': req.currentUser._id || '.', 'permissions.role': { $in: [roles] } },
            { createdBy: req.currentUser._id },
          ],
        },
      ],
    }).catch(() => { throw new ServerError(); });
    if (!allowed) throw new ForbiddenError();
    return next();
  };
}
export function requirePrivateFolderPermission(req, res, next) {
  const { id } = req.params;
  const allowed = db.collection('folders').findOne({
    $and: [
      { _id: id },
      {
        $or: [
          { access: { $in: (req.currentUser.role !== 'admin') ? ['public'] : ['private', 'public'] } },
          { 'permissions.userId': req.currentUser._id || '.' },
        ],
      },
    ],
  }).catch(() => { throw new ServerError(); });
  if (!allowed) throw new ForbiddenError();
  return next();
}

export function requireRoles(roles) {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser?.role)) {
      throw new ForbiddenError('Droits insuffisants');
    }
    return next();
  };
}
