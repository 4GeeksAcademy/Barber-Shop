import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from './summaryCard';

const BookAppointment_Services = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getServices()
  }, [])

  const handleContinue = () => {
    if (selectedService) {
      actions.selectService(store.services.find(service => service.id === selectedService.id));
      navigate('/book-appointment-date');
    } else {
      alert("Please select a service before continuing.");
    }
  };
  const selectedProfessional = store.selectedProfessional;

  const selectedService = store.selectedService;

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        <div className="col-md-8">
          <h3>Step 2 of 3</h3>
          <h2>Select Services</h2>
          <ul className="list-group">
            {store.services.map((service, index) => (
              <li
                key={index}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedService === service.id ? '#fff9e6' : '',
                  border: selectedService === service.id ? '1px solid #FFD700' : '',
                  fontSize: '1.2rem'
                }}
                onClick={() => actions.selectService(service)}
              >
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center">
                    {selectedService && selectedService.id === service.id && (
                      <i className="fa-solid fa-circle-check me-2" style={{ color: '#FFD700', fontSize: '1.5rem' }}></i>
                    )}
                    {service.service_name}
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <span className="badge bg-secondary me-3">
                    EUR {service.price}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>


        <SummaryCard
          profeName={selectedProfessional ? selectedProfessional.name : ''}
          profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
          serviName={selectedService ? selectedService.service_name : ''}
          serviPrice={selectedService ? selectedService.price : ''}
          handleContinue={handleContinue}
          backRoute='/book-appointment-proffesional'
          showContinueButton={true}
        />

      </div>
    </div>
  );
};

export default BookAppointment_Services;
