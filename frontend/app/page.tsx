export default async function Home() {
	const { status } = await fetch('http://localhost:8000/status').then((x) =>
		x.json()
	);

	return (
		<div className="flex text-3xl font-extrabold underline justify-center place-items-center">
			<h1>Status is {status}</h1>
		</div>
	);
}
