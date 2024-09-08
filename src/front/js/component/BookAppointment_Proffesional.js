import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const professionals = [
  { id: 1, name: 'James Mitchell', available: true, hours: '1h' },
  { id: 2, name: 'Ethan Carter', available: true, hours: '1h' },
  { id: 3, name: 'Emily Anderson', available: true, hours: '1h' },
  { id: 4, name: 'Olivia Parker', available: true, hours: '1h' },
  { id: 5, name: 'William Bennett', available: true, hours: '1h' },
  { id: 6, name: 'Sophia Harris', available: false, hours: 'Day Off' }
];

const BookAppointment_Proffesionals = () => {
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  return (
    <div className="container mt-5">
      <div className="row">
        {/* Profesionales */}
        <div className="col-md-8">
          <h3>Step 1 of 3</h3>
          <h2>Select Professional</h2>
          <ul className="list-group">
            {professionals.map(pro => (
              <li
                key={pro.id}
                className={`list-group-item d-flex justify-content-between align-items-center ${selectedProfessional === pro.id ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedProfessional(pro.id)}
              >
                <div>
                  <input
                    type="radio"
                    name="professional"
                    checked={selectedProfessional === pro.id}
                    onChange={() => setSelectedProfessional(pro.id)}
                    className="me-2"
                  />
                  {pro.name}
                </div>
                <span className="badge bg-light text-dark">{pro.hours}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen */}
        <div className="col-md-4">
          <div className="card">
            <img src="https://via.placeholder.com/150" className="card-img-top" alt="Location" />
            <div className="card-body">
              <h5 className="card-title">Vurve - Bangalore</h5>
              <p className="card-text">MG Road, Bangalore</p>
              {selectedProfessional && (
                <div>
                  <p><strong>{professionals.find(pro => pro.id === selectedProfessional).name}</strong></p>
                  <p>Available</p>
                </div>
              )}
              <p><strong>Total:</strong> EUR 0,00</p>
              <button className="btn btn-warning w-100 mb-2">Continue</button>
              <button className="btn btn-secondary w-100">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment_Proffesionals;
