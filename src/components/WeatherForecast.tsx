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
	const [officeCode, setOfficeCode] = useState("");
	const [point, setPoint] = useState<Point>();
	const [forecast, setForecast] = useState<Forecast>();
	const [error, setError] = useState<Error>();

	const fetchForecast = useCallback(async (loc: Array<number> | undefined): Promise<undefined> => {
		setState("loading");
		setOfficeCode("")
		setPoint(undefined);
		setForecast(undefined);

		Weather.points(loc).get()
			.then((p: Point) => {
				setOfficeCode(p.office.id);
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
			<div className="rounded-2xl dark:bg-neutral-100/25 dark:text-neutral-200">
				<div className="text-xl pt-2">
					{officeCode?.length && (
						<div>
							<div>Forecast for {officeCode}</div>
							<div className="text-base">{formatDegrees(coords!.latitude, false)}, {formatDegrees(coords!.longitude, true)}</div>
						</div>
					)}
					{!officeCode?.length && (
						<>Forecast for {formatDegrees(coords!.latitude, false)}, {formatDegrees(coords!.longitude, true)}</>
					)}
				</div>

				<div className="flex flex-col gap-2 p-2 sm:flex-row items-center sm:gap-6 sm:py-1">
					{forecast?.periods?.map((period) => {
						return (
							<>
							{period.number === 1 && (
								<div key={`period${period.number}`}
									 className="flex flex-col gap-2 p-8 sm:flex-row items-center sm:gap-6 sm:py-4">
									<div className="space-y-2 font-medium text-center">
										<div className="text-2xl pb-2">{period.name}</div>
										<img className="mx-auto block h-24 rounded-sm sm:mx-0 sm:shrink-0 scale-125"
											 src={period.icon} alt={period.detailedForecast}/>
										<div className="text-lg pt-2">{period.temperature.value}&#176; {period.temperature.unit}</div>
										<div className="text-xs mt-[-0.75rem]">Wind: {period.windSpeed.replace(" to ", "-")} <i className={`arrow-${period.windDirection} fa-light fa-arrow-up`}></i></div>
									</div>
									<div className="space-y-1/2 text-center sm:text-left">
										<div className="w-2xs text-sm pt-2">{period.detailedForecast}</div>
									</div>
								</div>
							)}
							{period.number > 1 && period.number < 5 && (
								<div key={`period${period.number}`}
									 className="flex flex-col py-2 sm:flex-row sm:items-center sm:py-2">
									<div className="space-y-1/2 font-medium size-[8rem] items-center">
										<div className="text-medium h-4 align-bottom mt-[-0.5rem]">{period.name}</div>
										<div className="flex justify-center align-center">
											<img className="mx-0 block h-24 rounded-md sm:mx-0 sm:shrink-0 scale-75 place-self-center-safe"
												 src={period.icon} alt={period.detailedForecast}/>
										</div>
										<div className="text-lg mt-[-0.25rem]">{period.temperature.value}&#176; {period.temperature.unit}</div>
									</div>
								</div>
							)}
							</>
						)
					})}
				</div>

				<div className="text-xs italic pb-2">Updated
					at {epochToHuman(forecast?.updateTime.milliseconds)} ({point?.timeZone})
				</div>
			</div>
		);
	}
}

// <div className="weather-forecast-forecast-detailed">{period.detailedForecast}</div>

export default WeatherForecast;
