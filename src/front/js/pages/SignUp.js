import React, { useState, useContext, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { store, actions } = useContext(Context);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
    } else {
      const customerData = {
        email: formData.email,
        password: formData.password
      };

      try {
        await actions.postSignupCustomer(customerData);
        navigate('/book-appointment-resume');
        // if (location.pathname === '/book-appointment-date') {
          
        // } else {
        //   navigate('/dashboard-customer');
        // }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  useEffect(() => {
    if (store.selectedProfessional) localStorage.setItem('selectedProfessional', JSON.stringify(store.selectedProfessional));
    if (store.selectedService) localStorage.setItem('selectedService', JSON.stringify(store.selectedService));
    if (store.selectedDate) localStorage.setItem('selectedDate', store.selectedDate);
    if (store.selectedTime) localStorage.setItem('selectedTime', store.selectedTime);
  }, [store.selectedProfessional, store.selectedService, store.selectedDate, store.selectedTime]);

  useEffect(() => {
    const savedProfessional = localStorage.getItem('selectedProfessional');
    const savedService = localStorage.getItem('selectedService');
    const savedDate = localStorage.getItem('selectedDate');
    const savedTime = localStorage.getItem('selectedTime');

    if (savedProfessional) actions.selectProfessional(JSON.parse(savedProfessional));
    if (savedService) actions.selectService(JSON.parse(savedService));
    if (savedDate) actions.selectDate(savedDate);
    if (savedTime) actions.selectTime(savedTime);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-start" style={{ paddingTop: '5rem', height: 'auto', minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ width: '90%', maxWidth: '30rem' }}> 
        <h1 className="text-center">Create account</h1>
        <h6 className='fs-6 fw-lighter text-center mt-3'>Sign up to access Barber Shop.</h6>
        <form className='mt-3' onSubmit={handleSubmit}>
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

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMeCheck"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="rememberMeCheck">Remember me</label>
          </div>

          <button type="submit" className="btn btn-login w-100">Create account</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/login" className="text-danger">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
