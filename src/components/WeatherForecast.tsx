import {Weather} from "noaajs";
import {Point} from "noaajs/src/weather/response/point.ts";
import {Forecast} from "noaajs/src/weather/response/forecast.ts";
import {useCallback, useEffect, useState} from "react";
import {CoordinateOptions} from "./Weather.tsx";

const getDirection = (degrees: number, isLongitude: boolean) =>
	degrees > 0 ? (isLongitude ? "E" : "N") : isLongitude ? "W" : "S";

const formatDegrees = (degrees: number, isLongitude: boolean) =>
	`${0 | degrees}° ${
		0 | (((degrees < 0 ? (degrees = -degrees) : degrees) % 1) * 60)
	}' ${0 | (((degrees * 60) % 1) * 60)}" ${getDirection(
		degrees,
		isLongitude,
	)}`;

const epochToHuman = (value: number | string): string => {
	if (!value)
		return '';

	const time = new Date(Number(value));
	if (isNaN(time.valueOf()))
		return '';

	return time.toLocaleString("en-US", {hour: "numeric", minute: "numeric", hour12: true});
};

// https://windy.app/blog/what-is-wind-direction.html
const updateWindArrows = (): void => {
	const angles: [string, number][] = [
		["N", 0],
		["NNE", 22.5],
		["NE", 45],
		["ENE", 67.5],
		["E", 90],
		["ESE", 112.5],
		["SE", 135],
		["SSE", 157.5],
		["S", 180],
		["SSW", 202.5],
		["SW", 225],
		["WSW", 247.5],
		["W", 270],
		["WNW", 292.5],
		["NW", 315],
		["NNW", 337.5]
	];

	angles.map(([direction, degrees]) => {
		const elements = document.getElementsByClassName(`arrow-${direction}`);

		for (const element of elements) {
			if (!element.classList.contains("fa-rotate-by"))
				element.classList.add("fa-rotate-by");

			const attr = document.createAttribute("style");
			attr.value = `--fa-rotate-angle: ${degrees}deg`;

			element.attributes.setNamedItem(attr);
		}
	});
}

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
			.then((p: Point) => {
				setPoint(p);
				return p.getGridPointForecast();
			})
			.then((f: Forecast) => {
				console.log(f);
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
		// TODO: Figure out how this works. I assumed putting it before the return() that actually adds those elements would mean nothing is there to update
		updateWindArrows();

		return (
			<div>
				<div>
					Forecast for {formatDegrees(coords!.latitude, false)}, {formatDegrees(coords!.longitude, true)}
				</div>

				<div>
					{forecast?.periods?.map((period) => {
						return (
							<div key={`period${period.number}`}
								 className="flex flex-col gap-2 p-8 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
								<div className="space-y-2 font-medium text-center sm:text-left items-center">
									<div className="mx-auto block sm:mx-0 sm:shrink-0">{period.name}</div>
									<img className="mx-auto block h-24 rounded-sm sm:mx-0 sm:shrink-0"
										 src={period.icon} alt={period.detailedForecast}/>
								</div>
								<div className="space-y-1/2 text-center sm:text-left">
									<div>{period.temperature.value}&#176; {period.temperature.unit}</div>
									<div>Wind: {period.windSpeed.replace(" to ", "-")} <i className={`arrow-${period.windDirection} fa-light fa-arrow-up`}></i></div>
									<div>{period.shortForecast}</div>
								</div>
							</div>
						)
					})}
				</div>

				<div>Updated
					at {epochToHuman(forecast?.updateTime.milliseconds)} ({point?.timeZone})
				</div>
			</div>
		);
	}
}

// <div className="weather-forecast-forecast-detailed">{period.detailedForecast}</div>

export default WeatherForecast;
