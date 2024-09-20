import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from './summaryCard';

const timeslots = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
];

const BookAppointment_Date = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate('/login-customers');
    } else {
      alert("Please select both a date and time before continuing.");
    }
  };

  const selectedProfessional = store.selectedProfessional;
  const selectedService = store.selectedService;
  const selectedDate = store.selectedDate;
  const selectedTime = store.selectedTime;

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
                    onClick={() => actions.selectTime(time)}
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
                onChange={(e) => actions.selectDate(e.target.value)}
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

        <SummaryCard
          profeName={selectedProfessional ? selectedProfessional.name : ''}
          profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
          serviName={selectedService ? selectedService.service_name : ''}
          serviPrice={selectedService ? selectedService.price : ''}
          selectTime={selectedTime ? selectedTime : ''}
          selectDate={selectedDate ? selectedDate : ''}
          handleContinue={handleContinue}
          backRoute='/book-appointment-services'
          showContinueButton={true}
        />


      </div>
    </div>
  );
};

export default BookAppointment_Date;
