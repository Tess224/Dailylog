export default function SpeechBubble({ text, visible }) {
  return (
    <div style={{
      position: 'absolute',
      top: '-100px',
      left: '60%',
      background: '#fff9f0',
      border: '2.5px solid #1a1a1a',
      borderRadius: '0 18px 18px 18px',
      padding: '12px 16px',
      fontSize: 13,
      fontFamily: "'Courier Prime', monospace",
      maxWidth: 200,
      lineHeight: 1.5,
      boxShadow: '3px 3px 0 #1a1a1a',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
      transition: 'all 0.28s ease',
      pointerEvents: 'none',
      zIndex: 10,
      whiteSpace: 'pre-wrap',
    }}>
      {text}
      <span style={{
        position: 'absolute', bottom: -13, left: 12,
        borderWidth: 6, borderStyle: 'solid',
        borderColor: '#1a1a1a transparent transparent transparent',
      }} />
      <span style={{
        position: 'absolute', bottom: -9, left: 13,
        borderWidth: 5, borderStyle: 'solid',
        borderColor: '#fff9f0 transparent transparent transparent',
      }} />
    </div>
  )
}
