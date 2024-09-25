
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
        else {actions.PasswordReset(searchParams.get("token"), newPassword)
            setTimeout(() => {
                window.close(); // Cerrar la ventana después de 5 segundos
              }, 5000);
          
        }

    };

    return (
        <div className='passReset text-center text-black fs-3 text'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="newPassword">New password</label>
                    <div>
                        <input
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
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className='text-center'>
                    <button className='mt-5' type="submit">
                        Reset password</button>
                </div>
            </form>
        </div>
    );
};

export default PasswordReset;
