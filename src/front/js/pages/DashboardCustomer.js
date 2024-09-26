import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../store/appContext';

import CustomerCard from '../component/CustomerCard';
import BookAppointment from '../component/BookAppointment';

const DashboardCustomer = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("jwt_token")) {
          
            
        } else {
            navigate("/login");
        }
    }, [actions, navigate]);


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
                                <td>{appointment.employee}</td>
                                <td>{appointment.service}</td>
                                <td>{appointment.price}</td>
                                <td>{appointment.appointment_time}</td>
                                <td>{appointment.appointment_state_id}</td>
                                <td>{appointment.appointment_date}</td>
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
                <Link to="/book-appointment">
                    <button className='btn btn-warning fw-bold'>BOOK AN APPOINTMENT</button>
                </Link>
            </div>
        </div>
    );
};

export default DashboardCustomer;
