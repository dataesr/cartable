import { Breadcrumb, BreadcrumbItem, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import { Link, useParams, Outlet } from 'react-router-dom';
import { useUsers } from '../../../contexts/UsersContext';

export default function UsersLayout() {
  const users = useUsers();
  const { id } = useParams();
  return (
    <Container>
      <Breadcrumb>
        <BreadcrumbItem asLink={<Link to="/" />}>
          Cartable
        </BreadcrumbItem>
        {!id && (
          <BreadcrumbItem>
            Admin / Utilisateurs et permission
          </BreadcrumbItem>
        )}
        {id && (
          <BreadcrumbItem asLink={<Link to="/admin/utilisateurs" />}>
            Admin / Utilisateurs et permission
          </BreadcrumbItem>
        )}
        {id && (
          <BreadcrumbItem>
            {users?.findById(id)?.email}
          </BreadcrumbItem>
        )}
      </Breadcrumb>
      <Container fluid spacing="mt-5w mb-3w">
        <Row>
          <Title className="fr-mb-1v" as="h2" loog="h5">Utilisateurs et permissions</Title>
        </Row>
        <Row>
          <Text>Gérer les utilisateurs, leurs accès aux classeurs, leurs rôles et les nouvelles invitations</Text>
        </Row>
      </Container>
      <Outlet />
    </Container>
  );
}
