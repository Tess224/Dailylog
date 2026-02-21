// headAnim options: idle | talking | nodding | shaking | bounce | spin | wiggle | float
// bodyAnim options: body-breathe | body-dance | body-bounce
// All arm/leg coords relative to the 200x440 viewBox

export const POSES = {
  idle: {
    armL: { x2: 62,  y2: 175 }, armR: { x2: 138, y2: 175 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 88 68 Q 100 78 112 68',
    emotion: 'IDLE', caption: 'waiting for you...',
    headAnim: 'idle', bodyAnim: 'body-breathe',
  },
  talking: {
    armL: { x2: 54,  y2: 158 }, armR: { x2: 148, y2: 168 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 86 66 Q 100 80 114 66',
    emotion: 'TALKING', caption: 'responding...',
    headAnim: 'talking', bodyAnim: 'body-breathe',
  },
  nodding: {
    armL: { x2: 64,  y2: 180 }, armR: { x2: 136, y2: 180 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 89 67 Q 100 75 111 67',
    emotion: 'LISTENING', caption: 'i hear you...',
    headAnim: 'nodding', bodyAnim: 'body-breathe',
  },
  thinking: {
    armL: { x2: 84,  y2: 118 }, armR: { x2: 148, y2: 175 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 90 70 Q 100 66 110 70',
    emotion: 'THINKING', caption: 'hmm...',
    headAnim: 'idle', bodyAnim: 'body-breathe',
  },
  happy: {
    armL: { x2: 30,  y2: 130 }, armR: { x2: 170, y2: 130 },
    legL: { x2: 66,  y2: 318 }, legR: { x2: 134, y2: 318 },
    mouth: 'M 85 65 Q 100 84 115 65',
    emotion: 'HAPPY!', caption: 'love that!',
    headAnim: 'bounce', bodyAnim: 'body-bounce',
  },
  surprised: {
    armL: { x2: 28,  y2: 128 }, armR: { x2: 172, y2: 128 },
    legL: { x2: 68,  y2: 322 }, legR: { x2: 132, y2: 322 },
    mouth: 'M 91 66 Q 100 80 109 66',
    emotion: 'WOW', caption: 'no way!',
    headAnim: 'shaking', bodyAnim: 'body-breathe',
  },
  stretching: {
    armL: { x2: 18,  y2: 105 }, armR: { x2: 182, y2: 105 },
    legL: { x2: 58,  y2: 330 }, legR: { x2: 142, y2: 330 },
    mouth: 'M 88 68 Q 100 78 112 68',
    emotion: 'STRETCHING', caption: 'lemme stretch...',
    headAnim: 'idle', bodyAnim: 'body-breathe',
  },
  dancing: {
    armL: { x2: 30,  y2: 120 }, armR: { x2: 170, y2: 120 },
    legL: { x2: 60,  y2: 310 }, legR: { x2: 140, y2: 310 },
    mouth: 'M 84 65 Q 100 86 116 65',
    emotion: 'DANCING!', caption: 'getting it 🕺',
    headAnim: 'wiggle', bodyAnim: 'body-dance',
  },
  walking: {
    armL: { x2: 62,  y2: 175 }, armR: { x2: 138, y2: 175 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 88 68 Q 100 76 112 68',
    emotion: 'WALKING', caption: 'taking a stroll...',
    headAnim: 'idle', bodyAnim: 'body-breathe',
  },
  shrugging: {
    armL: { x2: 44,  y2: 108 }, armR: { x2: 156, y2: 108 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 90 70 Q 100 66 110 70',
    emotion: 'SHRUG', caption: 'idk man...',
    headAnim: 'wiggle', bodyAnim: 'body-breathe',
  },
  excited: {
    armL: { x2: 22,  y2: 100 }, armR: { x2: 178, y2: 100 },
    legL: { x2: 60,  y2: 315 }, legR: { x2: 140, y2: 315 },
    mouth: 'M 83 64 Q 100 88 117 64',
    emotion: 'EXCITED!!', caption: 'LETS GOOO',
    headAnim: 'bounce', bodyAnim: 'body-bounce',
  },
  sad: {
    armL: { x2: 70,  y2: 195 }, armR: { x2: 130, y2: 195 },
    legL: { x2: 80,  y2: 315 }, legR: { x2: 120, y2: 315 },
    mouth: 'M 88 74 Q 100 64 112 74',
    emotion: 'SAD', caption: 'aw man...',
    headAnim: 'idle', bodyAnim: 'body-breathe',
  },
  facepalm: {
    armL: { x2: 90,  y2: 68  }, armR: { x2: 138, y2: 175 },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 90 70 Q 100 66 110 70',
    emotion: 'FACEPALM', caption: 'omg...',
    headAnim: 'shaking', bodyAnim: 'body-breathe',
  },
  waving: {
    armL: { x2: 62,  y2: 175 }, armR: { x2: 168, y2: 95  },
    legL: { x2: 72,  y2: 320 }, legR: { x2: 128, y2: 320 },
    mouth: 'M 86 66 Q 100 80 114 66',
    emotion: 'WAVING!', caption: 'heyyyy!',
    headAnim: 'wiggle', bodyAnim: 'body-breathe',
  },
}

// Mock responses — replace with real API later
// pose must match a key in POSES above
export const AI_REPLIES = [
  { text: "Oof, sounds like a lot! How are you feeling about it all?",          pose: 'nodding',    speech: 'sounds heavy...' },
  { text: "Wait, seriously?! That's actually wild. Tell me more!",              pose: 'surprised',  speech: 'no way!' },
  { text: "Haha okay okay, I see you! That's lowkey a win though.",             pose: 'happy',      speech: 'yesss!' },
  { text: "Hmm... maybe the key thing here is how you reacted to it?",          pose: 'thinking',   speech: 'hmm 🤔' },
  { text: "I feel like this keeps coming up for you. Is it weighing on you?",   pose: 'nodding',    speech: 'i hear you...' },
  { text: "Bro that sounds exhausting. You okay? Real talk.",                   pose: 'sad',        speech: 'you ok?' },
  { text: "Okay but that's actually hilarious 😅 didn't see that coming",       pose: 'excited',    speech: 'lmaooo' },
  { text: "You're allowed to just feel whatever you feel about it, y'know?",    pose: 'talking',    speech: 'for real tho' },
  { text: "Wait wait wait — back up. You actually did that?! Legend.",          pose: 'excited',    speech: 'LETS GO' },
  { text: "Ngl that would stress me out too. Makes total sense.",               pose: 'facepalm',   speech: 'omg...' },
  { text: "I mean... what were you supposed to do? You made the right call.",   pose: 'shrugging',  speech: 'idk man' },
  { text: "Okay I'm not gonna lie, that's actually really wholesome 🥹",        pose: 'happy',      speech: '🥹🥹' },
  { text: "Sounds like you need a proper break. When did you last rest?",       pose: 'stretching', speech: 'breathe...' },
  { text: "That's huge! You should be proud of yourself fr.",                   pose: 'waving',     speech: 'big deal!' },
]

// Keyword → pose mapping for smarter mock responses
// Your real backend should return the pose directly
export const KEYWORD_POSES = {
  happy:    ['happy', 'great', 'amazing', 'love', 'yay', 'won', 'win', 'excited', 'awesome'],
  sad:      ['sad', 'bad', 'terrible', 'miss', 'lost', 'hurt', 'cry', 'upset', 'depressed'],
  surprised:['what', 'wow', 'really', 'seriously', 'omg', 'no way', 'crazy', 'insane'],
  dancing:  ['dance', 'party', 'celebrate', 'music', 'vibe', 'lit', 'banger'],
  thinking: ['wonder', 'maybe', 'think', 'not sure', 'confused', 'question'],
  excited:  ['can\'t wait', 'so excited', 'pumped', 'hyped', 'let\'s go', 'finally'],
  facepalm: ['ugh', 'annoying', 'frustrated', 'stupid', 'mess', 'fail'],
  nodding:  ['yeah', 'exactly', 'right', 'true', 'same', 'agree', 'yes'],
  waving:   ['hello', 'hey', 'hi', 'bye', 'goodbye', 'see you'],
  shrugging:['idk', 'dunno', 'whatever', 'not sure', 'unsure'],
}
