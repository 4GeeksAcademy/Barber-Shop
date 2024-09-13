import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

const ReviewAndConfirm = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row">
        <div className="col-md-8">
          <h5>Step 3 of 3</h5>
          <h2>Review and confirm</h2>
          <div className="card p-4" style={{ backgroundColor: '#F0F0F0' }}>
            <h5>Cancellation policy</h5>
            <p>
              Cancel for free anytime in advance, otherwise you will be charged{' '}
              <strong>100%</strong> of the service price for not showing up.
            </p>
            <h5>Add booking notes</h5>
            <p>Include comments or requests about your booking</p>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Add your comments here..."
            ></textarea>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card" style={{ backgroundColor: '#F0F0F0' }}>
            <div style={{ backgroundColor: '#E0E0E0', padding: '20px', display: 'flex', justifyContent: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1519500528352-2d1460418d41?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="card-img-top"
                alt="Location"
                style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }}
              />
            </div>

            <div className="card-body">
              <h5 className="card-title">Vurve - Bangalore</h5>
              <p className="card-text">MG Road, Bangalore</p>
              <p>
                <strong>Sun 16 July 2023 at 5:00pm</strong>
              </p>
              <p>1h duration, ends at 6:00pm</p>
              {store.selectedService && (
                <div>
                  <p>
                    <strong>{store.selectedService.name}</strong>
                  </p>
                  <p>Duration: {store.selectedService.duration}</p>
                  <p>EUR {store.selectedService.price.toFixed(2)}</p>
                </div>
              )}
              <p>
                <strong>Total:</strong> EUR {store.selectedService?.price.toFixed(2)}
              </p>
              <button className="btn btn-warning w-100 mt-3" onClick={() => navigate('/book-appointment-confirm')}>
                Book now
              </button>
              <button className="btn btn-secondary w-100 mt-3" onClick={() => navigate('/login-customers')}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAndConfirm;
