import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import UsersPage from './pages/Users';

export default function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="*" element={<Navigate to="/users" replace />} />
      </Route>
    </Routes>
  );
}
