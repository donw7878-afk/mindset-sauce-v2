/**
 * Chapter/module completion ring — spec §10. Server-safe SVG.
 * done: solid gold + check · active: gold outline · open: steel outline
 */
export default function Ring({
  state,
  size = 20,
  title,
}: {
  state: "done" | "active" | "open";
  size?: number;
  title?: string;
}) {
  const r = size / 2 - 1;
  const c = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={title}
      style={state === "done" ? { filter: "drop-shadow(0 0 6px rgba(218,165,32,0.4))" } : undefined}
    >
      {title ? <title>{title}</title> : null}
      <circle
        cx={c}
        cy={c}
        r={r}
        fill={state === "done" ? "#daa520" : "none"}
        stroke={state === "done" ? "#daa520" : state === "active" ? "#b8860b" : "#2a2a2a"}
        strokeWidth="1"
      />
      {state === "done" && (
        <path
          d={`M ${size * 0.28} ${size * 0.52} L ${size * 0.44} ${size * 0.68} L ${size * 0.72} ${size * 0.34}`}
          stroke="#080808"
          strokeWidth={size * 0.09}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
