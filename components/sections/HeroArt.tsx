/** Decorative engineering/consulting graphic (replaces the Manus-hosted hero image). Purely visual. */
export default function HeroArt({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 520 520" className={className} fill="none">
      <g stroke="#c7a86b" strokeOpacity=".5">
        <circle cx="260" cy="260" r="236" /><circle cx="260" cy="260" r="176" strokeOpacity=".35" /><circle cx="260" cy="260" r="116" strokeOpacity=".5" />
      </g>
      <g stroke="#5fa8a5" strokeOpacity=".45"><path d="M24 260h472M260 24v472" /><path d="M93 93l334 334M427 93L93 427" strokeOpacity=".2" /></g>
      <g transform="translate(150 120) skewX(-16)">
        <rect x="0" y="170" width="64" height="120" fill="#c7a86b" /><rect x="90" y="90" width="64" height="200" fill="#5fa8a5" /><rect x="180" y="0" width="64" height="290" fill="#c7a86b" />
      </g>
      <circle cx="260" cy="24" r="5" fill="#c7a86b" /><circle cx="496" cy="260" r="5" fill="#5fa8a5" /><circle cx="84" cy="436" r="4" fill="#c7a86b" />
    </svg>
  );
}
