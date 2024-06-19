<!-- src/lib/components/messageDisplay.svelte -->


<script>
    export let data;

    let message = "";

    $: {
        if (data) {
            message = `Cliente: ${data.data.name}, RUT: ${data.data.rut}, Resultado: ${data.data.response}`;
        } else {
            message = "No se proporcionaron datos.";
        }
    }
</script>

<div class="message">
    <p>{message}</p>
</div>

<style>
    .message {
        font-weight: bold;
        color: #333;
    }
</style>
