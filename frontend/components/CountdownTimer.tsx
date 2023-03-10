import React, { useState, useEffect } from 'react';

type Props = {
	deadline: Date;
};

const CountdownTimer: React.FC<Props> = ({ deadline }) => {
	const [remainingTime, setRemainingTime] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = new Date().getTime();
			const distance = deadline.getTime() - now;

			if (distance < 0) {
				clearInterval(intervalId);
			} else {
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				setRemainingTime({ hours, minutes, seconds });
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [deadline]);

	const { hours, minutes, seconds } = remainingTime;

	return (
		<div className="mx-auto bg-blue-500 rounded-lg my-2 shadow-lg">
			<h2 className="normal-num p-1 text-xl font-bold text-white">{`${hours
				.toString()
				.padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
				.toString()
				.padStart(2, '0')}`}</h2>
		</div>
	);
};

export default CountdownTimer;
