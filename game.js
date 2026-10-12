// ============================================================
// DeMOCKracy — Main Game Engine (v2)
// A satirical Chrome Dino-style endless runner based on
// the Oct 2026 India democracy protests & CJP movement.
// ============================================================

'use strict';

// ── CONFIGURATION & CONSTANTS ────────────────────────────────
const C = {
  WIDTH: 900,
  HEIGHT: 250,
  GROUND_Y: 202,           // Ground line where feet touch
  GRAVITY: 0.70,
  JUMP_VEL: -13.2,
  JUMP_VEL_HOLD: -14.6,
  INITIAL_SPEED: 5.6,
  MAX_SPEED: 16.5,
  SPEED_INC: 0.0007,
  SCORE_RATE: 0.015,
  OBSTACLE_MIN_GAP: 290,
  OBSTACLE_MAX_GAP: 620,
  DAY_COLOR:   '#f7f7f7',
  DUSK_COLOR:  '#eee6d8',
  NIGHT_COLOR: '#1b1b26',
  INK:         '#2b2b2b',
  INK_MUTED:   '#555555',
  INK_FAINT:   '#888888',
  FONTS: {
    TITLE:   'bold 18px "Press Start 2P", monospace',
    SUBTITLE:'10px "Silkscreen", monospace',
    HUD:     '11px "Press Start 2P", monospace',
    HUD_TAG: '9px "Silkscreen", monospace',
    BANNER:  '11px "Press Start 2P", monospace',
    BANNER_SUB: '10px "Silkscreen", monospace',
    QUOTE:   'italic 13px Georgia, serif',
    FACT_TITLE: 'bold 10px "Silkscreen", monospace',
    FACT_BODY:  '11px Georgia, serif',
    BTN:     '10px "Press Start 2P", monospace',
  }
};

// ── FACT-CHECKED LEGAL CITATIONS (matched to obstacles) ─────
const OBSTACLE_FACTS = {
  barricade: {
    title: 'ARTICLE 19(1)(b) — RIGHT TO PEACEFUL ASSEMBLY',
    text: 'The Supreme Court (Shaheen Bagh, 2020) affirmed that peaceful protest is a fundamental right. Public roads cannot be indefinitely blocked or barricaded by police to deny citizens their right to assemble.'
  },
  police: {
    title: 'ARTICLE 21 & D.K. BASU GUIDELINES (1997)',
    text: 'Use of police force must be strictly proportional. Section 46(4) BNSS/CrPC strictly prohibits male police officers from physically detaining or handling female protesters.'
  },
  bus: {
    title: 'ARTICLE 22 — PROTECTION AGAINST ILLEGAL ARREST',
    text: 'Every detained citizen must be informed of the grounds of arrest immediately and produced before a magistrate within 24 hours. Mass "preventive detention" to stop rallies violates constitutional safeguards.'
  },
  section163: {
    title: 'SECTION 163 BNSS (FORMERLY SEC 144 CrPC)',
    text: 'In Anuradha Bhasin (2020), the Supreme Court ruled that prohibitory orders cannot be used as a routine executive weapon to suppress democratic dissent, speech, or peaceful assembly.'
  },
  teargas: {
    title: 'UN GUIDANCE ON LESS-LETHAL WEAPONS (2020)',
    text: 'Chemical irritants and tear gas canisters must never be fired at body level, in confined areas, or against peaceful crowds, as blunt force trauma and asphyxiation cause severe injury.'
  },
  lathi: {
    title: 'POLICE MANUAL & PROPORTIONALITY PRINCIPLE',
    text: 'Under police regulations, a lathi charge can only be ordered by an executive magistrate after three clear warnings when life is in imminent danger. Non-violent protesters cannot be struck.'
  },
  drone: {
    title: 'JUSTICE K.S. PUTTASWAMY (2017) — RIGHT TO PRIVACY',
    text: 'The nine-judge Supreme Court bench held that privacy is a Fundamental Right under Article 21. Deploying facial-recognition drones to catalog peaceful citizens creates an unlawful chilling effect.'
  },
  watercannon: {
    title: 'INTERNATIONAL PROTOCOLS ON CROWD CONTROL',
    text: 'High-pressure water cannons cause concussions and internal trauma. International human rights standards restrict their use strictly to situations of widespread violent riots.'
  }
};

// ── GENERAL PROTEST QUOTES (fallback) ───────────────────────
const GENERAL_QUOTES = [
  { text: '"A govt that can\'t tolerate a protest, can\'t tolerate democracy."', sub: 'Protest Banner — Delhi, Oct 2026' },
  { text: '"Cockroaches never die."', sub: 'Cockroach Janta Party (CJP) Movement' },
  { text: '130+ Million names removed from electoral rolls without individual notice.', sub: 'Electoral Revision Purge — Oct 2026' },
  { text: 'Metro stations closed and mobile internet suspended to silence dissent.', sub: 'Delhi Protests — Oct 2026' },
  { text: 'Supreme Court: "Dissent is the safety valve of democracy."', sub: 'Justice D.Y. Chandrachud' },
  { text: 'UN Human Rights: "Deeply concerned by mass detentions of peaceful protesters."', sub: 'Geneva Statement — Oct 2026' },
  { text: '"War with its own citizens." — CJP', sub: 'Delhi University Students Union' }
];

// ── EASTER EGG MILESTONES ───────────────────────────────────
const MILESTONES = {
  19:   { title: 'ARTICLE 19 — FREEDOM TO ASSEMBLE', sub: 'Constitution of India: Peaceful protest is a guaranteed Fundamental Right.', duration: 3200 },
  144:  { title: 'SECTION 163 BNSS IMPOSED', sub: 'Prohibiting assembly of 5+ citizens. SC: Cannot be used to silence dissent.', duration: 3200 },
  370:  { title: 'ARTICLE 370 REMEMBERED', sub: 'Longest internet shutdown in democratic history. The precedent was set.', duration: 3400 },
  1947: { title: '1947 — FREEDOM WAS WON', sub: 'Democracy was built by protests. Don\'t let it be dismantled in silence.', duration: 3800 },
  2026: { title: '2026 — CITIZENS STILL RUNNING', sub: '"Cockroaches never die." Keep moving forward.', duration: 3500 },
};

// ── PLAYABLE CHARACTERS SPECIFICATION ───────────────────────
const CHARACTERS = [
  {
    id: 'cockroach',
    name: 'COCKROACH',
    label: '🪳 CJP MASCOT',
    tag: '"Cockroaches never die"',
    color: '#333333',
    w: 52, h: 58,
    duckW: 60, duckH: 36,
    sprites: {
      run: ['player_run1', 'player_run2', 'player_run3'],
      jump: 'player_jump',
      duck: 'player_duck'
    }
  },
  {
    id: 'dino',
    name: 'DINO',
    label: '🦖 CLASSIC DINO',
    tag: '"Chrome endless runner"',
    color: '#333333',
    w: 48, h: 54,
    duckW: 56, duckH: 34,
    sprites: {
      run: ['dino_run1', 'dino_run2'],
      jump: 'dino_jump',
      duck: 'dino_duck'
    }
  },
  {
    id: 'student',
    name: 'STUDENT',
    label: '📢 PROTESTER',
    tag: '"Save Democracy · Placard"',
    color: '#333333',
    w: 48, h: 56,
    duckW: 54, duckH: 36,
    sprites: {
      run: ['student_run1', 'student_run2'],
      jump: 'student_jump',
      duck: 'student_duck'
    }
  },
  {
    id: 'journalist',
    name: 'JOURNALIST',
    label: '📷 PRESS CORPS',
    tag: '"Press is not a crime"',
    color: '#333333',
    w: 48, h: 56,
    duckW: 54, duckH: 36,
    sprites: {
      run: ['journalist_run1', 'journalist_run2'],
      jump: 'journalist_jump',
      duck: 'journalist_duck'
    }
  }
];

// ── OBSTACLE TYPES (Ordered with alternating variety) ───────
const OBSTACLES = [
  {
    id: 'barricade',
    sprite: 'obs_barricade',
    w: 68, h: 36,
    aerial: false,
    yOffset: 0,
    hitbox: { x: 4, y: 4, w: 60, h: 32 }
  },
  {
    id: 'police',
    sprite: 'obs_police',
    w: 32, h: 52,
    aerial: false,
    yOffset: 0,
    hitbox: { x: 4, y: 4, w: 24, h: 48 }
  },
  {
    id: 'section163',
    sprite: 'obs_section163',
    w: 52, h: 50,
    aerial: false,
    yOffset: 0,
    hitbox: { x: 4, y: 4, w: 44, h: 46 }
  },
  {
    id: 'bus',
    sprite: 'obs_bus',
    w: 86, h: 52,
    aerial: false,
    yOffset: 0,
    hitbox: { x: 6, y: 6, w: 74, h: 46 }
  },
  {
    id: 'teargas',
    sprite: 'obs_teargas',
    w: 56, h: 30,
    aerial: false,
    yOffset: 0,
    hitbox: { x: 6, y: 6, w: 44, h: 24 }
  },
  {
    id: 'lathi',
    sprite: 'obs_lathi',
    w: 42, h: 46,
    aerial: false,
    yOffset: 0,
    hitbox: { x: 6, y: 6, w: 30, h: 40 }
  },
  {
    id: 'drone',
    sprite: 'obs_drone',
    w: 50, h: 44,
    aerial: true,
    yOffset: -80, // Drone flies at head-height; player must DUCK!
    hitbox: { x: 4, y: 6, w: 42, h: 34 }
  },
  {
    id: 'watercannon',
    sprite: 'obs_watercannon',
    w: 120, h: 38,
    aerial: true,
    yOffset: -70, // High-pressure stream at head-height; DUCK!
    hitbox: { x: 10, y: 8, w: 100, h: 24 }
  }
];

// ────────────────────────────────────────────────────────────
//  IMAGE ASSET LOADER
// ────────────────────────────────────────────────────────────
class AssetLoader {
  constructor() {
    this.images = new Map();
    this.loaded = false;
  }

  async loadAll() {
    const list = [
      // Player Cockroach
      ['player_run1', 'assets/sprites/player_run1.png'],
      ['player_run2', 'assets/sprites/player_run2.png'],
      ['player_run3', 'assets/sprites/player_run3.png'],
      ['player_jump', 'assets/sprites/player_jump.png'],
      ['player_duck', 'assets/sprites/player_duck.png'],
      // Dino
      ['dino_run1', 'assets/sprites/dino_run1.png'],
      ['dino_run2', 'assets/sprites/dino_run2.png'],
      ['dino_jump', 'assets/sprites/dino_jump.png'],
      ['dino_duck', 'assets/sprites/dino_duck.png'],
      // Student
      ['student_run1', 'assets/sprites/student_run1.png'],
      ['student_run2', 'assets/sprites/student_run2.png'],
      ['student_jump', 'assets/sprites/student_jump.png'],
      ['student_duck', 'assets/sprites/student_duck.png'],
      // Journalist
      ['journalist_run1', 'assets/sprites/journalist_run1.png'],
      ['journalist_run2', 'assets/sprites/journalist_run2.png'],
      ['journalist_jump', 'assets/sprites/journalist_jump.png'],
      ['journalist_duck', 'assets/sprites/journalist_duck.png'],
      // Obstacles
      ['obs_barricade', 'assets/sprites/obs_barricade.png'],
      ['obs_police', 'assets/sprites/obs_police.png'],
      ['obs_bus', 'assets/sprites/obs_bus.png'],
      ['obs_section163', 'assets/sprites/obs_section163.png'],
      ['obs_teargas', 'assets/sprites/obs_teargas.png'],
      ['obs_lathi', 'assets/sprites/obs_lathi.png'],
      ['obs_drone', 'assets/sprites/obs_drone.png'],
      ['obs_watercannon', 'assets/sprites/obs_watercannon.png'],
      // Parallax Backgrounds
      ['bg_far_strip', 'assets/sprites/bg_far_strip.png'],
      ['bg_mid_strip', 'assets/sprites/bg_mid_strip.png'],
      ['bg_trees_strip', 'assets/sprites/bg_trees_strip.png'],
      ['ground_tile', 'assets/sprites/ground_tile.png'],
      // Clouds
      ['cloud_1', 'assets/sprites/cloud_1.png'],
      ['cloud_2', 'assets/sprites/cloud_2.png'],
      ['cloud_3', 'assets/sprites/cloud_3.png'],
      ['cloud_4', 'assets/sprites/cloud_4.png'],
    ];

    const promises = list.map(([key, src]) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.images.set(key, img);
          resolve();
        };
        img.onerror = () => {
          console.warn(`Failed to load asset: ${src}`);
          resolve(); // Don't crash, will fallback
        };
        img.src = src;
      });
    });

    await Promise.all(promises);
    this.loaded = true;
  }

  get(key) {
    return this.images.get(key) || null;
  }
}

// ────────────────────────────────────────────────────────────
//  PROCEDURAL AUDIO MANAGER (Web Audio API)
// ────────────────────────────────────────────────────────────
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      this.ctx = null;
    }
  }

  play(name) {
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const t = this.ctx.currentTime;
    try {
      if (name === 'jump') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(540, t + 0.08);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.start(t);
        osc.stop(t + 0.08);
      } else if (name === 'score') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1174, t + 0.06);
        g.gain.setValueAtTime(0.06, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.start(t);
        osc.stop(t + 0.14);
      } else if (name === 'milestone') {
        const notes = [587, 740, 880, 1174];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const g = this.ctx.createGain();
          osc.connect(g);
          g.connect(this.ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.06);
          g.gain.setValueAtTime(0.07, t + idx * 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.1);
          osc.start(t + idx * 0.06);
          osc.stop(t + idx * 0.06 + 0.1);
        });
      } else if (name === 'hit') {
        // Impact noise
        const bufLen = Math.floor(this.ctx.sampleRate * 0.25);
        const buf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
        const src = this.ctx.createBufferSource();
        const g = this.ctx.createGain();
        src.buffer = buf;
        src.connect(g);
        g.connect(this.ctx.destination);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        src.start(t);
      } else if (name === 'select') {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        g.gain.setValueAtTime(0.05, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.start(t);
        osc.stop(t + 0.04);
      }
    } catch (e) {}
  }

  toggle() {
    this.muted = !this.muted;
    return this.muted;
  }
}

// ────────────────────────────────────────────────────────────
//  PARALLAX BACKGROUND ENGINE
// ────────────────────────────────────────────────────────────
class ParallaxBackground {
  constructor(loader) {
    this.loader = loader;
    this.farX = 0;
    this.midX = 0;
    this.treesX = 0;
    this.groundX = 0;
    this.skyBlend = 0; // 0=Day, 0.5=Dusk, 1=Night
    this.clouds = [
      { x: 120, y: 25, speed: 0.15, sprite: 'cloud_1' },
      { x: 380, y: 45, speed: 0.12, sprite: 'cloud_2' },
      { x: 640, y: 20, speed: 0.18, sprite: 'cloud_3' },
      { x: 820, y: 55, speed: 0.14, sprite: 'cloud_4' }
    ];
  }

  update(gameSpeed, score) {
    // Parallax layers scroll speeds
    this.farX = (this.farX - gameSpeed * 0.10);
    this.midX = (this.midX - gameSpeed * 0.28);
    this.treesX = (this.treesX - gameSpeed * 0.55);
    this.groundX = (this.groundX - gameSpeed * 1.0);

    // Sky Day/Dusk/Night transition
    if (score < 400) {
      this.skyBlend = 0;
    } else if (score < 900) {
      this.skyBlend = (score - 400) / 500 * 0.5;
    } else if (score < 1800) {
      this.skyBlend = 0.5 + (score - 900) / 900 * 0.5;
    } else {
      this.skyBlend = 1;
    }

    // Clouds
    this.clouds.forEach(cl => {
      cl.x -= cl.speed * (gameSpeed / C.INITIAL_SPEED);
      if (cl.x < -100) {
        cl.x = C.WIDTH + 50 + Math.random() * 150;
        cl.y = 15 + Math.random() * 55;
      }
    });
  }

  draw(ctx, score) {
    // 1. Sky Background Tint
    this._drawSky(ctx);

    // 2. Clouds
    this._drawClouds(ctx);

    // 3. Far Layer: India Gate, Parliament, Lotus Temple skyline
    this._drawLayer(ctx, 'bg_far_strip', this.farX, C.GROUND_Y - 76, 760, 76, 0.22);

    // 4. Mid Layer: Jantar Mantar, Metro Station ("STATION CLOSED")
    this._drawLayer(ctx, 'bg_mid_strip', this.midX, C.GROUND_Y - 58, 755, 58, 0.38);

    // 5. Trees & Bushes Layer (Lightened for clear character visibility)
    this._drawLayer(ctx, 'bg_trees_strip', this.treesX, C.GROUND_Y - 38, 755, 38, 0.30);

    // 6. Seamless Ground Tile
    this._drawGround(ctx);

    // 7. Internet Blackout Easter Egg at 2200+
    if (score >= 2200 && Math.random() < 0.003) {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.90)';
      ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);
      ctx.fillStyle = '#f7f7f7';
      ctx.font = '10px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ INTERNET SUSPENDED BY AUTHORITIES ⚠', C.WIDTH / 2, C.HEIGHT / 2);
      ctx.textAlign = 'left';
    }
  }

  _drawSky(ctx) {
    const day = [247, 247, 247];
    const dusk = [238, 222, 204];
    const night = [27, 27, 38];

    let r, g, b;
    if (this.skyBlend <= 0.5) {
      const t = this.skyBlend * 2;
      r = Math.round(day[0] + (dusk[0] - day[0]) * t);
      g = Math.round(day[1] + (dusk[1] - day[1]) * t);
      b = Math.round(day[2] + (dusk[2] - day[2]) * t);
    } else {
      const t = (this.skyBlend - 0.5) * 2;
      r = Math.round(dusk[0] + (night[0] - dusk[0]) * t);
      g = Math.round(dusk[1] + (night[1] - dusk[1]) * t);
      b = Math.round(dusk[2] + (night[2] - dusk[2]) * t);
    }

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);
  }

  _drawClouds(ctx) {
    this.clouds.forEach(cl => {
      const img = this.loader.get(cl.sprite);
      if (img) {
        ctx.save();
        ctx.globalAlpha = this.skyBlend > 0.6 ? 0.35 : 0.65;
        ctx.drawImage(img, cl.x, cl.y);
        ctx.restore();
      }
    });
  }

  _drawLayer(ctx, spriteKey, scrollX, y, stripW, stripH, baseAlpha) {
    const img = this.loader.get(spriteKey);
    if (!img) return;

    ctx.save();
    // At night, slightly invert / lighten silhouettes
    const alpha = this.skyBlend > 0.7 ? baseAlpha * 0.75 : baseAlpha;
    ctx.globalAlpha = alpha;

    const modX = ((scrollX % stripW) + stripW) % stripW;
    // Draw tiles to cover screen
    for (let x = modX - stripW; x < C.WIDTH + stripW; x += stripW) {
      ctx.drawImage(img, 0, 0, img.width, img.height, x, y, stripW, stripH);
    }
    ctx.restore();
  }

  _drawGround(ctx) {
    const tile = this.loader.get('ground_tile');
    const isDark = this.skyBlend > 0.7;

    // Solid base ground line
    ctx.fillStyle = isDark ? '#444455' : '#333333';
    ctx.fillRect(0, C.GROUND_Y, C.WIDTH, 2);

    if (tile) {
      ctx.save();
      ctx.globalAlpha = isDark ? 0.6 : 0.9;
      const tileW = 172;
      const tileH = 46;
      const modX = ((this.groundX % tileW) + tileW) % tileW;
      for (let x = modX - tileW; x < C.WIDTH + tileW; x += tileW) {
        ctx.drawImage(tile, 0, 0, tile.width, tile.height, x, C.GROUND_Y + 1, tileW, tileH);
      }
      ctx.restore();
    } else {
      // Procedural fallback dots if tile missing
      ctx.fillStyle = '#666';
      for (let i = 0; i < C.WIDTH; i += 24) {
        ctx.fillRect((i + (this.groundX % 24)) % C.WIDTH, C.GROUND_Y + 4, 3, 2);
      }
    }
  }
}

// ────────────────────────────────────────────────────────────
//  PLAYER CLASS
// ────────────────────────────────────────────────────────────
class Player {
  constructor(charDef, loader, sound) {
    this.char = charDef;
    this.loader = loader;
    this.sound = sound;

    this.x = 80;
    this.vy = 0;
    this.state = 'RUN'; // RUN | JUMP | DUCK | HIT
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.onGround = true;
    this.jumpHeld = false;
    this.hitTimer = 0;

    // Sprite scale & dimension
    this.w = this.char.w;
    this.h = this.char.h;
    this.duckW = this.char.duckW;
    this.duckH = this.char.duckH;

    // Exact alignment to ground line: feet sit directly on GROUND_Y
    this.y = C.GROUND_Y - this.h;
  }

  get hitbox() {
    if (this.state === 'DUCK') {
      return {
        x: this.x + 6,
        y: (C.GROUND_Y - this.duckH) + 6,
        w: this.duckW - 12,
        h: this.duckH - 8
      };
    }
    return {
      x: this.x + 8,
      y: this.y + 6,
      w: this.w - 16,
      h: this.h - 8
    };
  }

  jump(held) {
    if (this.state === 'HIT') return;
    if (this.onGround) {
      this.vy = held ? C.JUMP_VEL_HOLD : C.JUMP_VEL;
      this.state = 'JUMP';
      this.onGround = false;
      this.sound.play('jump');
    }
  }

  duck(active) {
    if (this.state === 'HIT') return;
    if (active && this.onGround) {
      this.state = 'DUCK';
    } else if (!active && this.state === 'DUCK') {
      this.state = 'RUN';
    }
  }

  hit() {
    if (this.state === 'HIT') return;
    this.state = 'HIT';
    this.hitTimer = 60;
    this.sound.play('hit');
  }

  update(dt) {
    // Animation frame timing
    this.frameTimer += dt;
    if (this.frameTimer > 85) {
      this.frameTimer = 0;
      const runFrames = this.char.sprites.run;
      this.frameIndex = (this.frameIndex + 1) % runFrames.length;
    }

    if (this.state === 'DUCK') {
      this.y = C.GROUND_Y - this.duckH;
      this.vy = 0;
      this.onGround = true;
      return;
    }

    // Apply Gravity in Jump or Run
    this.vy += C.GRAVITY;
    this.y += this.vy;

    const baseLandingY = C.GROUND_Y - this.h;
    if (this.y >= baseLandingY) {
      this.y = baseLandingY;
      this.vy = 0;
      this.onGround = true;
      if (this.state === 'JUMP') {
        this.state = 'RUN';
      }
    } else {
      this.onGround = false;
    }

    if (this.hitTimer > 0) this.hitTimer--;
  }

  draw(ctx) {
    // Determine which sprite key to use
    let spriteKey = null;
    let drawW = this.w;
    let drawH = this.h;
    let drawY = this.y;

    if (this.state === 'DUCK') {
      spriteKey = this.char.sprites.duck;
      drawW = this.duckW;
      drawH = this.duckH;
      drawY = C.GROUND_Y - this.duckH;
    } else if (this.state === 'JUMP') {
      spriteKey = this.char.sprites.jump;
    } else {
      const frames = this.char.sprites.run;
      spriteKey = frames[this.frameIndex % frames.length];
    }

    const img = this.loader.get(spriteKey);

    ctx.save();
    // Hit flicker
    if (this.state === 'HIT' && Math.floor(this.hitTimer / 4) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    if (img) {
      ctx.drawImage(img, 0, 0, img.width, img.height, this.x, drawY, drawW, drawH);
    } else {
      // Fallback silhouette
      ctx.fillStyle = this.char.color;
      ctx.fillRect(this.x, drawY, drawW, drawH);
    }
    ctx.restore();
  }
}

// ────────────────────────────────────────────────────────────
//  OBSTACLE MANAGER (Smart Alternating Rotation)
// ────────────────────────────────────────────────────────────
class ObstacleManager {
  constructor(loader) {
    this.loader = loader;
    this.active = [];
    this.nextSpawnX = C.WIDTH + 180;
    this.lastTypeIndex = -1;
    this.spawnHistory = [];
  }

  reset() {
    this.active = [];
    this.nextSpawnX = C.WIDTH + 180;
    this.lastTypeIndex = -1;
    this.spawnHistory = [];
  }

  _pickNextObstacle(score) {
    // Ground obstacles eligible from the start
    const groundTypes = [
      'barricade',
      'police',
      'section163',
      'bus',
      'teargas',
      'lathi'
    ];

    // Aerial obstacles eligible as score increases
    const aerialTypes = [];
    if (score >= 180) aerialTypes.push('drone');
    if (score >= 350) aerialTypes.push('watercannon');

    // Decide if aerial (roughly 25% chance when available)
    let pickId = '';
    const canSpawnAerial = aerialTypes.length > 0 && Math.random() < 0.28;

    if (canSpawnAerial) {
      pickId = aerialTypes[Math.floor(Math.random() * aerialTypes.length)];
    } else {
      // Pick ground obstacle avoiding the last 2 spawned types (ensures rich variety!)
      const available = groundTypes.filter(id => !this.spawnHistory.slice(-2).includes(id));
      const pool = available.length > 0 ? available : groundTypes;
      pickId = pool[Math.floor(Math.random() * pool.length)];
    }

    this.spawnHistory.push(pickId);
    if (this.spawnHistory.length > 10) this.spawnHistory.shift();

    return OBSTACLES.find(o => o.id === pickId) || OBSTACLES[0];
  }

  update(gameSpeed, score) {
    // Move existing obstacles
    this.active.forEach(obs => {
      obs.x -= gameSpeed;
    });

    // Remove offscreen
    this.active = this.active.filter(obs => obs.x + obs.type.w > -30);

    // Spawn countdown
    this.nextSpawnX -= gameSpeed;
    if (this.nextSpawnX <= 0) {
      const type = this._pickNextObstacle(score);
      
      // Calculate Y: ground obstacles sit on GROUND_Y, aerial obstacles hang at yOffset
      let y = C.GROUND_Y - type.h;
      if (type.aerial) {
        y = C.GROUND_Y + type.yOffset;
      }

      this.active.push({
        type,
        x: C.WIDTH + 15,
        y: y,
        w: type.w,
        h: type.h
      });

      // Variable spacing based on speed and difficulty
      const minGap = Math.max(260, C.OBSTACLE_MIN_GAP - score * 0.04);
      const maxGap = Math.max(460, C.OBSTACLE_MAX_GAP - score * 0.06);
      this.nextSpawnX = minGap + Math.random() * (maxGap - minGap);
    }
  }

  draw(ctx) {
    this.active.forEach(obs => {
      const img = this.loader.get(obs.type.sprite);
      if (img) {
        ctx.drawImage(img, 0, 0, img.width, img.height, obs.x, obs.y, obs.w, obs.h);
      } else {
        // Fallback placeholder
        ctx.fillStyle = '#444';
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
      }
    });
  }

  hitboxes() {
    return this.active.map(obs => {
      const hb = obs.type.hitbox;
      return {
        id: obs.type.id,
        x: obs.x + hb.x,
        y: obs.y + hb.y,
        w: hb.w,
        h: hb.h
      };
    });
  }
}

// ────────────────────────────────────────────────────────────
//  COLLISION DETECTION (AABB)
// ────────────────────────────────────────────────────────────
function rectsIntersect(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x &&
         a.y < b.y + b.h && a.y + a.h > b.y;
}

// ────────────────────────────────────────────────────────────
//  HUD & MILESTONES (Clean, Crisp, Non-Stretched)
// ────────────────────────────────────────────────────────────
class HUD {
  constructor() {
    this.scoreFlash = 0;
  }

  flash() {
    this.scoreFlash = 24;
  }

  draw(ctx, score, highScore, isDark, isMuted) {
    const sc = String(Math.floor(score)).padStart(5, '0');
    const hi = String(Math.floor(highScore)).padStart(5, '0');

    ctx.save();
    ctx.textAlign = 'right';

    // High Score
    ctx.font = C.FONTS.HUD;
    ctx.fillStyle = isDark ? '#888899' : '#888888';
    ctx.fillText(`HI ${hi}`, C.WIDTH - 14, 24);

    // Current Score (flashes on milestones)
    if (this.scoreFlash > 0) {
      this.scoreFlash--;
      ctx.fillStyle = isDark ? '#ffffff' : '#000000';
    } else {
      ctx.fillStyle = isDark ? '#e0e0f0' : '#2b2b2b';
    }
    ctx.fillText(sc, C.WIDTH - 14, 42);

    // Mute Status Icon
    ctx.textAlign = 'left';
    ctx.font = C.FONTS.HUD_TAG;
    ctx.fillStyle = isDark ? '#888899' : '#888888';
    ctx.fillText(isMuted ? '🔇 MUTED (M)' : '🔊 SOUND (M)', 14, 24);

    ctx.restore();
  }
}

// ────────────────────────────────────────────────────────────
//  MILESTONE NOTIFICATION (Sleek Retro Banner)
// ────────────────────────────────────────────────────────────
class MilestoneBanner {
  constructor() {
    this.active = null;
    this.timer = 0;
  }

  show(data) {
    this.active = data;
    this.timer = data.duration;
  }

  update(dt) {
    if (this.timer > 0) {
      this.timer -= dt;
      if (this.timer <= 0) this.active = null;
    }
  }

  draw(ctx) {
    if (!this.active) return;

    ctx.save();
    // Fade in and out
    let alpha = 1;
    if (this.timer < 350) alpha = this.timer / 350;
    if (this.timer > this.active.duration - 250) alpha = (this.active.duration - this.timer) / 250;

    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Sleek centered banner at the top
    const bw = 520;
    const bh = 44;
    const bx = (C.WIDTH - bw) / 2;
    const by = 14;

    // Background box
    ctx.fillStyle = 'rgba(34, 34, 42, 0.92)';
    ctx.fillRect(bx, by, bw, bh);

    // Clean border
    ctx.strokeStyle = '#c93b2b';
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = C.FONTS.BANNER;
    ctx.textAlign = 'center';
    ctx.fillText(this.active.title, C.WIDTH / 2, by + 18);

    // Subtitle
    ctx.fillStyle = '#dcdcdc';
    ctx.font = C.FONTS.BANNER_SUB;
    ctx.fillText(this.active.sub, C.WIDTH / 2, by + 34);

    ctx.restore();
  }
}

// ────────────────────────────────────────────────────────────
//  CHARACTER SELECTION SCREEN
// ────────────────────────────────────────────────────────────
class CharacterSelectScreen {
  constructor(loader, sound) {
    this.loader = loader;
    this.sound = sound;
    this.selected = 0;
    this.animTimer = 0;
    this.animFrame = 0;
  }

  select(idx) {
    if (idx >= 0 && idx < CHARACTERS.length) {
      this.selected = idx;
      this.sound.play('select');
    }
  }

  next() {
    this.selected = (this.selected + 1) % CHARACTERS.length;
    this.sound.play('select');
  }

  prev() {
    this.selected = (this.selected - 1 + CHARACTERS.length) % CHARACTERS.length;
    this.sound.play('select');
  }

  getSelectedCharacter() {
    return CHARACTERS[this.selected];
  }

  update(dt) {
    this.animTimer += dt;
    if (this.animTimer > 110) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 3;
    }
  }

  draw(ctx) {
    ctx.save();

    // Background
    ctx.fillStyle = C.DAY_COLOR;
    ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);

    // Ground reference line
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, C.GROUND_Y, C.WIDTH, 2);

    // Header Title
    ctx.fillStyle = '#2b2b2b';
    ctx.font = C.FONTS.TITLE;
    ctx.textAlign = 'center';
    ctx.fillText('SELECT YOUR PROTESTER', C.WIDTH / 2, 34);

    ctx.font = C.FONTS.SUBTITLE;
    ctx.fillStyle = '#666666';
    ctx.fillText('CHOOSE WHO WILL RUN AGAINST THE CRACKDOWN', C.WIDTH / 2, 50);

    // Draw 4 Character Cards
    const cardW = 180;
    const cardH = 100;
    const gap = 16;
    const totalW = CHARACTERS.length * cardW + (CHARACTERS.length - 1) * gap;
    const startX = (C.WIDTH - totalW) / 2;
    const cardY = 66;

    CHARACTERS.forEach((ch, idx) => {
      const cx = startX + idx * (cardW + gap);
      const isSelected = idx === this.selected;

      // Card Box
      ctx.fillStyle = isSelected ? '#ffffff' : '#f0f0f0';
      ctx.fillRect(cx, cardY, cardW, cardH);

      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeStyle = isSelected ? '#c93b2b' : '#cccccc';
      ctx.strokeRect(cx, cardY, cardW, cardH);

      if (isSelected) {
        // Selected badge ribbon
        ctx.fillStyle = '#c93b2b';
        ctx.fillRect(cx, cardY, cardW, 14);
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px "Silkscreen", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SELECTED', cx + cardW / 2, cardY + 10);
      }

      // Draw Animated Character Sprite inside card
      const runSprites = ch.sprites.run;
      const frameKey = runSprites[this.animFrame % runSprites.length];
      const img = this.loader.get(frameKey);

      const spriteDrawX = cx + (cardW - ch.w) / 2;
      const spriteDrawY = cardY + 22;

      if (img) {
        ctx.drawImage(img, 0, 0, img.width, img.height, spriteDrawX, spriteDrawY, ch.w, ch.h);
      }

      // Character Name & Lore Tag
      ctx.fillStyle = isSelected ? '#2b2b2b' : '#666666';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ch.name, cx + cardW / 2, cardY + cardH - 18);

      ctx.fillStyle = '#888888';
      ctx.font = '8px "Silkscreen", monospace';
      ctx.fillText(ch.label, cx + cardW / 2, cardY + cardH - 6);
    });

    // Instructions Footer
    ctx.textAlign = 'center';
    ctx.font = '10px "Silkscreen", monospace';
    ctx.fillStyle = '#444444';
    ctx.fillText('← / → ARROW KEYS OR CLICK TO CHOOSE', C.WIDTH / 2, 192);

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#c93b2b';
    ctx.fillText('PRESS SPACE OR TAP TO RUN!', C.WIDTH / 2, 222);

    ctx.restore();
  }

  handleClick(canvasX, canvasY) {
    const cardW = 180;
    const cardH = 100;
    const gap = 16;
    const totalW = CHARACTERS.length * cardW + (CHARACTERS.length - 1) * gap;
    const startX = (C.WIDTH - totalW) / 2;
    const cardY = 66;

    for (let idx = 0; idx < CHARACTERS.length; idx++) {
      const cx = startX + idx * (cardW + gap);
      if (canvasX >= cx && canvasX <= cx + cardW && canvasY >= cardY && canvasY <= cardY + cardH) {
        this.select(idx);
        return true;
      }
    }
    return false;
  }
}

// ────────────────────────────────────────────────────────────
//  SOCIAL SHARING HANDLER
// ────────────────────────────────────────────────────────────
const SocialShare = {
  getScoreMessage(score) {
    const sc = String(Math.floor(score)).padStart(5, '0');
    return `I survived to ${sc} pts in DeMOCKracy 🪳\n"A govt that can't tolerate a protest, can't tolerate democracy."\nPlay the satirical runner: https://demockracy.vercel.app`;
  },

  shareCopy(score) {
    const text = this.getScoreMessage(score);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        alert('Score & protest quote copied to clipboard! Share it with friends!');
      }).catch(() => {
        prompt('Copy your score to share:', text);
      });
    } else {
      prompt('Copy your score to share:', text);
    }
  },

  shareX(score) {
    const text = encodeURIComponent(this.getScoreMessage(score));
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  },

  shareWhatsApp(score) {
    const text = encodeURIComponent(this.getScoreMessage(score));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }
};

// ────────────────────────────────────────────────────────────
//  MAIN GAME CONTROLLER
// ────────────────────────────────────────────────────────────
class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.loader = new AssetLoader();
    this.sound = new SoundManager();

    this.state = 'LOADING'; // LOADING | CHAR_SELECT | RUNNING | GAME_OVER
    this.score = 0;
    this.highScore = parseFloat(localStorage.getItem('demockracy-high-score') || '0');
    this.speed = C.INITIAL_SPEED;
    this.lastTime = 0;

    // Fact & GameOver Data
    this.lastHitObstacle = null;
    this.gameOverFade = 0;
    this.milestonesSeen = new Set();
    this.lastHundredScore = 0;

    // Entities
    this.charScreen = null;
    this.bg = null;
    this.player = null;
    this.obstacles = null;
    this.hud = null;
    this.banner = null;

    // Input States
    this.jumpPressed = false;

    this._init();
  }

  async _init() {
    this._setupCanvasResolution();
    this._bindEvents();

    // Load assets
    await this.loader.loadAll();

    this.charScreen = new CharacterSelectScreen(this.loader, this.sound);
    this.bg = new ParallaxBackground(this.loader);
    this.obstacles = new ObstacleManager(this.loader);
    this.hud = new HUD();
    this.banner = new MilestoneBanner();

    this.state = 'CHAR_SELECT';

    // Start Loop
    requestAnimationFrame((ts) => this._loop(ts));
  }

  _setupCanvasResolution() {
    const dpr = window.devicePixelRatio || 1;
    this.dpr = dpr;

    // Logical game dimensions: 900 x 250
    this.canvas.width = C.WIDTH * dpr;
    this.canvas.height = C.HEIGHT * dpr;

    // Crisp high-DPI scaling
    this.ctx.resetTransform?.();
    this.ctx.scale(dpr, dpr);

    // Disable smoothing on pixel art
    this.ctx.imageSmoothingEnabled = false;
  }

  _startGame() {
    const selectedChar = this.charScreen.getSelectedCharacter();
    this.player = new Player(selectedChar, this.loader, this.sound);
    this.obstacles.reset();
    this.score = 0;
    this.speed = C.INITIAL_SPEED;
    this.lastHitObstacle = null;
    this.gameOverFade = 0;
    this.milestonesSeen.clear();
    this.lastHundredScore = 0;

    this.state = 'RUNNING';

    // Hide share section
    const shareArea = document.getElementById('share-area');
    if (shareArea) shareArea.classList.remove('visible');
  }

  _onGameOver(obstacleId) {
    this.state = 'GAME_OVER';
    this.lastHitObstacle = obstacleId;
    this.gameOverFade = 0;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('demockracy-high-score', this.highScore.toFixed(0));
    }

    // Show share section
    const shareArea = document.getElementById('share-area');
    if (shareArea) shareArea.classList.add('visible');
  }

  _bindEvents() {
    // Window Resize
    window.addEventListener('resize', () => {
      this._setupCanvasResolution();
    });

    // Keyboard Listeners
    window.addEventListener('keydown', (e) => {
      this.sound.init(); // Audio unlock on first key

      if (e.code === 'KeyM') {
        this.sound.toggle();
        return;
      }

      if (this.state === 'CHAR_SELECT') {
        if (e.code === 'ArrowLeft') this.charScreen.prev();
        if (e.code === 'ArrowRight') this.charScreen.next();
        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'Enter') {
          e.preventDefault();
          this._startGame();
        }
        return;
      }

      if (this.state === 'RUNNING') {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
          e.preventDefault();
          if (!this.jumpPressed) {
            this.player.jump(true);
            this.jumpPressed = true;
          }
        }
        if (e.code === 'ArrowDown') {
          e.preventDefault();
          this.player.duck(true);
        }
        return;
      }

      if (this.state === 'GAME_OVER') {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault();
          this._startGame(); // Restart with current character
        } else if (e.code === 'KeyC') {
          e.preventDefault();
          this.state = 'CHAR_SELECT'; // Return to character select
          const shareArea = document.getElementById('share-area');
          if (shareArea) shareArea.classList.remove('visible');
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        this.jumpPressed = false;
      }
      if (e.code === 'ArrowDown' && this.state === 'RUNNING') {
        this.player.duck(false);
      }
    });

    // Touch & Mouse on Canvas
    const handleCanvasPointer = (clientX, clientY) => {
      this.sound.init();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = C.WIDTH / rect.width;
      const scaleY = C.HEIGHT / rect.height;
      const canvasX = (clientX - rect.left) * scaleX;
      const canvasY = (clientY - rect.top) * scaleY;

      if (this.state === 'CHAR_SELECT') {
        const clickedCard = this.charScreen.handleClick(canvasX, canvasY);
        if (!clickedCard) {
          this._startGame();
        }
        return;
      }

      if (this.state === 'GAME_OVER') {
        // Check if clicked "[C] CHANGE CHARACTER" button on GameOver screen
        const btnChangeX = C.WIDTH / 2 - 130;
        const btnChangeY = 212;
        const btnW = 260;
        const btnH = 26;

        if (canvasX >= btnChangeX && canvasX <= btnChangeX + btnW && canvasY >= btnChangeY && canvasY <= btnChangeY + btnH) {
          this.state = 'CHAR_SELECT';
          const shareArea = document.getElementById('share-area');
          if (shareArea) shareArea.classList.remove('visible');
          return;
        }

        // Otherwise tap restarts game
        this._startGame();
        return;
      }

      if (this.state === 'RUNNING') {
        // Upper 60% = Jump, Lower 40% = Duck
        if (canvasY < C.HEIGHT * 0.60) {
          this.player.jump(true);
        } else {
          this.player.duck(true);
          setTimeout(() => this.player.duck(false), 450);
        }
      }
    };

    this.canvas.addEventListener('mousedown', (e) => {
      handleCanvasPointer(e.clientX, e.clientY);
    });

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        handleCanvasPointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    // Social Sharing Buttons
    document.getElementById('share-btn')?.addEventListener('click', () => {
      SocialShare.shareCopy(this.score);
    });
    document.getElementById('share-x-btn')?.addEventListener('click', () => {
      SocialShare.shareX(this.score);
    });
    document.getElementById('share-wa-btn')?.addEventListener('click', () => {
      SocialShare.shareWhatsApp(this.score);
    });
  }

  _checkMilestones() {
    const cur = Math.floor(this.score);

    // Easter Egg Milestones
    for (const [pts, data] of Object.entries(MILESTONES)) {
      const p = parseInt(pts);
      if (cur >= p && !this.milestonesSeen.has(p)) {
        this.milestonesSeen.add(p);
        this.banner.show(data);
        this.sound.play('milestone');
        break;
      }
    }

    // Every 100 points sound & flash
    const hundreds = Math.floor(cur / 100);
    if (hundreds > this.lastHundredScore) {
      this.lastHundredScore = hundreds;
      this.hud.flash();
      this.sound.play('score');
    }
  }

  _update(dt) {
    if (this.state === 'CHAR_SELECT') {
      this.charScreen.update(dt);
      return;
    }

    if (this.state === 'GAME_OVER') {
      if (this.gameOverFade < 1) {
        this.gameOverFade = Math.min(1, this.gameOverFade + dt * 0.003);
      }
      return;
    }

    if (this.state !== 'RUNNING') return;

    // Score & Speed Ramp
    this.score += dt * C.SCORE_RATE;
    this.speed = Math.min(C.MAX_SPEED, C.INITIAL_SPEED + this.score * C.SPEED_INC);

    // Update subsystems
    this.bg.update(this.speed, this.score);
    this.obstacles.update(this.speed, this.score);
    this.player.update(dt);
    this.banner.update(dt);

    this._checkMilestones();

    // Collision Check
    if (this.player.state !== 'HIT') {
      const ph = this.player.hitbox;
      const obstHits = this.obstacles.hitboxes();

      for (const oh of obstHits) {
        if (rectsIntersect(ph, oh)) {
          this.player.hit();
          setTimeout(() => {
            this._onGameOver(oh.id);
          }, 350);
          break;
        }
      }
    }
  }

  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, C.WIDTH, C.HEIGHT);

    if (this.state === 'CHAR_SELECT') {
      this.charScreen.draw(ctx);
      return;
    }

    const isDark = this.bg.skyBlend > 0.65;

    // Draw Parallax World
    this.bg.draw(ctx, this.score);
    this.obstacles.draw(ctx);
    this.player.draw(ctx);
    this.hud.draw(ctx, this.score, this.highScore, isDark, this.sound.muted);
    this.banner.draw(ctx);

    // Draw GameOver Screen
    if (this.state === 'GAME_OVER') {
      this._renderGameOver(ctx, isDark);
    }
  }

  _renderGameOver(ctx, isDark) {
    ctx.save();

    // Dark semi-transparent scrim
    ctx.fillStyle = isDark ? 'rgba(15, 15, 22, 0.82)' : 'rgba(247, 247, 247, 0.88)';
    ctx.fillRect(0, 0, C.WIDTH, C.HEIGHT);

    // Header: DEMOCRACY OVER
    ctx.fillStyle = '#c93b2b';
    ctx.font = 'bold 22px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('DEMOCRACY OVER', C.WIDTH / 2, 42);

    // Score Board
    const sc = String(Math.floor(this.score)).padStart(5, '0');
    const hi = String(Math.floor(this.highScore)).padStart(5, '0');

    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = isDark ? '#ffffff' : '#2b2b2b';
    ctx.fillText(`SCORE: ${sc}    HIGH: ${hi}`, C.WIDTH / 2, 66);

    // Fact-Checked Legal Context Box
    const fact = OBSTACLE_FACTS[this.lastHitObstacle] || GENERAL_QUOTES[0];
    const factBoxW = 680;
    const factBoxH = 78;
    const factBoxX = (C.WIDTH - factBoxW) / 2;
    const factBoxY = 82;

    ctx.fillStyle = isDark ? '#232330' : '#ffffff';
    ctx.fillRect(factBoxX, factBoxY, factBoxW, factBoxH);

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c93b2b';
    ctx.strokeRect(factBoxX, factBoxY, factBoxW, factBoxH);

    // Fact Title
    ctx.fillStyle = '#c93b2b';
    ctx.font = C.FONTS.FACT_TITLE;
    ctx.textAlign = 'left';
    ctx.fillText(fact.title || 'CONSTITUTION OF INDIA', factBoxX + 16, factBoxY + 18);

    // Fact Body Text (cleanly wrapped)
    ctx.fillStyle = isDark ? '#d0d0e0' : '#444444';
    ctx.font = C.FONTS.FACT_BODY;
    this._wrapText(ctx, fact.text || fact.sub, factBoxX + 16, factBoxY + 36, factBoxW - 32, 18);

    // Actions
    ctx.textAlign = 'center';

    // Restart prompt
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillStyle = isDark ? '#ffffff' : '#2b2b2b';
    ctx.fillText('PRESS SPACE / TAP TO TRY AGAIN', C.WIDTH / 2, 192);

    // Change Character Interactive Button
    const btnChangeX = C.WIDTH / 2 - 130;
    const btnChangeY = 208;
    const btnW = 260;
    const btnH = 24;

    ctx.fillStyle = isDark ? '#333344' : '#eaeaea';
    ctx.fillRect(btnChangeX, btnChangeY, btnW, btnH);
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 1;
    ctx.strokeRect(btnChangeX, btnChangeY, btnW, btnH);

    ctx.font = '9px "Silkscreen", monospace';
    ctx.fillStyle = isDark ? '#ffffff' : '#333333';
    ctx.fillText('[C] CHANGE CHARACTER', C.WIDTH / 2, btnChangeY + 16);

    ctx.restore();
  }

  _wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  _loop(ts) {
    const dt = Math.min(ts - this.lastTime, 40);
    this.lastTime = ts;

    this._update(dt);
    this._render();

    requestAnimationFrame((t) => this._loop(t));
  }
}

// ── BOOTSTRAP ────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  new Game();
});
