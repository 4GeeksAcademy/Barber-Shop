import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from './summaryCard';
import "../../styles/BookAppointment_Proffesional.css"; // Importa el CSS

const BookAppointment_Proffesional = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getProfessional();
  }, []);

  const getBadgeClasses = (status) => {
    switch (status) {
      case 'Available':
        return 'badge bg-success text-white';
      case 'Day Off':
        return 'badge bg-danger text-white';
      case 'Holiday':
        return 'badge bg-secondary text-white';
      default:
        return 'badge bg-light text-dark';
    }
  };

  const selectedProfessional = store.selectedProfessional;

  const handleContinue = () => {
    if (store.selectedProfessional) {
      actions.selectProfessional(
        store.professional.find(pro => pro.id === store.selectedProfessional.id)
      );
      navigate('/book-appointment-services');
    } else {
      alert("Please select a professional before continuing.");
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 container-professional"> {/* Clase container-professional */}
      <div className="container mt-1 flex-grow-1">
        <div className="row mt-4">
          <div className="col-md-8">
            <h3 className="mb-3">Step 1 of 3</h3>
            <h2 className="mb-4">Select Professional</h2>
            <ul className="list-group">
              {store.professional.map((pro, index) => (
                <li
                  key={index}
                  className={`list-group-item d-flex justify-content-between align-items-center ${selectedProfessional && selectedProfessional.id === pro.id ? 'bg-warning' : ''} ${pro.status !== 'Available' ? 'opacity-50' : ''}`}
                  onClick={() => pro.status === 'Available' && actions.selectProfessional(pro)}
                  style={{ cursor: pro.status === 'Available' ? 'pointer' : 'not-allowed' }}
                >
                  <div className="d-flex align-items-center">
                    {selectedProfessional && selectedProfessional.id === pro.id && (
                      <i className="fa-solid fa-circle-check me-2 text-warning fs-3"></i>
                    )}
                    {pro.name} {pro.last_name}
                  </div>
                  <span className={getBadgeClasses(pro.status)}>
                    {pro.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <SummaryCard
            className="mt-3"
            profeName={selectedProfessional ? selectedProfessional.name : ''}
            profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
            serviName={store.selectedService ? store.selectedService.service_name : ''}
            serviPrice={store.selectedService ? store.selectedService.price : ''}
            handleContinue={handleContinue}
            backRoute='/book-appointment'
            showContinueButton={true}
          />
        </div>
      </div>
    </div>
  );
};

export default BookAppointment_Proffesional;
