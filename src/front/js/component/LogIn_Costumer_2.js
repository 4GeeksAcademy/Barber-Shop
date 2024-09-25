import React, { useState, useContext,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/footer.css";
import SummaryCard from './summaryCard';

export const Login_Costumer_2 = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const form = {
        "email": email,
        "password": password
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.loginCustomer(form);
        if (success) {
            navigate("/book-appointment-resume"); // Navegar a dashboard después del login exitoso
        } else {
            setErrorMessage("Login incorrecto. Por favor, verifica tus credenciales.")
        }
    }

    useEffect(() => {
        // Guardar en localStorage cada vez que cambien
        if (store.selectedProfessional) localStorage.setItem('selectedProfessional', JSON.stringify(store.selectedProfessional));
        if (store.selectedService) localStorage.setItem('selectedService', JSON.stringify(store.selectedService));
        if (store.selectedDate) localStorage.setItem('selectedDate', store.selectedDate);
        if (store.selectedTime) localStorage.setItem('selectedTime', store.selectedTime);
    }, [store.selectedProfessional, store.selectedService, store.selectedDate, store.selectedTime]);
    
    useEffect(() => {
        // Cargar desde localStorage al montar el componente
        const savedProfessional = localStorage.getItem('selectedProfessional');
        const savedService = localStorage.getItem('selectedService');
        const savedDate = localStorage.getItem('selectedDate');
        const savedTime = localStorage.getItem('selectedTime');
    
        if (savedProfessional) actions.selectProfessional(JSON.parse(savedProfessional));
        if (savedService) actions.selectService(JSON.parse(savedService));
        if (savedDate) actions.selectDate(savedDate);
        if (savedTime) actions.selectTime(savedTime);
    }, []);

    const selectedProfessional = store.selectedProfessional;
    const selectedService = store.selectedService;
    const selectedDate = store.selectedDate;
    const selectedTime = store.selectedTime;


    return (
        <div className='container mt-5'>
            <div className="row">
                <div className="col-md-8">
                    <div className='bodyCard'>
                        <h1>Login</h1>
                        <h6 className='fs-6 fw-lighter mt-3'>Login to access your travelwise account</h6>
                        <form className='mt-3' style={{ width: "100%" }} onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="emailLogin" className="form-label">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="emailLogin"
                                    aria-describedby="emailHelp"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="passwordLogin" className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="passwordLogin"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-3 form-check">
                                <input type="checkbox" className="form-check-input" id="rememberMeCheck" />
                                <label className="form-check-label" htmlFor="rememberMeCheck">Remember me</label>
                            </div>
                            <button type="submit" className="btn-login">Login</button>
                            {
                                errorMessage && (
                                    <div className="alert alert-danger mt-3" role="alert">
                                        {errorMessage}
                                    </div>
                                )
                            }
                            <div className='mt-3'>
                                <p>Reset password click <a href='/password-reset-request' className='text-danger'> here</a></p>
                            </div>
                        </form>
                    </div>
                </div>

                <SummaryCard
                    profeName={selectedProfessional ? selectedProfessional.name : ''}
                    profeLastName={selectedProfessional ? selectedProfessional.last_name : ''}
                    serviName={selectedService ? selectedService.service_name : ''}
                    serviPrice={selectedService ? selectedService.price : ''}
                    selectTime={selectedTime ? selectedTime : ''}
                    selectDate={selectedDate ? selectedDate : ''}

                    backRoute='/login-customers'
                    showContinueButton={false}
                />
            </div>
        </div>
    );
};
