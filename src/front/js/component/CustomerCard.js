import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Context } from '../store/appContext';
import { Login_Costumer_2 } from './LogIn_Costumer_2';


const CustomerCard = props => {
    const { store, actions } = useContext(Context);

    const userType = localStorage.getItem('userType');
    const userEmail = localStorage.getItem('email');

    return (
        <div>
            {store.customer.map((customer, index) => {
                if ((userType == 'customer' && userEmail == customer.email) || (userType == 'employee'))
                return(
                <div className="card mb-3" style={{ maxWidth: '540px' }}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src="https://xsgames.co/randomusers/avatar.php?g=male" className="img-fluid rounded-start" alt="Descripción de la imagen" />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{customer.name} {customer.last_name}</h5>
                                <p className="card-text">{customer.email}</p>
                                <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            )})}
        </div>
    )
}

CustomerCard.propTypes = {}

export default CustomerCard