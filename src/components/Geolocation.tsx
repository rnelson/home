import {GeolocatedConfig, GeolocatedResult, useGeolocated} from "react-geolocated";

const Geolocation = (): GeolocatedResult => {
	const config: GeolocatedConfig = {
		positionOptions: {
			enableHighAccuracy: true,
		},
		userDecisionTimeout: 15000,
	};

	return useGeolocated(config);
};

export default Geolocation;
