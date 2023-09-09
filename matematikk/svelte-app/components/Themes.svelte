<script>
    let themes = [];

    // Hent temaer fra API ved komponentens montering
    onMount(async () => {
        const response = await fetch('/api/themes');
        themes = await response.json();
    });

    let newTheme = '';

    function addTheme() {
        fetch('/api/themes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newTheme })
        }).then(() => {
            // Oppdater tema-listen eller naviger brukeren
        });
    }

    function deleteTheme(id) {
        fetch(`/api/themes/${id}`, {
            method: 'DELETE'
        }).then(() => {
            // Oppdater tema-listen eller naviger brukeren
        });
    }
</script>

<input bind:value={newTheme} placeholder="Nytt tema" />
<button on:click={addTheme}>Legg til tema</button>

<ul>
    {#each themes as theme}
        <li>
            {theme.name}
            <button on:click={() => deleteTheme(theme.id)}>Slett</button>
        </li>
    {/each}
</ul>

<ul>
    {#each themes as theme}
        <li>{theme.name}</li>
    {/each}
</ul>

