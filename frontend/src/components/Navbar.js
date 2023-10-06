import React from "react";
import logo from '/Users/skar3krow/react-projects/securauma/src/logo.png'

function NavBar() {
  return (
    <header>
      {/* <img className="logo" src={logo} alt="Henlo" /> */}
      <ul className="nav__links">
        <li>
          <a href="">About Us</a>
        </li>
        <li>
          <a href="">Emergency</a>
        </li>
        <li>
          <a href="">Partners</a>
        </li>
        <li>
          <a href="">Services</a>
        </li>
      </ul>
      <button>Contact Us</button>
    </header>
  );
}

export default NavBar;