import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; 


//este es el nabvar definitivo
export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="https://res.cloudinary.com/drigqgirt/image/upload/v1725545065/z85szc7sniccil8xdega.png"
            alt="Logo"
            style={{ width: "50px", height: "50px" }}
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isExpanded}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse justify-content-end ${isExpanded ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/services" onClick={toggleNavbar}>
                Services
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={toggleNavbar}>
                Contacts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login" onClick={toggleNavbar}>
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
