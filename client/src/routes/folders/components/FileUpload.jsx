import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { ButtonGroup, File, Icon, Modal, ModalContent, ModalFooter, ModalTitle, Row, Tag, TagGroup, Text } from '@dataesr/react-dsfr';
import { useState } from 'react';
import { useNotice } from '../../../libs/notice';
import Button from '../../../components/button';
import api from '../../../services/api';
import { Spinner } from '../../../components/spinner';

export default function FileUpload({ reload }) {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState();
  const [files, setFiles] = useState();
  const [filesErrors, setFilesErrors] = useState();
  const [isSending, setIsSending] = useState(false);
  const { notice } = useNotice();

  const uploadFiles = () => {
    setIsSending(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i += 1) {
      formData.append(`files[${i}]`, files[i]);
    }
    formData.append('files', files);
    api.post(`/folders/${id}/files`, formData, { 'Content-Type': 'multipart/form-data' })
      .then(() => { reload(); notice({ type: 'success', content: 'Fichier ajouté avec succès' }); })
      .catch((e) => setFilesErrors(e.message))
      .finally(() => setIsSending(false));
  };

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} size="lg" title="Ajouter un fichier" tertiary borderless rounded icon="ri-file-add-line" />
      <Modal size="sm" isOpen={isModalOpen} hide={() => { setFiles(null); setFilesErrors(null); setIsSending(false); setIsModalOpen(false); }}>
        <ModalTitle>Ajouter un fichier</ModalTitle>
        <ModalContent>
          <form>
            <File
              required
              label="Ajouter des fichiers"
              hint="Format acceptés csv, jpg, png, pdf, doc, docx, xls, xlsx, csv"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              multiple
              message={(filesErrors) ? "Une erreur est survenue à l'ajout des fichiers" : null}
              messageType={(filesErrors) ? 'error' : ''}
            />
            {(filesErrors) ? (
              <Text size="xs" className="fr-error-text">
                Une erreur est survenue à l'ajout des fichiers. Veuillez réessayer
                {' '}
                {filesErrors}
              </Text>
            ) : null}
            {(files && files?.length > 0) && (
              <Row spacing="mt-2w">
                <TagGroup>
                  {files.map((file) => (
                    <Tag key={file.name} onClick={() => { setFiles((prev) => prev.filter((f) => f.name !== file.name)); }}>
                      {file.name}
                      <Icon iconPosition="right" name="ri-close-line" />
                    </Tag>
                  ))}
                </TagGroup>
              </Row>
            )}
            {isSending && <Row alignItems="middle"><Spinner /></Row>}
          </form>
        </ModalContent>
        <ModalFooter>
          <ButtonGroup>
            <Button disabled={isSending || !files?.length} onClick={uploadFiles}>Enregistrer</Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
}

FileUpload.propTypes = {
  reload: PropTypes.func.isRequired,
};
