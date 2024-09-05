import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGrid from './ImageGrid';
import SalonInfo from './SalonInfo';
import { Navbar } from './navbar';
import { Footer } from './footer';

const BookAppointment = () => {
  return (
    <div>
      <ImageGrid />
      <SalonInfo />
    </div>
  );
};

export default BookAppointment;