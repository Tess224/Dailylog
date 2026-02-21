import { POSES } from './data.js'

const HEAD_ANIMS = `
  @keyframes headBob  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes headTalk { from{transform:rotate(-4deg)} to{transform:rotate(4deg)} }
  @keyframes nod      { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(6px) rotate(9deg)} }
`

const HEAD_STYLE = {
  idle:    { animation: 'headBob 2s ease-in-out infinite',              transformOrigin: '50px 28px' },
  talking: { animation: 'headTalk 0.4s ease-in-out infinite alternate', transformOrigin: '50px 28px' },
  nodding: { animation: 'nod 0.55s ease-in-out infinite',              transformOrigin: '50px 28px' },
}

export default function Stickman({ pose, walkProgress }) {
  const p = POSES[pose] || POSES.idle
  const walking = walkProgress < 100
  const walkOffset = Math.sin(walkProgress * 0.4) * 14
  const legLy2 = walking ? 185 + walkOffset : p.legL.y2
  const legRy2 = walking ? 185 - walkOffset : p.legR.y2
  const headStyle = HEAD_STYLE[p.headAnim] || {}
  const limbTransition = walking ? 'none' : 'x2 0.4s ease, y2 0.4s ease'

  return (
    <svg viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <style>{HEAD_ANIMS}</style>

      {/* Head */}
      <g style={headStyle}>
        <circle cx="50" cy="28" r="22" fill="none" stroke="#1a1a1a" strokeWidth="3" />
        <rect x="33" y="23" width="13" height="9" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="2.2" />
        <rect x="54" y="23" width="13" height="9" rx="2" fill="none" stroke="#1a1a1a" strokeWidth="2.2" />
        <line x1="46" y1="27" x2="54" y2="27" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="33" y1="27" x2="30" y2="26" stroke="#1a1a1a" strokeWidth="2" />
        <line x1="67" y1="27" x2="70" y2="26" stroke="#1a1a1a" strokeWidth="2" />
        <path d={p.mouth} fill="none" stroke="#1a1a1a" strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* Body */}
      <line x1="50" y1="50" x2="50" y2="130" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />

      {/* Arms */}
      <line {...p.armL} stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"
        style={{ transition: limbTransition }} />
      <line {...p.armR} stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"
        style={{ transition: limbTransition }} />

      {/* Legs */}
      <line x1="50" y1="130" x2={p.legL.x2} y2={legLy2}
        stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"
        style={{ transition: walking ? 'none' : limbTransition }} />
      <line x1="50" y1="130" x2={p.legR.x2} y2={legRy2}
        stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"
        style={{ transition: walking ? 'none' : limbTransition }} />

      {/* Feet */}
      <line x1={p.legL.x2} y1={legLy2} x2={p.legL.x2 - 12} y2={legLy2 + 10}
        stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      <line x1={p.legR.x2} y1={legRy2} x2={p.legR.x2 + 12} y2={legRy2 + 10}
        stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
