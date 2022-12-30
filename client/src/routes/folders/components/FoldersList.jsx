import {
  Badge,
  BadgeGroup,
  Col,
  Container,
  Row,
  Title,
} from '@dataesr/react-dsfr';
import { Link } from 'react-router-dom';
import { useFolders } from '../../../contexts/FoldersContext';
import useAuth from '../../../hooks/useAuth';
import CreateFolder from './CreateFolder';

export default function FoldersList() {
  const { viewer } = useAuth();
  const folders = useFolders();
  const data = folders.getAll();
  const publicFolders = data.filter((folder) => folder.access === 'public');
  const sharedFolders = data.filter((folder) => folder.access === 'private');

  return (
    <Container fluid>
      {(sharedFolders.length > 0) && (
        <>
          <Container fluid spacing="mb-3w">
            <Row alignItems="middle">
              <Title as="h2" look="h5" className="fr-mb-1v">
                {sharedFolders.length}
                {' '}
                classeur
                {(sharedFolders.length > 1) ? 's ' : ' '}
                partagé
                {(sharedFolders.length > 1) ? 's ' : ' '}
              </Title>
              {(viewer.role === 'admin') && <CreateFolder />}
            </Row>
          </Container>
          <Container fluid spacing="mb-5w">
            <Row gutters spacing="mb-5w">
              {sharedFolders.map((folder) => (
                <Col key={folder._id} n="12 sm-6 md-4 lg-3">
                  <div className="fr-card fr-card--sm fr-enlarge-link fr-card--shadow">
                    <div className="fr-card__body">
                      <div className="fr-card__content">
                        <h2 className="fr-card__title">
                          <Link to={folder._id}>
                            {folder.name}
                          </Link>
                        </h2>
                        {folder.description && <p className="fr-card__desc">{folder.description}</p>}
                        {folder.isArchived && (
                          <div className="fr-card__start">
                            <BadgeGroup>
                              <Badge text="Archivé" />
                            </BadgeGroup>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </>
      )}
      <Container fluid spacing="mb-3w">
        <Row alignItems="middle">
          <Title as="h2" look="h5" className="fr-mb-1v">
            {publicFolders.length}
            {' '}
            classeur
            {(publicFolders.length > 1) ? 's' : ''}
          </Title>
          {(viewer.role === 'admin') && <CreateFolder isPublic />}
        </Row>
      </Container>
      <Container fluid spacing="mb-5w">
        <Row gutters spacing="mb-5w">
          {publicFolders.map((folder) => (
            <Col key={folder._id} n="12 sm-6 md-4 lg-3">
              <div className="fr-card fr-card--sm fr-enlarge-link fr-card--shadow">
                <div className="fr-card__body">
                  <div className="fr-card__content">
                    <h2 className="fr-card__title">
                      <Link to={folder._id}>
                        {folder.name}
                      </Link>
                    </h2>
                    {folder.description && <p className="fr-card__desc">{folder.description}</p>}
                    {folder.isArchived && (
                      <div className="fr-card__start">
                        <BadgeGroup>
                          <Badge text="Archivé" />
                        </BadgeGroup>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
}
