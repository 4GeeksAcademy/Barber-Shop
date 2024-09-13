// LogIn_Customers.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; 

const LogIn_Customers = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        <div className="col-md-8">
          <h3>Step 3 of 3</h3>
          <h2>Create account to continue</h2>

          <div className="btn-group-vertical w-100">
            <button className="btn btn-warning mb-3">Sign up with email</button>
            <button className="btn btn-primary mb-3">Continue with Facebook</button>
            <button className="btn btn-danger mb-3">Continue with Google</button>
          </div>

          <p>Already have an account? <a href="#">Log in now</a></p>
        </div>

        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: '#F0F0F0' }}>
            <div style={{ backgroundColor: '#E0E0E0', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="Location"
                style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>

            <div className="card-body">
              <h5 className="card-title">Vurve - Bangalore</h5>
              <p className="card-text">MG Road, Bangalore</p>
              {store.selectedProfessional && (
                <div>
                  <p><strong>Professional: {store.selectedProfessional.name}</strong></p>
                  <p>{store.selectedProfessional.hours}</p>
                </div>
              )}
              {store.selectedService && (
                <div>
                  <p><strong>Service: {store.selectedService.name}</strong></p>
                  <p>Duration: {store.selectedService.duration}</p>
                  <p>EUR {store.selectedService.price.toFixed(2)}</p>
                </div>
              )}
              <p><strong>Total:</strong> EUR {store.selectedService?.price.toFixed(2)}</p>
              <button className="btn btn-secondary w-100 mt-3" onClick={() => navigate('/book-appointment-date')}>Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn_Customers;
