import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import SummaryCard from "../component/summaryCard";
import SignUp from "./SignUp";

const SignUpPage = () => {

  const navigate = useNavigate();
  const { store, actions } = useContext(Context);



const selectedProfessional = store.selectedProfessional;
const selectedService = store.selectedService;
const selectedDate = store.selectedDate;
const selectedTime = store.selectedTime;

return (
  <div className="container" >
    <div className="d-flex justify-content-evenly">
      <SignUp />
      <SummaryCard
        profeName={selectedProfessional ? selectedProfessional.name : ''}
        profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
        serviName={selectedService ? selectedService.service_name : ''}
        serviPrice={selectedService ? selectedService.price : ''}
        selectTime={selectedTime ? selectedTime : ''}
        selectDate={selectedDate ? selectedDate : ''}
        backRoute='/login-customers'
        showContinueButton={false}
      />
     
    </div>
  </div>
);
};

export default SignUpPage;
