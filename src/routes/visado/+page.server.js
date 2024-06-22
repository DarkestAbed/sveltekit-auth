// src/routes/visado/+page.server.js

import { clients } from '../../store/clients';
import { get } from 'svelte/store';

const API_KEY = process.env.API_KEY || null;
const API_URL = process.env.API_URL || "http://undefined/";

// Definir estructura inicial de los datos.
let reply = {
	name: "",
	rut: "",
	response: "",
};

// Función para verificar la validez del RUT.
async function checkRUT(rut) {
  	rut = String(rut);

  	const headers = new Headers({
		"Content-Type": "application/json",
		"Accept": "application/json",
		"x-api-key": API_KEY.toString(),
  	});

	const payload = { rut };

	const request = new Request(`${API_URL}/api/checkRut`, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(payload),
	});

	const response = await fetch(request);
	if (!response.ok) {
		console.log(`Error from API. statusCode: ${response.status}`);
		throw new Error('Failed to fetch data on RUT check');
	}

	const data = await response.json();
	return data;
}

// Función para obtener el visado basado en el RUT validado.
async function getVisado(rut) {
  	rut = String(rut);
	const APIroute = `${API_URL}/api/visado?rut=${rut}`;
	
	console.log("APIroute:", APIroute)

	const headers = new Headers({
		"Content-Type": "application/json",
		"Accept": "application/json",
		"x-api-key": API_KEY.toString(),
	});

	const request = new Request(APIroute, {
		method: "GET",
		headers: headers
	});

	const response = await fetch(request);
	
	if (!response.ok) {
		if (response.status >= 400 && response.status < 500) {
			console.log("user error")
			throw new TypeError('Error on user input');
		}
		else if (response.status >= 500) {
			console.log("server error")
			throw new EvalError("Error on server processing");
		}
		throw new Error('Failed to fetch data on client check');
	}

	const data = await response.json();
	return data;
}

// Método load de SvelteKit
export const load = async () => {
	const reply = get(clients);

	console.log("reply:", reply)

	return {
		data: reply,
	};
};

// Acciones del formulario
export const actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const { name, rut } = Object.fromEntries(form);

		if (!rut) {
		return { missing: true };
		}

		try {
		const validez = await checkRUT(rut);

		if (validez.statusCode !== 200 || !validez.valido) {
			if (validez.statusCode >= 500) {
				return {
					incorrect: true,
					error: "Hubo un error procesando los datos"
				}
			};
			return {
				incorrect: true,
				error: "El RUT proporcionado no es válido"
			};
		}

		try {
			var visado = await getVisado(validez.rut);
		} catch(err) {
			if (err.name === "TypeError") {
				console.log("TypeError:", err.message);
				return {
					incorrect: true,
					error: "Error al ingresar datos"
				}
			} else if (err.name === "EvalError") {
				console.log("EvalError:", err.message)
				return {
					serverside: true,
					error: "Error al procesar los datos"
				};
			} else {
				console.log("error:", err.name, "message", err.message)
				return {
					unknown: true,
					error: err.message,
				};
			}
		};

		// Crear la respuesta del servidor
		const responseMessage = visado.resultado ? "es sujeto de crédito 🎉" : "no es sujeto de crédito 😢";
		const globalData = {
			name: name,
			rut: validez.rut,
			response: responseMessage,
		};

		clients.set(globalData);

		return {
			success: true,
			data: globalData,
		};
		} catch (error) {
		console.error("Error al obtener datos:", error);
		return {
			incorrect: true,
			error: "Se produjo un error al obtener los datos."
		};
		}
	}
};
