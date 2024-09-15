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
        <div>
            <h1>Dashboard</h1>
            <div className="nav nav-tabs">
                <button className="m-auto nav-item" onClick={() => handleTabClick('tab1')}>Employees</button>
                <button className="m-auto nav-item" onClick={() => handleTabClick('tab2')}>Customers</button>
                <button className="m-auto nav-item" onClick={() => handleTabClick('tab3')}>Appointment</button>
            </div>
            <div className="content">
                {activeTab === 'tab1' && <div>
                    <EmployeeCard />
                </div>}
                {activeTab === 'tab2' && <div>
                    <CustomerCard/>
                </div>}
                {activeTab === 'tab3' && <div>
                    Aqui componente Appointment
                    </div>}
            </div>
        </div>
    )
}

export default Dashboard;
