import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Home from './pages/HomePage/Home';
import NewRequest from './pages/NewRequest/NewRequest';
import Requests from './pages/Requests/Requests';
import Account from './pages/Account/Account';
import RequestDetail from './pages/RequestDetail/RequestDetail';
import withHamburger from './components/hamburger/withHamburger';

// Auth wrapper component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  const HomeWithHam = withHamburger(Home)
  const NewRequestWithHam = withHamburger(NewRequest)
  const RequestsWithHam = withHamburger(Requests)
  const AccountWithHam = withHamburger(Account)
  const RequestDetailWithHam = withHamburger(RequestDetail)
  return (
    <Routes>
      <Route path="/" element={
        <Login />
        } />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
              <HomeWithHam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/request-create"
        element={
          <ProtectedRoute>
            <NewRequestWithHam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requests"
        element={
          <ProtectedRoute>
            <RequestsWithHam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountWithHam />
          </ProtectedRoute>
        }
      />
      <Route
        path=":id/request-detail"
        element={
          <ProtectedRoute>
            <RequestDetailWithHam />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all route for unauthenticated access */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
