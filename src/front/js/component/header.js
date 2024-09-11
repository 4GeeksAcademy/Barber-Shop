import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/header.css';

const Header = () => {
  return (
    <div>
      <div className='header'>
        <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725483090/imgHeader_f7qvgk.png" className="img-fluid-header" alt="..." />
        <div className="titleheader">
          <h1 className='display-1 fw-bold'>THE ULTIMATE CONVENIENCE FOR BUSY PEOPLE</h1>
          <h3>Experience the Convenience of in-Home Barber Services</h3>
          <Link to="/book-appointment"> {/* Link para redirigir a BookAppointment */}
            <button>BOOK AN APPOINTMENT</button>
          </Link>
        </div>
        <div className="cardHeader">
          <div className="card" style={{width: "100%"}}>
            <div className="card-body-header row">
              <div className="card-item col-lg-4 col-md-6 col-12">
                <i className="fa-solid fa-location-dot"></i>
                <h2 className='card-title-Header'>ADDRESS</h2>
                <h3>Cl. Edison, 3, Chamartín, 28006 Madrid</h3>
              </div>
              <div className="card-item col-lg-4 col-md-6 col-12">
                <i className="fa-solid fa-phone-volume"></i>
                <h2 className='card-title-Header'>PHONE</h2>
                <h3>+34 606-66-66-66</h3>
                <h3>+34 966-66-66-66</h3>
              </div>
              <div className="card-item col-lg-4 col-md-12 col-12">
                <i className="fa-solid fa-clock"></i>
                <h2 className='card-title-Header'>HOURS</h2>
                <h3>Mon-Sat: 9am-8pm</h3>
                <h3>SUN: 9am-6pm</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;
