import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGrid from './ImageGrid';
import SalonInfo from './SalonInfo';
import { Navbar } from './navbar';
import { Footer } from './footer';
import "../../styles/BookAppointment.css"; // Ruta actualizada para el archivo CSS

const BookAppointment = () => {
  return (
    <div className="container-appointment"> {/* Aplicamos la clase container-appointment */}
      <ImageGrid />
      <SalonInfo />
    </div>
  );
};

export default BookAppointment;
