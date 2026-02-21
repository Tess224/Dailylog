import { useState, useEffect, useRef, useCallback } from 'react'
import Stickman from './Stickman.jsx'
import SpeechBubble from './SpeechBubble.jsx'
import { Message, ThinkingDots } from './ChatMessage.jsx'
import { useSpeechRecognition } from './useSpeechRecognition.js'
import { POSES, AI_REPLIES, KEYWORD_POSES } from './data.js'

const lerp = (a, b, t) => a + (b - a) * t
const isMobile = () => window.innerWidth < 768

const GLOBAL_STYLES = `
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .stage {
    display: grid;
    grid-template-columns: 1fr 400px;
    flex: 1;
    min-height: 0;
  }
  .canvas-area {
    border-right: 3px solid #1a1a1a;
    position: relative;
    overflow: hidden;
  }
  .chat-panel {
    display: flex;
    flex-direction: column;
    background: #fff9f0;
    min-height: 0;
  }
  .chat-log {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    min-height: 0;
  }

  @media (max-width: 767px) {
    .stage {
      grid-template-columns: 1fr;
      grid-template-rows: 50vh 1fr;
    }
    .canvas-area {
      border-right: none;
      border-bottom: 3px solid #1a1a1a;
    }
  }
`

export default function App() {
  const [messages, setMessages]           = useState([{ id: 0, role: 'ai', text: "Hey! Walk in and tell me about your day. I'm all ears 👓" }])
  const [pose, setPose]                   = useState('idle')
  const [speech, setSpeech]               = useState('')
  const [speechVisible, setSpeechVisible] = useState(false)
  const [thinking, setThinking]           = useState(false)
  const [input, setInput]                 = useState('')
  const [walkProgress, setWalkProgress]   = useState(0)
  const [stickX, setStickX]               = useState(-30)
  const [stickOpacity, setStickOpacity]   = useState(0)
  const [emotion, setEmotion]             = useState('IDLE')
  const [caption, setCaption]             = useState('walk on in...')
  const [mobile, setMobile]               = useState(isMobile())

  const chatRef     = useRef(null)
  const replyIdx    = useRef(0)
  const speechTimer = useRef(null)

  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    let prog = 0
    const id = setInterval(() => {
      prog += 2.2
      const t = Math.min(prog / 52, 1)
      setWalkProgress(prog)
      setStickX(lerp(-30, 50, t))
      setStickOpacity(Math.min(t * 3, 1))
      if (t >= 1) {
        clearInterval(id)
        setWalkProgress(100)
        setPose('idle')
        setCaption('waiting for you...')
        setTimeout(() => showSpeech('hey! 👋', 2500), 400)
      }
    }, 32)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, thinking])

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

  // Walk stickman across stage and back
  const doWalk = useCallback(() => {
    const dir = Math.random() > 0.5 ? 1 : -1
    const target = 50 + dir * 28
    let prog = 0
    const go = setInterval(() => {
      prog += 3
      const t = Math.min(prog / 40, 1)
      setWalkProgress(prog)
      setStickX(50 + (target - 50) * t)
      if (t >= 1) {
        clearInterval(go)
        let prog2 = 0
        const back = setInterval(() => {
          prog2 += 3
          const t2 = Math.min(prog2 / 40, 1)
          setWalkProgress(prog2)
          setStickX(target + (50 - target) * t2)
          if (t2 >= 1) { clearInterval(back); setWalkProgress(100); setStickX(50) }
        }, 32)
      }
    }, 32)
  }, [])

  const handleSend = useCallback(async (overrideText) => {
    const text = (overrideText ?? input).trim()
    if (!text) return
    setInput('')
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text }])
    applyPose('nodding')
    setThinking(true)

    // ↓ Replace with your real API call
    await new Promise(r => setTimeout(r, 900 + Math.random() * 800))
    const lower = text.toLowerCase()
    let detectedPose = null
    for (const [poseName, keywords] of Object.entries(KEYWORD_POSES)) {
      if (keywords.some(kw => lower.includes(kw))) { detectedPose = poseName; break }
    }
    const reply = { ...AI_REPLIES[replyIdx.current % AI_REPLIES.length] }
    if (detectedPose) reply.pose = detectedPose
    replyIdx.current++
    // ↑ --------------------------------

    setThinking(false)

    if (replyIdx.current % 3 === 0) {
      applyPose('walking')
      doWalk()
      await new Promise(r => setTimeout(r, 2200))
    } else if (replyIdx.current % 5 === 0) {
      applyPose('stretching')
      await new Promise(r => setTimeout(r, 900))
    }

    applyPose(reply.pose)
    showSpeech(reply.speech, 3200)
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: reply.text }])
    setTimeout(() => applyPose('idle'), 4000)
  }, [input, applyPose, showSpeech, doWalk])

  const { recording, toggle: toggleMic, isSupported } = useSpeechRecognition({
    onResult: (t) => setInput(t),
    onEnd: () => { applyPose('idle'); setInput(prev => { handleSend(prev); return prev }) },
  })

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // Stickman sizing per breakpoint
  const stickW      = mobile ? 130 : 300
  const stickH      = mobile ? 260 : 600
  const groundBot   = mobile ? 70  : 110
  const stickBot    = mobile ? 58  : 95

  return (
    <div style={{
      height: '100dvh', background: '#f5f0e8',
      backgroundImage: 'radial-gradient(circle, #c9bfa5 1px, transparent 1px)',
      backgroundSize: '28px 28px', fontFamily: "'Courier Prime', monospace",
      color: '#1a1a1a', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <style>{GLOBAL_STYLES}</style>

      {/* NAV */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: mobile ? '10px 16px' : '14px 32px',
        borderBottom: '3px solid #1a1a1a', background: '#f5f0e8', flexShrink: 0,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: mobile ? 20 : 26, letterSpacing: 4 }}>
          DAYLOG_
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
          border: '2px solid #1a1a1a', padding: mobile ? '4px 8px' : '6px 14px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a1a1a', animation: 'blink 1.2s infinite' }} />
          {mobile ? 'ONLINE' : 'COMPANION ONLINE'}
        </div>
      </nav>

      {/* STAGE */}
      <div className="stage">

        {/* CANVAS */}
        <div className="canvas-area">
          <Label top={12} left={12} small={mobile}>STAGE_01</Label>
          <EmotionTag small={mobile}>{emotion}</EmotionTag>

          <div style={{ position: 'absolute', bottom: groundBot, left: 0, width: '100%', height: 3, background: '#1a1a1a' }} />

          <div style={{
            position: 'absolute', bottom: mobile ? 40 : 62,
            width: '100%', textAlign: 'center',
            fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
            opacity: 0.4, fontFamily: "'Space Mono', monospace",
          }}>
            {caption}
          </div>

          <div style={{
            position: 'absolute', bottom: stickBot,
            left: `${stickX}%`, transform: 'translateX(-50%)',
            width: stickW, height: stickH, opacity: stickOpacity,
          }}>
            <SpeechBubble text={speech} visible={speechVisible} />
            <Stickman pose={pose} walkProgress={walkProgress} />
          </div>
        </div>

        {/* CHAT PANEL */}
        <div className="chat-panel">
          {!mobile && (
            <div style={{
              padding: '16px 24px', borderBottom: '3px solid #1a1a1a',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: 3,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0,
            }}>
              <span>CONVERSATION</span>
              <span style={{ fontSize: 11, fontFamily: "'Space Mono'", fontWeight: 400, opacity: 0.45, letterSpacing: 1 }}>
                VOICE / TEXT
              </span>
            </div>
          )}

          <div className="chat-log" ref={chatRef}>
            {messages.map(m => <Message key={m.id} text={m.text} role={m.role} />)}
            {thinking && (
              <div style={{ alignSelf: 'flex-start' }}>
                <div style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase',
                  opacity: 0.45, marginBottom: 4, fontFamily: "'Space Mono', monospace" }}>BUDDY_</div>
                <ThinkingDots />
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            borderTop: '3px solid #1a1a1a',
            padding: mobile ? '10px 12px' : '14px 20px',
            background: '#fff9f0', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Tell me what happened today..."
                style={{
                  flex: 1, background: '#f5f0e8', border: '2.5px solid #1a1a1a',
                  padding: '10px 14px', fontFamily: "'Courier Prime', monospace",
                  fontSize: 13, resize: 'none', outline: 'none', height: 46, lineHeight: 1.4,
                }}
              />
              <button
                onClick={toggleMic}
                disabled={!isSupported}
                style={{
                  width: 46, height: 46, flexShrink: 0,
                  border: `2.5px solid ${recording ? '#c0392b' : '#1a1a1a'}`,
                  background: recording ? '#c0392b' : '#1a1a1a', color: '#f5f0e8',
                  cursor: isSupported ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, animation: recording ? 'pulse 0.8s infinite' : 'none',
                  opacity: isSupported ? 1 : 0.4,
                }}
              >
                {recording ? '⏹' : '🎙'}
              </button>
              <SendButton onClick={handleSend} small={mobile}>SEND →</SendButton>
            </div>
            {!mobile && (
              <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
                opacity: 0.35, marginTop: 6, fontFamily: "'Space Mono', monospace" }}>
                PRESS ENTER OR SEND · MIC FOR VOICE
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ top, left, small, children }) {
  return (
    <div style={{
      position: 'absolute', top, left,
      fontFamily: "'Bebas Neue', sans-serif", fontSize: small ? 10 : 13,
      letterSpacing: 3, border: '2px solid #1a1a1a', padding: '3px 8px', background: '#f5f0e8',
    }}>
      {children}
    </div>
  )
}

function EmotionTag({ small, children }) {
  return (
    <div style={{
      position: 'absolute', top: small ? 12 : 18, right: small ? 12 : 18,
      fontFamily: "'Bebas Neue', sans-serif", fontSize: small ? 11 : 15,
      letterSpacing: 2, border: '2.5px solid #1a1a1a', padding: '3px 10px',
      background: '#1a1a1a', color: '#f5f0e8', minWidth: 55, textAlign: 'center', transition: 'all 0.3s',
    }}>
      {children}
    </div>
  )
}

function SendButton({ onClick, small, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: small ? '0 12px' : '0 20px', height: 46, flexShrink: 0,
        border: '2.5px solid #1a1a1a',
        background: hovered ? '#1a1a1a' : '#f5f0e8',
        color: hovered ? '#f5f0e8' : '#1a1a1a',
        fontFamily: "'Bebas Neue', sans-serif", fontSize: small ? 13 : 16,
        letterSpacing: 2, cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  )
}
