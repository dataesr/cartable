import jwt from 'jsonwebtoken';
import config from '../../config';
import { UnauthorizedError } from '../../errors';
import { db } from '../../services/mongo.service';

const { jwtSecret, accessTokenExpiresIn, refreshTokenExpiresIn } = config;

export default async function refreshAccessToken(req, res) {
  const userAgent = req.headers['user-agent'];
  const { body } = req;
  const { refreshToken: token } = body;
  jwt.verify(token, jwtSecret, (err) => {
    if (err) throw new UnauthorizedError('Token invalide');
  });
  const session = await db.collection('tokens').findOne({ refreshToken: token, userAgent });
  if (!session) throw new UnauthorizedError('Token invalide');
  const user = await db.collection('users').findOne(session.userId);
  const { _id, role, email } = user;
  const accessToken = jwt.sign({ user: { _id, email, role } }, jwtSecret, { expiresIn: accessTokenExpiresIn });
  const refreshToken = jwt.sign({ user: { _id, email, role } }, jwtSecret, { expiresIn: refreshTokenExpiresIn });
  const expireAt = new Date(jwt.verify(refreshToken, jwtSecret).exp * 1000);
  await db.collection('tokens').updateOne(
    { userId: _id, userAgent },
    { $set: { userId: _id, userAgent, refreshToken, expireAt } },
    { upsert: true },
  );
  res.status(200).json({ accessToken, refreshToken });
}
