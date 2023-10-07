import { Link } from "react-router-dom";
import React, { useState } from 'react';
import '../assets/login.css'

function Login() {
  const [contact, setContact] = useState({
      fname: "",
      lname: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setContact(prevValue => {
        if (name === "fname") {
            return {
                fname: value,
                lname: prevValue.lname,
                email: prevValue.email
            };
        } else if (name === "lname") {
            return {
                fname: prevValue.fname,
                lname: value,
                email: prevValue.email
            };
        } else if (name === "email") { // Change this condition to check for "email"
            return {
                fname: prevValue.fname,
                lname: prevValue.lname,
                email: value
            };
        }
    });
}

  return (
      <div className="container">
          <h1>
              Welcome {contact.fname} {contact.lname}
          </h1>
          <br/>
          
          <form className="form" >
              <input className="input"
                  onChange={handleChange}
                  value={contact.fname}
                  name="fname"
                  placeholder="First Name"
              />
              <input className="input"
                  onChange={handleChange}
                  value={contact.lname}
                  name="lname"
                  placeholder="Last Name"
              />
              <input className="input"
                  onChange={handleChange}
                  value={contact.email}
                  name="email"
                  placeholder="Email"
              />
              <input className="input" type="password" class="form-control" name="password" placeholder="Password" required="required" />
              <button className="ton"><Link to='/home'>Log In</Link></button>
          </form>
      </div>
  );
}

export default Login;