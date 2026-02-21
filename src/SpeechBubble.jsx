export default function SpeechBubble({ text, visible }) {
  return (
    <div style={{
      position: 'absolute',
      top: '-90px',
      left: '55%',
      background: '#fff9f0',
      border: '2.5px solid #1a1a1a',
      borderRadius: '0 16px 16px 16px',
      padding: '10px 14px',
      fontSize: 12,
      fontFamily: "'Courier Prime', monospace",
      maxWidth: 180,
      lineHeight: 1.5,
      boxShadow: '3px 3px 0 #1a1a1a',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.92)',
      transition: 'all 0.25s ease',
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
