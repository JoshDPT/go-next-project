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
			<main>
				<h1>{data.title}</h1>
				<h1>Current Cost: {data.body}</h1>
				<input
					className="bg-slate-800 text-white w-max"
					onChange={(e) =>
						ws.send(
							JSON.stringify({
								title: e.target.value,
								body: data.body,
							})
						)
					}
					value={data.title || 'Untitled Document'}
				/>

				<textarea
					onChange={(e) =>
						ws.send(
							JSON.stringify({
								title: data.title,
								body: e.target.value,
							})
						)
					}
					value={data.body || ''}
				/>
				<button
					className='bg-yellow-500 p-2 m-6 rounded-sm'
					onClick={() =>
						ws.send(
							JSON.stringify({
								title: data.title,
								body: (Number(data.body) + 5).toString(),
							})
						)
					}
				>
					Bid +5
				</button>
				<button
					className='bg-yellow-500 p-2 m-6 rounded-sm'
					onClick={() =>
						ws.send(
							JSON.stringify({
								title: data.title,
								body: (Number(data.body) + 25).toString(),
							})
						)
					}
				>
					Bid +25
				</button>
				<button
					className='bg-yellow-500 p-2 m-6 rounded-sm'
					onClick={() =>
						ws.send(
							JSON.stringify({
								title: data.title,
								body: (Number(data.body) + 100).toString(),
							})
						)
					}
				>
					Bid +100
				</button>
			</main>
		</div>
	);
}
