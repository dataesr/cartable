import {
  Col,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  TextInput,
} from '@dataesr/react-dsfr';
import { useState } from 'react';
import Button from '../../../components/button';
import { useUsers } from '../../../contexts/UsersContext';
import { useNotice } from '../../../libs/notice';
import api from '../../../services/api';

export default function InviteUser() {
  const users = useUsers();
  const [email, setEmail] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const { notice } = useNotice();

  const handleInvites = (event) => {
    event.preventDefault();
    return api
      .post('/users', { email })
      .then((response) => { users.reload(); notice({ type: 'success', content: response.data.message }); })
      .catch(() => { notice({ type: 'error', content: "Une erreur s'est produite, si cette erreur persiste, contactez le support" }); })
      .finally(() => { setEmail(''); setIsInviteOpen(false); });
  };

  return (
    <>
      <Button className="fr-ml-auto" size="sm" color="success" icon="ri-user-add-line" onClick={() => setIsInviteOpen(true)}>Inviter</Button>
      <Modal size="md" isOpen={isInviteOpen} hide={() => setIsInviteOpen(false)}>
        <ModalTitle>Inviter un nouvel utilisateur</ModalTitle>
        <ModalContent>
          <form onSubmit={handleInvites}>
            <Row gutters>
              <Col n="12">
                <TextInput
                  required
                  label="Email"
                  hint="Veuillez entrer une adresse email vers laquelle envoyer l'invitation"
                  value={email || ''}
                  onChange={(e) => setEmail(e.target.value)}
                  // message={(showErrors && errors.documentTypeId) ? errors.documentTypeId : null}
                  // messageType={(showErrors && errors.documentTypeId) ? 'error' : ''}
                />
              </Col>
            </Row>
            <Row justifyContent="right" spacing="mt-4w">
              <Button type="submit" icon="ri-send-plane-2-line">Envoyer l'invitation</Button>
            </Row>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
