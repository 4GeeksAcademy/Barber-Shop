import React, { Component } from "react";
import "../../styles/login.css";
import "bootstrap/dist/css/bootstrap.min.css";

export const Footer = () => (
	<footer className="mt-auto fixed-bottom">
		<nav className="navbar mt-auto  bg-dark">
			<div className="container-fluid">
				<p className="text ms-2 mt-3"><i className="bi bi-c-circle">  </i>Copyrigth Barber Shop 2024 - All rigth reserved </p>
				<div className="icon">
					<a href="https://4geeksacademy.com/us/index?utm_source=facebook&utm_medium=social&utm_campaign=organic+bio&fbclid=IwY2xjawFTzf5leHRuA2FlbQIxMAABHTAoXeRD9tg7SZHFiI0aUBuRy6bR4wh7rNe8xmoNKml2njxYfDQrY7WL_Q_aem_R6B6THui8gDGva0CxwzvLQ"><i className="bi bi-whatsapp text me-3"></i></a>
					<a href="https://www.facebook.com/4geeksacademy"><i className="bi bi-facebook text me-3"></i></a>
					<a href="https://www.instagram.com/4geeksacademy/"><i className="bi bi-instagram text me-3"></i></a>
				</div>
			</div>
		</nav>
	</footer>
);
