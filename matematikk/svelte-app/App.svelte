<script>
    import { Router, Link, Route } from 'svelte-routing';
    import Questions from './components/Questions.svelte';
    import Themes from './components/Themes.svelte';  // Importer Themes-komponenten
</script>
<main>
<Router>
  <nav>
    <Link to="/questions">Questions</Link>
    <Link to="/themes">Themes</Link>  <!-- Legg til en lenke for Themes -->
  </nav>
  
  <Route path="/questions" component={Questions} />
  <Route path="/themes" component={Themes} />  <!-- Legg til en rute for Themes -->
</Router>
</main>
<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
