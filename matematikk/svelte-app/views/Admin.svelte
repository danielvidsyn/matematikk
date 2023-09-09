<script>
    import { onMount } from 'svelte';

    let themes = [];
    let questions = [];
    let newTheme = '';
    let newQuestion = '';
    let selectedThemeId;

    onMount(async () => {
        await fetchThemes();
        await fetchQuestions();
    });

    async function fetchThemes() {
        const response = await fetch('/api/themes');
        themes = await response.json();
    }

    async function fetchQuestions() {
        const response = await fetch('/api/questions');
        questions = await response.json();
    }

    async function addTheme() {
        await fetch('/api/themes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: newTheme })
        });
        newTheme = '';
        await fetchThemes();
    }

    async function deleteTheme(id) {
        await fetch(`/api/themes/${id}`, {
            method: 'DELETE'
        });
        await fetchThemes();
    }

    async function addQuestion() {
        await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newQuestion, theme_id: selectedThemeId })
        });
        newQuestion = '';
        await fetchQuestions();
    }

    async function deleteQuestion(id) {
        await fetch(`/api/questions/${id}`, {
            method: 'DELETE'
        });
        await fetchQuestions();
    }
</script>

<div class="admin-section bg-gray-100 p-6 rounded-lg shadow-md m-4">
    <h2 class="text-xl font-bold mb-4">Administrate Themes</h2>
    <div class="flex items-center mb-4">
        <input bind:value={newTheme} placeholder="New theme" class="border p-2 flex-grow rounded mr-2" />
        <button on:click={addTheme} class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Theme</button>
    </div>

    <ul>
        {#each themes as theme}
            <li class="flex items-center justify-between border-b py-2">
                {theme.name}
                <button on:click={() => deleteTheme(theme.id)} class="text-red-500 hover:text-red-600">Delete</button>
            </li>
        {/each}
    </ul>
</div>

<div class="admin-section bg-gray-100 p-6 rounded-lg shadow-md m-4">
    <h2 class="text-xl font-bold mb-4">Administrate Questions</h2>
    <div class="flex items-center mb-4">
        <select bind:value={selectedThemeId} class="border p-2 flex-grow rounded mr-2">
            <option value="">-- Select Theme --</option>
            {#each themes as theme}
                <option value={theme.id}>{theme.name}</option>
            {/each}
        </select>
        <input bind:value={newQuestion} placeholder="New question" class="border p-2 flex-grow rounded mr-2" />
        <button on:click={addQuestion} class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Question</button>
    </div>

    <ul>
        {#each questions as question}
            <li class="flex items-center justify-between border-b py-2">
                {question.content}
                <button on:click={() => deleteQuestion(question.id)} class="text-red-500 hover:text-red-600">Delete</button>
            </li>
        {/each}
    </ul>
</div>
