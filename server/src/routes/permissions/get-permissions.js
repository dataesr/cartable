import { ObjectId } from 'mongodb';
import { db } from '../../services/mongo.service';
import { NotFoundError } from '../../errors';

export default async function getPermmissions(req, res) {
  const { id } = req.params;
  const folder = await db.collection('folders').findOne({ _id: new ObjectId(id) });
  if (!folder) throw new NotFoundError();
  res.status(200).json(folder.permissions || []);
}
