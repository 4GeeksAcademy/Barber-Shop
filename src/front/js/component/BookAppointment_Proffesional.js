import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate.
import { Context } from '../store/appContext'; // Ruta corregida del appContext
import SummaryCard from './summaryCard';

const BookAppointment_Proffesional = () => {
  const navigate = useNavigate(); // Usamos el hook useNavigate
  const { store, actions } = useContext(Context); // Uso del contexto

  useEffect(()=>{
    actions.getProfessional()
    
  },[])

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Available':
        return { backgroundColor: '#d4edda', color: '#155724' }; // Verde suave
      case 'Day Off':
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // Rojo suave
      case 'Holiday':
        return { backgroundColor: '#e2e3e5', color: '#6c757d' }; // Gris
      default:
        return {};
    }
  };

  const handleContinue = () => {
    if (store.selectedProfessional) {
      // Guardar el profesional seleccionado en el contexto
      actions.selectProfessional(store.professional.find(pro => pro.id === store.selectedProfessional));
      navigate('/book-appointment-services'); // Navega a la siguiente página si se selecciona un profesional
    } else {
      alert("Please select a professional before continuing.");
    }
  };
  const selectedProfessional = store.selectedProfessional;
  
  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        {/* Profesionales */}
        <div className="col-md-8">
          <h3>Step 1 of 3</h3>
          <h2>Select Professional</h2>
          <ul className="list-group">
            {store.professional.map((pro,index) => (
              <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              style={{
                cursor: pro.status === 'Available' ? 'pointer' : 'not-allowed',
                backgroundColor: selectedProfessional && selectedProfessional.id === pro.id ? '#fff9e6' : '',
                border: selectedProfessional && selectedProfessional.id === pro.id ? '1px solid #FFD700' : '',
                fontSize: '1.2rem',
                opacity: pro.status === 'Available' ? 1 : 0.6
              }}
              onClick={() => pro.status === 'Available' && actions.selectProfessional(pro)}
            >
              <div className="d-flex align-items-center">
                {selectedProfessional && selectedProfessional.id === pro.id && (
                  <i className="fa-solid fa-circle-check me-2" style={{ color: '#FFD700', fontSize: '1.5rem' }}></i>
                )}
                {pro.name} {pro.last_name}
              </div>
              <span className="badge" style={getBadgeStyle(pro.status)}>
                {pro.status}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* SummaryCard */}
      <SummaryCard
        profeName={selectedProfessional ? selectedProfessional.name : ''}
        profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
        services={null} 
        time={null} 
        date={null}
        handleContinue={handleContinue} 
      />
        
      </div>
    </div>
  );
};

export default BookAppointment_Proffesional;
