import { db } from '../../services/mongo.service';

export default async function listUsers(req, res) {
  const resource = await db.collection('users').find(
    {},
    {
      projection: {
        _id: 1,
        email: 1,
        role: 1,
        firstName: 1,
        lastName: 1,
        '2fa': 1,
        '2faPreferedMethod': 1,
        createdAt: 1,
        updatedAt: 1,
        status: 1,
      },
    },
  ).toArray();
  res.status(200).json(resource);
}
