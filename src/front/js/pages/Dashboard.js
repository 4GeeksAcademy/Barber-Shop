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

    useEffect(() => {
        actions.getProfessional(),
            actions.getCustomer()
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='container'>

            <h1 className='mt-3'>Dashboard</h1><div className="nav nav-tabs mt-3">
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
                    <table class="table">

                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Employee Id</th>
                                <th scope="col">Role</th>
                                <th scope="col">Status</th>
                                <th scope="col">Appointment</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {store.professional.map((professional, index) => (
                                <tr key={index}>
                                    <th scope="row"><input type="checkbox" /></th>
                                    <td>{professional.name}</td>
                                    <td>{professional.id}</td>
                                    <td>{professional.role}</td>
                                    <td>{professional.status}</td>
                                    <td>{professional.appointment}</td>
                                    <td>
                                        <button className="btn">
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                    </td>
                                    <td>
                                        <button className="btn">
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div><div className="container d-flex justify-content-evenly ">
                <button className='m-auto btn btn-warning fw-bold ' type='submit'>Register employee</button>
                <button className='m-auto btn btn-warning fw-bold ' type='submit'>Register Customer</button>
            </div>

        </div>
    )
}

export default Dashboard;
