import { ServerError } from '../../errors';
import Storage from '../../services/storage.service';

function formatFilesInfo({ Key: key, LastModified: updatedAt, Size: size }) {
  const [folder, name] = key.split('/');
  return { folder, name, updatedAt, size, type: 'file' };
}

export default async function listFiles(req, res) {
  const { id } = req.params;
  const { Contents: list } = await Storage.list(`${id}/`)
    .catch(() => { throw new ServerError('Une erreur est survenue'); });
  if (list) {
    const result = list.map((element) => formatFilesInfo(element));
    res.status(200).json(result);
  } else {
    res.status(200).json([]);
  }
}
