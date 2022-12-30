import logger from '../../services/logger.service';
import Storage from '../../services/storage.service';
import { BadRequestError, ServerError } from '../../errors';

export default async function createFile(req, res) {
  const { id } = req.params;
  if (!req.files || !req.files.length) { throw new BadRequestError('No file found'); }
  const promises = req.files.map(
    (file) => Storage.put(`${id}/${Buffer.from(file.originalname, 'latin1').toString('utf-8')}`, file.buffer, file.mimetype),
  );
  await Promise.all(promises).catch((e) => { logger.error(e); throw new ServerError('Cannot upload files'); });
  res.status(201).json({});
}
