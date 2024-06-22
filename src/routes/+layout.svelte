<!-- src/routes/+layout.svelte -->

<script>
	import { goto } from '$app/navigation';
	
	import Navigation from '$lib/components/Navigation.svelte';
	
	import './styles.css';

    export let data;
    
	async function handleSignOut(event) {
		const status = event.detail.signout;
        await goto(`/?signout=${status}`);
	}
</script>

<div class="app">
	<Navigation user={data.user} on:signout={handleSignOut}/>

    <div class="container mx-auto mt-8 antialiased">
        <slot />
    </div>
</div>
