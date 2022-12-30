import {
  Route,
  Navigate,
  Outlet,
  Routes,
} from 'react-router-dom';

import Layout from './layout';
import SignIn from './routes/signin';
import SignUp from './routes/signup';
import Passwordless from './routes/passwordless';

import useAuth from './hooks/useAuth';
import Users from './routes/users';
import Folders from './routes/folders';

function VisitorRoute() {
  const { viewer } = useAuth();
  if (!viewer._id) return <Outlet />;
  return <Navigate to="/" />;
}

function AdminRoute() {
  const { viewer } = useAuth();
  if (viewer.role === 'admin') return <Outlet />;
  return <Navigate to="/" />;
}

export default function RootRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/classeurs" />} />
        <Route path="classeurs/*" element={<Folders />} />

        <Route path="admin" element={<AdminRoute />}>
          <Route path="utilisateurs/*" element={<Users />} />
        </Route>

        <Route element={<VisitorRoute />}>
          <Route path="se-connecter" element={<SignIn />} />
          <Route path="mot-de-passe-oublie" element={<Passwordless firstConnexion={false} />} />
          <Route path="activer-mon-compte" element={<SignUp firstConnexion />} />
        </Route>
      </Route>
    </Routes>
  );
}
