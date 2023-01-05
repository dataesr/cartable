import Storage from '../../services/storage.service';

export default async function getFile(req, res) {
  const { id, fileName } = req.params;
  const url = await Storage.get(`${id}/${fileName}`);
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json({ location: url.replace('minio', 'localhost') });
  }
  return res.status(200).json({ location: url });
}
