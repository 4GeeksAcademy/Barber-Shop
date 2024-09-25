import React, { useContext, useState, useEffect } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

const BookAppointment_Confirm = () => {
  const { store, actions } = useContext(Context);
  const [appointmentDetails, setAppointmentDetails] = useState(null);  // Nuevo estado para los detalles de la cita
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Si los detalles de la cita están en el store, guárdalos localmente al cargar esta vista
    if (store.selectedService && store.selectedProfessional && store.selectedDate && store.selectedTime) {
      setAppointmentDetails({
        service: store.selectedService,
        professional: store.selectedProfessional,
        date: store.selectedDate,
        time: store.selectedTime,
        price: store.selectedService.price
      });
    }
}, [store]);

// Nuevo useEffect para limpiar el store después de mostrar los detalles
useEffect(() => {
    // Usa un pequeño timeout para asegurarte de que los datos se muestren antes de resetear el estado global
    const timer = setTimeout(() => {
        actions.resetAppointmentState();
    }, 900000);  // Espera 100ms antes de limpiar el store

    // Limpia el timeout si el componente se desmonta
    return () => clearTimeout(timer);
}, []);



  const handleDirections = () => {
    const googleMapsUrl = `https://www.google.com/maps/place/4Geeks+Academy+Espa%C3%B1a/@40.4398883,-3.6835532,1138m/data=!3m3!1e3!4b1!5s0xd42262ecf1fd29d:0xf78d2e440eddad3b!4m6!3m5!1s0xd422989055a08a7:0xb1a742c609c68c4b!8m2!3d40.4398842!4d-3.6809783!16s%2Fg%2F11fqsrz6qd?entry=ttu&g_ep=EgoyMDI0MDkxNi4wIKXMDSoASAFQAw%3D%3D`;
    window.open(googleMapsUrl, '_blank');
  };

  const handleCancel = async () => {

    console.log("Appointment ID:", store?.appointment_id);
    try {

      if (!store?.appointment_id) {
        throw new Error("No appointment selected.");
      }

      await actions.deleteAppointment(store?.appointment_id);
      navigate('/');
    } catch (error) {
      
      console.error("Error al cancelar la cita", error);
    }
  };

  const handleReschedule = async () => {
    try {
      // Aquí llamamos la acción que cancela la cita
      await actions.deleteAppointment(store?.appointment_id);
      navigate('/book-appointment-date'); // Redirige a la página de selección de nueva cita
    } catch (error) {
      console.error("Error al cancelar y reprogramar la cita", error);
     
    }
  };

  const handleCancelClick = () => {
    setShowConfirmModal(true);  // Muestra el modal de confirmación para cancelar
  };

  const handleRescheduleClick = () => {
    setShowRescheduleModal(true);  // Muestra el modal para reprogramar la cita
  };

  const handleConfirmCancel = () => {
    handleCancel();
    setShowConfirmModal(false);  // Cierra el modal tras cancelar
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);  // Cierra el modal sin cancelar
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);  // Cierra el modal de reprogramación
  };

  if (!appointmentDetails) {
    return <div>Loading appointment details...</div>;
  }

  return (
    <div className="container mt-5" style={{ paddingBottom: '80px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card p-4" style={{ backgroundColor: '#F0F0F0' }}>
            <h5 className="text-muted">{store.selectedDate} at {store.selectedTime}</h5> {/* Fecha y hora de la cita */}
            <h2>Appointment Confirmed</h2>
            <div className="d-flex align-items-center">
              <img
                src="https://images.unsplash.com/photo-1635611578109-4b9ce9525b13?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                  <p><strong>Servicio: {store.selectedService.name}</strong></p> {/* Servicio que se hará el cliente */}
                  <p>Fecha: {store.selectedDate} a las {store.selectedTime}</p> {/* Fecha y hora */}
                  {/* <p>Duración: {store.selectedService.duration} minutos</p> */}
                  <p>Empleado: {store.selectedProfessional.name} {store.selectedProfessional.last_name}</p>
                  <p>Total: <strong>EUR {store.selectedService.price}</strong></p>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button className="btn btn-primary" onClick={handleDirections}>Directions</button>
                <button className="btn btn-secondary" onClick={handleRescheduleClick}>Reschedule</button> {/* Mostrar modal de reprogramación */}
                <button className="btn btn-danger" onClick={handleCancelClick}>Cancel</button>
              </div>
            </div>

            <div className="mt-4">
              <h5>Cancellation policy</h5>
              <p>Cancel for free anytime in advance, otherwise you will be charged <strong>100%</strong> of the service price for not showing up.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de cancelación */}
      {showConfirmModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Cancelación</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas cancelar la cita?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseModal}>No</button>
                <button className="btn btn-danger" onClick={handleConfirmCancel}>Sí, cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de reprogramación de cita */}
      {showRescheduleModal && (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reprogramar Cita</h5>
                <button type="button" className="close" onClick={handleCloseRescheduleModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p>Si continúas, se cancelará la cita actual y serás redirigido al calendario para seleccionar una nueva cita. ¿Deseas continuar?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCloseRescheduleModal}>Cancelar</button> {/* No cancela la cita, cierra modal */}
                <button className="btn btn-danger" onClick={handleReschedule}>Sí, continuar</button> {/* Cancela la cita y redirige */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment_Confirm;
