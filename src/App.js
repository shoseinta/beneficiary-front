import Login from './pages/LoginPage/Login';
import Home from './pages/HomePage/Home';
import './App.css';

import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
