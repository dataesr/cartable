import logger from '../../services/logger.service';
import Storage from '../../services/storage.service';
import { ServerError } from '../../errors';

export default async function deleteFile(req, res) {
  const { id, fileName } = req.params;
  await Storage.delete(`${id}/${fileName}`)
    .catch((e) => { logger.error(e); throw new ServerError('Cannot delete file'); });
  res.status(204).json();
}
