import React, { useState, useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/login.css";
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Context } from '../store/appContext';
import { Alert } from 'react-bootstrap';

const EmployeeRegister = () => {
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { store, actions } = useContext(Context);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        date_of_birth: "",
        email: "",
        hire_date: "",
        job_position: "",
        salary: "",
        status: "available"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleUpdate = async () => {
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
        } else {
            const newEmployee = {
                name: formData.name,
                last_name: formData.last_name,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                date_of_birth: formData.date_of_birth,
                email: formData.email,
                hire_date: formData.hire_date,
                job_position: formData.job_position,
                salary: formData.salary,
                status: formData.status
            };
            try {
                const result = await actions.postNewEmployee(newEmployee);
                if (result) {
                    navigate('/dashboard');
                }
            } catch (error) {
                setError("Error al registrar al empleado");
            }
        }
    };

    return (
        <div className="container card mt-3 mb-3">
            <div className="card-body">
                <h5 className="card-title">Register Employee Information</h5>
                <div className="mb-3 row">
                    <div className='col'>
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className='col'>
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className='row'>
                    <div className="mb-3 col">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            aria-required
                        />
                    </div>
                </div>
                <div className='row'>
                    <div className="mb-3 col">
                        <label className="form-label">Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Job Position</label>
                        <input
                            type="text"
                            className="form-control"
                            name="job_position"
                            value={formData.job_position}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Salary</label>
                        <input
                            type="text"
                            className="form-control"
                            name="salary"
                            value={formData.salary}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3 col">
                        <label className="form-label">Status</label>
                        <select
                            className="form-control"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
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
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <button className="btn btn-secondary" onClick={handleUpdate}>
                        Update
                    </button>
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

export default EmployeeRegister;
