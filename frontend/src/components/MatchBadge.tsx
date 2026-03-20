interface Props {
  score: number;
}

export function MatchBadge({ score }: Props) {
  let colorClass = "bg-red-100 text-red-700";
  if (score >= 70) {
    colorClass = "bg-green-100 text-green-700";
  } else if (score >= 50) {
    colorClass = "bg-yellow-100 text-yellow-700";
  } else if (score >= 30) {
    colorClass = "bg-orange-100 text-orange-700";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-bold ${colorClass}`}
    >
      {score}%
    </span>
  );
}
