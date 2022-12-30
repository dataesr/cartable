import Storage from '../../services/storage.service';
import { ServerError } from '../../errors';

export default async function getFile(req, res) {
  const { id, fileName } = req.params;
  const file = await Storage.get(`${id}/${fileName}`)
    .catch(() => { throw new ServerError(); });
  res.setHeader('content-type', file.ContentType);
  res.setHeader('content-length', file.ContentLength);
  file.Body.pipe(res);
}
