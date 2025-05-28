// src/components/Navbar.js
import { Link } from 'react-router-dom';
import home_nav from '../../media/icons/home_nav.svg'
import home_nav_active from '../../media/icons/home_nav_active.svg'
import creation_nav_active from '../../media/icons/creation_nav_active.svg'
import creation_nav from '../../media/icons/creation_nav.svg'
import account_nav from '../../media/icons/account_nav.svg'
import requests_nav from '../../media/icons/requests_nav.svg'
import { useState } from 'react';

function NavigationBar() {
  const [selected, setSelected] = useState(1)
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li onClick={() => setSelected(1)}>
          <Link to="/home" className={selected === 1?"active-nav":""}> 
            <div className="nav-icon"><img src={selected === 1?home_nav_active:home_nav} alt="" /></div> خانه
          </Link>
        </li>
        <li onClick={() => setSelected(2)}>
          <Link to="/request-create"  className={selected === 2?"active-nav":""}>
            <div className="nav-icon"> <img src={selected === 2? creation_nav_active:creation_nav} alt="" /></div> ایجاد درخواست
          </Link>
        </li>
        <li onClick={() => setSelected(3)}>
          <Link to="/requests" className={selected === 3?"active-nav":""}>
            <div className="nav-icon"> <img src={requests_nav} alt="" /></div> سوابق درخواست
          </Link>
        </li>
        <li onClick={() => setSelected(4)}>
          <Link to="/account" className={selected === 4?"active-nav":""}> 
            <div className="nav-icon"><img src={account_nav} alt="" /></div> حساب کاربری
          </Link>
        </li>
      </ul>
  </nav>
  );
}

export default NavigationBar;

