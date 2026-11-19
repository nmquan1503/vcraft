export default function Seal() {
  return (
    <div className="seal-wrap" aria-label="vCraft · Bát Tràng · Est. 1010">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <path
            id="seal-path"
            d="M50 50 m-34 0 a34 34 0 1 1 68 0 a34 34 0 1 1 -68 0"
          />
          <filter id="seal-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.2"
              numOctaves="2"
              result="t"
            />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" />
          </filter>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="48"
          fill="var(--red)"
          filter="url(#seal-noise)"
        />
        <circle
          cx="50"
          cy="50"
          r="43.5"
          fill="none"
          stroke="var(--cream)"
          strokeWidth="0.6"
          opacity="0.7"
        />

        <g
          className="seal-svg"
          style={{ transformOrigin: '50px 50px', transformBox: 'fill-box' }}
        >
          <text
            fill="var(--cream)"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '7.8px',
              fontWeight: 600,
              letterSpacing: '1.6px',
            }}
          >
            <textPath href="#seal-path" textLength="208" lengthAdjust="spacing">
              VCRAFT · BÁT TRÀNG · EST. 1010 ·
            </textPath>
          </text>
        </g>

        <path
          d="M40 60 C44 52 50 44 58 36 C60 34 62 35 61 37 C56 45 50 54 45 62 C43 65 39 64 40 60 Z"
          fill="var(--cream)"
          filter="url(#seal-noise)"
        />
        <path
          d="M38 64 C42 66 48 66 54 63"
          fill="none"
          stroke="var(--cream)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}