import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import BookAppointment_Proffesional from "./component/BookAppointment_Proffesional"; // Importación del componente profesional
import SalonInfo from "./component/SalonInfo"; // Importación de SalonInfo (BookAppointment)
import BookAppointment from "./component/BookAppointment";

//create your first component
const Layout = () => {
    const basename = process.env.BASENAME || "";

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        
                        {/* Ruta para BookAppointment_Proffesional */}
                        <Route element={<BookAppointment_Proffesional />} path="/book-appointment-proffesional" />
                        
                        {/* Ruta para SalonInfo (donde está el botón para redirigir) */}
                        <Route element={<BookAppointment />} path="/book-appointment" />
                        
                        {/* Ruta de fallback para 404 */}
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
