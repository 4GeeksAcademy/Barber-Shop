// BookAppointment_Confirm.js

import React, { useContext } from 'react';
import { Context } from '../store/appContext';

const BookAppointment_Confirm = () => {
  const { store } = useContext(Context);

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4" style={{ backgroundColor: '#F0F0F0' }}>
            <h5 className="text-muted">Sun 16 July 2023 at 5:00pm</h5>
            <h2>Appointment Confirmed</h2>
            <div className="d-flex align-items-center">
              <img
                src="https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Location"
                style={{ width: '150px', height: '150px', objectFit: 'cover', marginRight: '20px' }}
              />
              <div>
                <h4>Vurve - Bangalore</h4>
                <p>MG Road, Bangalore</p>
                <p>Booking ref: #65742695</p>
              </div>
            </div>

            <hr />

            <div className="appointment-details">
              {store.selectedService && (
                <div>
                  <p>
                    <strong>{store.selectedService.name}</strong>
                  </p>
                  <p>Duration: {store.selectedService.duration}</p>
                  <p>Taxes: {store.selectedService.taxes ? `EUR ${store.selectedService.taxes}` : 'N/A'}</p>
                  <p>
                    <strong>Total: EUR {store.selectedService.price.toFixed(2)}</strong>
                  </p>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button className="btn btn-primary">Directions</button>
                <button className="btn btn-secondary">Reschedule</button>
                <button className="btn btn-danger">Cancel</button>
              </div>
            </div>

            <div className="mt-4">
              <h5>Cancellation policy</h5>
              <p>
                Cancel for free anytime in advance, otherwise you will be charged{' '}
                <strong>100%</strong> of the service price for not showing up.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment_Confirm;
