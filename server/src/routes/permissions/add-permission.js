import { ObjectId } from 'mongodb';
import { db } from '../../services/mongo.service';
import { BadRequestError, NotFoundError } from '../../errors';

export default async function addPermmission(req, res) {
  const { id } = req.params;
  const { userId, role = 'viewer' } = req.body;
  const userOid = new ObjectId(userId);
  const folderOid = new ObjectId(id);
  const userExists = await db.collection('users').findOne({ _id: userOid });
  const folderExists = await db.collection('folders').findOne({ _id: folderOid });
  if (!folderExists) throw new NotFoundError();
  if (!userExists) throw new BadRequestError('userId does not exist');
  const exists = await db.collection('folders').findOne({ _id: folderOid, 'permissions.userId': userOid });
  if (exists) {
    await db.collection('folders')
      .updateOne(
        { _id: folderOid, 'permissions.userId': userOid },
        { $set: { 'permissions.$': { userId: userOid, role } } },
      );
  } else {
    await db.collection('folders')
      .updateOne(
        { _id: folderOid },
        { $push: { permissions: { userId: userOid, role } } },
      );
  }
  res.status(204).json();
}
