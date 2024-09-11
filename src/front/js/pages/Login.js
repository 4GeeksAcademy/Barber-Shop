import React from 'react';
import "../../styles/footer.css";


export const Login = () => {
    return (
        <div className='bodyPage '>
            <div className='bodyCard'>
                <h1 className=''>Login</h1>
                <h6 className='fw-lighter'>Login to access your travelwise account</h6>
                <form className='' style={{ width: "25rem" }}>
                    <div className="mb-3">
                        <label for="emailLogin" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="emailLogin" aria-describedby="emailHelp" />
                        
                    </div>
                    <div className="mb-3">
                        <label for="passwordLogin" className="form-label">Password</label>
                        <input type="password" className="form-control" id="passwordLogin" />
                    </div>
                    <div className="mb-3 form-check">
                        <input type="checkbox" className="form-check-input" id="rememberMeCheck" />
                        <label className="form-check-label" for="rememberMeCheck">Remember me</label>
                    </div>
                    <button type="submit" className="btn-login">Login</button>
                </form>
            </div>
        </div>

    )
}
