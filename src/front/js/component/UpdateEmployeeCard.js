import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookAppointment_Proffesional from '../component/BookAppointment_Proffesional';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Importar el hook useNavigate.
import { Context } from '../store/appContext'; // Ruta corregida del appContext
import EmployeeCard from '../component/EmployeeCard';
import CustomerCard from '../component/CustomerCard';
import BookAppointment from '../component/BookAppointment';



const UpdateEmployeeCard = ({ employee, onUpdate }) => {
    const [name, setName] = useState(employee.name || '');
    const [lastName, setLastName] = useState(employee.last_name || '');
    const [email, setEmail] = useState(employee.email || '');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState(employee.phone || '');
    const [address, setAddress] = useState(employee.address || '');
    const [jobPosition, setJobPosition] = useState(employee.job_position || '');
    const [salary, setSalary] = useState(employee.salary || '');
    const [status, setStatus] = useState(employee.status || '');

    const { store, actions } = useContext(Context);
    
    const handleUpdate = () => {
        const updatedEmployee = {
            email: employee.email, // Email original para identificar al empleado
            update_name: name,
            update_last_name: lastName,
            update_email: email,
            update_password: password,
            update_phone: phone,
            update_address: address,
            update_job_position: jobPosition,
            update_salary: salary,
            update_status: status
        };
        onUpdate(updatedEmployee);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Actualizar Datos del Empleado</h5>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Dirección</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Puesto de Trabajo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={jobPosition}
                        onChange={(e) => setJobPosition(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Salario</label>
                    <input
                        type="text"
                        className="form-control"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <input
                        type="text"
                        className="form-control"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleUpdate}>
                    Actualizar
                </button>
            </div>
        </div>
    );
};

export default UpdateEmployeeCard;
