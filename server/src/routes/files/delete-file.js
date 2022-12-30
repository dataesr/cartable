import Storage from '../../services/storage.service';

export default async function deleteFile(req, res) {
  const { id, fileName } = req.params;
  await Storage.delete(`${id}/${fileName}`);
  res.status(204).json();
}
