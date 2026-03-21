interface Props {
  score: number;
}

export function MatchBadge({ score }: Props) {
  let colorClass = "bg-rose-950/60 text-rose-200";
  if (score >= 70) {
    colorClass = "bg-emerald-950/60 text-emerald-200";
  } else if (score >= 50) {
    colorClass = "bg-amber-950/60 text-amber-200";
  } else if (score >= 30) {
    colorClass = "bg-orange-950/60 text-orange-200";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-bold ${colorClass}`}
    >
      {score}%
    </span>
  );
}
