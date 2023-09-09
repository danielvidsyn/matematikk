<script>
    import { onMount } from 'svelte';

    let themes = [];

    async function fetchThemes() {
        const response = await fetch('/api/themes');
        themes = await response.json();
    }

    onMount(fetchThemes);

    let newTheme = '';

    async function addTheme() {
        const response = await fetch('/api/themes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newTheme })
        });

        if (response.ok) {
            fetchThemes();
        } else {
            console.error('Failed to add theme');
        }
    }

    async function deleteTheme(id) {
        const response = await fetch(`/api/themes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchThemes();
        } else {
            console.error('Failed to delete theme');
        }
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
