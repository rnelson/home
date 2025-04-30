import "./App.css";
import Weather from "./components/Weather.tsx";
import WebSearch from "./components/WebSearch.tsx";

const App = () => {

	return (
		<div>
			<WebSearch/>
			<Weather/>
		</div>
	);
};

export default App;
