// src/routes/sign-in/+page.server.js

import { fail, redirect } from '@sveltejs/kit';

import { supabase } from "$lib/db";
import { getUserByEmail } from '../../store/db';

import { dev } from '$app/environment';

async function getUsers() {
	const { data, error } = await supabase
		.from('Users')
		.select('id,email,created_at,active')
		.order('id')
	;

	if (error) {
		console.log(error.message)
		throw new Error(error.message)
	}
	
	return {
		data,
	}
};

export async function load() {
	return {
		users: await getUsers()
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');

		if (email === '' || password === '') {
			throw redirect(307, '/');
		}

		const user = await getUserByEmail(email);
        
		if(!user || user.password !== password) {
            return fail(400, { email, incorrect: true });
        }
 
		cookies.set('session_id', user.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: 60 * 60 // one hour
		});
        throw redirect(303, "/protected")
	}
};
