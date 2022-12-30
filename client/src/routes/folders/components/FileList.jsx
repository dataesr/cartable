import PropTypes from 'prop-types';
import { Col, Container, Icon, Row, Text } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '../../../components/button';
import { Spinner } from '../../../components/spinner';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNotice } from '../../../libs/notice';
import api from '../../../services/api';

const dtOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const map = {
  image: ['jpg', 'png', 'jpeg'],
  texte: ['txt', 'md'],
  audio: ['mpeg', 'mp3'],
  video: ['mov'],
  pdf: ['pdf'],
  document: ['doc', 'docx', 'ods'],
  powerpoint: ['ppt'],
  excel: ['csv', 'xls', 'xlsx'],
  archive: ['zip', 'tar', 'rar', 'gz', 'tgz', 'bz2', 'jar', 'tbz', 'zipx', '7z', 'tlz', 'lzma', 'lz', 'txz', 'xz', 'tbz2'],
};

const mapping = {
  fichier: <Icon size="2x" className="fr-mr-3v" name="ri-file-fill" color="var(--grey-main-525)" />,
  image: <Icon size="2x" className="fr-mr-3v" name="ri-image-2-fill" color="var(--green-archipel-main-557)" />,
  texte: <Icon size="2x" className="fr-mr-3v" name="ri-file-text-fill" color="var(--grey-main-525)" />,
  audio: <Icon size="2x" className="fr-mr-3v" name="ri-mv-fill" color="var(--grey-main-525)" />,
  video: <Icon size="2x" className="fr-mr-3v" name="ri-video-fill" color="var(--grey-main-525)" />,
  pdf: <Icon size="2x" className="fr-mr-3v" name="ri-file-pdf-fill" color="var(--error-main-525)" />,
  document: <Icon size="2x" className="fr-mr-3v" name="ri-file-word-fill" color="var(--blue-ecume-main-400)" />,
  powerpoint: <Icon size="2x" className="fr-mr-3v" name="ri-file-ppt-fill" color="var(--grey-main-525)" />,
  excel: <Icon size="2x" className="fr-mr-3v" name="ri-file-excel-fill" color="var(--green-emeraude-main-632)" />,
  archive: <Icon size="2x" className="fr-mr-3v" name="ri-file-zip-fill" color="var(--yellow-tournesol-main-731)" />,
};

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

function getFileIconFromExtension(fileName) {
  const fileExtension = fileName.split('.').pop();
  const type = Object.entries(map)
    .map(([k, v]) => ([k, v.includes(fileExtension)]))
    .find((el) => el[1] === true)?.[0] || 'fichier';
  return mapping[type];
}

export default function FileList({ data }) {
  const { id } = useParams();
  const folders = useFolders();
  const currentFolder = folders.findById(id);
  const { notice } = useNotice();
  const [files, setFiles] = useState(data);
  const [isInAction, setisInAction] = useState();

  const handleDownloadFile = (folder, name) => {
    setisInAction(name);
    return api.get(`/folders/${folder}/files/${name}`, { Accept: '*' })
      .then(async (response) => new Blob([await response.blob()], { type: response.headers.get('content-type') }))
      .then((fileBlob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(fileBlob);
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }))
      .finally(() => setisInAction(null));
  };

  const handleDeleteFile = (folder, name) => {
    setisInAction(name);
    return api.delete(`/folders/${folder}/files/${name}`)
      .then(() => {
        notice({
          type: 'success',
          content: (
            <Text>
              Fichier
              {' '}
              <i>
                '
                {name}
                '
              </i>
              {' '}
              supprimé
            </Text>
          ),
        });
        setFiles((prev) => prev.filter((f) => f.name !== name));
      })
      .catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }))
      .finally(() => setisInAction(null));
  };

  if (!files?.length > 0) {
    return (
      <Container spacing="my-15w">
        <Row justifyContent="center">
          <Icon name="ri-folder-open-line" size="3x" />
        </Row>
        <Row spacing="mt-5w" justifyContent="center">
          <Text size="lg"><i>Aucun fichier dans ce classeur pour le moment.</i></Text>
        </Row>
      </Container>
    );
  }
  return (
    <Container fluid>
      <Row alignItems="middle">
        <Col n="12" className="ctbl-line fr-py-1v fr-px-1w">
          <Row alignItems="middle">
            <Col n="6"><Text size="sm" className="fr-mb-0" bold>Nom</Text></Col>
            <Col n="2"><Row justifyContent="right"><Text className="fr-mb-0" size="sm" bold>Dernière modification</Text></Row></Col>
            <Col n="2"><Row justifyContent="right"><Text size="sm" className="fr-mb-0" bold>Taille</Text></Row></Col>
            <Col n="2" />
          </Row>
        </Col>
        {files.map((file) => (
          <Col n="12" key={file.name} className="ctbl-line ctbl-line__item fr-py-1w fr-px-1w">
            <Row alignItems="middle">
              <Col n="6">
                <Text className="fr-mb-0" size="sm">
                  {getFileIconFromExtension(file.name)}
                  {file.name}
                </Text>
              </Col>
              <Col n="2"><Row justifyContent="right"><Text className="fr-mb-0" size="sm">{new Date(file.updatedAt).toLocaleDateString('fr-FR', dtOptions)}</Text></Row></Col>
              <Col n="2"><Row justifyContent="right"><Text className="fr-mb-0" size="sm">{formatBytes(file.size)}</Text></Row></Col>
              <Col n="2">
                <Row justifyContent="right">
                  {(isInAction !== file.name)
                    ? (
                      <>
                        <Button onClick={() => handleDownloadFile(file.folder, file.name)} tertiary rounded borderless title="Télécharger" icon="ri-download-2-line" />
                        {['admin'].includes(currentFolder.viewerRole) && (
                          <Button onClick={() => handleDeleteFile(file.folder, file.name)} tertiary rounded borderless color="error" title="Supprimer" icon="ri-delete-bin-line" />
                        )}
                      </>
                    )
                    : <Spinner />}
                </Row>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

FileList.propTypes = {
  data: PropTypes.object.isRequired,
};
