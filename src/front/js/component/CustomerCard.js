import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';


const CustomerCard = props => {
    const navigate = useNavigate()
    const { store, actions } = useContext(Context);
    const [customerDataCard, setCustomerDataCard]= useState({
        name:"",
        last_name:"",
        email:"",
        phone:""
    })

    const handleInputChange = (e)=>{
        const { name, value } = e.target;
        setCustomerDataCard({
            ...customerDataCard,
            [name]: value
        });
    }

    const handleEdit = (customer) => {
        navigate('/update-customer', { state: { customer } });
    };

    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('email');

    return (
        <div className=''>
            {store.customer.map((customer, index) => {
                if ((userType == 'customer' && userEmail == customer.email) || (userType == 'employee'))
                return(
                <div className="card mb-3 col " style={{ maxWidth: '540px' }} key={index}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src="https://xsgames.co/randomusers/avatar.php?g=male" className="img-fluid rounded-start" alt="Descripción de la imagen" />
                        </div>
                        <div className="col-md-8 d-flex">
                            <div className="card-body">
                                <h5 className="card-title">{customer.name} {customer.last_name}</h5>
                                <p className="card-text">{customer.email}</p>
                                <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                            <button className="btn" onClick={() => handleEdit(customer)}>
                                <i className="bi bi-pencil-square"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )})}
        </div>
    )
}

CustomerCard.propTypes = {}

export default CustomerCard