// Coordinates match the 200x440 viewBox in Stickman.jsx
// armL/R: end points of arm bezier curves (start is always 100,125)
// legL/R: end points of leg bezier curves (start is always 100,220)
// mouth: SVG path drawn inside head (centered ~100,56)
export const POSES = {
  idle: {
    armL: { x2: 62,  y2: 175 },
    armR: { x2: 138, y2: 175 },
    legL: { x2: 72,  y2: 320 },
    legR: { x2: 128, y2: 320 },
    mouth: "M 88 68 Q 100 78 112 68",
    emotion: "IDLE",
    caption: "waiting for you...",
    headAnim: "idle",
  },
  talking: {
    armL: { x2: 54,  y2: 158 },
    armR: { x2: 148, y2: 168 },
    legL: { x2: 72,  y2: 320 },
    legR: { x2: 128, y2: 320 },
    mouth: "M 86 66 Q 100 80 114 66",
    emotion: "TALKING",
    caption: "responding...",
    headAnim: "talking",
  },
  nodding: {
    armL: { x2: 64,  y2: 180 },
    armR: { x2: 136, y2: 180 },
    legL: { x2: 72,  y2: 320 },
    legR: { x2: 128, y2: 320 },
    mouth: "M 89 67 Q 100 75 111 67",
    emotion: "LISTENING",
    caption: "i hear you...",
    headAnim: "nodding",
  },
  thinking: {
    armL: { x2: 84,  y2: 118 },  // hand near chin
    armR: { x2: 148, y2: 175 },
    legL: { x2: 72,  y2: 320 },
    legR: { x2: 128, y2: 320 },
    mouth: "M 90 70 Q 100 66 110 70",
    emotion: "THINKING",
    caption: "hmm...",
    headAnim: "idle",
  },
  happy: {
    armL: { x2: 30,  y2: 130 },  // arms raised
    armR: { x2: 170, y2: 130 },
    legL: { x2: 66,  y2: 318 },
    legR: { x2: 134, y2: 318 },
    mouth: "M 85 65 Q 100 82 115 65",
    emotion: "HAPPY!",
    caption: "love that!",
    headAnim: "idle",
  },
  surprised: {
    armL: { x2: 28,  y2: 128 },
    armR: { x2: 172, y2: 128 },
    legL: { x2: 68,  y2: 322 },
    legR: { x2: 132, y2: 322 },
    mouth: "M 90 66 Q 100 82 110 66",
    emotion: "WOW",
    caption: "no way!",
    headAnim: "idle",
  },
  stretching: {
    armL: { x2: 18,  y2: 105 },
    armR: { x2: 182, y2: 105 },
    legL: { x2: 58,  y2: 330 },
    legR: { x2: 142, y2: 330 },
    mouth: "M 88 68 Q 100 78 112 68",
    emotion: "STRETCHING",
    caption: "lemme stretch...",
    headAnim: "idle",
  },
};

export const AI_REPLIES = [
  { text: "Oof, sounds like a lot! How are you feeling about it all?", pose: "nodding", speech: "sounds heavy..." },
  { text: "Wait, seriously?! That's actually wild. Tell me more!", pose: "surprised", speech: "no way!" },
  { text: "Haha okay okay, I see you! That's lowkey a win though.", pose: "happy", speech: "yesss!" },
  { text: "Hmm... maybe the key thing here is how you reacted to it?", pose: "thinking", speech: "hmm 🤔" },
  { text: "I feel like this keeps coming up for you. Is it weighing on you?", pose: "nodding", speech: "i hear you..." },
  { text: "Bro that sounds exhausting. You okay? Real talk.", pose: "nodding", speech: "you ok?" },
  { text: "Okay but that's actually hilarious 😅 didn't see that coming", pose: "happy", speech: "lmaooo" },
  { text: "You're allowed to just feel whatever you feel about it, y'know?", pose: "talking", speech: "for real tho" },
];
