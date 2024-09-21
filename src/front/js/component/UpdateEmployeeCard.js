import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../store/appContext'; 
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
const UpdateEmployeeCard = ({ employee = {} }) => {
    const [name, setName] = useState(employee.name || '');
    const [lastName, setLastName] = useState(employee.last_name || '');
    const [email, setEmail] = useState(employee.email || '');
    const [password, setPassword] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2]= useState('');
    const [phone, setPhone] = useState(employee.phone || '');
    const [address, setAddress] = useState(employee.address || '');
    const [jobPosition, setJobPosition] = useState(employee.job_position || '');
    const [salary, setSalary] = useState(employee.salary || '');
    const [status, setStatus] = useState(employee.status || '');

    const chancePassword = ()=>{
       pass1 === pass2? setPassword : Alert("The password does not match!")
    }

    const handleUpdate = () => {
        const updatedEmployee = {
            email: employee.email, // Email original para identificar al empleado
            update_name: name,
            update_last_name: lastName,
            update_email: email,
            update_phone: phone,
            update_address: address,
            update_job_position: jobPosition,
            update_salary: salary,
            update_status: status
        };

        // Solo agregar la contraseña si no está vacía
        if (password) {
            updatedEmployee.update_password = password;
        }

        onUpdate(updatedEmployee);
    };

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">Actualizar Datos del Empleado</h5>
                <div className="mb-5">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
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
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={pass1}
                        onChange={(e) => setPass1(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={pass2}
                        onChange={(e) => setPass2(e.target.value)}
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
                <Link to="/dashboard"><button className="btn btn-primary " style={{marginBottom: "80px"}} onClick={handleUpdate}>
                    Actualizar
                </button></Link>
            </div>
        </div>
    );
};

export default UpdateEmployeeCard;
