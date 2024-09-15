import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

import { Login } from "./pages/Login";

import "../styles/home.css";

import BookAppointment from "./component/BookAppointment";
import BookAppointment_Proffesional from "./component/BookAppointment_Proffesional";
import BookAppointment_Services from "./component/BookAppointment_Services";
import BookAppointment_Date from "./component/BookAppointment_Date";
import LogIn_Costumer from "./component/LogIn_Costumer";
import SignUpPage from "./component/LogIn_Costumer_SignUp";  
import { Login_Costumer_2 } from "./component/LogIn_Costumer_2";
import ReviewAndConfirm from "./component/BookAppointment_Resume"; // Nueva ruta importada
import BookAppointment_Confirm from "./component/BookAppointment_Confirm";
import Dashboard from "./pages/Dashboard";

//create your first component.
const Layout = () => {
    const basename = process.env.BASENAME || "";

    return (
        <div className="contenedor-page" >
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />

                        {/* Ruta para seleccionar BookAppointment */}
                        <Route element={<BookAppointment />} path="/book-appointment" />

                        {/* Ruta para seleccionar profesionales */}
                        <Route element={<BookAppointment_Proffesional />} path="/book-appointment-proffesional" />

                        {/* Ruta para seleccionar servicios */}
                        <Route element={<BookAppointment_Services />} path="/book-appointment-services" />

                        {/* Ruta para seleccionar la fecha */}
                        <Route element={<BookAppointment_Date />} path="/book-appointment-date" />

                        {/* Ruta para LogIn_Customers */}
                        <Route element={<LogIn_Costumer />} path="/login-customers" />

                        {/* Ruta para LogIn_Customers correo y contraseña */}
                        <Route element={<Login_Costumer_2 />} path="/login-customers-2" />

                        {/* Ruta para Sign Up Page */}
                        <Route element={<SignUpPage />} path="/sign-up" />

                        {/* ruta Dashboard */}
                        <Route element={<Dashboard />} path="/dashboard" />

                        {/* Ruta para la página de revisión y confirmación */}

                        <Route element={<ReviewAndConfirm />} path="/book-appointment-resume" />

                        <Route element={<BookAppointment_Confirm/>} path="/book-appointment-confirm" />

                        {/* Ruta de fallback para 404 */}
                        <Route element={<h1>Not found!</h1>} path="*" />

                        
                    </Routes>
                    
                </ScrollToTop>
               <Footer /> 
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
