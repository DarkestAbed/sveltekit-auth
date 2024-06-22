<!-- src/lib/components/ClientCheck.svelte -->

<script>
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';

	import { enhance } from '$app/forms';

	let sending = false;
	let name = '';
	let rut = '';

	console.log("sending:", sending)
</script>


<form
	use:enhance={() => {
		sending = true;
		console.log("sending:", sending)

		return ({ update }) => {
			update({ reset: true, }).finally(() => {
				sending = false;
				console.log("sending:", sending)
			});
		};
	}}
	method="POST" 
	class="space-y-5 {$$props.class}">
	<Input label="Nombre" id="email" name="email" type="text" bind:value={name} />
	<Input label="RUT" id="rut" name="rut" type="text" bind:value={rut} required />
	<Button type="submit">Visar cliente</Button>
</form>

{#if sending}
	<br/><p>Procesando datos...</p>
{:else}
	<p></p>
{/if}
