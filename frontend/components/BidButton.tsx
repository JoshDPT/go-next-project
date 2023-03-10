

interface BidButtonProps {
  amount: number;
  currentCash: number;
  disabled: boolean;
  onBid: () => void;
}

export default function BidButton({ amount, currentCash, disabled, onBid }: BidButtonProps) {
  return (
    <button
      className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded-lg shadow w-48 mx-auto my-2 disabled:text-gray-400 disabled:hover:bg-white"
      disabled={disabled}
      onClick={onBid}
    >
      {`Bid +$${amount}`}
    </button>
  );
}