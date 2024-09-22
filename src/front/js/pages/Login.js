import React, { useState, useEffect } from 'react';
import "../../styles/login.css";
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
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
            .then(response => {
                console.log(response);
             
                return response.json().then(data => ({code:response.status, data}))
            })

            .then(({code, data}) => {
                if (code == 400) {
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
                    if (data.type === "employee") {
                            navigate("/dashboard");
                    }//else navigate a dashboard de customer
                    
                }
                
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    return (
        <div className='bodyPage'>
            <div className='bodyCard mt-5'>
                <h1>Login</h1>
                <h6 className='fs-6 fw-lighter mt-3'>Login to access your Barber Shop account</h6>
                <form className='mt-3' style={{ width: "25rem" }} onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="emailLogin" className="form-label">Email</label>
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
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMeCheck"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="rememberMeCheck">Remember me</label>
                    </div>

                    <button type="submit" className=" btn btn-login">Login</button>

                </form>
                
        <p className="text-center mt-3">
        Don’t have an account? <a href="/register" className="text-danger">Sign Up</a>
        </p>
            </div>
        </div>
    )
}
