import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { store } = useContext(Context); // Obtener el contexto

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
    } else {
      // Lógica de envío del formulario
      console.log("Form submitted", formData);
      navigate('/confirmation');
    }
  };

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        {/* Formulario de Sign Up */}
        <div className="col-md-8">
          <h3>Step 3 of 3</h3>
          <h2>Create account to continue</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-warning w-100" onClick={() => navigate('/book-appointment-resume')}>Create account</button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <a href="/login" className="text-danger">Login</a>
          </p>
        </div>

        {/* Cuadro de resumen */}
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
                src="https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="Location"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
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
              {store.selectedDate && (
                <div>
                  <p><strong>Date: {new Date(store.selectedDate).toLocaleDateString()}</strong></p>
                </div>
              )}
              {store.selectedTime && (
                <div>
                  <p><strong>Time: {store.selectedTime}</strong></p>
                </div>
              )}
              <p><strong>Total:</strong> EUR {store.selectedService?.price.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
