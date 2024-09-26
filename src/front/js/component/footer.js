import React, { useState, useEffect } from "react";
import "../../styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Footer = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Detectar si estamos al final del scroll para mostrar el footer
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Si el usuario ha llegado al final de la página
        if (scrollTop + windowHeight >= documentHeight) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <footer className={`footer ${isVisible ? "show" : "hide"}`}>
            <nav className="navbar bg-dark">
                <div className="container-fluid">
                    <p className="text ms-1 mt-1">
                        <i className="bi bi-c-circle"></i> Copyright Barber Shop 2024 - All rights reserved
                    </p>
                    <div className="icon">
                        <a href="https://4geeksacademy.com">
                            <i className="bi bi-whatsapp text me-3"></i>
                        </a>
                        <a href="https://www.facebook.com/4geeksacademy">
                            <i className="bi bi-facebook text me-3"></i>
                        </a>
                        <a href="https://www.instagram.com/4geeksacademy/">
                            <i className="bi bi-instagram text me-3"></i>
                        </a>
                    </div>
                </div>
            </nav>
        </footer>
    );
};
