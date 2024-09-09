import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const professionals = [
  { id: 1, name: 'James Mitchell', available: true, hours: 'Available' },
  { id: 2, name: 'Ethan Carter', available: true, hours: 'Available' },
  { id: 3, name: 'Emily Anderson', available: true, hours: 'Available' },
  { id: 4, name: 'Olivia Parker', available: true, hours: 'Available' },
  { id: 5, name: 'William Bennett', available: true, hours: 'Holyday' },
  { id: 6, name: 'Sophia Harris', available: false, hours: 'Day Off' }
];

const Appointment = () => {
  const [selectedProfessional, setSelectedProfessional] = useState(null);

  const selectedColor = '#FFD700'; // Dorado menos intenso

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Available':
        return { backgroundColor: '#d4edda', color: '#155724' }; // Verde suave
      case 'Day Off':
        return { backgroundColor: '#f8d7da', color: '#721c24' }; // Rojo suave
      case 'Holyday':
        return { backgroundColor: '#e2e3e5', color: '#6c757d' }; // Gris
      default:
        return {};
    }
  };

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
                className={`list-group-item d-flex justify-content-between align-items-center`}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedProfessional === pro.id ? selectedColor : '',
                  fontSize: '1.2rem' // Aumenta el tamaño de los nombres
                }}
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
                <span
                  className="badge"
                  style={getBadgeStyle(pro.hours)} // Aplicamos el estilo en función del estado
                >
                  {pro.hours}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Resumen */}
        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: '#F0F0F0' }}> {/* Fondo gris claro */}
            <div style={{
              backgroundColor: '#E0E0E0', // Fondo similar al original que mencionas
              padding: '20px', 
              display: 'flex',
              justifyContent: 'center'
            }}>
              <img
                src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="Location"
                style={{
                  width: '100%', // Ajustamos la imagen al 100% del contenedor
                  height: '200px', // Mantiene la altura
                  objectFit: 'cover', // Evita la deformación de la imagen
                  objectPosition: 'center' // Centra la imagen
                }}
              />
            </div>
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

export default Appointment;
