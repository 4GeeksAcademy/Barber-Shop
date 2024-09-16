const getState = ({ getStore, getActions, setStore }) => {

	const savedState = JSON.parse(localStorage.getItem('appState')) || {};

	return {
		store: {
			selectedSalon: null,
			selectedProfessional: savedState.selectedProfessional || null, // Usar valor guardado o null
     		selectedService: savedState.selectedService || null, // Añadir el servicio seleccionado
			//fetch employee
			professional: [],
			customer: [],
			services:[]

		},
		actions: {
			selectSalon: (salon) => {
				setStore({ selectedSalon: salon });
			},
			selectProfessional: (professional) => {
				const store = getStore();
				setStore({ ...store, selectedProfessional: professional });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			selectService: (service) => { // Acción para seleccionar el servicio
				const store = getStore();
				setStore({ ...store, selectedService: service });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},

			selectCustomer: (customer)=>{
				const store = getStore();
				setStore({ ...store, selectCustomer: customer});
        localStorage.setItem('appState', JSON.stringify(getStore()));
			},

			//fetch Employee
			getProfessional: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/employees")
					const data = await resp.json()
					setStore({ professional: data })
					console.log(data)
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			//fetch Customer
			getCustomer: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customers")
					const data = await resp.json()
					setStore({ customer: data })
					console.log(data)
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			//fetch Services
			getServices: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/services")
					const data = await resp.json()
					setStore({ services: data})
					console.log(data)
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
		}
	};
};

export default getState;
