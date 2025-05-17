// src/components/Navbar.js
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/request-create">New Request</Link>
        </li>
        <li>
          <Link to="/requests">Requests</Link>
        </li>
        <li>
          <Link to="/account">Account</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavigationBar;