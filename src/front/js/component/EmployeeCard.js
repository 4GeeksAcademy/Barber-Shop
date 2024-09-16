import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { Context } from '../store/appContext';


const EmployeeCard = props => {
    const { store, actions } = useContext(Context);


    return (
        <div>
            {store.professional.map((pro, index) => (
                <div className="card mb-3" style={{ maxWidth: '540px' }}>
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src="https://xsgames.co/randomusers/avatar.php?g=male" className="img-fluid rounded-start" alt="Descripción de la imagen" />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{pro.name} {pro.last_name}</h5>
                                <p className="card-text">{pro.email}</p>
                                <p className="card-text">{pro.phone}</p>
                                <p className="card-text">{pro.status}</p>
                                
                                <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

EmployeeCard.propTypes = {}

export default EmployeeCard