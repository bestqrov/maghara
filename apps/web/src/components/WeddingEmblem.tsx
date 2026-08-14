export function starPoints(cx: number, cy: number, rOuter: number, rInner: number, spikes: number) {
  const step = Math.PI / spikes;
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const angle = i * step - Math.PI / 2;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

/** Decorative arabesque medallion — an original geometric mark, not a photo. */
export function WeddingEmblem({ className = '' }: { className?: string }) {
  const star = starPoints(120, 120, 96, 62, 8);
  const starInner = starPoints(120, 120, 60, 38, 8);

  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true">
      <circle cx="120" cy="120" r="114" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1" fill="none" />
      <circle cx="120" cy="120" r="100" stroke="currentColor" strokeOpacity="0.28" strokeWidth="1" fill="none" />
      <polygon points={star} stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.1" fill="none" />
      <polygon points={starInner} stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.1" fill="none" />
      <circle cx="120" cy="120" r="20" stroke="currentColor" strokeOpacity="0.6" strokeWidth="1.2" fill="none" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * Math.PI) / 8;
        const x = 120 + 128 * Math.cos(angle);
        const y = 120 + 128 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r={i % 2 === 0 ? 1.6 : 1} fill="currentColor" opacity={0.35} />;
      })}
    </svg>
  );
}

/** Small seal-like 8-point star, used as a badge background (e.g. numbered steps). */
export function StarSeal({ className = '' }: { className?: string }) {
  const outer = starPoints(24, 24, 23, 17, 8);

  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <polygon points={outer} fill="currentColor" />
    </svg>
  );
}
