import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import '../../styles/passwordResetRequest.css';
import { useNavigate } from 'react-router-dom';
import SummaryCard from './summaryCard';


const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    console.log(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await actions.postPasswordResetRequest(email)
    };

    const selectedProfessional = store.selectedProfessional;
    const selectedService = store.selectedService;
    const selectedDate = store.selectedDate;
    const selectedTime = store.selectedTime;

    return (
        <div className='container mt-5'>
            <div className="row">
                <div className="col-md-8 mt-5 mb-5">
                    <div className='passResetRequ text-center text-black fs-4 text'>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                </div>
                                <input
                                    placeholder='example@gmail.com'
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='mt-5'>
                                <button type="submit">Send request</button>

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
                    backRoute='/login-customers-2'
                    showContinueButton={false}
                />
            </div>
        </div>
    );
};

export default PasswordResetRequest;

