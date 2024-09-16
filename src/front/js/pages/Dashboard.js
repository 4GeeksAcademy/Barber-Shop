import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookAppointment_Proffesional from '../component/BookAppointment_Proffesional';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate.
import { Context } from '../store/appContext'; // Ruta corregida del appContext
import EmployeeCard from '../component/EmployeeCard';
import CustomerCard from '../component/CustomerCard';
import BookAppointment from '../component/BookAppointment';


const Dashboard = () => {
    const { store, actions } = useContext(Context);
    const [activeTab, setActiveTab] = useState("tab1");

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='container'>
            <h1 className='mt-3'>Dashboard</h1>
            <div className="nav nav-tabs mt-3">
                <button className="m-auto nav-item btn btn-warning fw-bold" onClick={() => handleTabClick('tab1')}>All Employees</button>
                <button className="m-auto nav-item btn btn-warning fw-bold" onClick={() => handleTabClick('tab2')}>All Customers</button>
                <button className="m-auto nav-item btn btn-warning fw-bold" onClick={() => handleTabClick('tab3')}>All Appointment</button>
            </div>
            <div className="content mt-3">
                {activeTab === 'tab1' && <div>
                    <EmployeeCard />
                </div>}
                {activeTab === 'tab2' && <div>
                    <CustomerCard />
                </div>}
                {activeTab === 'tab3' && <div>
                    Aqui componente Appointment
                </div>}
            </div >
            <div className="container d-flex justify-content-evenly ">
                <button className='m-auto btn btn-warning fw-bold ' type='submit'>Register employee</button>
                <button className='m-auto btn btn-warning fw-bold ' type='submit'>Register Customer</button>
            </div>

        </div>
    )
}

export default Dashboard;
