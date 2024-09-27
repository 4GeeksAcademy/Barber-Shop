import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SignUp from "./SignUp";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const selectedProfessional = store.selectedProfessional;
  const selectedService = store.selectedService;
  const selectedDate = store.selectedDate;
  const selectedTime = store.selectedTime;

  return (
    <div className="d-flex flex-column min-vh-100 justify-content-center align-items-center container-login">
      <div className="form-card"> {/* Aplica la clase form-card */}
        <div className="row justify-content-center align-items-center"> 
          
          {/* Columna del formulario de registro */}
          <div className="col-12 col-md-6" style={{ maxWidth: '500px', padding: '0 15px' }}>
            <SignUp /> {/* Formulario de registro */}
          </div>

          {/* Columna del SummaryCard */}
          <div className="col-12 col-md-4 mt-5 mt-md-0" style={{ maxWidth: '400px', padding: '0 15px' }}>
            <div className="card bg-light">
              <img
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="Location"
                style={{ width: '100%', height: '170px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">Vurve - Bangalore</h5>
                <p className="card-text">MG Road, Bangalore</p>

                {selectedProfessional && (
                  <div>
                    <p><strong>Professional: </strong>{selectedProfessional.name} {selectedProfessional.last_name}</p>
                  </div>
                )}
                {selectedService && (
                  <div>
                    <p><strong>Service: </strong>{selectedService.service_name}</p>
                  </div>
                )}
                {selectedTime && (
                  <div>
                    <p><strong>Time: </strong>{selectedTime}</p>
                  </div>
                )}
                {selectedDate && (
                  <div>
                    <p><strong>Date: </strong>{selectedDate}</p>
                  </div>
                )}

                <p><strong>Total: </strong>EUR {selectedService ? selectedService.price : '0,00'}</p>

                <button className="btn btn-secondary w-100" onClick={() => navigate('/login-customers')}>Back</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
