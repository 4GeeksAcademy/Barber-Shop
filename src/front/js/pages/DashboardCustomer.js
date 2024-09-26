import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Link, useParams } from "react-router-dom";
import BookAppointment_Proffesional from '../component/BookAppointment_Proffesional';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';

import CustomerCard from '../component/CustomerCard';
import BookAppointment from '../component/BookAppointment';

const DashboardCustomer = () => {
    const { store, actions } = useContext(Context);


    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("jwt_token")) {
            actions.getCustomerId();
            actions.getAppointments();
            actions.getCustomer();

        } else {
            navigate("/login");
        }
    }, []);
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
        <div className='container'>
            <h1 className='mt-3'>Dashboard</h1>
            <CustomerCard />

            <div className='container'>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Professional</th>
                            <th scope="col">Service</th>
                            <th scope="col">Price</th>
                            <th scope="col">Time</th>
                            <th scope="col">Status</th>
                            <th scope="col">Total</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.appointments && store.appointments.map((appointment, index) => (
                            <tr key={index}>
                                <th scope="row"><input type="checkbox" /></th>
                                <td>{appointment.professional}</td>
                                <td>{appointment.service}</td>
                                <td>{appointment.price}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.status}</td>
                                <td>{appointment.date}</td>
                                <td>{appointment.total}</td>
                                <td>
                                    <Link to=""><button className="btn"><i className="bi bi-pencil-square"></i></button></Link>
                                </td>
                                <td>
                                    <button className="btn"><i className="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="container d-flex justify-content-evenly">
                <Link to="/book-appointment"> {/* Link para redirigir a BookAppointment. */}
                    <button className='btn btn-warning fw-bold'>BOOK AN APPOINTMENT</button>
                </Link>
            </div>
        </div >
    );
};

export default DashboardCustomer;
