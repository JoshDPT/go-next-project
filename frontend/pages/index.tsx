import CountdownTimer from '@/components/CountdownTimer';
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface HomeProps {
	data: {
		title: string;
		body: string;
	};
}

// Grab initial data from server before page loads - may add auth here?
export async function getServerSideProps(): Promise<{ props: HomeProps }> {
	const initialData = await fetch(
		'http://localhost:8000/handler-initial-data'
	).then((x) => x.json());
	return { props: { data: initialData } };
}

export default function Home(props: HomeProps): JSX.Element {
	const [data, setData] = useState(props.data);
	const [ws, setWS] = useState<WebSocket | null>(null);

	// current cash as number
	const currentCash = Number('1000');

	// deadline of auction in some time zone
	const deadline = new Date('2023-03-31T23:59:59');
	

	// setting the state as a new Websocket to the handler endpoint on the Go server
	useEffect(() => {
		const newWS = new WebSocket('ws://localhost:8000/handler');
		newWS.onerror = (err) => console.error(err);
		newWS.onopen = () => setWS(newWS);
		newWS.onmessage = (msg) => setData(JSON.parse(msg.data));
	}, []);

	return (
		<div>
			<Head>
				<title>Auction House</title>
				<meta name="description" content="Real-time auction app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col ">
				{/* current liquid cash */}
				<h1 className="mx-auto normal-num p-2 my-2 w-48 font-serif font-extrabold text-green-900">
					Current Cash: ${currentCash.toLocaleString()}
				</h1>

				{/* TODO: BUTTON & LIB function for RNG add to cash */}

				{/* Title of item */}
				<h1 className="mx-auto p-2 my-2 w-48 underline text-3xl font-black">
					{data.title}
				</h1>

				{/* current price of item */}
				<h1 className="mx-auto normal-num p-2 my-2 font-serif text-xl font-bold text-red-500">
					Price: ${Number(data.body).toLocaleString()}
				</h1>

				{/* TODO: timer pauses when click bid button?? */}
				{/* countdown timer */}
				<CountdownTimer deadline={deadline} />

				{/* Button for small bid */}
				<button
					className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow w-48 mx-auto my-2 disabled:text-gray-400 disabled:hover:bg-white"
					disabled={currentCash < Number(data.body) + 5}
					onClick={() => {
						if (ws) {
							ws.send(
								JSON.stringify({
									title: data.title,
									body: (Number(data.body) + 5).toString(),
								})
							);
						}
					}}
				>
					Bid +$5
				</button>

				{/* Button for medium bid */}
				<button
					className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow w-48 mx-auto my-2 disabled:text-gray-400 disabled:hover:bg-white"
					disabled={currentCash < Number(data.body) + 25}
					onClick={() => {
						if (ws) {
							ws.send(
								JSON.stringify({
									title: data.title,
									body: (Number(data.body) + 25).toString(),
								})
							);
						}
					}}
				>
					Bid +$25
				</button>

				{/* Button for large bid */}
				<button
					className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow w-48 mx-auto my-2 disabled:text-gray-400 disabled:hover:bg-white"
					disabled={currentCash < Number(data.body) + 100}
					onClick={() => {
						if (ws && currentCash >= Number(data.body) + 100) {
							ws.send(
								JSON.stringify({
									title: data.title,
									body: (Number(data.body) + 100).toString(),
								})
							);
						}
					}}
				>
					Bid +$100
				</button>
			</main>
		</div>
	);
}
