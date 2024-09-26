import React, { useContext } from "react";
import { Context } from "../store/appContext";

import "../../styles/home.css";
import Header from "../component/header";
import InfoSection from "../component/infoSection";
import Servicios from "../component/servicios"; // Este es el componente de Servicios
import Contact from "../component/contact";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="contenedor-page">
			<Header /> {/* Sección del encabezado */}
			<InfoSection /> {/* Sección de información */}
			<Servicios /> {/* Sección de Servicios */}
			<Contact /> {/* Sección de Contacto */}
		</div>
	);
};
