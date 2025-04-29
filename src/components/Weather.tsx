import {Coordinates, getCoordinates} from "./Coordinates.tsx";
import WeatherForecast from "./WeatherForecast.tsx";


const Weather = () => {
	const opt = getCoordinates();

	return (
		<>
			<Coordinates {...opt} />
			<WeatherForecast {...opt} />
		</>
	);
};

export default Weather;
