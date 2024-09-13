import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../store/appContext';
import "../../styles/footer.css";

export const Login_Costumer_2 = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const form = {
        "email": email,
        "password": password
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(process.env.BACKEND_URL + "/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
        .then(response => response.json())
        .then(data => {
            if (data.jwt_token){
                localStorage.setItem('jwt_token', data.jwt_token);
            }
            console.log('Success:', data);
            navigate("/dashboard"); // Navegar a dashboard después del login exitoso
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

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
                        </form>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card" style={{ backgroundColor: '#F0F0F0' }}>
                        <div style={{ backgroundColor: '#E0E0E0', padding: '20px', display: 'flex', justifyContent: 'center' }}>
                            <img
                                src="https://images.unsplash.com/photo-1532710093739-9470acff878f?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                className="card-img-top"
                                alt="Location"
                                style={{ width: '100%', height: '200px', objectFit: 'cover', objectPosition: 'center' }}
                            />
                        </div>

                        <div className="card-body">
                            <h5 className="card-title">Vurve - Bangalore</h5>
                            <p className="card-text">MG Road, Bangalore</p>
                            <p><strong>Sun 16 July 2023 at 5:00pm</strong></p>
                            <p>1h duration, ends at 6:00pm</p>
                            {store.selectedService && (
                                <div>
                                    <p><strong>{store.selectedService.name}</strong></p>
                                    <p>Duration: {store.selectedService.duration}</p>
                                    <p>EUR {store.selectedService.price.toFixed(2)}</p>
                                </div>
                            )}
                            <p><strong>Total:</strong> EUR {store.selectedService?.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
