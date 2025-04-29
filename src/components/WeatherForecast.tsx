import {CoordinateOptions} from "./Coordinates.tsx";
import {Weather} from "noaajs";
import {Point} from "noaajs/src/weather/response/point.ts";
import {Forecast} from "noaajs/src/weather/response/forecast.ts";
import {useCallback, useEffect, useState} from "react";

const WeatherForecast = ({coords}: CoordinateOptions) => {
	const [state, setState] = useState("");
	const [point, setPoint] = useState<Point>();
	const [forecast, setForecast] = useState<Forecast>();
	const [error, setError] = useState<Error>();

	const fetchForecast = useCallback(async (loc: Array<number> | undefined): Promise<undefined> => {
		setState("loading");
		setPoint(undefined);
		setForecast(undefined);

		Weather.points(loc).get()
			.then((p: Point)=> {
				setPoint(p);
				return p.getGridPointForecast();
			})
			.then((f: Forecast) => {
				setForecast(f);
				setState("done");
			})
			.catch((e: Error) => {
				setState("error");
				setError(e);
			});
	}, []);

	useEffect(() => {
		const location = coords === undefined ? [41.257160, -95.995102] : [coords.latitude, coords.longitude];
		fetchForecast(location);
	}, []);

	if ("error" === state) {
		return (
			<div>
				<strong>error:</strong> {error?.toString()}
			</div>
		);
	} else if ("loading" === state) {
		return (
			<div>
				Loading forecast for {coords?.latitude}, {coords?.longitude}...
			</div>
		);
	} else {
		return (
			<div>
				The forecast for {coords?.latitude}, {coords?.longitude} ({point?.timeZone}) was last updated at {forecast?.updateTime.toString()}
			</div>
		);
	}
}

export default WeatherForecast;
