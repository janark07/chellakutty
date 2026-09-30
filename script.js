/* ==========================================================================
   ROMANTIC BIRTHDAY WEBSITE JAVASCRIPT
   "Happy Birthday My Chellakutty Kavya"
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordLock();
  initBackgroundCanvas();
  initMusicPlayer();
  initSurpriseShower();
  initPolaroidModal();
  initWaxEnvelope();
  initBirthdayCake();
  initClickHeartSparkles();
  initCuteFloatingCritters();
});

/* ==========================================================================
   0. PASSWORD PROTECTION (KEY: 'kavya2102007')
   ========================================================================== */
let startMusicGlobal = null;
let stopMusicGlobal = null;

function initPasswordLock() {
  const overlay = document.getElementById('passwordOverlay');
  const passInput = document.getElementById('passInput');
  const passError = document.getElementById('passError');
  const lockModal = document.getElementById('lockModal');
  const lockEmoji = document.getElementById('lockEmoji');
  const togglePassBtn = document.getElementById('togglePassBtn');
  const hintToggleBtn = document.getElementById('hintToggleBtn');
  const hintText = document.getElementById('hintText');

  if (!overlay) return;

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      if (passInput.type === 'password') {
        passInput.type = 'text';
        togglePassBtn.textContent = '🙈';
      } else {
        passInput.type = 'password';
        togglePassBtn.textContent = '👁️';
      }
    });
  }

  if (hintToggleBtn && hintText) {
    hintToggleBtn.addEventListener('click', () => {
      hintText.classList.toggle('hidden');
    });
  }

  window.handleUnlock = function(e) {
    if (e) e.preventDefault();
    const entered = (passInput ? passInput.value : '').trim();

    if (entered === 'kavya2102007' || entered.toLowerCase() === 'kavya2102007') {
      if (passError) passError.textContent = '';
      if (lockEmoji) lockEmoji.textContent = '🔓';

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 120,
          spread: 85,
          origin: { y: 0.5 },
          colors: ['#ff4d79', '#ffb3c6', '#ffd166', '#ffffff']
        });
      }

      // Auto start "Perfect" by Ed Sheeran
      if (typeof startMusicGlobal === 'function') {
        startMusicGlobal();
      }

      overlay.classList.add('unlocked');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 850);
    } else {
      if (passError) {
        passError.textContent = '❌ Incorrect passcode! Only Chellakutty knows the key 🙈';
      }
      if (lockModal) {
        lockModal.classList.remove('shake-anim');
        void lockModal.offsetWidth;
        lockModal.classList.add('shake-anim');
      }
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
    }
    return false;
  };
}

/* ==========================================================================
   1. FLOATING PARTICLES CANVAS (HEARTS & SPARKLES)
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('sparkle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 45;

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 8 + 4;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.5 - 0.25;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.isHeart = Math.random() > 0.4;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
    }

    update() {
      this.y -= this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.4;
      this.rotation += this.rotSpeed;

      if (this.y < -30) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = this.opacity;

      if (this.isHeart) {
        ctx.fillStyle = '#ff7597';
        ctx.beginPath();
        const d = this.size;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
        ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
        ctx.fill();
      } else {
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. MUSIC PLAYER: "PERFECT" BY ED SHEERAN
   ("We were just kids when we fell in love...")
   ========================================================================== */
function initMusicPlayer() {
  const musicToggle = document.getElementById('musicToggle');
  const musicText = document.getElementById('musicText');
  const musicWaves = document.getElementById('musicWaves');
  const localAudio = document.getElementById('localAudio');
  if (!musicToggle) return;

  let isPlaying = false;
  let ytPlayer = null;
  let audioCtx = null;
  let synthInterval = null;

  // Load YouTube IFrame API for Ed Sheeran - Perfect (Official video ID: 2Vv-BfVoq4g)
  window.onYouTubeIframeAPIReady = function() {
    try {
      ytPlayer = new YT.Player('ytPlayer', {
        height: '1',
        width: '1',
        videoId: '2Vv-BfVoq4g',
        playerVars: {
          'autoplay': 0,
          'controls': 0,
          'loop': 1,
          'playlist': '2Vv-BfVoq4g'
        },
        events: {
          'onReady': () => {
            // ready to stream
          }
        }
      });
    } catch (e) {
      console.log('YT API error', e);
    }
  };

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  // Exact melodic progression of Ed Sheeran - "Perfect" (Chorus: "We were just kids when we fell in love...")
  const perfectMelody = [
    // "I found a love for me..."
    415.30, 466.16, 523.25, 415.30, 349.23, 311.13,
    // "Darling just dive right in..."
    349.23, 415.30, 466.16, 523.25, 466.16, 415.30,
    // "We were just kids when we fell in love..."
    523.25, 466.16, 415.30, 466.16, 523.25, 415.30, 349.23, 311.13,
    // "Not knowing what it was..."
    349.23, 415.30, 466.16, 415.30, 349.23, 311.13,
    // "I will not give you up this time..."
    523.25, 622.25, 523.25, 466.16, 415.30, 466.16, 523.25, 415.30,
    // "Darling just kiss me slow, your heart is all I own..."
    415.30, 466.16, 523.25, 622.25, 523.25, 466.16, 415.30, 349.23
  ];
  let noteIdx = 0;

  function playSoftPianoNote(freq) {
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.14, audioCtx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.9);
    } catch (e) {
      console.error(e);
    }
  }

  function startMusic() {
    isPlaying = true;
    musicText.textContent = 'Ed Sheeran - Perfect';
    musicWaves.classList.add('playing');

    if (localAudio) {
      localAudio.volume = 1.0;
      const playPromise = localAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Playing Perfect by Ed Sheeran');
        }).catch((err) => {
          console.log('Local audio play error, fallback to synth/youtube', err);
          playYouTubeOrSynth();
        });
      }
    } else {
      playYouTubeOrSynth();
    }
  }

  function playYouTubeOrSynth() {
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
      try {
        ytPlayer.playVideo();
      } catch (err) {
        startSynthMelody();
      }
    } else {
      startSynthMelody();
    }
  }

  function startSynthMelody() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (synthInterval) clearInterval(synthInterval);

    synthInterval = setInterval(() => {
      const freq = perfectMelody[noteIdx % perfectMelody.length];
      playSoftPianoNote(freq);
      if (noteIdx % 3 === 0) {
        setTimeout(() => playSoftPianoNote(freq * 0.5), 120);
      }
      noteIdx++;
    }, 480);
  }

  function stopMusic() {
    isPlaying = false;
    musicText.textContent = 'Play "Perfect"';
    musicWaves.classList.remove('playing');

    if (localAudio) {
      try { localAudio.pause(); } catch(e){}
    }
    if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
      try { ytPlayer.pauseVideo(); } catch(e){}
    }
    if (synthInterval) clearInterval(synthInterval);
  }

  startMusicGlobal = startMusic;
  stopMusicGlobal = stopMusic;

  musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
      startMusic();
    } else {
      stopMusic();
    }
  });
}

/* ==========================================================================
   3. LOVE SHOWER & CONFETTI SURPRISE
   ========================================================================== */
function initSurpriseShower() {
  const surpriseBtn = document.getElementById('surpriseBtn');
  if (!surpriseBtn) return;

  surpriseBtn.addEventListener('click', () => {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ff4d79', '#ffb3c6', '#ffd166', '#ffffff']
      });

      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff4d79', '#ff7597', '#ffd166']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff4d79', '#ff7597', '#ffd166']
        });
      }, 250);
    }

    const rect = surpriseBtn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top;

    for (let i = 0; i < 18; i++) {
      createFloatingHeartBubble(btnX, btnY);
    }
  });
}

function createFloatingHeartBubble(x, y) {
  const heart = document.createElement('div');
  const emojis = ['💖', '❤️', '💕', '✨', '🌸', '🥰'];
  heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  heart.style.position = 'fixed';
  heart.style.left = `${x + (Math.random() - 0.5) * 80}px`;
  heart.style.top = `${y}px`;
  heart.style.fontSize = `${Math.random() * 1.5 + 1.2}rem`;
  heart.style.zIndex = '9999';
  heart.style.pointerEvents = 'none';
  heart.style.transition = `all ${Math.random() * 1.5 + 1.8}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
  heart.style.opacity = '1';
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    const moveX = (Math.random() - 0.5) * 200;
    const moveY = -(Math.random() * 300 + 200);
    heart.style.transform = `translate(${moveX}px, ${moveY}px) scale(${Math.random() * 0.8 + 0.8})`;
    heart.style.opacity = '0';
  });

  setTimeout(() => {
    heart.remove();
  }, 3500);
}

/* ==========================================================================
   4. POLAROID MODAL (DYNAMIC MATCHING TO REAL PHOTOS)
   ========================================================================== */
function initPolaroidModal() {
  const polaroids = document.querySelectorAll('.polaroid-card');
  const modal = document.getElementById('photoModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalSub = document.getElementById('modalSub');
  const modalHeartBtn = document.getElementById('modalHeartBtn');
  const modalHeartCount = document.getElementById('modalHeartCount');

  if (!modal) return;

  let currentLikes = 6;

  polaroids.forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('.polaroid-img-wrapper img');
      const title = card.getAttribute('data-title') || "Our Sweet Memory 💖";
      const story = card.getAttribute('data-story') || card.getAttribute('data-sub') || "A special moment together.";

      modalImg.src = img.src;
      modalCaption.textContent = title;
      modalSub.textContent = story;
      currentLikes = Math.floor(Math.random() * 4) + 6;
      modalHeartCount.textContent = currentLikes;

      modal.classList.add('active');
    });
  });

  modalClose.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  modalHeartBtn.addEventListener('click', () => {
    currentLikes++;
    modalHeartCount.textContent = currentLikes;

    const rect = modalHeartBtn.getBoundingClientRect();
    createFloatingHeartBubble(rect.left + rect.width / 2, rect.top);
  });
}

/* ==========================================================================
   5. INTERACTIVE WAX ENVELOPE & LOVE LETTER (CLICK SEAL TO REVEAL)
   ========================================================================== */
function initWaxEnvelope() {
  const waxEnvelope = document.getElementById('waxEnvelope');
  const waxSeal = document.getElementById('waxSeal');
  const envelopeFront = document.getElementById('envelopeFront');
  const sealInstruction = document.getElementById('sealInstruction');
  const letterDate = document.getElementById('letterDate');
  const letterPaper = document.getElementById('letterPaper');

  if (letterDate) {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    letterDate.textContent = `Written for Kavya • 11 Months & Forever`;
  }

  if (!waxEnvelope || !envelopeFront) return;

  envelopeFront.addEventListener('click', () => {
    const isOpening = !waxEnvelope.classList.contains('open');
    waxEnvelope.classList.toggle('open');

    if (isOpening) {
      if (letterPaper) {
        letterPaper.style.display = 'block';
        letterPaper.style.opacity = '1';
        letterPaper.style.visibility = 'visible';
      }

      if (sealInstruction) {
        sealInstruction.textContent = "Letter Opened with All My Love 💖 (Click to fold)";
        sealInstruction.style.color = "#2a9d8f";
      }

      if (typeof confetti === 'function') {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ff2a4b', '#ff7597', '#ffd166', '#ffffff']
        });
      }

      // Smooth scroll to the top of the unfolded letter so she reads from the beginning
      setTimeout(() => {
        if (letterPaper) {
          letterPaper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      if (letterPaper) {
        letterPaper.style.display = 'none';
      }
      if (sealInstruction) {
        sealInstruction.textContent = "Click the seal to read my heart 💌";
        sealInstruction.style.color = "#7a3e2a";
      }
    }
  });
}

/* ==========================================================================
   6. INTERACTIVE BIRTHDAY CAKE & WISH FINALE
   ========================================================================== */
function initBirthdayCake() {
  const cakeContainer = document.getElementById('cakeContainer');
  const candles = document.querySelectorAll('.candle');
  const wishResult = document.getElementById('wishResult');
  const relightBtn = document.getElementById('relightBtn');

  if (!cakeContainer) return;

  function blowOutCandles() {
    candles.forEach((c) => {
      c.setAttribute('data-lit', 'false');
    });

    if (typeof confetti === 'function') {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#ff4d79', '#ffd166', '#a855f7', '#ffffff', '#ff99c8'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 65,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 65,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }

    if (wishResult) {
      wishResult.classList.add('show');
    }
  }

  cakeContainer.addEventListener('click', () => {
    blowOutCandles();
  });

  if (relightBtn) {
    relightBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      candles.forEach((c) => {
        c.setAttribute('data-lit', 'true');
      });
      if (wishResult) {
        wishResult.classList.remove('show');
      }
    });
  }
}

/* ==========================================================================
   7. CLICK ANYWHERE FOR FLOATING HEART SPARKLE
   ========================================================================== */
function initClickHeartSparkles() {
  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('.wax-seal') || e.target.closest('.envelope-front') || e.target.closest('.floating-cute-creature')) return;
    createFloatingHeartBubble(e.clientX, e.clientY);
  });
}

/* ==========================================================================
   8. CUTE FLOATING TEDDY BEARS, CATS & HEARTS
   ========================================================================== */
function initCuteFloatingCritters() {
  const critters = ['🧸', '🐱', '😸', '😻', '💖', '❤️', '💕', '🐾'];

  function spawnCritter(initialY = null) {
    const el = document.createElement('div');
    el.className = 'floating-cute-creature';
    el.textContent = critters[Math.floor(Math.random() * critters.length)];

    const startX = Math.random() * (window.innerWidth - 70) + 25;
    el.style.left = `${startX}px`;

    const drift = (Math.random() - 0.5) * 80;
    const rot = (Math.random() - 0.5) * 35;
    el.style.setProperty('--drift', `${drift}px`);
    el.style.setProperty('--rot', `${rot}deg`);

    const duration = Math.random() * 8 + 11;
    el.style.animationDuration = `${duration}s`;

    if (initialY !== null) {
      el.style.bottom = `${initialY}px`;
    }

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      el.style.transform = 'scale(1.6) rotate(360deg)';
      el.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      el.style.opacity = '0';
      createFloatingHeartBubble(e.clientX, e.clientY);
      setTimeout(() => el.remove(), 450);
    });

    document.body.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.remove();
    }, duration * 1000);
  }

  // Pre-spawn 4 critters at varying heights on page load
  for (let i = 0; i < 4; i++) {
    spawnCritter(Math.random() * (window.innerHeight * 0.7));
  }

  // Continuously spawn cute creatures every 2.4 seconds
  setInterval(() => {
    spawnCritter();
  }, 2400);
}
