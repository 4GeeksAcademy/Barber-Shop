import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from './summaryCard';

const ReviewAndConfirm = () => {
  const navigate = useNavigate();
  const { store, actions } = useContext(Context);

  const handleContinue = async () => {
    try {
      await actions.getCustomerId();
      await actions.postAppointment();
      navigate('/book-appointment-confirm')
    } catch (error) {
      console.error("Error al reservar cita", error);
    }
  }
  const selectedProfessional = store.selectedProfessional;
  const selectedService = store.selectedService;
  const selectedDate = store.selectedDate;
  const selectedTime = store.selectedTime;
  const messageAppointment = store.messageAppointment;

  useEffect(() => {
    // Guardar en localStorage cada vez que cambien
    if (store.selectedProfessional) localStorage.setItem('selectedProfessional', JSON.stringify(store.selectedProfessional));
    if (store.selectedService) localStorage.setItem('selectedService', JSON.stringify(store.selectedService));
    if (store.selectedDate) localStorage.setItem('selectedDate', store.selectedDate);
    if (store.selectedTime) localStorage.setItem('selectedTime', store.selectedTime);
}, [store.selectedProfessional, store.selectedService, store.selectedDate, store.selectedTime]);

useEffect(() => {
    // Cargar desde localStorage al montar el componente
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
              value={messageAppointment || ""}
              onChange={(e) => actions.messageAppointmentCustomer(e.target.value)}
              placeholder="Add your commentrs here..."
            ></textarea>
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
          backRoute='/book-appointment-date'
          showContinueButton={true}
        />
      </div>
    </div>
  );
};

export default ReviewAndConfirm;
