import { ObjectId } from 'mongodb';
import { UnauthorizedError } from '../../errors';
import { db } from '../../services/mongo.service';

export default async function getMe(req, res) {
  const { _id } = req.currentUser;
  if (!_id) throw new UnauthorizedError();
  const resource = await db.collection('users').findOne(
    { _id: new ObjectId(_id) },
    { projection: {
      _id: 1,
      email: 1,
      role: 1,
      firstName: 1,
      lastName: 1,
      '2fa': 1,
      '2faPreferedMethod': 1,
      createdAt: 1,
      updatedAt: 1,
    } },
  );
  res.status(200).json(resource);
}
