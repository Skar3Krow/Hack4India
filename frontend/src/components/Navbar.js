import React from "react";
import '../assets/navbar.css'
import SCard from './SCard'
import logo from '../assets/logo.png'

function NavBar() {
  return (
    <header>
      <SCard/>
      <img className="logo" src={logo} alt="Henlo" />
      
      <ul className="nav__links">
      <li>
          <a href="">Your Profile</a>
      </li>
      <button>Contact Us</button>
      </ul>

        
    </header>
  );
}

export default NavBar;