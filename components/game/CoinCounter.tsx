export function CoinCounter({ coins }: { coins: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-300">
      <span aria-hidden>🪙</span>
      <span>{coins.toLocaleString("en-US")}</span>
      <span className="sr-only">coins</span>
    </div>
  );
}
