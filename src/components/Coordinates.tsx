import Geolocation from "./Geolocation.tsx";

const getDirection = (degrees: number, isLongitude: boolean) =>
	degrees > 0 ? (isLongitude ? "E" : "N") : isLongitude ? "W" : "S";

const formatDegrees = (degrees: number, isLongitude: boolean) =>
	`${0 | degrees}° ${
		0 | (((degrees < 0 ? (degrees = -degrees) : degrees) % 1) * 60)
	}' ${0 | (((degrees * 60) % 1) * 60)}" ${getDirection(
		degrees,
		isLongitude,
	)}`;

export const getCoordinates = (): CoordinateOptions => {
	const {
		coords,
		isGeolocationAvailable,
		isGeolocationEnabled,
		positionError,
	} = Geolocation();

	return {
		coords: coords,
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

export const Coordinates = ({coords, geoAvailable, geoEnabled, geoError}: CoordinateOptions) => {
	return (
		<div className="p-4 m-4 bg-slate-100 rounded-sm max-w-md mx-auto bg-white drop-shadow-lg flex flex-col items-center space-x-4">
			<div className="text-slate-900">
				<div className="m-8 font-bold text-l">
					{!geoAvailable ? (
						<div>Your browser does not support Geolocation.</div>
					) : !geoEnabled ? (
						<div>Geolocation is not enabled.</div>
					) : coords ? (
						<div>
							<span className="coordinate">
                                {formatDegrees(coords.latitude, false)}
                            </span>
							,{" "}
							<span className="coordinate">
                                {formatDegrees(coords.longitude, true)}
                            </span>
						</div>
					) : (
						<div>Getting the location data&hellip;</div>
					)}
					{!!geoError && (
						<div>
							<br />
							Last position error:
							<pre>{JSON.stringify(geoError)}</pre>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
