import { ObjectId } from 'mongodb';
import { db } from '../../services/mongo.service';
import { ServerError } from '../../errors';

export default async function createFolder(req, res) {
  const { body } = req;
  const _id = new ObjectId();
  const data = {
    ...body,
    _id,
    createdBy: req.currentUser._id,
    createdAt: new Date(),
  };
  await db.collection('folders').insertOne(data);
  const folder = await db.collection('folders')
    .findOne(
      { _id },
      {
        projection: {
          _id: 1,
          name: 1,
          description: 1,
          createdAt: 1,
          updatedAt: 1,
          access: 1,
          isArchived: 1,
        },
      },
    )
    .catch(() => { throw new ServerError(); });
  res.status(201).json(folder);
}
