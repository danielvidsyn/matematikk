<script>
    import { onMount } from 'svelte';

    let questions = [];
    let categories = ["Enkel", "Middels", "Kompleks"];
    let newQuestion = '';
    let selectedCategory;

    onMount(async () => {
        const response = await fetch('/api/questions');
        questions = await response.json();
    });

    async function addQuestion() {
        const response = await fetch('/api/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: newQuestion, category: selectedCategory })
        });

        if (response.ok) {
            // Oppdater spørsmålslisten
            const updatedQuestions = await fetch('/api/questions');
            questions = await updatedQuestions.json();
            newQuestion = ''; // Tøm input-feltet
        }
    }

    async function deleteQuestion(id) {
        const response = await fetch(`/api/questions/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            // Oppdater spørsmålslisten
            questions = questions.filter(question => question.id !== id);
        }
    }
</script>

<h2 class="text-2xl font-bold mb-4">Spørsmål</h2>

<div class="mb-4">
    <select bind:value={selectedCategory} class="border rounded p-2 mr-2">
        <option value="" disabled selected>Velg kategori</option>
        {#each categories as category}
            <option value={category}>{category}</option>
        {/each}
    </select>

    <input bind:value={newQuestion} placeholder="Nytt spørsmål" class="border rounded p-2 mr-2" />
    <button on:click={addQuestion} class="bg-blue-500 text-white rounded p-2">Legg til spørsmål</button>
</div>

<ul>
    {#each questions as question}
        <li class="mb-2">
            {question.content}
            <button on:click={() => deleteQuestion(question.id)} class="bg-red-500 text-white rounded p-1 ml-2">Slett</button>
        </li>
    {/each}
</ul>
