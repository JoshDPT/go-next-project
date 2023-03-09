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
				<input
					className='bg-slate-800 text-white w-max'
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
			</main>
		</div>
	);
}
