import React, { useState, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../store/appContext';
import { Link, useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const UpdateCustomerCard = ({ onUpdate }) => {
    const location = useLocation();
    const { customer } = location.state || {};

    const { store, actions } = useContext(Context);

    const [name, setName] = useState(customer?.name || '');
    const [lastName, setLastName] = useState(customer?.last_name || '');
    const [email, setEmail] = useState(customer?.email || '');
    const [password, setPassword] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [phone, setPhone] = useState(customer?.phone || '');


    const changePassword = () => {
        if (pass1 === pass2) {
            setPassword(pass1);
        } else {
            alert("The passwords do not match!");
        }
    };

    const handleUpdate = () => {
        const updatedCustomer = {
            email: customer.email,
            name: name,
            last_name: lastName,
            email: email,
            phone: phone
        };

        // Solo agregar la contraseña si no está vacía
        if (password) {
            updatedCustomer.password = password;
        };


        actions.updateCustomer(updatedCustomer);
        if (onUpdate) {
            onUpdate(updatedCustomer);
        }
    };
    return (
        <div className="container card mt-5 mb-3">
            <div className="card-body">
                <h5 className="card-title">Update Customer Information</h5>
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
                   
                </div>
                <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
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

export default UpdateCustomerCard;
