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
  const headers = new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": API_KEY,
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
  const headers = new Headers({
    "Content-Type": "application/json",
    "Accept": "application/json",
    "x-api-key": API_KEY,
  });

  const request = new Request(`${API_URL}/api/visado?rut=${rut}`, {
    method: "GET",
    headers: headers
  });

  const response = await fetch(request);
  if (!response.ok) {
    throw new Error('Failed to fetch data on client check');
  }

  const data = await response.json();
  return data;
}

// Método load de SvelteKit
export const load = async () => {
  const reply = get(clients);

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
      // Verificar la validez del RUT
      const validez = await checkRUT(rut);

      if (validez.statusCode !== 200 || !validez.valido) {
        return {
          incorrect: true,
          error: "El RUT proporcionado no es válido"
        };
      }

      // Obtener el visado basado en el RUT validado
      const visado = await getVisado(validez.rut);;

      // Crear la respuesta del servidor
      const responseMessage = visado.resultado ? "es sujeto de crédito 🎉" : "no es sujeto de crédito 😢";
      const globalData = {
        name,
        rut: validez.rut,
        response: responseMessage,
      };

      clients.set(globalData);

      return {
        success: true,
        data: globalData // Devolver los datos procesados para que estén disponibles en la página
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
