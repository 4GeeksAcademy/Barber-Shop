
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/passwordReset.css'
import { Context } from '../store/appContext';

const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

    };

    return (
        <div className='bodyPage mt-5'>

            <form className='bodyCard' style={{ width: "25rem" }} onSubmit={handleSubmit}>
                <h1 className='text-center'>Let’s create a new password</h1>
                <h6 className='fs-6 fw-lighter mt-3'>Please enter your new password.</h6>
                <div className='mt-3'>
                    <label htmlFor="newPassword">New password</label>
                    <div>
                        <input className="form-control mt-3"
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='confirmPass mt-3'>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <div>
                        <input
                            className="form-control mt-3"
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='text-center'>
                    <button className='btn-login btn mt-5' type="submit">
                        Reset password</button>
                </div>
            </form>
        </div>
    );
};

export default PasswordReset;
