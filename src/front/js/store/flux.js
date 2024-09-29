import UpdateEmployeeCard from "../component/UpdateEmployeeCard";

const getState = ({ getStore, getActions, setStore }) => {

	return {
		store: {
			selectedSalon: null,
			selectedProfessional: null,
			selectedService: null,
			//fetch employee

			professional: [],
			customer: [],
			services: [],
			appointments:[],
			selectedDate:null,
			selectedTime:null,
			selectCustomer:null,
			messageAppointment: "",
			token: localStorage.getItem('jwt_token') || null,
			auth: !!localStorage.getItem('jwt_token'),
			userType: "",
			appointment_id: null


		},
		actions: {
			setToken: (token) => {
				if (token) {
					localStorage.setItem('jwt_token', token);
					setStore({
						token: token,
						auth: true,
					});
				} else {
					localStorage.removeItem('jwt_token');
					setStore({
						token: null,
						auth: false,
					});
				}
			},
			// Cerrar sesión
			logout: () => {
				localStorage.removeItem('jwt_token');
				setStore({
					token: null,
					auth: false,
					selectCustomer: null,
				});
				console.log("Usuario desconectado");
			},

			selectSalon: (salon) => {
				setStore({ selectedSalon: salon });
			},
			selectProfessional: (professional) => {
				const store = getStore();
				setStore({ ...store, selectedProfessional: professional });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			selectService: (service) => {
				const store = getStore();
				setStore({ ...store, selectedService: service });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			//fetch date appointment
			selectDate: (date) => {
				const store = getStore();
				setStore({ ...store, selectedDate: date });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			//fetch time appointment
			selectTime: (time) => {
				const store = getStore();
				setStore({ ...store, selectedTime: time });
				localStorage.setItem('appState', JSON.stringify(getStore()));
			},
			selectCustomer: (customer) => {
				const store = getStore();
				setStore({ ...store, selectCustomer: customer });


				localStorage.setItem('appState', JSON.stringify(getStore()));
			},

			//fetch Employee
			getProfessional: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/employees")
					const data = await resp.json()
					setStore({ professional: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			
			postNewEmployee: async (newEmployee) => {
				const store = getStore();
				const token = store.token;
			
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/register_employee", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify(newEmployee)
					});
			
					if (!resp.ok) {
						const errorData = await resp.json();
						console.error('Error data:', errorData);
						throw new Error(errorData.msg || 'Error enviando solicitud de actualización de empleado');
					}
					const data = await resp.json();
					setStore({ professional: newEmployee });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
					return null;
				}
			},
			

			updateEmployee: async (updatedEmployee) => {
				const store = getStore();
				const token = store.token; // Obtener el token del estado global

				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/update_employee", {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` // Usar el token del estado global
						},
						body: JSON.stringify(updatedEmployee)
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						console.error('Error data:', errorData);
						throw new Error(errorData.msg || 'Error enviando solicitud de actualización de empleado');
					}

					const data = await resp.json();
					const updatedProfessionals = store.professional.map(pro =>
						pro.id === updatedEmployee.id ? { ...pro, ...updatedEmployee } : pro
					);
					setStore({ professional: updatedProfessionals });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
					return null; // Retornar null en caso de error
				}
			},

			//fetch Customer Bernardo
			getCustomer: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customers")
					const data = await resp.json()
					setStore({ customer: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			updateCustomer: async (updatedCustomer) => {
				const store = getStore();
				const token = store.token; // Obtener el token del estado global

				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customer_update", {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}` // Usar el token del estado global
						},
						body: JSON.stringify(updatedCustomer)
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'Error enviando solicitud de actualización de customer');
					}

					const data = await resp.json();
					const updatedcustomers = store.customer.map(customer =>
						customer.id === updatedCustomer.id ? { ...customer, ...updatedCustomer } : customer
					);
					setStore({ customer: updatedcustomers });
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error);
					return null; // Retornar null en caso de error
				}
			},
			fetchEmployeeId: async () => {
				const store = getStore();
				const token = store.token;
				
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/get_employee_info', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'Error al obtener ID del empleado');
					}

					const data = await resp.json();
					return data.id;
				} catch (error) {
					console.error("Error loading employee ID from backend", error);
					return null;
				}
			},

			fetchCustomerId: async () => {
				const store = getStore();
				const token = store.token;
				
				try {
					const resp = await fetch(process.env.BACKEND_URL + '/api/get_customer_info', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${token}`
						}
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'Error al obtener ID del empleado');
					}

					const data = await resp.json();
					return data.id;
				} catch (error) {
					console.error("Error loading employee ID from backend", error);
					return null;
				}
			},

			//fetch Services
			getServices: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/services")
					const data = await resp.json()
					setStore({ services: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			//fetch appointment
			getAppointments: async () => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/appointments")
					const data = await resp.json()
					setStore({ appointments: data })
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			postAppointment: async () => {
				const store = getStore()
				console.log(store.selectCustomer);


				try {
					const appointmentData = {
						order_date: new Date().toISOString(),
						appointment_time: store.selectedTime,
						customer_id: store.selectCustomer, // Debo ser el ID del cliente logueado
						employee_id: store.selectedProfessional.id,
						service_id: store.selectedService.id,
						appointment_state_id: true,
						appointment_date: store.selectedDate

					}
					console.log('Datos de la cita:', appointmentData);
					const resp = await fetch(process.env.BACKEND_URL + "/api/new_appointment", {
						method: "POST",
						body: JSON.stringify(appointmentData),
						headers: { "Content-Type": "application/json" }

					})
					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'error al reservar cita');
					}

					const data = await resp.json()
					console.log('Reserva exitosa', data)
					setStore({ appointment_id: data.appointment_id })

					return data;
				} catch (error) {
					console.log("Error en registrar la reserva:'", error)
					throw error;
				}

			},
			//fetch signupCustomer
			postSignupCustomer: async (customerData) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/customer_register", {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(customerData)
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'Error al registrar el usuario');
					}

					const data = await resp.json();
					console.log('Registro exitoso', data);

					if (data.jwt_token) {

						getActions().setToken(data.jwt_token);
					}

					// Almacenar el customer_id en selectCustomer
					setStore({ selectCustomer: data.customer_id });
					setStore({ customer: data })
					// Guardar el estado actualizado en localStorage
					localStorage.setItem('appState', JSON.stringify(getStore()));
					localStorage.setItem('email', data.email);
					localStorage.setItem('userType', data.type);
					console.log('Customer ID almacenado:', data.customer_id);
					return data;
				} catch (error) {
					console.log("Error en el registro:", error);
					throw error;
				}
			},

			//fetch PasswordResetRequest
			postPasswordResetRequest: async (email) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/request_password_reset', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ email })
					});


					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.msg || 'Error enviando solicitud de restablecimiento de contraseña');
					}

					const data = await response.json();  // Convierte la respuesta en JSON
					return { success: true, message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu email' };  // Devuelve un objeto
				} catch (error) {
					console.error('Error:', error);
					return { success: false, message: error.message };  // Devuelve el error capturado
				}
			},
			//fetch PasswordReset
			PasswordReset: async (token, newPassword) => {
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/reset_password', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${token}`
						},
						body: JSON.stringify({ new_password: newPassword })
					});

					if (!response.ok) {
						const errorData = await response.json();
						throw new Error(errorData.msg || 'Error restableciendo la contraseña');
					}

					alert('¡Tu contraseña ha sido restablecida!');
				} catch (error) {
					console.error('Error:', error);
					alert('Hubo un error al restablecer la contraseña');
				}
			},
			//fetch messageAppointmentCustomer
			messageAppointmentCustomer: (message) => {
				const store = getStore();
				setStore({ ...store, messageAppointment: message });
				localStorage.setItem('appState', JSON.stringify(getStore()));

			},
			//fetch login customer
			loginCustomer: async (form) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
						method: 'POST',
						headers: {
							'Content-Type': "application/json",
						},
						body: JSON.stringify(form),
					});

					if (!resp.ok) {
						const errorData = await resp.json();
						throw new Error(errorData.msg || 'Error al autenticar usuario');
					}

					const data = await resp.json();

					if (data.jwt_token) {
						getActions().setToken(data.jwt_token);
						console.log(data);
						//bernardo
						localStorage.setItem('jwt_token', data.jwt_token);
						localStorage.setItem('userType', data.type);
						localStorage.setItem('email', data.email);
						//alberto
						setStore({ selectCustomer: data.customer_id });
						console.log('Inicio de sesión exitoso');
						return true; // Retornar éxito
					}

					return false;
				} catch (error) {
					console.error('Error:', error);
					return false;
				}
			},
			getCustomerId: async () => {
				const store = getStore();
				const token = store.token;
				if (!token) {
					console.log("No se ha encontrado un token.");
					return;
				}

				try {
					
					const resp = await fetch(process.env.BACKEND_URL + "/api/get_customer_id", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${token}`
						}
					});

					if (!resp.ok) {
						
						throw new Error("Error al obtener el customer_id");
					}

					const data = await resp.json();
					setStore({ selectCustomer: data.customer_id });
					console.log("Customer ID obtenido", data);
				} catch (error) {
					console.error("Error:", error);
				}
			},
			deleteAppointment: async (appointmentId) => {
				const store = getStore()
				const token = store.token;
				if (!token) {
					console.error('Token JWT faltante');
					return;
				  }
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/delete_appointment', {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${token}`,  
						},
						body: JSON.stringify({ appointment_id: appointmentId })  
					});
					

					if (!response.ok) {
						const errorMessage = await response.json();
						throw new Error(errorMessage.msg || "Error al cancelar la cita");
					}

					const result = await response.json();
					if (!result.msg) {
						throw new Error("Formato de respuesta no esperado");
					  }
					console.log(result);
					
					return result;

				} catch (error) {
					console.error("Error al cancelar la cita:", error);
					throw error;
				}
			},
			resetAppointmentState: () => {
				setStore({
					selectedService: null,
					selectedProfessional: null,
					selectedDate: null,
					selectedTime: null,
					appointment_id: null
				});
			},
			deleteCustomer: async (email) => {
				const store = getStore();
				const token = store.token;
				try {
					const response = await fetch(process.env.BACKEND_URL + '/api/delete_customer', {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							"Authorization": `Bearer ${token}`,  // Asegúrate de que el token JWT está almacenado
						},
						body: JSON.stringify({ email })  // Asegúrate de que envías el email del cliente
					});
			
					if (!response.ok) {
						const errorMessage = await response.json();
						throw new Error(errorMessage.msg || "Error al eliminar el cliente");
					}
			
					const result = await response.json();
					return result;
			
				} catch (error) {
					console.error("Error al eliminar el cliente:", error);
					throw error;
				}
			},
			
			
		}
	};
};

export default getState;
