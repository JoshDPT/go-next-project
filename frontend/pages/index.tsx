import BidButton from '@/components/BidButton';
import CountdownTimer from '@/components/CountdownTimer';
import getRandomNumber from '@/lib/getRandomNumber';
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
	let [cash, setCash] = useState(Number('1000'));

	console.log(cash);
	// custom hook - useWebSocket
	const ws = useWebSocket('ws://localhost:8000/handler', setData);

	// deadline of auction in some time zone
	const deadline = new Date('2023-03-31T23:59:59');

	// bid button options
	const bids = [5, 25, 100];

	return (
		<div>
			<Head>
				<title>Auction House</title>
				<meta name="description" content="Real-time auction app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="flex flex-col ">
				{/* current liquid cash */}
				<h1 className="mx-auto normal-num p-2 my-2 font-serif font-extrabold text-green-900">
					Current Cash: ${cash.toLocaleString()}
				</h1>

				{/* TODO: BUTTON & LIB function for RNG add to cash */}
				<button
					className="bg-amber-200 hover:bg-amber-300 text-gray-800 font-semibold py-2 p-1 border border-gray-400 rounded-full shadow w-12 mx-auto my-2 disabled:text-gray-400 disabled:hover:bg-white"
					onClick={() => setCash((cash += getRandomNumber()))}
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
						currentCash={cash}
						disabled={cash < Number(data.body) + n}
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
