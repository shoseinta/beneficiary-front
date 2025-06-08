// src/components/Navbar.js
import { Link } from 'react-router-dom';
import home_nav from '../../media/icons/home_nav.svg'
import home_nav_active from '../../media/icons/home_nav_active.svg'
import creation_nav_active from '../../media/icons/creation_nav_active.svg'
import creation_nav from '../../media/icons/creation_nav.svg'
import account_nav_active from '../../media/icons/account_nav_active.svg'
import account_nav from '../../media/icons/account_nav.svg';
import requests_nav_active from '../../media/icons/requests_nav_active.svg'
import requests_nav from '../../media/icons/requests_nav.svg';
import { useState } from 'react';
import { useLookup } from '../../context/LookUpContext';

function NavigationBar({selected}) {
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link to="/home"  style={selected === 1?{color:"#185ea7"}:null}> 
            <div className="nav-icon"><img src={selected === 1?home_nav_active:home_nav} alt="" /></div> خانه
          </Link>
        </li>
        <li>
          <Link to="/request-create" style={selected === 2?{color:"#185ea7"}:null}>
            <div className="nav-icon"> <img src={selected === 2? creation_nav_active:creation_nav} alt="" /></div> ایجاد درخواست
          </Link>
        </li>
        <li>
          <Link to="/requests" style={selected === 3?{color:"#185ea7"}:null}>
            <div className="nav-icon"> <img src={selected === 3?requests_nav_active:requests_nav} alt="" /></div> سوابق درخواست
          </Link>
        </li>
        <li>
          <Link to="/account" style={selected === 4?{color:"#185ea7"}:null}> 
            <div className="nav-icon"><img src={selected === 4?account_nav_active:account_nav} alt="" /></div> حساب کاربری
          </Link>
        </li>
      </ul>
  </nav>
  );
}

export default NavigationBar;

