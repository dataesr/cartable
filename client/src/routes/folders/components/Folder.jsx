import { useState } from 'react';
import { Col, Container, Row } from '@dataesr/react-dsfr';
import { useNavigate, useParams } from 'react-router-dom';
import FileUpload from './FileUpload';
import Button from '../../../components/button';
import useFetch from '../../../hooks/useFetch';
import useAuth from '../../../hooks/useAuth';
import FileList from './FileList';
import FolderSettings from './FolderSettings';
import { PageSpinner } from '../../../components/spinner';
import Error from '../../../components/errors';
import { useFolders } from '../../../contexts/FoldersContext';

export default function Folder() {
  const navigate = useNavigate();
  const { viewer } = useAuth();
  const { id } = useParams();
  const folders = useFolders();
  const currentFolder = folders.findById(id);
  const [settingsView, setSettingsView] = useState(false);
  const { data, isLoading, error, reload } = useFetch(`/folders/${id}/files`);
  if (isLoading) return <PageSpinner />;
  if (error) return <Error status={error} />;
  return (
    <Container fluid>
      <Row spacing="mb-2w" gutters>
        <Button
          className="fr-mr-auto"
          size="lg"
          title="Revenir au cartable"
          tertiary
          borderless
          rounded
          icon="ri-arrow-left-line"
          onClick={settingsView ? () => setSettingsView(false) : () => navigate('/classeurs')}
        />
        {(!settingsView && ['editor', 'admin'].includes(currentFolder.viewerRole)) && <FileUpload id={id} reload={reload} />}
        {(viewer.role === 'admin') && (
          <Button
            onClick={() => setSettingsView(!settingsView)}
            title="Gérer les utilisateurs du classeur"
            size="lg"
            tertiary
            borderless
            rounded
            icon={`ri-settings-4-${settingsView ? 'fill' : 'line'}`}
          />
        )}
      </Row>
      <Row justifyContent="center">
        <Col n="12" className={settingsView ? 'ctbl-folder-hidden' : 'ctbl-folder-list-visible'}>
          <FileList data={data} />
        </Col>
        <Col n="12 md-7" className={settingsView ? 'ctbl-folder-settings-visible' : 'ctbl-folder-hidden'}>
          {(viewer.role === 'admin') && <FolderSettings />}
        </Col>
      </Row>
    </Container>
  );
}
