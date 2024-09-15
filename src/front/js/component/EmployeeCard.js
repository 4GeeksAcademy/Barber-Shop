import React from 'react'
import PropTypes from 'prop-types'

const EmployeeCard = props => {
    return (
        <div>
            <div className="card mb-3" style={{ maxWidth: '540px' }}>
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src="ruta-de-tu-imagen.jpg" className="img-fluid rounded-start" alt="Descripción de la imagen" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">Employee</h5>
                            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            <p className="card-text"><small className="text-body-secondary">Last updated 3 mins ago</small></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

EmployeeCard.propTypes = {}

export default EmployeeCard