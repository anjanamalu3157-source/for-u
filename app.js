// A Promise of Forever - Application Script
document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const loader = document.getElementById('loader');
  const customCursor = document.getElementById('custom-cursor');
  const typewriterElement = document.getElementById('typewriter-element');
  const waitingPrompt = document.getElementById('waiting-prompt');
  const heroActionContainer = document.getElementById('hero-action-container');
  const openHeartBtn = document.getElementById('open-heart-btn');
  const heroSection = document.getElementById('hero-section');
  
  const envelopeSection = document.getElementById('envelope-section');
  const envelopeWrapper = document.getElementById('envelope-wrapper');
  const envelope = document.getElementById('envelope');
  
  const proposalSection = document.getElementById('proposal-section');
  const proposalBox = document.getElementById('proposal-box');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');
  const noBubble = document.getElementById('no-bubble');
  const yesCelebration = document.getElementById('yes-celebration');
  const proposalDate = document.getElementById('proposal-date');
  const unlockedContent = document.getElementById('unlocked-content');
  
  const musicWidget = document.getElementById('music-widget');
  // --- Loader Screen ---
  setTimeout(() => {
    loader.classList.add('fade-out');
    // Start the typewriter animation after loader fades out
    setTimeout(startTypewriter, 1000);
  }, 2500);
  // --- Custom Cursor ---
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  // Smooth cursor follow
  function updateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    customCursor.style.left = `${cursorX}px`;
    customCursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(updateCursor);
  }
  updateCursor();
  // Scale cursor on hoverable elements
  const hoverables = document.querySelectorAll('button, .music-widget, .gallery-card');
  hoverables.forEach(item => {
    item.addEventListener('mouseenter', () => {
      customCursor.style.width = '24px';
      customCursor.style.height = '24px';
      customCursor.style.backgroundColor = 'rgba(255, 179, 193, 0.3)';
      customCursor.style.border = '2px solid var(--rose-gold-light)';
    });
    item.addEventListener('mouseleave', () => {
      customCursor.style.width = '10px';
      customCursor.style.height = '10px';
      customCursor.style.backgroundColor = 'var(--blush-rose)';
      customCursor.style.border = 'none';
    });
  });
  // --- Typewriter Animation ---
  const typewriterLines = [
    "Some people become memories...",
    "Some become happiness...",
    "But you became my whole world. ❤️"
  ];
  let currentLineIdx = 0;
  let currentCharIdx = 0;
  function startTypewriter() {
    typewriterElement.innerHTML = '';
    typewriterElement.style.display = 'block';
    typeChar();
  }
  function typeChar() {
    if (currentLineIdx < typewriterLines.length) {
      const line = typewriterLines[currentLineIdx];
      if (currentCharIdx < line.length) {
        typewriterElement.innerHTML += line.charAt(currentCharIdx);
        currentCharIdx++;
        setTimeout(typeChar, 70); // typing speed
      } else {
        // Line completed
        typewriterElement.innerHTML += '<br>';
        currentLineIdx++;
        currentCharIdx = 0;
        setTimeout(typeChar, 800); // pause between lines
      }
    } else {
      // Completed all typewriter lines
      setTimeout(() => {
        waitingPrompt.classList.add('visible');
        heroActionContainer.classList.add('visible');
      }, 1000);
    }
  }
  // --- Open My Heart Action ---
  openHeartBtn.addEventListener('click', () => {
    // Fade out hero content slightly and reveal Envelope section
    envelopeSection.style.display = 'flex';
    envelopeSection.scrollIntoView({ behavior: 'smooth' });
    
    // Automatically start the envelope open sequence after scrolling
    setTimeout(() => {
      envelope.classList.add('open');
      
      // Auto transition to proposal after user reads the letter (approx 10s)
      setTimeout(() => {
        // Add a beautiful prompt inside the letter to click to continue
        const letter = document.getElementById('letter-sheet');
        const continuePrompt = document.createElement('div');
        continuePrompt.innerHTML = "✨ Click to unfold my heart... ✨";
        continuePrompt.style.cssText = `
          font-family: 'Poppins', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          color: var(--rose-gold-dark);
          text-align: center;
          margin-top: 25px;
          text-transform: uppercase;
          animation: pulseGlow 1.5s infinite alternate ease-in-out;
          cursor: pointer;
        `;
        letter.appendChild(continuePrompt);
        
        const transitionToProposal = () => {
          envelopeWrapper.classList.add('fade-out');
          setTimeout(() => {
            envelopeSection.style.display = 'none';
            proposalSection.style.display = 'flex';
            proposalSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
              proposalBox.classList.add('visible');
            }, 500);
          }, 1500);
        };
        
        continuePrompt.addEventListener('click', transitionToProposal);
        letter.addEventListener('click', transitionToProposal);
      }, 7000);
      
    }, 1500);
  });
  // --- NO Button Evasion Mechanics ---
  const noMessages = [
    "🥺 Are you really sure?",
    "❤️ My heart already chose you.",
    "😭 Please don't break my heart.",
    "💕 One more chance?",
    "🌸 I know your answer is YES."
  ];
  let noClicks = 0;
  let isSwapped = false;
  function evadeNoButton(e) {
    const btnRect = btnNo.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const mouseXPos = e.clientX || (e.touches && e.touches[0].clientX);
    const mouseYPos = e.clientY || (e.touches && e.touches[0].clientY);
    const distance = Math.hypot(mouseXPos - btnCenterX, mouseYPos - btnCenterY);
    // If mouse is within 100px radius of button, move it
    if (distance < 110) {
      noClicks++;
      // 1. Swap positions occasionally (every 3rd evasion)
      if (noClicks % 3 === 0) {
        swapButtons();
        showNoBubble();
        return;
      }
      // 2. Calculate evasion movement vector
      const angle = Math.atan2(btnCenterY - mouseYPos, btnCenterX - mouseXPos);
      let runDist = 120; // run distance
      let newLeft = btnNo.offsetLeft + Math.cos(angle) * runDist;
      let newTop = btnNo.offsetTop + Math.sin(angle) * runDist;
      // Restrict within parent container bounds
      const parentRect = btnNo.parentElement.getBoundingClientRect();
      const margin = 20;
      if (newLeft < margin || newLeft > parentRect.width - btnRect.width - margin) {
        newLeft = Math.random() * (parentRect.width - btnRect.width - 2 * margin) + margin;
      }
      if (newTop < -parentRect.height || newTop > parentRect.height + margin) {
        newTop = (Math.random() - 0.5) * parentRect.height;
      }
      // 3. Shrink and rotate playfully
      const currentScale = Math.max(1 - (noClicks * 0.08), 0.35); // Shrink up to 65% max
      const randomRotate = (Math.random() - 0.5) * 50; // rotate between -25deg and 25deg
      btnNo.style.position = 'absolute';
      btnNo.style.left = `${newLeft}px`;
      btnNo.style.top = `${newTop}px`;
      btnNo.style.transform = `scale(${currentScale}) rotate(${randomRotate}deg)`;
      showNoBubble();
    }
  }
  function swapButtons() {
    const parent = btnNo.parentElement.parentElement; // .proposal-buttons
    const yesRect = btnYes.getBoundingClientRect();
    const noRect = btnNo.getBoundingClientRect();
    if (!isSwapped) {
      btnNo.style.position = 'absolute';
      btnYes.style.position = 'absolute';
      
      btnNo.style.left = `${yesRect.left - parent.getBoundingClientRect().left}px`;
      btnYes.style.left = `${noRect.left - parent.getBoundingClientRect().left}px`;
      isSwapped = true;
    } else {
      btnNo.style.position = 'relative';
      btnYes.style.position = 'relative';
      btnNo.style.left = 'auto';
      btnNo.style.top = 'auto';
      btnYes.style.left = 'auto';
      btnYes.style.top = 'auto';
      btnNo.style.transform = 'none';
      isSwapped = false;
    }
  }
  function showNoBubble() {
    const randomMsg = noMessages[Math.floor(Math.random() * noMessages.length)];
    noBubble.textContent = randomMsg;
    noBubble.classList.add('visible');
    
    // Auto-hide bubble after a brief pause
    setTimeout(() => {
      noBubble.classList.remove('visible');
    }, 1500);
  }
  btnNo.addEventListener('mousemove', evadeNoButton);
  btnNo.addEventListener('touchstart', evadeNoButton);
  btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    evadeNoButton(e);
  });
  // --- YES Button Actions & Celebration ---
  btnYes.addEventListener('click', () => {
    // 1. Play synthesized soundtrack if it was muted
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (isMuted) {
      toggleMusic();
    }
    // 2. Set proposal date (today)
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    proposalDate.textContent = today.toLocaleDateString('en-US', options);
    // 3. Transition Vows Card
    proposalBox.style.display = 'none';
    yesCelebration.classList.add('visible');
    // 4. Trigger Canvas Fireworks, confetti, heart explosions
    celebrateCelebration();
    // 5. Unlock the scrolling content
    unlockedContent.classList.add('visible');
    // 6. Smooth scroll to vows page
    setTimeout(() => {
      yesCelebration.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  });
  // --- Background Particle Canvas System ---
  const canvas = document.getElementById('effects-canvas');
  const ctx = canvas.getContext('2d');
  
  let particles = [];
  let isCelebrating = false;
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  // Particle prototypes
  class Star {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random();
      this.speed = Math.random() * 0.02 + 0.005;
    }
    update() {
      this.alpha += this.speed;
      if (this.alpha > 1 || this.alpha < 0) {
        this.speed = -this.speed;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  class Petal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20 - Math.random() * 100;
      this.size = Math.random() * 12 + 6;
      this.speedX = Math.random() * 1.5 - 0.5;
      this.speedY = Math.random() * 1.2 + 0.6;
      this.rotation = Math.random() * 360;
      this.rotationSpeed = Math.random() * 1.5 - 0.75;
      this.opacity = Math.random() * 0.4 + 0.4;
      this.swingSpeed = Math.random() * 0.03 + 0.01;
      this.swingAngle = Math.random() * Math.PI;
    }
    update() {
      this.y += this.speedY;
      this.swingAngle += this.swingSpeed;
      this.x += this.speedX + Math.sin(this.swingAngle) * 0.6;
      this.rotation += this.rotationSpeed;
      if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.fillStyle = `rgba(255, 183, 197, ${this.opacity})`;
      
      // Draw rose petal leaf shape
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size / 1.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  class Heart {
    constructor(isExplosion = false, x, y) {
      this.isExplosion = isExplosion;
      if (isExplosion) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2; // gravity offset
        this.size = Math.random() * 15 + 8;
        this.opacity = 1;
        this.decay = Math.random() * 0.015 + 0.01;
      } else {
        this.reset();
      }
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20 + Math.random() * 100;
      this.size = Math.random() * 14 + 5;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.speedY = -(Math.random() * 0.8 + 0.4);
      this.opacity = Math.random() * 0.3 + 0.3;
      this.swingSpeed = Math.random() * 0.02 + 0.01;
      this.swingAngle = Math.random() * Math.PI;
    }
    update() {
      if (this.isExplosion) {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += 0.08; // gravity
        this.opacity -= this.decay;
      } else {
        this.y += this.speedY;
        this.swingAngle += this.swingSpeed;
        this.x += this.speedX + Math.sin(this.swingAngle) * 0.3;
        if (this.y < -20) {
          this.reset();
        }
      }
    }
    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.isExplosion 
        ? `rgba(255, ${Math.floor(Math.random() * 100) + 50}, ${Math.floor(Math.random() * 120) + 100}, ${this.opacity})`
        : `rgba(255, 179, 193, ${this.opacity})`;
      
      // Draw Heart Shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size / 4);
      ctx.bezierCurveTo(this.size / 2, -this.size, this.size * 1.2, -this.size / 3, 0, this.size);
      ctx.bezierCurveTo(-this.size * 1.2, -this.size / 3, -this.size / 2, -this.size, 0, -this.size / 4);
      ctx.fill();
      ctx.restore();
    }
  }
  class Butterfly {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = -50;
      this.y = Math.random() * (canvas.height * 0.7) + 50;
      this.size = Math.random() * 10 + 6;
      this.speedX = Math.random() * 1.5 + 1;
      this.speedY = Math.random() * 1 - 0.5;
      this.flapSpeed = Math.random() * 0.15 + 0.1;
      this.flapAngle = 0;
      this.opacity = Math.random() * 0.4 + 0.4;
      this.color = `hsl(${Math.random() * 40 + 320}, 90%, 85%)`; // Lavender to blush range
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY + Math.sin(this.x * 0.02) * 0.8;
      this.flapAngle += this.flapSpeed;
      if (this.x > canvas.width + 50) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      const wingWidth = this.size * Math.abs(Math.sin(this.flapAngle));
      // Draw Left Wings
      ctx.beginPath();
      ctx.ellipse(-this.size/2, -this.size/2, wingWidth, this.size, Math.PI/4, 0, Math.PI*2);
      ctx.ellipse(-this.size/2, this.size/2, wingWidth, this.size * 0.7, -Math.PI/4, 0, Math.PI*2);
      ctx.fill();
      // Draw Right Wings
      ctx.beginPath();
      ctx.ellipse(this.size/2, -this.size/2, wingWidth, this.size, -Math.PI/4, 0, Math.PI*2);
      ctx.ellipse(this.size/2, this.size/2, wingWidth, this.size * 0.7, Math.PI/4, 0, Math.PI*2);
      ctx.fill();
      // Body
      ctx.fillStyle = '#4a3e41';
      ctx.beginPath();
      ctx.ellipse(0, 0, 1.5, this.size * 0.9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  class Firework {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.particles = [];
      const particleCount = 60;
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(new Heart(true, x, y));
      }
    }
    update() {
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.opacity > 0);
    }
    draw() {
      this.particles.forEach(p => p.draw());
    }
  }
  // Populate initial particles
  const starsCount = 100;
  const petalsCount = 45;
  const heartsCount = 30;
  const butterfliesCount = 3;
  for (let i = 0; i < starsCount; i++) particles.push(new Star());
  for (let i = 0; i < petalsCount; i++) particles.push(new Petal());
  for (let i = 0; i < heartsCount; i++) particles.push(new Heart());
  for (let i = 0; i < butterfliesCount; i++) particles.push(new Butterfly());
  // Cursor Trail Particle Generation
  let mouseTrailTimer = 0;
  document.addEventListener('mousemove', (e) => {
    mouseTrailTimer++;
    if (mouseTrailTimer % 4 === 0) {
      // Add cursor sparkle particle on canvas
      const cursorParticle = new Heart(true, e.clientX, e.clientY);
      cursorParticle.speedX = (Math.random() - 0.5) * 2;
      cursorParticle.speedY = (Math.random() - 0.5) * 2 - 1;
      cursorParticle.size = Math.random() * 8 + 4;
      cursorParticle.decay = 0.02;
      particles.push(cursorParticle);
    }
  });
  // Animation Loop
  let fireworks = [];
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    if (isCelebrating) {
      fireworks.forEach((fw, idx) => {
        fw.update();
        fw.draw();
        if (fw.particles.length === 0) {
          fireworks.splice(idx, 1);
        }
      });
      // Periodically trigger auto fireworks during celebration
      if (Math.random() < 0.02) {
        fireworks.push(new Firework(
          Math.random() * canvas.width,
          Math.random() * (canvas.height * 0.6) + 100
        ));
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
  function celebrateCelebration() {
    isCelebrating = true;
    
    // Massive initial explosion of fireworks
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        fireworks.push(new Firework(
          Math.random() * (canvas.width - 200) + 100,
          Math.random() * (canvas.height * 0.5) + 100
        ));
      }, i * 350);
    }
    // Add extra butterflies and petals for the fairytale feel
    for (let i = 0; i < 5; i++) {
      particles.push(new Butterfly());
    }
    for (let i = 0; i < 30; i++) {
      particles.push(new Petal());
    }
  }
  // --- Scroll Reveal Animations ---
  const scrollElements = document.querySelectorAll('.reveal-on-scroll, .timeline-content, .gallery-card, .final-box');
  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };
  const displayScrollElement = (element) => {
    element.classList.add('reveal');
  };
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.15)) {
        displayScrollElement(el);
      }
    });
  };
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
  // Initial check on load
  setTimeout(handleScrollAnimation, 3000);
  // --- Web Audio Romantic Piano Player ---
  let audioCtx = null;
  let synthInterval = null;
  let isMuted = true;
  // Notes and frequencies for Canon in D arpeggios
  // Notation: [Note, Octave] mapped to frequency
  const noteFreq = {
    'D3': 146.83, 'F#3': 185.00, 'A3': 220.00, 'C#4': 277.18, 
    'D4': 293.66, 'E4': 329.63, 'F#4': 369.99, 'G4': 392.00, 
    'A4': 440.00, 'B4': 493.88, 'C#5': 554.37, 'D5': 587.33,
    'E5': 659.25, 'F#5': 739.99, 'G5': 783.99, 'A5': 880.00
  };
  // 8 Chord progressions for Canon in D: 
  // D - A - Bm - F#m - G - D - G - A
  const arpeggios = [
    ['D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3'],   // D Major
    ['A3', 'E4', 'A4', 'C#5', 'E5', 'C#5', 'A4', 'E4'],   // A Major
    ['B3', 'F#4', 'B4', 'D5', 'F#5', 'D5', 'B4', 'F#4'],  // B Minor
    ['F#3', 'C#4', 'F#4', 'A4', 'C#5', 'A4', 'F#4', 'C#4'], // F# Minor
    ['G3', 'D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4'],     // G Major
    ['D3', 'A3', 'D4', 'F#4', 'A4', 'F#4', 'D4', 'A3'],   // D Major
    ['G3', 'D4', 'G4', 'B4', 'D5', 'B4', 'G4', 'D4'],     // G Major
    ['A3', 'E4', 'A4', 'C#5', 'E5', 'C#5', 'A4', 'E4']    // A Major
  ];
  let currentChordIdx = 0;
  let currentNoteIdx = 0;
  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create master volume node
    const masterVolume = audioCtx.createGain();
    masterVolume.gain.setValueAtTime(0, audioCtx.currentTime); // fade-in start
    
    // Create a delay/echo feedback loop to simulate a soft sustain pedal
    const delay = audioCtx.createDelay();
    delay.delayTime.setValueAtTime(0.45, audioCtx.currentTime);
    
    const feedback = audioCtx.createGain();
    feedback.gain.setValueAtTime(0.3, audioCtx.currentTime); // echo volume decay
    // Filter to make it warmer & softer (lowpass filter)
    const lowpass = audioCtx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(850, audioCtx.currentTime); // filter out harsh transients
    // Connect nodes
    // Synth Voice -> Lowpass Filter -> Master Volume -> Speakers
    // Master Volume -> Delay Loop -> Master Volume (sustain effect)
    lowpass.connect(masterVolume);
    masterVolume.connect(audioCtx.destination);
    
    masterVolume.connect(delay);
    delay.connect(feedback);
    feedback.connect(masterVolume);
    return { audioCtx, masterVolume, lowpass };
  }
  let synthNodes = null;
  function playPianoNote(noteName, time) {
    if (!synthNodes || !audioCtx) return;
    const freq = noteFreq[noteName];
    if (!freq) return;
    // Create dual oscillators for a rich, warm, complex tone (triangle + soft sine)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const voiceVolume = audioCtx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time); // 1st octave overtone
    // Soft envelope (soft attack, slow decay & release)
    const attack = 0.015;
    const decay = 0.15;
    const sustain = 0.45;
    const release = 1.8;
    voiceVolume.gain.setValueAtTime(0, time);
    voiceVolume.gain.linearRampToValueAtTime(0.18, time + attack); // Triangle weight
    voiceVolume.gain.exponentialRampToValueAtTime(0.08, time + attack + decay);
    voiceVolume.gain.exponentialRampToValueAtTime(0.001, time + attack + decay + release);
    osc1.connect(voiceVolume);
    osc2.connect(voiceVolume);
    voiceVolume.connect(synthNodes.lowpass);
    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + attack + decay + release + 0.5);
    osc2.stop(time + attack + decay + release + 0.5);
  }
  let nextNoteTime = 0.0;
  const scheduleAheadTime = 0.1; // schedule notes 100ms in advance
  const noteDuration = 0.32; // tempo speed (ms between notes)
  function scheduler() {
    if (!audioCtx) return;
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
      scheduleNote(currentChordIdx, currentNoteIdx, nextNoteTime);
      advanceNote();
    }
  }
  function scheduleNote(chordIdx, noteIdx, time) {
    const chord = arpeggios[chordIdx];
    const note = chord[noteIdx];
    playPianoNote(note, time);
  }
  function advanceNote() {
    nextNoteTime += noteDuration;
    currentNoteIdx++;
    if (currentNoteIdx >= 8) {
      currentNoteIdx = 0;
      currentChordIdx = (currentChordIdx + 1) % arpeggios.length;
    }
  }
  let scheduleInterval = null;
  function startSynthesizer() {
    if (!audioCtx) {
      synthNodes = initAudio();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    // Fade-in master volume
    synthNodes.masterVolume.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.5);
    nextNoteTime = audioCtx.currentTime;
    
    // Scheduler polling
    scheduleInterval = setInterval(scheduler, 25);
  }
  function stopSynthesizer() {
    if (!audioCtx || !synthNodes) return;
    
    // Fade-out master volume
    synthNodes.masterVolume.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.0);
    setTimeout(() => {
      clearInterval(scheduleInterval);
      scheduleInterval = null;
    }, 1000);
  }
  function toggleMusic() {
    if (isMuted) {
      isMuted = false;
      musicWidget.classList.remove('muted');
      document.getElementById('music-text').textContent = "Mute Soundtrack";
      startSynthesizer();
    } else {
      isMuted = true;
      musicWidget.classList.add('muted');
      document.getElementById('music-text').textContent = "Play Soundtrack";
      stopSynthesizer();
    }
  }
  musicWidget.addEventListener('click', toggleMusic);
});
