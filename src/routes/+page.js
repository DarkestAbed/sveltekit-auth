/** @type {import('./$types').PageLoad} */
export const load = async ({ parent }) => {
	const { user } = await parent();
	if (user) {
		console.log("user", user);
		return {
			user: user
		};
	}
	else {
		console.log("no user", user);
	}
};
