import { ObjectId } from 'mongodb';
import { ServerError } from '../../errors';
import { db } from '../../services/mongo.service';

export default async function updateUser(req, res) {
  const { id } = req.params;
  const { body } = req;
  await db.collection('users')
    .updateOne({ _id: new ObjectId(id) }, { $set: { ...body } })
    .catch(() => { throw new ServerError(); });
  res.status(204).json();
}
