import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from "./summaryCard";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();
  const { store, actions } = useContext(Context);


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

      const customerData = {
        name: formData.name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      actions.postSignupCustomer(customerData)
        .then(() => {
          navigate('/book-appointment-resume')
        })
        .catch(error => {
          console.error("Error submitting form:", error);
        })
    }
  };

  const selectedProfessional = store.selectedProfessional;
  const selectedService = store.selectedService;
  const selectedDate = store.selectedDate;
  const selectedTime = store.selectedTime;

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
                <label htmlFor="name">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
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
              <label htmlFor="phone">Phone Number</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                value={formData.phone}
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

            <button type="submit" className="btn btn-warning w-100" onClick={() => { }}>Create account</button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <a href="/login-customers-2" className="text-danger">Login</a>
          </p>
        </div>

        <SummaryCard
          profeName={selectedProfessional ? selectedProfessional.name : ''}
          profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
          serviName={selectedService ? selectedService.service_name : ''}
          serviPrice={selectedService ? selectedService.price : ''}
          selectTime={selectedTime ? selectedTime : ''}
          selectDate={selectedDate ? selectedDate : ''}
          backRoute='/login-customers'
          showContinueButton={false}
        />
      </div>
    </div>
  );
};

export default SignUpPage;
