import { useRef, useState, useCallback } from 'react'

export function useSpeechRecognition({ onResult, onEnd }) {
  const [recording, setRecording] = useState(false)
  const recRef = useRef(null)

  const isSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  const toggle = useCallback(() => {
    if (!isSupported) return

    if (!recRef.current) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      const rec = new SR()
      rec.continuous = false
      rec.interimResults = true
      rec.lang = 'en-US'
      rec.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join('')
        onResult(transcript)
      }
      rec.onend = () => {
        setRecording(false)
        onEnd()
      }
      recRef.current = rec
    }

    if (!recording) {
      recRef.current.start()
      setRecording(true)
    } else {
      recRef.current.stop()
    }
  }, [recording, isSupported, onResult, onEnd])

  return { recording, toggle, isSupported }
}
