<!-- src/lib/components/UserList.svelte -->

<script>
    export let data;
</script>

<br />
{#if data} 
	{#each data.users.data as user}
		<li>( {user.id} ) {user.email} :: {user.created_at} [ Activo? {user.active} ]</li>
	{/each}
{:else}
	<p>Something went wrong while fetching the data</p>
{/if}
