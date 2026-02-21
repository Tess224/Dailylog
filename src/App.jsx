import { useState, useEffect, useRef, useCallback } from 'react'
import Stickman from './Stickman.jsx'
import SpeechBubble from './SpeechBubble.jsx'
import { Message, ThinkingDots } from './ChatMessage.jsx'
import { useSpeechRecognition } from './useSpeechRecognition.js'
import { POSES, AI_REPLIES } from './data.js'

const lerp = (a, b, t) => a + (b - a) * t

const GLOBAL_STYLES = `
  @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
`

export default function App() {
  const [messages, setMessages]         = useState([{ id: 0, role: 'ai', text: "Hey! Walk in and tell me about your day. I'm all ears 👓" }])
  const [pose, setPose]                 = useState('idle')
  const [speech, setSpeech]             = useState('')
  const [speechVisible, setSpeechVisible] = useState(false)
  const [thinking, setThinking]         = useState(false)
  const [input, setInput]               = useState('')
  const [walkProgress, setWalkProgress] = useState(0)
  const [stickX, setStickX]             = useState(-25)
  const [stickOpacity, setStickOpacity] = useState(0)
  const [emotion, setEmotion]           = useState('IDLE')
  const [caption, setCaption]           = useState('walk on in...')

  const chatRef    = useRef(null)
  const replyIdx   = useRef(0)
  const speechTimer = useRef(null)

  // ── Walk-in on mount ──────────────────────────────────────────────────
  useEffect(() => {
    let prog = 0
    const id = setInterval(() => {
      prog += 2.2
      const t = Math.min(prog / 52, 1)
      setWalkProgress(prog)
      setStickX(lerp(-25, 50, t))
      setStickOpacity(Math.min(t * 3, 1))
      if (t >= 1) {
        clearInterval(id)
        setWalkProgress(100)
        setPose('idle')
        setCaption('waiting for you...')
        setTimeout(() => showSpeech("hey! 👋", 2500), 400)
      }
    }, 32)
    return () => clearInterval(id)
  }, [])

  // ── Auto-scroll chat ──────────────────────────────────────────────────
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, thinking])

  // ── Helpers ───────────────────────────────────────────────────────────
  const showSpeech = useCallback((text, duration = 3000) => {
    clearTimeout(speechTimer.current)
    setSpeech(text)
    setSpeechVisible(true)
    speechTimer.current = setTimeout(() => setSpeechVisible(false), duration)
  }, [])

  const applyPose = useCallback((name) => {
    const p = POSES[name] || POSES.idle
    setPose(name)
    setEmotion(p.emotion)
    setCaption(p.caption)
  }, [])

  // ── Send message ──────────────────────────────────────────────────────
  const handleSend = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim()
    if (!text) return
    setInput('')

    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }])
    applyPose('nodding')
    setThinking(true)

    // ↓ Replace this block with your real API call
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 900))
    const reply = AI_REPLIES[replyIdx.current % AI_REPLIES.length]
    replyIdx.current++
    // ↑ ---------------------------------------------------

    setThinking(false)

    if (replyIdx.current % 4 === 0) {
      applyPose('stretching')
      await new Promise(r => setTimeout(r, 750))
    }

    applyPose(reply.pose)
    showSpeech(reply.speech, 3200)
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply.text }])
    setTimeout(() => applyPose('idle'), 3500)
  }, [input, applyPose, showSpeech])

  // ── Speech recognition ────────────────────────────────────────────────
  const { recording, toggle: toggleMic, isSupported } = useSpeechRecognition({
    onResult: (t) => setInput(t),
    onEnd:    () => { applyPose('idle'); setInput(prev => { handleSend(prev); return prev }) },
  })

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8',
      backgroundImage: 'radial-gradient(circle, #c9bfa5 1px, transparent 1px)',
      backgroundSize: '28px 28px', fontFamily: "'Courier Prime', monospace",
      color: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      <style>{GLOBAL_STYLES}</style>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '16px 32px', borderBottom: '3px solid #1a1a1a',
        background: '#f5f0e8', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 4 }}>DAYLOG_</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11,
          letterSpacing: 2, textTransform: 'uppercase', border: '2px solid #1a1a1a', padding: '6px 14px' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#1a1a1a', animation: 'blink 1.2s infinite' }} />
          COMPANION ONLINE
        </div>
      </nav>

      {/* STAGE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', flex: 1 }}>

        {/* LEFT: Stickman canvas */}
        <div style={{ borderRight: '3px solid #1a1a1a', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'flex-end', padding: 24,
          position: 'relative', overflow: 'hidden', minHeight: 600 }}>

          <Label top={20} left={20}>STAGE_01</Label>

          <EmotionTag>{emotion}</EmotionTag>

          {/* Ground */}
          <div style={{ width: '100%', height: 3, background: '#1a1a1a', position: 'absolute', bottom: 120 }} />

          {/* Caption */}
          <div style={{ position: 'absolute', bottom: 80, width: '100%', textAlign: 'center',
            fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', opacity: 0.45,
            fontFamily: "'Space Mono', monospace" }}>{caption}</div>

          {/* Stickman */}
          <div style={{ position: 'absolute', bottom: 123, left: `${stickX}%`,
            transform: 'translateX(-50%)', width: 160, height: 320, opacity: stickOpacity }}>
            <SpeechBubble text={speech} visible={speechVisible} />
            <Stickman pose={pose} walkProgress={walkProgress} />
          </div>

          {/* Decorative rule */}
          <svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 120, opacity: 0.1 }} viewBox="0 0 400 120">
            <line x1="0" y1="60" x2="400" y2="60" stroke="#1a1a1a" strokeWidth="1" />
            {[100, 200, 300].map(x => <line key={x} x1={x} y1="50" x2={x} y2="70" stroke="#1a1a1a" strokeWidth="1.5" />)}
          </svg>
        </div>

        {/* RIGHT: Chat panel */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#fff9f0' }}>
          <div style={{ padding: '20px 24px', borderBottom: '3px solid #1a1a1a',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>CONVERSATION</span>
            <span style={{ fontSize: 11, fontFamily: "'Space Mono'", fontWeight: 400, opacity: 0.45, letterSpacing: 1 }}>
              VOICE / TEXT
            </span>
          </div>

          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: 20,
            display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 240px)' }}>
            {messages.map(m => <Message key={m.id} text={m.text} role={m.role} />)}
            {thinking && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
                  opacity: 0.45, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>BUDDY_</div>
                <ThinkingDots />
              </div>
            )}
          </div>

          {/* Input area */}
          <div style={{ borderTop: '3px solid #1a1a1a', padding: '16px 20px', background: '#fff9f0' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Tell me what happened today..."
                style={{ flex: 1, background: '#f5f0e8', border: '2.5px solid #1a1a1a',
                  padding: '12px 16px', fontFamily: "'Courier Prime', monospace",
                  fontSize: 13, resize: 'none', outline: 'none', height: 50, lineHeight: 1.4 }}
              />
              <button
                onClick={toggleMic}
                disabled={!isSupported}
                style={{ width: 50, height: 50, border: `2.5px solid ${recording ? '#c0392b' : '#1a1a1a'}`,
                  background: recording ? '#c0392b' : '#1a1a1a', color: '#f5f0e8',
                  cursor: isSupported ? 'pointer' : 'not-allowed', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                  animation: recording ? 'pulse 0.8s infinite' : 'none',
                  opacity: isSupported ? 1 : 0.4 }}
              >
                {recording ? '⏹' : '🎙'}
              </button>
              <SendButton onClick={handleSend}>SEND →</SendButton>
            </div>
            <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              opacity: 0.38, marginTop: 8, fontFamily: "'Space Mono', monospace" }}>
              PRESS ENTER OR SEND · MIC FOR VOICE
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Tiny reusable sub-components ────────────────────────────────────────
function Label({ top, left, children }) {
  return (
    <div style={{ position: 'absolute', top, left, fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 13, letterSpacing: 3, border: '2px solid #1a1a1a', padding: '4px 10px', background: '#f5f0e8' }}>
      {children}
    </div>
  )
}

function EmotionTag({ children }) {
  return (
    <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: "'Bebas Neue', sans-serif",
      fontSize: 15, letterSpacing: 2, border: '2.5px solid #1a1a1a', padding: '4px 12px',
      background: '#1a1a1a', color: '#f5f0e8', minWidth: 80, textAlign: 'center', transition: 'all 0.3s' }}>
      {children}
    </div>
  )
}

function SendButton({ onClick, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ padding: '0 20px', height: 50, border: '2.5px solid #1a1a1a',
        background: hovered ? '#1a1a1a' : '#f5f0e8', color: hovered ? '#f5f0e8' : '#1a1a1a',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 2,
        cursor: 'pointer', transition: 'all 0.15s' }}>
      {children}
    </button>
  )
}
