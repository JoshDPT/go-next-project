export default function getRandomNumber(): number {
	const number = Math.floor(Math.random() * 100) + 1;

	switch (true) {
		case number > 96:
			return Math.floor(Math.random() * 10000) + 1000;

		case number > 90:
			return Math.floor(Math.random() * 500) + 500;

		case number > 50:
			return Math.floor(Math.random() * 100) + 100;

		default:
			return Math.floor(Math.random() * 100) + 1;
	}
}
