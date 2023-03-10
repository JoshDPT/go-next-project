import BidButton from '@/components/BidButton';
import CountdownTimer from '@/components/CountdownTimer';
import useWebSocket from '@/lib/useWebsocket';
import Head from 'next/head';
import { useState } from 'react';

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

	// custom hook - useWebSocket
	const ws = useWebSocket('ws://localhost:8000/handler', setData);

	// current cash as number
	const currentCash = Number('1000');

	// deadline of auction in some time zone
	const deadline = new Date('2023-03-31T23:59:59');

	// bid button options
	const bids = [5, 25, 100, 500];

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
				<button className="mx-auto p-2 my-2 w-48 underline text-3xl font-black"
					onClick={}
					>
					Roll
				</button>

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

				{/* Bid button map */}
				{bids.map((n, i) => (
					<BidButton
						key={`${n}-${i}`}
						amount={n}
						currentCash={currentCash}
						disabled={currentCash < Number(data.body) + n}
						onBid={() => {
							if (ws) {
								ws.send(
									JSON.stringify({
										title: data.title,
										body: (Number(data.body) + n).toString(),
									})
								);
							}
						}}
					/>
				))}
			</main>
		</div>
	);
}
