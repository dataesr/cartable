import { useState } from 'react';
import {
  Badge,
  ButtonGroup,
  Col,
  Container,
  Icon,
  Modal,
  ModalContent,
  ModalTitle,
  Row,
  Select,
  Text,
} from '@dataesr/react-dsfr';
import Button from '../../../components/button';
import { useUsers } from '../../../contexts/UsersContext';
import { useNotice } from '../../../libs/notice';
import api from '../../../services/api';
import InviteUser from './InviteUser';

export default function UsersList() {
  const users = useUsers();
  const data = users.getAll();
  const { notice } = useNotice();
  const [isDeleteOpen, setIsDeleteOpen] = useState();
  const [isEditOpen, setIsEditOpen] = useState();
  const [userRole, setUserRole] = useState(null);

  const handleDeleteUser = (id) => api.delete(`/users/${id}`)
    .then(() => { users.reload(); notice({ type: 'success', content: 'Utilisateur supprimé' }); })
    .catch(() => { notice({ type: 'error', content: "Une erreur s'est produite, si cette erreur persiste, contactez le support" }); })
    .finally(() => { setIsDeleteOpen(null); });

  const handleUpdateUser = (id) => api.patch(`/users/${id}`, { role: userRole })
    .then(() => { users.reload(); notice({ type: 'success', content: 'Modifications enregistrées' }); })
    .catch(() => { notice({ type: 'error', content: "Une erreur s'est produite, si cette erreur persiste, contactez le support" }); })
    .finally(() => { setIsEditOpen(null); });

  return (
    <Container fluid>
      {/* <Container fluid>
        <Row spacing="mb-3w" gutters>
          <Col>
            <SearchBar
              size="md"
              placeholder="Rechercher un utilisateur par nom ou adress email"
              query={query}
              setQuery={setQuery}
            />
          </Col>
          <Col>
            <Button secondary icon="ri-filter-3-line">filtrer</Button>
          </Col>
        </Row>
      </Container> */}
      <Container fluid spacing="mb-3w">
        <Row alignItems="middle">
          <Text className="fr-mb-1v" size="lead" bold>
            {data.length}
            {' '}
            utilisateur
            {(data.length > 1) ? 's' : ''}
          </Text>
          <InviteUser />
        </Row>
      </Container>
      <Container fluid spacing="mb-5w">
        <Row alignItems="middle">
          <Col n="12" className="list-border fr-py-1v">
            <Row alignItems="middle">
              <Col n="3"><Text className="fr-mb-1v" bold>Email</Text></Col>
              <Col n="3"><Text className="fr-mb-1v" bold>Nom</Text></Col>
              <Col n="3"><Text className="fr-mb-1v" bold>Status</Text></Col>
              <Col n="2"><Text className="fr-mb-1v" bold>Role</Text></Col>
              <Col n="1" />
            </Row>
          </Col>
          {data.map((user) => (
            <Col n="12" key={user._id} className="list-border fr-py-2w">
              <Row spacing="fr-mb-2w" alignItems="middle">
                <Col n="3">{user.email}</Col>
                <Col n="3">{(user.firstName || user.lastName) ? `${user.firstName} ${user.lastName}`.trim() : <Text size="xs" className="fr-m-0"><i>Non renseigné</i></Text>}</Col>
                <Col n="3">
                  {(user.status === 'active') && (
                    <>
                      <Icon size="lg" name="ri-checkbox-circle-line" color="var(--success-main-525)" />
                      Actif
                      <br />
                      <Text size="xs" className="fr-m-0">
                        <i>
                          modifié le
                          {' '}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </i>
                      </Text>
                    </>
                  )}
                  {(user.status === 'pending') && (
                    <>
                      <Icon size="lg" name="ri-time-line" color="var(--purple-glycine-main-494)" />
                      En attente
                      <br />
                      <Text size="xs" className="fr-m-0">
                        <i>
                          Invitation envoyée le
                          {' '}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </i>
                      </Text>
                    </>
                  )}
                  {(user.status === 'deleted') && (
                    <>
                      <Icon size="lg" name="ri-close-circle-line" color="var(--error-main-525)" />
                      En attente
                      <br />
                      <Text size="xs" className="fr-m-0">
                        <i>
                          Invitation envoyée le
                          {' '}
                          {new Date(user.createdAt).toLocaleDateString()}
                        </i>
                      </Text>
                    </>
                  )}
                </Col>
                <Col n="2"><Badge text={user.role} /></Col>
                <Col n="1">
                  <Button onClick={() => { setUserRole(user.role); setIsEditOpen(user._id); }} title="Editer l'utilisateur" className="fr-ml-auto" rounded tertiary borderless icon="ri-edit-line" />
                  <Modal size="sm" isOpen={isEditOpen === user._id} hide={() => setIsEditOpen(null)}>
                    <ModalTitle>Editer le role</ModalTitle>
                    <ModalContent>
                      <form>
                        <Select
                          className="fr-mb-3w"
                          selected={userRole}
                          options={[{ label: 'Administrateur', value: 'admin' }, { label: 'Utilisateur', value: 'user' }]}
                          onChange={(e) => setUserRole(e.target.value)}
                        />
                      </form>
                      <ButtonGroup>
                        <Button onClick={() => handleUpdateUser(user._id)}>
                          Enregistrer
                        </Button>
                        <Button secondary onClick={() => setIsDeleteOpen(null)}>
                          Annuler
                        </Button>
                      </ButtonGroup>
                    </ModalContent>
                  </Modal>
                  {(user.role !== 'admin') && (
                    <>
                      <Button onClick={() => setIsDeleteOpen(user._id)} title="Supprimer l'utilisateur" color="error" tertiary rounded borderless icon="ri-delete-bin-line" />
                      <Modal size="sm" isOpen={isDeleteOpen === user._id} hide={() => setIsDeleteOpen(null)}>
                        <ModalContent>
                          <Text size="lg" bold>
                            Etes vous sur de vouloir supprimer
                            {' '}
                            {user.email}
                            {' '}
                            ?
                          </Text>
                          <ButtonGroup>
                            <Button color="error" onClick={() => handleDeleteUser(user._id)}>
                              Oui, supprimer l'utilisateur
                            </Button>
                            <Button secondary onClick={() => setIsDeleteOpen(null)}>
                              Non, annuler
                            </Button>
                          </ButtonGroup>
                        </ModalContent>
                      </Modal>
                    </>
                  )}
                </Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}
