import { Routes, Route } from 'react-router-dom';
import UsersLayout from './components/UsersLayout';
import UsersList from './components/UsersList';

export default function UsersRoutes() {
  return (
    <Routes>
      <Route element={<UsersLayout />}>
        <Route path="" element={<UsersList />} />
      </Route>
    </Routes>
  );
}
