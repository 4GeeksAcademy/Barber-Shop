import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from './summaryCard';
import "../../styles/LogIn_Costumer.css"; // Ruta actualizada para el archivo CSS

const LogIn_Customers = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);

  const selectedProfessional = store.selectedProfessional;
  const selectedService = store.selectedService;
  const selectedDate = store.selectedDate;
  const selectedTime = store.selectedTime;

  return (
    <div className="container container-login mt-5"> {/* Aplicamos la clase container-login */}
      <div className="row">
        <div className="col-md-8">
          <h3>Step 3 of 3</h3>
          <h2>Create account to continue</h2>

          <div className="btn-group-vertical w-100">
            <button className="btn btn-warning mb-3" onClick={() => navigate('/sign-up')}>
              Sign up with email
            </button>
            <button className="btn btn-primary mb-3">Continue with Facebook</button>
            <button className="btn btn-success mb-3">Continue with Google</button>
          </div>

          <p>Already have an account? <a href="#" onClick={() => navigate('/login-customers-2')}>Log in now</a></p>
        </div>

        <SummaryCard
          profeName={selectedProfessional ? selectedProfessional.name : ''}
          profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
          serviName={selectedService ? selectedService.service_name : ''}
          serviPrice={selectedService ? selectedService.price : ''}
          selectTime={selectedTime ? selectedTime : ''}
          selectDate={selectedDate ? selectedDate : ''}
          backRoute='/book-appointment-date'
          showContinueButton={false}
        />
      </div>
    </div>
  );
};

export default LogIn_Customers;
