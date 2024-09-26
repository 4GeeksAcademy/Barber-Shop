import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import '../../styles/passwordReset.css';
import { Context } from '../store/appContext';
import { useSearchParams } from 'react-router-dom';

const PasswordReset = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const { token } = useParams();
    const { store, actions } = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        } else {
            actions.PasswordReset(searchParams.get("token"), newPassword);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center mt-5">
            <form className="card p-4 shadow-lg" style={{ width: "25rem" }} onSubmit={handleSubmit}> {/* Sombra añadida */}
                <h1 className="text-center">Let’s create a new password</h1>
                <h6 className="fs-6 fw-lighter mt-3 text-center">Please enter your new password.</h6>
                
                <div className="mt-3">
                    <label htmlFor="newPassword">New password</label>
                    <input
                        className="form-control mt-3"
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                
                <div className="confirmPass mt-3">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                        className="form-control mt-3"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="text-center">
                    <button className="btn btn-warning btn-lg shadow mt-5" type="submit">Reset password</button>
                </div>
            </form>
        </div>
    );
};

export default PasswordReset;
