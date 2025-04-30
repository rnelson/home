const DoWebSearch = (data: FormData) => {
	alert(`Search: ${data.get("query")}`);
};

const WebSearch = () => {
	return (
		<div className="p-16">
			<form action={DoWebSearch}>
				<input className="bg-neutral-50 text-neutral-950 p-2 rounded-lg w-[900px]" name="query"/>
				<button type="submit">Search</button>
			</form>
		</div>
	);
};

export default WebSearch;
