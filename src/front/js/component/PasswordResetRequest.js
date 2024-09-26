import React, { useState, useContext } from 'react';
import { Context } from '../store/appContext';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <div className="bodyPage mt-5">
            <form className="bodyCard card p-4 shadow-lg" style={{ width: "25rem" }} onSubmit={handleSubmit}>
                <h1 className="text-center">Reset your password</h1>
                <h6 className="fs-6 fw-lighter mt-3 text-center">Please enter your email to reset your password.</h6>

                <div className="mt-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        className="form-control"
                        placeholder='example@gmail.com'
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="d-grid mt-5">
                    <button className="btn btn-warning btn-lg shadow" type="submit">Send request</button> {/* Añadida la clase shadow al botón */}
                </div>
            </form>
        </div>
    );
};

export default PasswordResetRequest;
