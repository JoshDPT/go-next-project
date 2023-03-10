import CountdownTimer from '@/components/CountdownTimer';
import Head from 'next/head';
import { useEffect, useState } from 'react';

interface HomeProps {
	data: {
		title: string;
		body: string;
	};
}

export async function getServerSideProps(): Promise<{ props: HomeProps }> {
	const initialData = await fetch(
		'http://localhost:8000/handler-initial-data'
	).then((x) => x.json());
	return { props: { data: initialData } };
}

export default function Home(props: HomeProps): JSX.Element {
	const [data, setData] = useState(props.data);
	const [ws, setWS] = useState<WebSocket | null>(null);
	const currentCash = Number('7500');
	const deadline = new Date('2023-03-31T23:59:59');

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
				<meta name="description" content="Like Google Docs, but open source!" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col ">
				<h1 className="mx-auto normal-num p-2 my-2 w-48 font-serif font-extrabold text-green-900">
					Current Cash: ${currentCash}
				</h1>
				<h1 className="mx-auto p-2 my-2 w-48 underline text-3xl font-black">
					{data.title}
				</h1>
				<h1 className="mx-auto normal-num p-2 my-2 font-serif text-xl font-bold text-red-500">
					Current Cost: ${data.body}
				</h1>
				<CountdownTimer deadline={deadline} />

				<button
					className="bg-green-600 font-bold p-2 my-2 rounded-full w-48 mx-auto shadow-lg text-white"
					onClick={() => {
						if (ws && currentCash >= Number(data.body) + 5) {
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

				<button
					className="bg-green-600 font-bold p-2 my-2 rounded-full w-48 mx-auto shadow-lg text-white"
					onClick={() => {
						if (ws && currentCash >= Number(data.body) + 25) {
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

				<button
					className="bg-green-600 font-bold p-2 my-2 rounded-full w-48 mx-auto shadow-lg text-white"
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
