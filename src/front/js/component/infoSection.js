import React from 'react'
import '../../styles/infoSection.css'

const InfoSection = () => {
    return (
        <div className='infoSection'>
            <div className="container">
                <div className="cardSection">
                    <div className="card mb-3">
                        <div className="row g-0">
                            <div className="col-lg-6 col-md-12">
                                <div className="card-body-section">
                                    <div className="card-title-section p-5">
                                        <h1 className='fw-bold text-start display-3 mb-5'>YOUR PERSONAL BARBER SERVICE AT YOUR HOME</h1>
                                        <h5 className='text-start lh-lg'>La Barbería since 1966. A family business, barbershop in Madrid, with three generations, where father, son and their team currently work at the service of men's care.</h5>
                                    </div>
                                    <div className="card-text-section p-5">
                                        <div className="container text-start">
                                            <div className="row">
                                                <div className="col-6 col-sm-4 fw-bold display-6">99</div>
                                                <div className="col-6 col-sm-4 fw-bold display-6">10</div>
                                                <div className="w-100 d-none d-md-block"></div>
                                                <div className="col-6 col-sm-4 fs-3">CUSTOMER SATISFACTION</div>
                                                <div className="col-6 col-sm-4 fs-3 text">YEARS OF EXPERIENCE</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-12">
                                <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725524096/imgInfoSection_uubktc.png" className="img-fluid img-fluid-section" alt="..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoSection