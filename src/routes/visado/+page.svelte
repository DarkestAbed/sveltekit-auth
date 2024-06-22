<!-- src/routes/visado/+page.svelte -->

<script>
    import ClientCheck from '$lib/components/ClientCheck.svelte';
    import MessageDisplay from '$lib/components/MessageDisplay.svelte';
    
    export let sending = false;
    export let form;
    export let data;
</script>

<svelte:head>
    <title>Visado de prospectos</title>
    <meta name="description" content="About this app" />
</svelte:head>

<ClientCheck sending={sending}/>
<br/>

{#if form}
	{#if form.missing}
		<p class="error">Requiero el RUT para poder visar 🙂</p>
	{/if}
	{#if form.serverside}
		<p class="error">Algo pasó al visar el RUT. Intenta de nuevo.</p>
	{/if}
	{#if form.unknown}
		<p class="error">Pasó algo inesperado 🥲: {form.error}</p>
	{/if}
	{#if form.incorrect}
		<p class="error">RUT erróneo! 😱</p>
	{/if}
	{#if form.success}
		<p class="success">El visado fue exitoso! 🎉</p>
		<MessageDisplay {data} />
	{/if}
{:else}
	<p>Vamos a visar clientes 😊</p>
{/if}
