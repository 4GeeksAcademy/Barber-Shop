import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
//.
const times = [
  '4:00pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm', '9:00pm', '10:00pm'
];

const BookAppointment_Date = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      navigate('/appointment-summary');
    } else {
      alert('Please select both a date and a time.');
    }
  };

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        <div className="col-md-8">
          <h3>Step 3 of 3</h3>
          <h2>Select Date & Time</h2>

          <div className="d-flex">
            <div style={{ flex: 1 }}>
              <h4>Select Time:</h4>
              <ul className="list-group">
                {times.map((time, index) => (
                  <li
                    key={index}
                    className={`list-group-item d-flex justify-content-between align-items-center`}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedTime === time ? '#fff9e6' : '',
                      border: selectedTime === time ? '1px solid #FFD700' : '',
                      fontSize: '1.2rem'
                    }}
                    onClick={() => setSelectedTime(time)}
                  >
                    {selectedTime === time && (
                      <i className="fa-solid fa-circle-check me-2" style={{ color: '#FFD700', fontSize: '1.5rem' }}></i>
                    )}
                    {time}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginLeft: '20px' }}>
              <h4>Select Date:</h4>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
              />
            </div>
          </div>
        </div>

        {/* Summary */}
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
                src="https://images.unsplash.com/photo-1536520002442-39764a41e987?q=80&w=3987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="Location"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">Vurve - Bangalore</h5>
              <p className="card-text">MG Road, Bangalore</p>
              {selectedDate && selectedTime && (
                <div>
                  <p><strong>Date:</strong> {selectedDate.toDateString()}</p>
                  <p><strong>Time:</strong> {selectedTime}</p>
                </div>
              )}
              <p><strong>Total:</strong> EUR 15,00</p>
              <button className="btn btn-warning w-100 mb-2" onClick={handleContinue}>
                Continue
              </button>
              <button
                className="btn btn-secondary w-100"
                onClick={() => navigate('/book-appointment-services')}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment_Date;