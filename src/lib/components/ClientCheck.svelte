<script>
	import Input from '$lib/components/Input.svelte';
	import Button from '$lib/components/Button.svelte';
	import MessageDisplay from './MessageDisplay.svelte';

	import { enhance } from '$app/forms';

	let form;
	let data;
	let name = '';
	let rut = '';
	let sending = false;
</script>


<form
	use:enhance={() => {
		sending = true;
		return ({ update }) => {
			update({
				invalidateAll: false,
				reset: true,
			}).finally(() => {
				sending = false;
			});
		};
	}}
	method="POST" 
	class="space-y-5 {$$props.class}">
	<Input label="Nombre" id="email" name="email" type="text" bind:value={name} />
	<Input label="RUT" id="rut" name="rut" type="text" bind:value={rut} required />
	<Button type="submit">Visar cliente</Button>
</form>

<!-- {#if sending}
	<p>Enviando...</p> -->
{#if form}
	{#if form.missing}
		<p class="error">Requiero el RUT para poder visar 🙂</p>
	{/if}
	{#if form.incorrect}
		<p class="error">RUT erróneo! 😱</p>
	{/if}
	{#if form.success}
		<p class="success">El visado fue exitoso! 🎉</p>
		<MessageDisplay {data} />
	{/if}
{:else}
	<p>Vamos a visar clientes ☺️</p>
{/if}
