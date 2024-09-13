const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		selectedSalon: null,
		selectedProfessional: null,
		selectedService: null, // Añadir el servicio seleccionado
	  },
	  actions: {
		selectSalon: (salon) => {
		  setStore({ selectedSalon: salon });
		},
		selectProfessional: (professional) => {
		  setStore({ selectedProfessional: professional });
		},
		selectService: (service) => { // Acción para seleccionar el servicio
		  setStore({ selectedService: service });
		},
	  }
	};
  };
  
  export default getState;
  