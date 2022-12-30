import { Routes, Route } from 'react-router-dom';
import FoldersLayout from './components/FoldersLayout';
import Folders from './components/Folder';
import FoldersList from './components/FoldersList';

export default function FoldersRoutes() {
  return (
    <Routes>
      <Route element={<FoldersLayout />}>
        <Route path="" element={<FoldersList />} />
        <Route path=":id" element={<Folders />} />
      </Route>
    </Routes>
  );
}
