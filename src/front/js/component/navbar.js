import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Context } from '../store/appContext';


//este es el nabvar definitivo
export const Navbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { actions, store } = useContext(Context);

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    setIsExpanded(!isExpanded);
    actions.logout()
  }

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
      if (section){
        section.scrollIntoView({ behavior: "smooth"})
      }
      setIsExpanded
    
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src="https://res.cloudinary.com/drigqgirt/image/upload/v1725545065/z85szc7sniccil8xdega.png"
            alt="Logo"
            style={{ width: "85px", height: "80px" }}
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

          {/* Servicios */}
          <li className="nav-item">
              <a
                href="#services"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("services");
                }}
              >
                Services
              </a>
            </li>
            {/* Contact */}
            <li className="nav-item">
              <a
                href="#contact"
                className="nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection("contact");
                }}
              >
                Contact
              </a>


            </li>
             <li className="nav-item">
              <Link to="/dashboard" className="nav-link" onClick={toggleNavbar} >
                Dashboard
              </Link>
            </li>

            {store.auth === true ? (

              <li className="nav-item">
                <Link className="nav-link" to="/" onClick={handleLogout}>
                  Logout
                </Link>
              </li>) : (

              <li className="nav-item">
                <Link className="nav-link" to="/login" onClick={toggleNavbar}>
                  Login
                </Link>
              </li>
            )}

           
          </ul>
        </div>
      </div>
    </nav>
  );
};
