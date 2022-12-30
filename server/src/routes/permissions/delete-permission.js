import { ObjectId } from 'mongodb';
import { db } from '../../services/mongo.service';

export default async function deletePermmission(req, res) {
  const { id, userId } = req.params;
  await db.collection('folders')
    .updateOne(
      { _id: new ObjectId(id), 'permissions.userId': new ObjectId(userId) },
      { $pull: { permissions: { userId: new ObjectId(userId) } } },
    );
  res.status(204).json();
}
