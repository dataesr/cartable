import { ObjectId } from 'mongodb';
import { db } from '../../services/mongo.service';

export default async function updateFolder(req, res) {
  const { id } = req.params;
  const { body } = req;
  const data = {
    ...body,
    updatedBy: req.currentUser._id,
    updatedAt: new Date(),
  };
  await db.collection('folders').updateOne({ _id: new ObjectId(id) }, { $set: data });
  res.status(204).json();
}
