import React from 'react'
import '../../styles/contact.css'

const Contact = () => {
    return (
        

        <div className="contact">
            <img
                src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725630270/Hero_Footer_s8c7ry.png"
                className="img-fluid-contact"
                alt="..."/>
            <div className="titleMain text-white">
                <div className="titleContact">
                    <h1 className="display-2 fw-bold pb-2 ms-5">CONTACT US</h1>
                    <h5 className="fw-bold ms-5">
                        Fill out this form to contact you, to schedule an appointment with our specialists
                    </h5>
                </div>

                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-8 d-flex flex-column align-items-start justify-content-start text- start">
                            <div className="contact-info d-flex align-items-start mb-4">
                                <img
                                    src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725630270/whatsapp_image_mko8j6.png"
                                    className="img-fluid-contact-icono me-3"
                                    alt="whatsapp"
                                />
                                <div>
                                    <h6 className="fw-bold">GIVE US A WHATSAPP</h6>
                                    <h6>(+34)666-66-66</h6>
                                </div>
                            </div>
                            <div className="contact-info d-flex align-items-start mb-4">
                                <img
                                    src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725630269/Image_qmv8d8.png"
                                    className="img-fluid-contact-icono me-3"
                                    alt="phone"
                                />
                                <div>
                                    <h6 className="fw-bold">GIVE US A CALL</h6>
                                    <h6>(+34)999-66-66</h6>
                                </div>
                            </div>
                            <div className="contact-info d-flex align-items-start">
                                <img
                                    src="https://res.cloudinary.com/dc87bxiqf/image/upload/v1725630269/Image_1_r6xhsw.png"
                                    className="img-fluid-contact-icono me-3"
                                    alt="email"
                                />
                                <div>
                                    <h6 className="fw-bold">GIVE US A CALL</h6>
                                    <h6>info@barbershop.com</h6>
                                </div>
                            </div>
                        </div>
                      

                        <div className="col-md-4 mb-5">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputName" className="form-label fw-bold">FULL NAME</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exampleInputName"
                                        placeholder='Enter full name here'
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputSubject" className="form-label fw-bold">SUBJECT</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="exampleInputSubject"
                                        placeholder='Enter subject here'
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPhone" className="form-label fw-bold">PHONE NUMBER</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="exampleInputPhone"
                                        placeholder='Enter phone number here'
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label fw-bold">EMAIL ADDRESS</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="exampleInputEmail1"
                                        placeholder='Enter email here'
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputMessage" className="form-label fw-bold">PLEASE TYPE YOUR MESSAGE HERE..</label>
                                    <textarea
                                        className="form-control"
                                        id="exampleInputMessage"
                                        rows="3"
                                        placeholder='Enter you message here'
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-warning fw-bold">
                                    BOOK AN APPOINTMENT
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="map-container pb-5">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.598423755146!2d-3.683553222811296!3d40.439888254227704!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422989055a08a7%3A0xb1a742c609c68c4b!2s4Geeks%20Academy%20Espa%C3%B1a!5e0!3m2!1ses!2ses!4v1725646287369!5m2!1ses!2ses"
        style={{ border: 0, width: "100%", height: "100%" }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
    />
</div>
        
        </div>
    )
}

export default Contact