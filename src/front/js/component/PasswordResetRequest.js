import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import '../../styles/passwordResetRequest.css';
import { useNavigate } from 'react-router-dom';
import SummaryCard from './summaryCard';


const PasswordResetRequest = () => {
    const [email, setEmail] = useState('');
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    const response = await actions.postPasswordResetRequest(email)

    if (response.success) {
   
        window.alert("A reset email has been sent to your email address.");
        navigate('/login-customers-2');
    } else {
        window.alert("There was an error sending the email. Please try again.");
    }
};
   

    return (
        <div className='bodyPage mt-5'>
            <form className='bodyCard ' style={{ width: "25rem" }} onSubmit={handleSubmit}>
                <h1 className='text-center'>Reset your password.</h1>
                <h6 className='fs-6 fw-lighter mt-3'>Please enter your email to reset your password.</h6>
                <div className='mt-3'>
                    <div>
                        <label htmlFor="email">Email</label>
                    </div>
                    <input
                        className="form-control mt-3"
                        placeholder='example@gmail.com'
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className='mt-5'>
                    <button className='btn btn-resetPass' type="submit">Send request</button>

                </div>
            </form>
        </div>

    );
};

export default PasswordResetRequest;

