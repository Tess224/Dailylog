const ANIM = `@keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }`

export function Message({ text, role }) {
  const isUser = role === 'user'
  return (
    <div style={{ maxWidth: '85%', alignSelf: isUser ? 'flex-end' : 'flex-start', animation: 'msgIn 0.3s ease' }}>
      <style>{ANIM}</style>
      <div style={{
        fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase',
        opacity: 0.45, marginBottom: 4, fontFamily: "'Space Mono', monospace",
        textAlign: isUser ? 'right' : 'left',
      }}>
        {isUser ? 'YOU_' : 'BUDDY_'}
      </div>
      <div style={{
        padding: '12px 16px', fontSize: 13, lineHeight: 1.65,
        border: '2.5px solid #1a1a1a', fontFamily: "'Courier Prime', monospace",
        borderRadius: isUser ? '16px 0 16px 16px' : '0 16px 16px 16px',
        background: isUser ? '#1a1a1a' : '#fff9f0',
        color: isUser ? '#f5f0e8' : '#1a1a1a',
        boxShadow: isUser ? '3px 3px 0 #666' : '3px 3px 0 #1a1a1a',
      }}>
        {text}
      </div>
    </div>
  )
}

export function ThinkingDots() {
  return (
    <>
      <style>{`@keyframes think { 0%,100%{transform:translateY(0);opacity:.3} 50%{transform:translateY(-5px);opacity:1} }`}</style>
      <div style={{
        display: 'flex', gap: 5, padding: '12px 16px',
        border: '2.5px solid #1a1a1a', borderRadius: '0 16px 16px 16px',
        boxShadow: '3px 3px 0 #1a1a1a', background: '#fff9f0', width: 'fit-content',
      }}>
        {[0, 0.2, 0.4].map((delay, i) => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%', background: '#1a1a1a', display: 'inline-block',
            animation: `think 1s ${delay}s infinite`,
          }} />
        ))}
      </div>
    </>
  )
}
