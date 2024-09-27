import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../store/appContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const UpdateCustomerCard = ({ onUpdate }) => {
    const location = useLocation();
    const { customer } = location.state || {};
    const navigate = useNavigate();

    const { store, actions } = useContext(Context);

    const userType = localStorage.getItem('userType');

    const [name, setName] = useState(customer?.name || '');
    const [lastName, setLastName] = useState(customer?.last_name || '');
    const [email, setEmail] = useState(customer?.email || '');
    const [password, setPassword] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [phone, setPhone] = useState(customer?.phone || '');
    const [error, setError] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');

        const customerId = await actions.getCustomer(customer.id);

        if (!customerId) {
            setError("No se pudo obtener el ID del customer.");
            return;
        }

        let updatedCustomer = {
            id: customer,
            email: customer.email,
            name: name,
            last_name: lastName,
            email: email,
            phone: phone,
            ...(pass1 && pass1 === pass2 && { password: pass1 })
        };

        updatedCustomer = Object.fromEntries(
            Object.entries(updatedCustomer).filter(([_, value]) => value !== "" && value !== null)
        );

        try {
            const result = await actions.updateCustomer(updatedCustomer);
            if (result) {
                userType === "employee" ?
                    navigate('/dashboard') : navigate('/dashboard-customer');
            }
        } catch (error) {
            setError("Error al actualizar la información del empleado. Intente de nuevo.");
        }
    };

    return (
        <div className="container card mt-5 mb-3">
            <div className="card-body">
                <h5 className="card-title">Update Customer Information</h5>
                {error && <Alert variant="danger">{error}</Alert>}
                <form onSubmit={handleUpdate}>
                    <div className="mb-3 row">
                        <div className='col'>
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className='col'>
                            <label className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
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
                                className="form-control"
                                value={pass1}
                                onChange={(e) => setPass1(e.target.value)} />
                        </div>
                        <div className="mb-3 col">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
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
                    </div>
                    <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
                        <button type='submit' className="btn btn-secondary">
                            Update
                        </button>
                        {userType === "employee" ? (
                            <Link to="/dashboard">
                                <button className="btn btn-primary">
                                    Cancel
                                </button>
                            </Link>
                        ) : (
                            <Link to="/dashboard-customer">
                                <button className="btn btn-primary">
                                    Cancel
                                </button>
                            </Link>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateCustomerCard;
