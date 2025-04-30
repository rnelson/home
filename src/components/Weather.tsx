import WeatherForecast from "./WeatherForecast.tsx";

import Geolocation from "./Geolocation.tsx";

const omaha: GeolocationCoordinates = {
	accuracy: 3845,
	altitude: 0,
	altitudeAccuracy: 0,
	latitude: 41.257160,
	longitude: -95.995102,
	heading: null,
	speed: null,
	toJSON: (): string => "no json"
}

const getCoordinates = (): CoordinateOptions => {
	const {
		coords,
		isGeolocationAvailable,
		isGeolocationEnabled,
		positionError,
	} = Geolocation();

	return {
		coords: coords || omaha,
		geoAvailable: isGeolocationAvailable,
		geoEnabled: isGeolocationEnabled,
		geoError: positionError
	}
}

export interface CoordinateOptions {
	coords: GeolocationCoordinates | undefined,
	geoAvailable: boolean,
	geoEnabled: boolean,
	geoError: GeolocationPositionError | undefined
}

export const Weather = () => {
	const opt = getCoordinates();

	return (
		<>
			<WeatherForecast {...opt} />
		</>
	);
};

export default Weather;
