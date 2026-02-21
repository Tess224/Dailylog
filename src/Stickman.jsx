import { useEffect, useRef } from 'react'
import { POSES } from './data.js'

const STYLES = `
  @keyframes headBob    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes headTalk   { 0%,100%{transform:rotate(-4deg)} 50%{transform:rotate(4deg)} }
  @keyframes nod        { 0%,25%{transform:rotate(0deg) translateY(0)} 50%{transform:rotate(14deg) translateY(7px)} 75%,100%{transform:rotate(0deg) translateY(0)} }
  @keyframes shake      { 0%,100%{transform:rotate(0deg)} 20%{transform:rotate(-10deg)} 40%{transform:rotate(10deg)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(8deg)} }
  @keyframes bounce     { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-18px)} 60%{transform:translateY(-10px)} }
  @keyframes spin       { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes breathe    { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(1.04)} }
  @keyframes wiggle     { 0%,100%{transform:rotate(0deg) translateX(0)} 25%{transform:rotate(-3deg) translateX(-4px)} 75%{transform:rotate(3deg) translateX(4px)} }
  @keyframes armDanceL  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-60deg)} }
  @keyframes armDanceR  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(60deg)} }
  @keyframes legDanceL  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(20deg)} }
  @keyframes legDanceR  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-20deg)} }
  @keyframes floatUp    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

  .head-idle    { animation: headBob 2.4s ease-in-out infinite; transform-origin: 100px 56px; }
  .head-talking { animation: headTalk 0.45s ease-in-out infinite; transform-origin: 100px 56px; }
  .head-nodding { animation: nod 0.7s ease-in-out infinite; transform-origin: 100px 56px; }
  .head-shaking { animation: shake 0.5s ease-in-out infinite; transform-origin: 100px 56px; }
  .head-bounce  { animation: bounce 0.6s ease-in-out infinite; transform-origin: 100px 56px; }
  .head-spin    { animation: spin 0.8s linear infinite; transform-origin: 100px 56px; }
  .head-wiggle  { animation: wiggle 0.5s ease-in-out infinite; transform-origin: 100px 56px; }
  .head-float   { animation: floatUp 2s ease-in-out infinite; transform-origin: 100px 56px; }

  .body-breathe { animation: breathe 3s ease-in-out infinite; transform-origin: 100px 160px; }
  .body-dance   { animation: wiggle 0.4s ease-in-out infinite; transform-origin: 100px 160px; }
  .body-bounce  { animation: bounce 0.6s ease-in-out infinite; transform-origin: 100px 160px; }

  .arm-l-dance { animation: armDanceL 0.4s ease-in-out infinite; transform-origin: 100px 125px; }
  .arm-r-dance { animation: armDanceR 0.4s ease-in-out 0.2s infinite; transform-origin: 100px 125px; }
  .leg-l-dance { animation: legDanceL 0.4s ease-in-out infinite; transform-origin: 100px 220px; }
  .leg-r-dance { animation: legDanceR 0.4s ease-in-out 0.2s infinite; transform-origin: 100px 220px; }
`

// Quadratic bezier paths for organic feel
const arm  = (ex, ey) => `M 100 125 Q ${(100+ex)/2 + (ey-125)*0.12} ${(125+ey)/2 - Math.abs(ex-100)*0.08} ${ex} ${ey}`
const leg  = (ex, ey) => `M 100 220 Q ${(100+ex)/2 + (ex-100)*0.18} ${(220+ey)/2 + Math.abs(ex-100)*0.04} ${ex} ${ey}`
const foot = (lx, ly, side) => {
  const d = side === 'l' ? -1 : 1
  return `M ${lx} ${ly} Q ${lx+d*10} ${ly+6} ${lx+d*18} ${ly+14} Q ${lx+d*22} ${ly+18} ${lx+d*14} ${ly+20}`
}

export default function Stickman({ pose, walkProgress }) {
  const p = POSES[pose] || POSES.idle
  const walking = walkProgress < 100

  // Walk cycle
  const wt = walkProgress * 0.38
  const legSwing = Math.sin(wt) * 22
  const armSwing = Math.sin(wt) * 14

  const aL = walking ? { x: 100 - armSwing, y: 155 + Math.abs(armSwing)*0.3 } : { x: p.armL.x2, y: p.armL.y2 }
  const aR = walking ? { x: 100 + armSwing, y: 155 + Math.abs(armSwing)*0.3 } : { x: p.armR.x2, y: p.armR.y2 }
  const lL = walking ? { x: 100 - legSwing*0.6, y: 310 + legSwing*0.4 }       : { x: p.legL.x2, y: p.legL.y2 }
  const lR = walking ? { x: 100 + legSwing*0.6, y: 310 - legSwing*0.4 }       : { x: p.legR.x2, y: p.legR.y2 }

  const limbT = walking ? 'none' : 'd 0.5s cubic-bezier(0.34,1.56,0.64,1)'
  const isDancing = pose === 'dancing'

  return (
    <svg viewBox="0 0 200 440" xmlns="http://www.w3.org/2000/svg"
      style={{ width:'100%', height:'100%', overflow:'visible',
        filter:'drop-shadow(2px 4px 8px rgba(0,0,0,0.07))' }}>
      <style>{STYLES}</style>

      {/* HEAD */}
      <g className={`head-${p.headAnim || 'idle'}`}>
        {/* Hair tuft */}
        <path d="M 95 36 Q 100 22 108 30" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"/>
        {/* Head */}
        <ellipse cx="100" cy="56" rx="32" ry="30" fill="white" stroke="#1a1a1a" strokeWidth="2.8"/>
        {/* Left eye */}
        <ellipse cx="88" cy="52" rx="9" ry="7" fill="white" stroke="#1a1a1a" strokeWidth="2.2"/>
        <path d="M 80 50 Q 88 46 96 50" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="88" cy="54" r="3.5" fill="#1a1a1a"/>
        {/* Right eye */}
        <ellipse cx="112" cy="52" rx="9" ry="7" fill="white" stroke="#1a1a1a" strokeWidth="2.2"/>
        <path d="M 104 50 Q 112 46 120 50" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="112" cy="54" r="3.5" fill="#1a1a1a"/>
        {/* Glasses */}
        <line x1="97" y1="52" x2="103" y2="52" stroke="#1a1a1a" strokeWidth="2"/>
        <line x1="79"  y1="51" x2="74"  y2="50" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        <line x1="121" y1="51" x2="126" y2="50" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        {/* Mouth */}
        <path d={p.mouth} fill="none" stroke="#1a1a1a" strokeWidth="2.4" strokeLinecap="round"/>
        {/* Ears */}
        <path d="M 68 54 Q 65 58 68 63" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
        <path d="M 132 54 Q 135 58 132 63" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round"/>
      </g>

      {/* NECK */}
      <path d="M 97 85 Q 100 92 103 95" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"/>

      {/* BODY */}
      <g className={p.bodyAnim || 'body-breathe'}>
        <path d="M 100 95 Q 98 175 100 220" fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"/>
      </g>

      {/* ARMS */}
      <g className={isDancing ? 'arm-l-dance' : ''}>
        <path d={arm(aL.x, aL.y)} fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
          style={{ transition: limbT }}/>
        <circle cx={aL.x} cy={aL.y} r="4" fill="none" stroke="#1a1a1a" strokeWidth="2.2"/>
      </g>
      <g className={isDancing ? 'arm-r-dance' : ''}>
        <path d={arm(aR.x, aR.y)} fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
          style={{ transition: limbT }}/>
        <circle cx={aR.x} cy={aR.y} r="4" fill="none" stroke="#1a1a1a" strokeWidth="2.2"/>
      </g>

      {/* LEGS */}
      <g className={isDancing ? 'leg-l-dance' : ''}>
        <path d={leg(lL.x, lL.y)} fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
          style={{ transition: walking ? 'none' : limbT }}/>
        <path d={foot(lL.x, lL.y, 'l')} fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round"/>
      </g>
      <g className={isDancing ? 'leg-r-dance' : ''}>
        <path d={leg(lR.x, lR.y)} fill="none" stroke="#1a1a1a" strokeWidth="2.8" strokeLinecap="round"
          style={{ transition: walking ? 'none' : limbT }}/>
        <path d={foot(lR.x, lR.y, 'r')} fill="none" stroke="#1a1a1a" strokeWidth="2.6" strokeLinecap="round"/>
      </g>
    </svg>
  )
}
