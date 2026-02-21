import { useEffect, useRef } from 'react'
import { POSES } from './data.js'

// ── Keyframe CSS injected once ────────────────────────────────────────────
const STYLES = `
  @keyframes headBob  { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
  @keyframes headTalk { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(5deg)} }
  @keyframes nod      { 0%,100%{transform:rotate(0deg) translateY(0px)} 50%{transform:rotate(12deg) translateY(8px)} }
  @keyframes breathe  { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.03)} }
  @keyframes walkL    { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(28deg)} }
  @keyframes walkR    { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-28deg)} }
  @keyframes armSwayL { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-20deg)} }
  @keyframes armSwayR { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(20deg)} }

  .stick-head-idle    { animation: headBob 2.4s ease-in-out infinite; transform-origin: 100px 56px; }
  .stick-head-talking { animation: headTalk 0.45s ease-in-out infinite; transform-origin: 100px 56px; }
  .stick-head-nodding { animation: nod 0.6s ease-in-out infinite; transform-origin: 100px 56px; }
  .stick-body         { animation: breathe 3s ease-in-out infinite; transform-origin: 100px 130px; }

  .limb { transition: d 0.55s cubic-bezier(0.34,1.56,0.64,1); }
`

// ── SVG path builders for fluid curved limbs ─────────────────────────────
// Each limb is a quadratic bezier so they look organic / hand-drawn

function armPath(sx, sy, ex, ey) {
  const mx = (sx + ex) / 2 + (ey - sy) * 0.15
  const my = (sy + ey) / 2 - Math.abs(ex - sx) * 0.1
  return `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`
}

function legPath(sx, sy, ex, ey) {
  const mx = (sx + ex) / 2 + (ex - sx) * 0.2
  const my = (sy + ey) / 2 + Math.abs(ex - sx) * 0.05
  return `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`
}

// Rounded foot curl matching the image
function footPath(lx, ly, side) {
  const dir = side === 'l' ? -1 : 1
  return `M ${lx} ${ly} Q ${lx + dir * 10} ${ly + 6} ${lx + dir * 18} ${ly + 14} Q ${lx + dir * 22} ${ly + 18} ${lx + dir * 14} ${ly + 20}`
}

export default function Stickman({ pose, walkProgress }) {
  const svgRef = useRef(null)
  const p = POSES[pose] || POSES.idle
  const walking = walkProgress < 100

  // Walk cycle offsets
  const wt = walkProgress * 0.38
  const legSwing = Math.sin(wt) * 22
  const armSwing = Math.sin(wt) * 14

  // Final limb endpoints: walk overrides pose endpoints
  const aL = walking
    ? { x: 100 - armSwing, y: 155 + Math.abs(armSwing) * 0.3 }
    : { x: p.armL.x2, y: p.armL.y2 }
  const aR = walking
    ? { x: 100 + armSwing, y: 155 + Math.abs(armSwing) * 0.3 }
    : { x: p.armR.x2, y: p.armR.y2 }
  const lL = walking
    ? { x: 100 - legSwing * 0.6, y: 310 + legSwing * 0.4 }
    : { x: p.legL.x2, y: p.legL.y2 }
  const lR = walking
    ? { x: 100 + legSwing * 0.6, y: 310 - legSwing * 0.4 }
    : { x: p.legR.x2, y: p.legR.y2 }

  const headClass = `stick-head-${p.headAnim || 'idle'}`
  const limbT = walking ? 'none' : 'd 0.55s cubic-bezier(0.34,1.56,0.64,1)'

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 440"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.08))' }}
    >
      <style>{STYLES}</style>

      {/* ── HEAD GROUP ─────────────────────────────────────────── */}
      <g className={headClass}>
        {/* Hair tuft — matches image */}
        <path d="M 95 36 Q 100 22 108 30" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round" />

        {/* Head circle — slightly imperfect like hand-drawn */}
        <ellipse cx="100" cy="56" rx="32" ry="30" fill="white" stroke="#1a1a1a" strokeWidth="2.8" />

        {/* Left eye + squint (matches image: half-closed) */}
        <ellipse cx="88" cy="52" rx="9" ry="7" fill="white" stroke="#1a1a1a" strokeWidth="2.2" />
        <path d="M 80 50 Q 88 46 96 50" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="88" cy="54" r="3.5" fill="#1a1a1a" />

        {/* Right eye + squint */}
        <ellipse cx="112" cy="52" rx="9" ry="7" fill="white" stroke="#1a1a1a" strokeWidth="2.2" />
        <path d="M 104 50 Q 112 46 120 50" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <circle cx="112" cy="54" r="3.5" fill="#1a1a1a" />

        {/* Glasses bridge */}
        <line x1="97" y1="52" x2="103" y2="52" stroke="#1a1a1a" strokeWidth="2" />
        {/* Glasses arms */}
        <line x1="79" y1="51" x2="74" y2="50" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <line x1="121" y1="51" x2="126" y2="50" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />

        {/* Mouth */}
        <path d={p.mouth} fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round" />

        {/* Ear hints */}
        <path d="M 68 54 Q 65 58 68 63" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
        <path d="M 132 54 Q 135 58 132 63" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* ── NECK ───────────────────────────────────────────────── */}
      <path d="M 97 85 Q 100 92 103 95" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round" />

      {/* ── BODY ───────────────────────────────────────────────── */}
      <g className="stick-body">
        <path d="M 100 95 Q 98 175 100 220" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round" />
      </g>

      {/* ── ARMS ───────────────────────────────────────────────── */}
      <path
        d={armPath(100, 125, aL.x, aL.y)}
        fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
        style={{ transition: limbT }}
      />
      <path
        d={armPath(100, 125, aR.x, aR.y)}
        fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
        style={{ transition: limbT }}
      />
      {/* Little hands — dots */}
      <circle cx={aL.x} cy={aL.y} r="4" fill="none" stroke="#1a1a1a" strokeWidth="2.2" />
      <circle cx={aR.x} cy={aR.y} r="4" fill="none" stroke="#1a1a1a" strokeWidth="2.2" />

      {/* ── LEGS ───────────────────────────────────────────────── */}
      <path
        d={legPath(100, 220, lL.x, lL.y)}
        fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
        style={{ transition: limbT }}
      />
      <path
        d={legPath(100, 220, lR.x, lR.y)}
        fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
        style={{ transition: limbT }}
      />

      {/* ── FEET — curled like the image ─────────────────────── */}
      <path d={footPath(lL.x, lL.y, 'l')} fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round" />
      <path d={footPath(lR.x, lR.y, 'r')} fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}
