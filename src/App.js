import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Home from './pages/HomePage/Home';
import './App.css';
import NewRequest from './pages/NewRequest/NewRequest';
import Requests from './pages/Requests/Requests';
import Account from './pages/Account/Account';

// Auth wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-create"
        element={
          <ProtectedRoute>
            <NewRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <Requests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        }
      />
      {/* Catch-all route for unauthenticated access */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
