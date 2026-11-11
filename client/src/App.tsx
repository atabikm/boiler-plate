import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './features/auth/LoginPage';
import AppLayout from './layout/AppLayout';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="*" element={<h1>Dashboard</h1>} />
                    </Route>
                </Route>
                <Route path="*" element={<h1>404 - Halaman Tidak Ditemukan</h1>} />
            </Routes>
        </Router>
    );
}
