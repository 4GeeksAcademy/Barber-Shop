import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";  // Aquí se importa el componente Home que muestra Servicios
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
import SignUpPage from "./pages/SignUpPage"
import { Login_Costumer_2 } from "./component/LogIn_Costumer_2";
import ReviewAndConfirm from "./component/BookAppointment_Resume";
import BookAppointment_Confirm from "./component/BookAppointment_Confirm";
import Dashboard from "./pages/Dashboard";
import UpdateEmployeeCard from "./component/UpdateEmployeeCard";
import PasswordResetRequest from "./component/PasswordResetRequest";
import PasswordReset from "./component/PasswordReset";
import SignUp from "./pages/SignUp";
import DashboardCustomer from "./pages/DashboardCustomer";
import UpdateCustomerCard from "./component/UpdateCustomerCard";
import InactivityAlert from "./component/InactivityAlert";
import SummaryCard from "./component/summaryCard";
import EmployeeRegister from "./pages/EmployeeRegister";

// Aquí se crean las rutas principales, incluida la que apunta a la sección de servicios
const Layout = () => {
    const basename = process.env.BASENAME || "";

    return (
        <div className="contenedor-page">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar /> {/* Incluimos la Navbar */}
                    <Routes>
                        <Route element={<Home />} path="/" /> {/* Ruta para la home */}
                        <Route element={<Login />} path="/login" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />

                        {/* Ruta para BookAppointment */}
                        <Route element={<BookAppointment />} path="/book-appointment" />

                        {/* Ruta para seleccionar servicios */}
                        <Route element={<BookAppointment_Services />} path="/book-appointment-services" />

                        {/* Ruta para seleccionar profesionales */}
                        <Route element={<BookAppointment_Proffesional />} path="/book-appointment-proffesional" />

                        {/* Ruta para seleccionar fecha */}
                        <Route element={<BookAppointment_Date />} path="/book-appointment-date" />

                        {/* Ruta para iniciar sesión con clientes */}
                        <Route element={<LogIn_Costumer />} path="/login-customers" />

                        {/* Ruta para loguearse con correo y contraseña */}
                        <Route element={<Login_Costumer_2 />} path="/login-customers-2" />

                        {/* Ruta para la página de registro */}
                        <Route element={<SignUpPage />} path="/sign-up" />

                        <Route element={<SignUp />} path="/register"/>
                        <Route element={<EmployeeRegister/>} path="/employee-register"/>
                        {/* Ruta para los dashboards */}
                        <Route element={<Dashboard />} path="/dashboard" />
                        <Route element={<DashboardCustomer />} path="/dashboard-customer" />

                        {/* Ruta para actualizar empleado */}
                        <Route element={<UpdateEmployeeCard />} path="/update-employee" />
                        <Route element={<UpdateCustomerCard />} path="/update-customer" />

                        {/* Ruta para confirmar la cita */}
                        <Route element={<ReviewAndConfirm />} path="/book-appointment-resume" />

                        <Route element={<BookAppointment_Confirm />} path="/book-appointment-confirm" />

                        {/* Rutas de recuperación de contraseña */}
                        <Route element={<PasswordResetRequest />} path="/password-reset-request" />
                        <Route element={<PasswordReset />} path="/reset-password" />

                        {/* Ruta de tarjeta de resumen */}
                        <Route element={<SummaryCard />} path="/summarycard" />

                        {/* Ruta de fallback para 404 */}
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer /> {/* Incluimos el Footer */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
