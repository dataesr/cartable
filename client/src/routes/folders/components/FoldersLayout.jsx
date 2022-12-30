import { Breadcrumb, BreadcrumbItem, Container } from '@dataesr/react-dsfr';
import { Link, useParams, Outlet } from 'react-router-dom';
import { useFolders } from '../../../contexts/FoldersContext';

export default function FoldersLayout() {
  const folders = useFolders();
  const { id } = useParams();
  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem asLink={<Link to="/" />}>
          Mon cartable
        </BreadcrumbItem>
        {id && (
          <BreadcrumbItem>
            {folders.findById(id)?.name}
          </BreadcrumbItem>
        )}
      </Breadcrumb>
      <Outlet />
    </Container>
  );
}
