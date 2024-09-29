import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const InactivityAlert = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logoutTimeout, setLogoutTimeout] = useState(null);
  const [inactivityTimeout, setInactivityTimeout] = useState(null);

  useEffect(() => {
    const resetTimers = () => {
      // Reiniciar temporizadores al detectar actividad
      if (logoutTimeout) clearTimeout(logoutTimeout);
      if (inactivityTimeout) clearTimeout(inactivityTimeout);

      // Iniciar temporizador de inactividad de 3 minutos
      setInactivityTimeout(setTimeout(() => {
        setIsModalOpen(true);
      }, 5000)); // 3 minutos

      // Iniciar temporizador de cierre de sesión de 4 minutos
      setLogoutTimeout(setTimeout(() => {
        handleLogout();
      }, 6000)); // 4 minutos
    };

    // Escuchar eventos de interacción
    window.addEventListener('mousemove', resetTimers);
    window.addEventListener('keypress', resetTimers);

    resetTimers(); // Inicializar temporizadores al cargar

    return () => {
      // Limpiar event listeners y temporizadores al desmontar el componente
      window.removeEventListener('mousemove', resetTimers);
      window.removeEventListener('keypress', resetTimers);
      if (logoutTimeout) clearTimeout(logoutTimeout);
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
    };
  }, []);

  const handleLogout = () => {
    // Lógica para cerrar la sesión del usuario
    console.log("Sesión cerrada por inactividad");
    // Redirigir o hacer cualquier otra acción necesaria
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reiniciar temporizadores al cerrar el modal
    setLogoutTimeout(null);
    setInactivityTimeout(null);
    resetTimers();
  };

  return (
    <div>
        <Modal isOpen={isModalOpen}>
        <h2>Inactividad</h2>
        <p>Ha estado inactivo por 3 minutos. Su sesión se cerrará en 1 minuto.</p>
        <button onClick={handleCloseModal}>Continuar sesión</button>
      </Modal>
    </div>
  );
};

export default InactivityAlert;
