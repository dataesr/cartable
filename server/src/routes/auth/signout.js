import { db } from '../../services/mongo.service';

export default async function signout(req, res, next) {
  const { currentUser, userAgent } = req;
  await db.collection('tokens').deleteOne({ userId: currentUser.id, userAgent });
  res.status(204).json({ message: 'Vous êtes déconnecté.' });
  return next();
}
