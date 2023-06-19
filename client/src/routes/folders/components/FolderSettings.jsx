import { ButtonGroup, Col, Container, Icon, Modal, ModalContent, Row, Select, Text } from '@dataesr/react-dsfr';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../components/button';
import Error from '../../../components/errors';
import SearchBar from '../../../components/search-bar';
import { PageSpinner } from '../../../components/spinner';
import { useFolders } from '../../../contexts/FoldersContext';
import { useUsers } from '../../../contexts/UsersContext';
import useFetch from '../../../hooks/useFetch';
import { useNotice } from '../../../libs/notice';
import api from '../../../services/api';

export default function FolderSettings() {
  const { id } = useParams();
  const usersCtx = useUsers();
  const users = usersCtx.getAll();
  const folders = useFolders();
  const folder = folders.findById(id);
  const { notice } = useNotice();
  const navigate = useNavigate();
  const { data, isLoading, error } = useFetch(`/folders/${id}/permissions`);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const isPublic = (folder.access === 'public');
  const [selectedUser, setSelectedUser] = useState();
  const [permissions, setPermissions] = useState();
  useEffect(() => setPermissions(data), [data]);

  const handleAchiveSwitch = () => {
    setIsArchiveOpen(false);
    return api
      .patch(`/folders/${id}`, { isArchived: !folder.isArchived })
      .then(() => {
        notice({ type: 'success', content: 'Permission modifiée' });
        folders.reload();
        navigate('/classeurs');
      }).catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }));
  };

  const handleAccessSwitch = () => {
    setIsAccessOpen(false);
    const [newState, newStateLabel] = (folder.access === 'private') ? ['public', 'public'] : ['private', 'privé'];
    return api
      .patch(`/folders/${id}`, { access: newState })
      .then(() => {
        notice({ type: 'success', content: `Le classeur ${folder.name} est maintenant ${newStateLabel}` });
        folders.reload();
      }).catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }));
  };

  const handlePermissionUpdate = (body) => api
    .put(`/folders/${id}/permissions`, body)
    .then(() => {
      notice({ type: 'success', content: 'Permission modifiée' });
      setPermissions((prev) => {
        const otherPermissions = prev.filter((permission) => permission.userId !== body.userId);
        return [...otherPermissions, body];
      });
    }).catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }));

  const handlePermissionAdd = () => api
    .put(`/folders/${id}/permissions`, { userId: selectedUser._id, role: selectedUser.role || 'viewer' })
    .then(() => {
      notice({ type: 'success', content: 'Permission ajoutée' });
      setPermissions((prev) => {
        if (!prev) return [{ userId: selectedUser._id, role: selectedUser.role }];
        const otherPermissions = prev.filter((permission) => permission.userId !== selectedUser._id);
        return [...otherPermissions, { userId: selectedUser._id, role: selectedUser.role || 'viewer' }];
      });
      setSelectedUser(null);
    }).catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }));

  const handlePermissionDelete = (userId) => api
    .delete(`/folders/${id}/permissions/${userId}`)
    .then(() => {
      notice({ type: 'success', content: 'Permission supprimée' });
      setPermissions((prev) => {
        if (!prev) return [];
        const otherPermissions = prev.filter((permission) => permission.userId !== userId);
        return [...otherPermissions];
      });
    }).catch(() => notice({ type: 'error', content: 'Une erreur est survenue' }));

  if (isLoading || !usersCtx) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <Container fluid>
      <Row gutters>
        <Col n="12">
          <Text className="fr-mb-1v" size="lg" bold>{folder.name}</Text>
          <Text className="fr-mb-1v" size="xs">
            <i>
              classeur crée le
              {' '}
              {new Date(folder.createdAt)
                .toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' par '}
              {usersCtx?.findById(folder.createdBy)?.email}
            </i>
          </Text>
        </Col>
        {!isPublic && (
          <Col n="12">
            <hr />
            <Text className="fr-mb-2w" bold>
              <Icon name="ri-group-line" size="lg" />
              Utilisateurs ayant accès
            </Text>
            <Row gutters>
              <Col n="12">
                <SearchBar
                  placeholder="Ajouter un utilisateur"
                  onSelect={(user) => {
                    setSelectedUser({ _id: user._id, email: user.email });
                    setUserSearchQuery('');
                  }}
                  options={
                    users
                      .filter((user) => user.role !== 'admin')
                      .filter((user) => !permissions?.map((p) => p.userId).includes(user._id))
                      .filter((user) => user.email.includes(userSearchQuery)).slice(0, 10)
                  }
                  value={userSearchQuery}
                  onChange={(e) => { setUserSearchQuery(e.target.value); }}
                />
              </Col>
              {selectedUser && (
                <Col n="12" key={selectedUser._id} className="fr-p-2w ctbl-permission-bloc">
                  <Row spacing="mb-1w" alignItems="middle">
                    <Col n="8">
                      <Text className="fr-mb-0">
                        {selectedUser.email}
                      </Text>
                    </Col>
                    <Col n="4">
                      <Select
                        onChange={(e) => setSelectedUser((prev) => ({ ...prev, role: e.target.value }))}
                        selected={selectedUser?.role}
                        options={[
                          { label: 'Membre', value: 'viewer' },
                          { label: 'Editeur', value: 'editor' },
                          { label: 'Admin', value: 'admin' },
                        ]}
                      />
                    </Col>
                  </Row>
                  <hr />
                  <Row justifyContent="right">
                    <ButtonGroup size="sm" isInlineFrom="xs">
                      <Button onClick={handlePermissionAdd}>Ajouter une permission</Button>
                      <Button secondary onClick={() => setSelectedUser(null)}>Annuler</Button>
                    </ButtonGroup>
                  </Row>
                </Col>
              )}
              {
                (permissions?.length > 0)
                  ? permissions.map((permission) => (
                    <Col n="12" key={permission.userId} className="ctbl-line ctbl-line__item">
                      <Row alignItems="middle">
                        <Col n="8">
                          <Text className="fr-mb-0">
                            {usersCtx?.findById(permission.userId)?.email}
                          </Text>
                        </Col>
                        <Col n="3">
                          <Select
                            selected={permission.role}
                            onChange={(e) => handlePermissionUpdate({ userId: permission.userId, role: e.target.value })}
                            options={[
                              { label: 'Editeur', value: 'editor' },
                              { label: 'Membre', value: 'viewer' },
                              { label: 'Admin', value: 'admin' },
                            ]}
                          />
                        </Col>
                        <Col n="1">
                          <Row justifyContent="right">
                            <Button
                              tertiary
                              borderless
                              rounded
                              color="error"
                              icon="ri-delete-bin-line"
                              onClick={() => handlePermissionDelete(permission.userId)}
                            />
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  ))
                  : (
                    <Col n="12" className="fr-py-1w fr-px-1w">
                      <Text className="fr-mb-0" size="sm">
                        Seuls les administrateurs accèdent au classeur.
                      </Text>
                    </Col>
                  )
              }
            </Row>
          </Col>
        )}
        <Col n="12">
          <hr />
          <Text size="md" className="fr-mb-1v" bold>
            <Icon name={isPublic ? 'ri-lock-unlock-line' : 'ri-lock-line'} size="lg" />
            Classeur
            {' '}
            {isPublic ? 'public' : 'privé'}
          </Text>
          <Text size="xs">
            {
              isPublic
                ? "Ce classeur est public. Tous les utilisateurs disposant d'un compte peuvent télécharger les documents"
                : 'Ce classeur est privé. Seuls les utilisateurs ayant une permission peuvent télécharger les documents'
            }
          </Text>
          <ButtonGroup size="sm">
            <Button secondary onClick={() => setIsAccessOpen(true)}>
              Rendre le classeur
              {' '}
              {!isPublic ? 'public' : 'privé'}
            </Button>
          </ButtonGroup>
          <Modal size="sm" isOpen={isAccessOpen} hide={() => setIsAccessOpen(false)}>
            <ModalContent>
              <Text size="lg" bold>
                Etes vous sur de vouloir rendre le classeur
                {' '}
                {!isPublic ? 'public' : 'privé'}
                {' '}
                ?
              </Text>
              <ButtonGroup>
                <Button onClick={handleAccessSwitch}>
                  Oui, rendre le classeur
                  {' '}
                  {!isPublic ? 'public' : 'privé'}
                </Button>
                <Button secondary onClick={() => setIsAccessOpen(false)}>
                  Non, annuler
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        </Col>
        <Col n="12">
          <hr />
          <Text className="fr-mb-1v" size="md" bold>
            <Icon name="ri-archive-line" size="lg" />
            {folder.isArchived ? 'Classeur archivé' : 'Archiver le classeur'}
          </Text>
          <Text size="xs">
            Les classeurs archivés ne sont plus listés dans les classeurs disponibles.
          </Text>
          <ButtonGroup size="sm">
            <Button secondary color="error" onClick={() => setIsArchiveOpen(true)}>
              {folder.isArchived ? 'Restaurer' : 'Archiver'}
              {' '}
              le classeur
            </Button>
          </ButtonGroup>
          <Modal size="sm" isOpen={isArchiveOpen} hide={() => setIsArchiveOpen(false)}>
            <ModalContent>
              <Text size="lg" bold>
                Etes vous sur de vouloir
                {' '}
                {folder.isArchived ? 'restaurer' : 'archiver'}
                {' '}
                le classeur ?
              </Text>
              <ButtonGroup>
                <Button color="error" onClick={handleAchiveSwitch}>
                  Oui,
                  {' '}
                  {folder.isArchived ? 'restaurer' : 'archiver'}
                  {' '}
                  le classeur
                </Button>
                <Button secondary onClick={() => setIsArchiveOpen(false)}>
                  Non, annuler
                </Button>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}
