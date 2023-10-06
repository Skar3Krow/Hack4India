import React from "react";
import '../assets/navbar.css'
import SCard from './SCard'
import logo from '../assets/logo.png'
import { Link } from "react-router-dom";


function NavBar() {
  return (
    <header>
      <SCard/>
      <img className="logo" src={logo} alt="Henlo" />
      <div className="your">
      
      <h1 className="kal"><Link to='/'>Home</Link></h1>
      <h1 className="kal"><Link to='/Profile'>Your Profile</Link></h1>
      <button className="kal">Contact Us</button>
      </div>
        
    </header>
  );
}

export default NavBar;