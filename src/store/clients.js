// src/store/client.js

import { writable } from 'svelte/store';

// Crea un store para mantener los datos globales
export const clients = writable({
    name: '',
    rut: '',
    response: ''
});
