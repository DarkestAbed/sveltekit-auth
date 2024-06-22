// sveltekit.config.js

import adapter from '@sveltejs/adapter-auto';

import dotenv from 'dotenv';


dotenv.config();

const config = {
	kit: {
		adapter: adapter()
	},
};

export default config;
