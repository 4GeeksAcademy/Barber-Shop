const getState = ({ getStore, getActions, setStore }) => {
	return {
	  store: {
		selectedSalon: null,
		selectedProfessional: null,
	  },
	  actions: {
		selectSalon: (salon) => {
		  setStore({ selectedSalon: salon });
		},
		selectProfessional: (professional) => {
		  setStore({ selectedProfessional: professional });
		},
	  }
	};
  };
  
  export default getState;