import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../store/appContext';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const UpdateEmployeeCard = ({ onUpdate }) => {
    const location = useLocation();
    const { employee } = location.state || {};
    const navigate = useNavigate()

    const { store, actions } = useContext(Context);

    const [name, setName] = useState(employee?.name || '');
    const [lastName, setLastName] = useState(employee?.last_name || '');
    const [email, setEmail] = useState(employee?.email || '');
    const [password, setPassword] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [phone, setPhone] = useState(employee?.phone || '');
    const [address, setAddress] = useState(employee?.address || '');
    const [jobPosition, setJobPosition] = useState(employee?.job_position || '');
    const [salary, setSalary] = useState(employee?.salary || '');
    const [status, setStatus] = useState(employee?.status || '');
    const [error, setError] = useState('');

    const changePassword = () => {
        if (pass1 !== pass2) {
            throw new Error("The passwords do not match!"); // Lanza un error si no coinciden
        }
        return pass1; // Retorna la contraseña si coinciden
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(''); // Reinicia el mensaje de error

        // Validación de contraseñas
        if (pass1 !== pass2) {
            setError("Las contraseñas no coinciden!"); // Muestra un mensaje de error
            return; // Evita continuar si las contraseñas no coinciden
        }

        // Obtener el ID del empleado
        const employeeId = await actions.fetchEmployeeId(employee.id); // Obtener el ID

        if (!employeeId) {
            setError("No se pudo obtener el ID del empleado.");
            return;
        }

        let updatedEmployee = {
            id: employeeId, // Añadir el ID del empleado
            email: employee.email, // Email original para identificar al empleado
            update_name: name,
            update_last_name: lastName,
            update_email: email,
            update_phone: phone,
            update_address: address,
            update_job_position: jobPosition,
            update_salary: salary,
            update_status: status,
            password: pass1 // Solo agregar la contraseña si coincide
        };

        updatedEmployee = Object.fromEntries(
            Object.entries(updatedEmployee).filter(([_, value]) => value !== "" && value !== null)
        );

        try {
            const result = await actions.updateEmployee(updatedEmployee);
            if (result) {
                navigate('/dashboard');
            }
        } catch (error) {
            setError("Error al actualizar la información del empleado. Intente de nuevo."); // Mensaje de error en caso de fallo en el fetch
        }
    };


    return (
        <div className="container card mt-3 mb-3">
            <div className="card-body">
                <h5 className="card-title">Update Employee Information</h5>
                <div className="mb-3 row ">
                    <div className='col'>
                        <label className="form-label ">Name</label>
                        <input
                            type="text"
                            className="form-control col"
                            value={name}
                            onChange={(e) => setName(e.target.value)} />

                    </div>
                    <div className='col'>
                        <label className="form-label ">Last Name</label>
                        <input
                            type="text"
                            className="form-control col"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)} />
                    </div>
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
                <div className='row'>
                    <div className="mb-3 col">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control col"
                            value={pass1}
                            onChange={(e) => setPass1(e.target.value)} />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control col"
                            value={pass2}
                            onChange={(e) => setPass2(e.target.value)} />
                    </div>
                </div>
                <div className='row'>
                    <div className="mb-3 col">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 col ">
                        <label className="form-label">Job Position</label>
                        <input
                            type="text"
                            className="form-control"
                            value={jobPosition}
                            onChange={(e) => setJobPosition(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Salary</label>
                        <input
                            type="text"
                            className="form-control"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Status</label>
                        <select
                            className="form-control"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="available">Available</option>
                            <option value="holiday">Holiday</option>
                            <option value="dayOff">Day Off</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

                <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
                {error && <Alert variant="danger">{error}</Alert>}
                    <Link to="/dashboard">
                        <button className="btn btn-secondary" onClick={handleUpdate}>
                            Update
                        </button>
                    </Link>
                    <Link to="/dashboard">
                        <button className="btn btn-primary">
                            Cancel
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UpdateEmployeeCard;
