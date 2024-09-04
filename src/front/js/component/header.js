import React from 'react'
import '../../styles/header.css'

const Header = () => {
  return (
    <div>
      <div className='header'>
        <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725483090/imgHeader_f7qvgk.png" className="img-fluid" alt="..." />
        <div className="title">
          <h1>THE ULTIMATE CONVENIENCE FOR BUSY PEOPLE</h1>
          <h3>Experience the Convenience of in-Home Barber Services</h3>
          <button>BOOK AN APPOINTMENT</button>
        </div>

        <div className="card">
          <div className="card-body row">
            <div className="card-item col-lg-4 col-md-6 col-12">
              <i className="fa-solid fa-location-dot"></i>
              <h2 className="card-title">ADDRESS</h2>
              <h3>Cl. Edison, 3, Chamartín, 28006 Madrid</h3>
            </div>
            <div className="card-item col-lg-4 col-md-6 col-12">
              <i className="fa-solid fa-phone-volume"></i>
              <h2 className="card-title">PHONE</h2>
              <h3>+34 606-66-66-66</h3>
              <h3>+34 966-66-66-66</h3>
            </div>
            <div className="card-item col-lg-4 col-md-12 col-12">
              <i className="fa-solid fa-clock"></i>
              <h2 className="card-title">HOURS</h2>
              <h3>Mon-Sat: 9am-8pm</h3>
              <h3>SUN: 9am-6pm</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header;