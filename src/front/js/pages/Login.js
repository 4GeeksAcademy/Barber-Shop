import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        const rememberedCheck = localStorage.getItem('rememberMeCheck') === 'true';

        if (rememberedEmail && rememberedPassword && rememberedCheck) {
            setEmail(rememberedEmail);
            setPassword(rememberedPassword);
            setRememberMe(rememberedCheck);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(process.env.BACKEND_URL + "/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json().then(data => ({ code: response.status, data })))
            .then(({ code, data }) => {
                if (code === 400) {
                    alert(data.msg);
                }
                if (data.jwt_token) {
                    if (rememberMe) {
                        localStorage.setItem('rememberedEmail', email);
                        localStorage.setItem('rememberedPassword', password);
                        localStorage.setItem('rememberMeCheck', rememberMe);
                    } else {
                        localStorage.removeItem('rememberedEmail');
                        localStorage.removeItem('rememberedPassword');
                        localStorage.removeItem('rememberMeCheck');
                    }
                    localStorage.setItem('jwt_token', data.jwt_token);
                    localStorage.setItem('userType', data.type);
                    localStorage.setItem('email', data.email);
                    if (data.type === "employee") {
                        navigate("/dashboard");
                    } else {
                        navigate("/dashboard-customer");
                    }
                }
            })
            .catch((error) => {
                setErrorMessage("Incorrect username or password");
                console.error('Error:', error);
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-start" style={{ paddingTop: '5rem', height: 'auto', minHeight: '100vh' }}> {/* Ajuste para reducir espacio inferior */}
            <div className="card p-4 shadow" style={{ width: '90%', maxWidth: '30rem' }}>
                <h1 className="text-center h4">Login</h1>
                <h6 className="text-center fs-6 fw-lighter mt-3">Login to access your Barber Shop account</h6>
                <form className="mt-3" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label htmlFor="emailLogin" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="emailLogin"
                            aria-describedby="emailHelp"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="passwordLogin" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordLogin"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-2 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMeCheck"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="rememberMeCheck">Remember me</label>
                    </div>

                    <button type="submit" className="btn btn-warning w-100 mb-2">Login</button>
                    {errorMessage && (
                        <Alert variant="danger" className="mt-2">
                            {errorMessage}
                        </Alert>
                    )}
                    <div className="mt-2">
                        <p className="text-center">Reset password click <a href='/password-reset-request' className='text-danger'>here</a></p>
                    </div>
                </form>

                <p className="text-center mt-3">
                    Don’t have an account? <a href="/register" className="text-danger">Sign Up</a>
                </p>
            </div>
        </div>
    );
};
