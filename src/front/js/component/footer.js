import React, { Component } from "react";
import "../../styles/footer.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Footer = () => (
	<footer>
		<nav className="navbar fixed-bottom footer">
			<div className="container-fluid">
				<p className="text ms-2 mt-3"><i className="bi bi-c-circle">  </i>Copyrigth Barber Shop 2024 - All rigth reserved </p>
				<div className="icon">
				<i className="bi bi-whatsapp text me-3"></i>
				<i className="bi bi-facebook text me-3"></i>
				<i className="bi bi-instagram text me-3"></i>
				</div>
			</div>
		</nav>
	</footer>
);
