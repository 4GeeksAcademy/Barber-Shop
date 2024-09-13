import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext'; // Importar el contexto

const timeslots = [
  "4:00pm", "5:00pm", "6:00pm", "7:00pm", "8:00pm", "9:00pm", "10:00pm"
];

const BookAppointment_Date = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();
  const { store } = useContext(Context); // Obtener el contexto

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate('/confirmation');
    } else {
      alert("Please select both a date and time before continuing.");
    }
  };

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        <div className="col-md-8">
          <h3>Step 3 of 3</h3>
          <h2>Select Date & Time</h2>
          
          <div className="d-flex">
            <div className="w-50">
              <h5>Select Time:</h5>
              <ul className="list-group">
                {timeslots.map((time, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between align-items-center ${selectedTime === time ? 'active' : ''}`}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="w-50 ms-4">
              <h5>Select Date:</h5>
              <input
                type="date"
                className="form-control"
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  fontSize: '1.2rem',
                  padding: '10px',
                  marginTop: '20px',
                  border: '1px solid #FFD700',
                  borderRadius: '5px',
                }}
              />
            </div>
          </div>
        </div>

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
                src="https://images.unsplash.com/photo-1599351431613-18ef1fdd27e1?q=80&w=3988&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
              {selectedDate && (
                <div>
                  <p><strong>Date: {new Date(selectedDate).toLocaleDateString()}</strong></p>
                </div>
              )}
              {selectedTime && (
                <div>
                  <p><strong>Time: {selectedTime}</strong></p>
                </div>
              )}
              <p><strong>Total:</strong> EUR {store.selectedService?.price.toFixed(2)}</p>
              <button className="btn btn-warning w-100 mb-2" onClick={handleContinue}>Continue</button>
              <button className="btn btn-secondary w-100" onClick={() => navigate('/book-appointment-services')}>Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment_Date;
