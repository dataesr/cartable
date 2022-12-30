import PropTypes from 'prop-types';
import {
  ButtonGroup,
  Modal,
  ModalContent,
  ModalTitle,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../components/button';
import { useFolders } from '../../../contexts/FoldersContext';
import { useNotice } from '../../../libs/notice';
import api from '../../../services/api';

export default function CreateFolder({ isPublic }) {
  const { reload } = useFolders();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const { notice } = useNotice();

  const handleFolderCreation = (event) => {
    event.preventDefault();
    return api.post('/folders', { name: name.trim(), description: description.trim(), access: isPublic ? 'public' : 'private' })
      .then(() => { reload(); notice({ type: 'success', content: 'Classeur crée avec succès' }); })
      .catch(() => { notice({ type: 'error', content: "Une erreur s'est produite, si cette erreur persiste, contactez le support" }); })
      .finally(() => { setIsCreationModalOpen(false); });
  };

  return (
    <>
      <Button
        className="fr-ml-auto"
        size="sm"
        color="success"
        icon="ri-add-line"
        onClick={() => setIsCreationModalOpen(true)}
      >
        Nouveau
      </Button>
      <Modal size="sm" isOpen={isCreationModalOpen} hide={() => setIsCreationModalOpen(false)}>
        <ModalTitle>
          Créer un nouveau classeur
          {isPublic && ' public'}
        </ModalTitle>
        <ModalContent>
          <form onSubmit={handleFolderCreation}>
            <TextInput
              className="fr-mb-3w"
              required
              label="Nom du classeur"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextInput
              textarea
              className="fr-mb-3w"
              label="Description du classeur"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <ButtonGroup>
              <Button disabled={!name} type="submit" icon="ri-save-line">Créer le classeur</Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

CreateFolder.propTypes = {
  isPublic: PropTypes.bool,
};

CreateFolder.defaultProps = {
  isPublic: false,
};
