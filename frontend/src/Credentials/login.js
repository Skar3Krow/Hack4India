import React, { useState } from 'react';

function Login() {
  const [contact, setContact] = useState({
      fname: "",
      lname: "",
  });

  function handleChange(event) {
      const {name, value} = event.target ;

      setContact(prevValue => {
          if (name === "fname"){
              return {
                  fname: value,
                  lname: prevValue.lname,
                  email: prevValue.email
              };
          }else if (name === "lname"){
              return {
                  fname: prevValue.fname,
                  lname: value,
                  email: prevValue.email
              };
          }
      });
  }

  return (
      <div className="container">
          <h1>
              Welcome {contact.fname} {contact.lname}
          </h1>
          <br />
          <form>
              <input
                  onChange={handleChange}
                  value={contact.fname}
                  name="fname"
                  placeholder="First Name"
              />
              <input
                  onChange={handleChange}
                  value={contact.lname}
                  name="lname"
                  placeholder="Last Name"
              />
              <input
                  onChange={handleChange}
                  value={contact.email}
                  name="email"
                  placeholder="Email"
              />
              <input type="password" class="form-control" name="password" placeholder="Password" required="required" />
              <button>Log in</button>
          </form>
      </div>
  );
}

export default Login;