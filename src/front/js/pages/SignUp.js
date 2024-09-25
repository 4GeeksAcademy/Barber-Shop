import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/login.css";
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
        if (location.pathname === '/book-appointment-date') {
          navigate('/book-appointment-resume');
        } else {
          navigate('/dashboard-customer');
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }
  };

  return (
    <div className='bodyPage'>
      <div className='bodyCard mt-5'>
        <h1>Create account</h1>
        <h6 className='fs-6 fw-lighter mt-3'>Sign up to access Barber Shop.</h6>
        <form className='mt-3' style={{ width: "25rem" }} onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-login">Create account</button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/login" className="text-danger">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
