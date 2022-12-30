import { db } from '../../services/mongo.service';

export default async function listFolders(req, res) {
  const query = (req.currentUser.role === 'admin')
    ? {} : {
      $and: [
        { isArchived: false },
        { $or: [{ access: 'public' }, { 'permissions.userId': req.currentUser._id || '.' }] },
      ],
    };
  const resource = await db.collection('folders').find(
    query,
    {
      projection: {
        _id: 1,
        name: 1,
        description: 1,
        createdAt: 1,
        createdBy: 1,
        updatedAt: 1,
        access: 1,
        isArchived: 1,
        permissions: 1,
        starredBy: 1,
      },
    },
  ).toArray();
  const data = resource.map((folder) => {
    const { permissions, starredBy, ...rest } = folder;
    const isStarred = starredBy?.includes(req.currentUser._id) || false;
    const permissionRole = permissions?.find((p) => p.userId.toString() === req.currentUser._id.toString())?.role || null;
    const viewerRole = (req.currentUser.role === 'admin') ? 'admin' : permissionRole;
    return { ...rest, isStarred, viewerRole };
  });
  res.status(200).json(data);
}
