import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const services = [
    { id: 1, name: 'Haircut - Premier Stylist', price: 15.00, duration: '1h' },
    { id: 2, name: 'Haircut - Top Stylist', price: 18.00, duration: '1,25h' },
    { id: 3, name: 'Salon Director Cut', price: 20.00, duration: '1,5h' },
    { id: 4, name: 'Vurve Director Cut', price: 17.00, duration: '1h' },
    { id: 5, name: 'Hair Trim', price: 14.00, duration: '1h' },
    { id: 6, name: 'Kids Cut (Below 5 years)', price: 11.00, duration: '0,5' }
  ];
  
  const BookAppointment_Services = () => {
    const [selectedService, setSelectedService] = useState(null);
  
    return (
      <div className="container mt-5" style={{ paddingBottom: '80px' }}> {/* Agregado padding-bottom */}
        <div className="row">
          {/* Lista de Servicios */}
          <div className="col-md-8">
            <h3>Step 1 of 3</h3>
            <h2>Select Services</h2>
            <ul className="list-group">
              {services.map(service => (
                <li
                  key={service.id}
                  className={`list-group-item d-flex justify-content-between align-items-center`}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: selectedService === service.id ? '#fff9e6' : '',
                    border: selectedService === service.id ? '1px solid #FFD700' : '',
                    fontSize: '1.2rem'
                  }}
                  onClick={() => setSelectedService(service.id)}
                >
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center">
                      {selectedService === service.id && (
                        <i className="fa-solid fa-circle-check me-2" style={{ color: '#FFD700', fontSize: '1.5rem' }}></i>
                      )}
                      {service.name}
                    </div>
                    <div className="d-flex align-items-center mt-1" style={{ fontSize: '0.9rem' }}>
                      <i className="fa-solid fa-clock-rotate-left me-2" style={{ color: '#6c757d', fontSize: '1rem' }}></i>
                      {service.duration}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-secondary me-3">
                      EUR {service.price.toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
  
          {/* Resumen del Servicio */}
          <div className="col-md-4">
            <div className="card" style={{ backgroundColor: '#F0F0F0' }}>
              <div
                style={{
                  backgroundColor: '#E0E0E0',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=3988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  className="card-img-top"
                  alt="Location"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">Vurve - Bangalore</h5>
                <p className="card-text">MG Road, Bangalore</p>
                {selectedService && (
                  <div>
                    <p><strong>{services.find(service => service.id === selectedService).name}</strong></p>
                    <p>Price: EUR {services.find(service => service.id === selectedService).price.toFixed(2)}</p>
                    <p>Duration: {services.find(service => service.id === selectedService).duration}</p>
                  </div>
                )}
                <p><strong>Total:</strong> EUR {selectedService ? services.find(service => service.id === selectedService).price.toFixed(2) : '0.00'}</p>
                <button className="btn btn-warning w-100 mb-2">Continue</button>
                <button className="btn btn-secondary w-100">Back</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default BookAppointment_Services;