import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';

const EmployeeCard = props => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [employeeDataCard, setEmployeeDataCard] = useState({
        name: "",
        email: "",
        phone: "",
        status: ""
    })
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeDataCard({
            ...employeeDataCard,
            [name]: value
        });
    };
    // useEffect(() => {
    //     store.professional// Aquí puedes realizar cualquier acción necesaria cuando el contexto cambie
    // }, []);

    
    const handleEdit = (employee) => {
        navigate('/update-employee', { state: { employee } });
    };

    return (
        <div>
            {store.professional.map((employee, index) => (
                <div className="card mb-3" style={{ maxWidth: '540px' }} key={index}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src="https://xsgames.co/randomusers/avatar.php?g=male" className="img-fluid rounded-start" alt="Descripción de la imagen" />
                        </div>
                        <div className="col-md-8 d-flex">
                            <div className="card-body">
                                <h5 className="card-title" onChange={handleInputChange}>{employee.name} {employee.last_name}</h5>
                                <p className="card-text" onChange={handleInputChange}>{employee.email}</p>
                                <p className="card-text" onChange={handleInputChange}>{employee.phone}</p>
                                <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            <span className="card-text mt-3" onChange={handleInputChange}>{employee.status}</span>
                            <button className="btn" onClick={() => handleEdit(employee)}>
                                <i className="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

EmployeeCard.propTypes = {};

export default EmployeeCard;
