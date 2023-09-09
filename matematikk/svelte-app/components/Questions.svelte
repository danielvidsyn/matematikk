<script>
    import { onMount } from 'svelte';

    let questions = [];
    let categories = ["Enkel", "Middels", "Kompleks"];
    let newQuestion = '';
    let selectedCategory;
    let alternatives = {};
    let hints = {};

    let selectedOption = {}; // Til å holde styr på valgte alternativer
    let showHints = {}; // Til å kontrollere om hint skal vises

    onMount(async () => {
        const response = await fetch('/api/questions');
        questions = await response.json();

        for (let question of questions) {
            alternatives[question.id] = await fetch(`/api/getAlternatives/${question.id}`).then(res => res.json());
            hints[question.id] = await fetch(`/api/getLatexHint/${question.id}`).then(res => res.json());
        }
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

    function showHint(questionId) {
        showHints[questionId] = true;
        // Her kan du også få verdien av valgt alternativ for spørsmålet
        console.log(`Valgt alternativ for spørsmål ${questionId}: ${selectedOption[questionId]}`);
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
            <div class="mb-4">
                {#each alternatives[question.id] as alternative}
                    <label class="block mb-2">
                        <input type="radio" group:checked={selectedOption[question.id]} value={alternative.id} class="mr-2">
                        {alternative.text}
                    </label>
                {/each}
            </div>
            <button class="bg-blue-500 text-white px-4 py-2 rounded" on:click={() => showHint(question.id)}>Vis hint</button>
            <div id={`hint-${question.id}`} class="mt-4 p-4 bg-gray-100 rounded" style="display: none;">
                {hints[question.id]?.hint}
            </div>
        </li>
    {/each}
</ul>
