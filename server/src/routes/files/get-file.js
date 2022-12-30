import Storage from '../../services/storage.service';

export default async function getFile(req, res) {
  const { id, fileName } = req.params;
  const file = await Storage.get(`${id}/${fileName}`);
  res.setHeader('content-type', file.ContentType);
  res.setHeader('content-length', file.ContentLength);
  file.Body.pipe(res);
}
