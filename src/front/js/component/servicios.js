import React from 'react';
import "../../styles/servicios.css";

const Servicios = () => {
    return (
        <div id="services" className="servicios-section">
            <div className='text-main'>
                <h1 className='fw-bold text-center'>BROWSE OUR SERVICES</h1>
                <h5 className='text-center lh-lg'>At Barbershop Petro, we are proud to provide exceptional service in a welcoming and professional environment. Whether you need a haircut, beard trim, or any other men's styling service, our team of experts is here to make sure you leave completely satisfied.</h5>
            </div>

            <div className='servicios'>
                <div className="serviciosColumn">
                    {/* Primera fila */}
                    <div className="row mb-5">
                        <div className="col-lg-3 col-md-6 col-12 text-end mb-3 mb-lg-0">
                            <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725551950/Adult_haircut_img_g7kfjw.png" className="img-fluid-servicios" alt="Adult Haircut" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-start">
                            <h3 className='fw-bold'>ADULT HAIRCUT</h3>
                            <h6 className='lh-lg'>Hair cutting to a set of techniques that can modify its length and shape, performed with specific tools.</h6>
                            <h3 className='fw-bold pb-5'>€15,00</h3>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-end mb-3 mb-lg-0">
                            <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725551950/Kids_haircut_img_g1ap6c.png" className="img-fluid-servicios" alt="Kids Haircut" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-start">
                            <h3 className='fw-bold'>KIDS HAIRCUT</h3>
                            <h6 className='lh-lg'>Hair cutting to a set of techniques that can modify its length and shape, performed with specific tools.</h6>
                            <h3 className='fw-bold pb-5'>€10,00</h3>
                        </div>
                    </div>

                    {/* Segunda fila */}
                    <div className="row mb-5">
                        <div className="col-lg-3 col-md-6 col-12 text-end mb-3 mb-lg-0">
                            <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725551950/Beard_trim_img_jnye2t.png" className="img-fluid-servicios" alt="Beard Trim" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-start">
                            <h3 className='fw-bold'>BEARD TRIM</h3>
                            <h6 className='lh-lg'>Hair cutting to a set of techniques that can modify its length and shape, performed with specific tools.</h6>
                            <h3 className='fw-bold pb-5'>€19,00</h3>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-end mb-3 mb-lg-0">
                            <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725551950/Barbershop_muuwo3.png" className="img-fluid-servicios" alt="Neck Shave" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-start">
                            <h3 className='fw-bold'>NECK SHAVE</h3>
                            <h6 className='lh-lg'>Hair cutting to a set of techniques that can modify its length and shape, performed with specific tools.</h6>
                            <h3 className='fw-bold pb-5'>€17,00</h3>
                        </div>
                    </div>

                    {/* Tercera fila */}
                    <div className="row">
                        <div className="col-lg-3 col-md-6 col-12 text-end mb-3 mb-lg-0">
                            <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725551950/Scalp_moisturizing_img_vccebs.png" className="img-fluid-servicios" alt="Scalp Moisturizing" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-start">
                            <h3 className='fw-bold'>SCALP MOISTURIZING</h3>
                            <h6 className='lh-lg'>Hair cutting to a set of techniques that can modify its length and shape, performed with specific tools.</h6>
                            <h3 className='fw-bold pb-5'>€18,00</h3>
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-end mb-3 mb-lg-0">
                            <img src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725551950/Barbershop_1_qqqku8.png" className="img-fluid-servicios" alt="Beard Grooming" />
                        </div>
                        <div className="col-lg-3 col-md-6 col-12 text-start">
                            <h3 className='fw-bold'>BEARD GROOMING</h3>
                            <h6 className='lh-lg'>Hair cutting to a set of techniques that can modify its length and shape, performed with specific tools.</h6>
                            <h3 className='fw-bold pb-5'>€15,00</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Servicios;
