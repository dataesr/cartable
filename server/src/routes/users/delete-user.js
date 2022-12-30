import { ObjectId } from 'mongodb';
import { ServerError } from '../../errors';
import logger from '../../services/logger.service';
import { db } from '../../services/mongo.service';

export default async function deleteUser(req, res) {
  const { id } = req.params;
  const _id = new ObjectId(id);
  try {
    await db.collection('tokens').deleteMany({ userId: _id });
    await db.collection('folders').updateMany(
      { 'permissions.userId': _id },
      { $pull: { 'permissions.userId': _id } },
    );
    await db.collection('users').deleteOne({ _id });
  } catch (e) {
    logger.error(e);
    throw new ServerError();
  }
  res.status(204).json();
}
