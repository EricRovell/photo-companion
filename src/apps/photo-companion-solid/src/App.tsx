import { createSignal } from "solid-js";
import { Button } from "ui-solid";
import "ui-solid/styles/tokens.css";

function App() {
	const [count, setCount] = createSignal(0);

	return (
		<>
			<div>
			</div>
			<h1>Vite + Solid</h1>
			<div class="card">
				<Button onClick={() => setCount((count) => count + 1)}>
					count is {count()}
				</Button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p class="read-the-docs">
				Click on the Vite and Solid logos to learn more
			</p>
		</>
	);
}

export default App;
