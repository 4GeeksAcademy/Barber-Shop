import React, { useState } from 'react';
import "../../styles/footer.css";

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className='bodyPage'>
            <div className='bodyCard'>
                <h1>Login</h1>
                <h6 className='fs-6 fw-lighter mt-3'>Login to access your travelwise account</h6>
                <form className='mt-3' style={{ width: "25rem" }} onSubmit={handleSubmit}>
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
    )
}
