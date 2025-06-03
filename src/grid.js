import gsap from "gsap";

// -------- CONFIGURATION --------
const CONFIG = {
  blockSizeMin: 36,
  blockSizeMax: 52,
  blockGap: 6,          // <--- NEW: gap between blocks in px
  titleMargin: 1,
  introDuration: 1.0,
  iconRevealDelay: 0.32,
  flipDuration: 0.68,
  phraseHold: 1.75,
  //updater
  blankTransitionDuration: 0.44,
  revealWordCount: 7,
  maxPlacementAttempts: 3000,
  maxDirectionAttempts: 50,
  borderRadius: 6,
  iconScale: 0.69,
  letterScale: 0.54,
  titleLetterScale: 0.58,
  pulseStaggerAmount: 0.7,
  pulseFromCenter: true,
  popScale: 1.03,
  scrollPauseThreshold: 0.18
};

// -------- DATA --------
const WORDS_ORIGINAL = [
  "UXDesigner", "ProductDesign", "UXResearch", "Interaction", "Accessibility",
  "Wireframe", "Prototype", "Usability", "Figma", "Visual", "Storytelling",
  "Animation", "UserFlows", "DesignTokens", "Personas", "A11y", "ColorTheory",
  "JourneyMap", "Heuristics", "CardSort", "AffinityMap", "Prototyping",
  "DesignSprint", "AtomicDesign", "Feedback", "TaskFlow", "InteractionMap",
  "DesignSystem", "DesignOps", "UserJourney", "Sketching", "LoFi", "HiFi",
  "MotionDesign", "Handoff", "MicroUX", "Behavioral", "MobileFirst", "GridSystem",
  "UserTesting", "AccessibilityAudit", "Typography", "ComponentLib", "Collab",
  "Notion", "Storybook", "Zeroheight", "MaterialUI", "Tailwind", "ReactUI", "ChakraUI",
  "Empathy", "Cognitive", "HumanFactors", "InfoArch", "SystemThink", "DesignSys",
  "Psychology", "MentalModel", "GoalSetting", "Delight", "Context", "Trust", "Perception",
  "Onboarding", "Retention", "Consistency", "Efficiency", "Learnability", "Simplicity",
  "Complexity", "ErrorHandling", "Skeuomorph", "Minimalism", "Anticipation", "Ethics",
  "Sustainability", "Inclusive", "Emotion", "AIUX", "Conversational", "Branding", "Discovery",
  "Observability", "Wireframing", "DesignPatterns", "RapidPrototyping", "JourneyMaps",
  "UserInterview", "Persona", "Empathize", "Define", "Ideate", "Test", "Implement",
  "Measure", "Iterate", "Present", "FeedbackLoop", "AccessibilityTesting"
];

const CATEGORIES = [
  { title: "JOB ROLES I FILL", words: WORDS_ORIGINAL.slice(0, 5) },
  { title: "SKILLS I USE", words: WORDS_ORIGINAL.slice(5, 50) },
  { title: "TOPICS I LOVE", words: WORDS_ORIGINAL.slice(50) }
];

const ICON_URLS = [
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f119f669680fd75f9c4a_Apple.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f117433fc19d424f3073_Behance.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116feff8a3c4c7c9f8c_Discord.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116ada5d676d43545d3_Github.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116d3d5ffd8a9768c5b_Instagram.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116392b81886ae68cc0_Linkedin.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f1157a99d5531416941e_Twitter.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116debc3ee99b6b5ac8_Figma.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116feff8a3c4c7c9f4c_Wikipedia.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f1159786590dee047512_Steam.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837acd4a38bc135fdd23f4c_Gaming.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca9d85b68501fa01d0d_WEB%203.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca890c8d2547b16147e_Life%20Hacking.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca85147732db9894b43_AI.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca8b1a11a779607dafb_Programming.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca890c8d2547b16143f_Science.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca824e7b0507047986a_Remote.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca788fcd4e41026cce4_Technology.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837aca7f2d376307a3ef1f9_Startups.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9fcfa86f7c42373db5_Themes.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9fead8cf6533cb7b3a_Trending.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9eccb2139df04b7dc5_Pencil.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9e5a9130db7ed0e7de_Pro.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9eccb2139df04b7dbe_Save.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9eff082011cf4b8b14_Retro%20Camera.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9eee461aa2921224bb_Pen.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9e90c8d2547b160f55_Shuffle.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9d81175b18e99f56dd_Pen%20Nib.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9d0871af8986e835b9_Globe.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9d0871af8986e835b5_Headphones.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9d73b8cfafc60f24b4_Music.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9d0a1d5c1664c87e69_Heading%201.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9d314e91dd48e0b4c7_Crown.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9c73b8cfafc60f2490_Code.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6837ac9c7f192cd5481bc9cc_Paperclip.svg"

];

// -------- UTILITIES --------
const Utils = {
  shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },
  randomLetter() {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  },
  debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
  }
};

// -------- BLOCK CLASS --------
class Block {
  constructor(x, y, size, letter = "", wordKey = null, iconImage = null, isTitle = false) {
    this.x = x;
    this.y = y;
    this.width = size;
    this.height = size;
    this.letter = letter;
    this.wordKey = wordKey;
    this.iconImage = iconImage;
    this.isTitle = isTitle;
    this.empty = false;
    this.revealed = true;
    this.highlight = false;
    this.isBlankSpace = false;
    this.rotationY = 0;
    this.bubbleAlpha = 1;
    this.iconAlpha = 1;
    this.scale = 1;
    this._cachedBox = size * 0.91;
    this._cachedRadius = CONFIG.borderRadius;
  }
  setLetter(letter) { this.letter = letter; }

  draw(ctx) {
    if (this.empty) return;
    // --- Block gap: shrink block visual rect by blockGap, center it
    const gap = CONFIG.blockGap || 0;
    const gx = this.x + gap / 2;
    const gy = this.y + gap / 2;
    const w = this.width - gap;
    const h = this.height - gap;

    const rad = (this.rotationY * Math.PI) / 180;
    const scaleX = Math.abs(Math.cos(rad)) * this.scale;
    const isLetterSide = rad % (2 * Math.PI) > Math.PI / 2 && rad % (2 * Math.PI) < 3 * Math.PI / 2;
    const cx = gx + w / 2;
    const cy = gy + h / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scaleX, this.scale);

    if (this.isBlankSpace) {
      ctx.globalAlpha = this.bubbleAlpha;
      ctx.beginPath();
      ctx.arc(0, 0, (w * 0.43) * this.scale, 0, Math.PI * 2);
      ctx.fillStyle = "#fafafc";
      ctx.fill();
      ctx.restore();
      return;
    }
    if (isLetterSide && this.revealed) {
      if (this.isTitle) {
        ctx.globalAlpha = this.bubbleAlpha;
        this._drawRoundedRect(ctx, -w / 2, -h / 2, w, h, this._cachedRadius);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.strokeStyle = "#dad8ef";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.font = `bold ${w * CONFIG.titleLetterScale}px 'Satoshi', sans-serif`;
        ctx.fillStyle = "#202048";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.letter, 0, 0);
      } else {
        if (this.highlight) {
          ctx.save();
          ctx.globalAlpha = 0.32 * this.bubbleAlpha;
          ctx.beginPath();
          ctx.arc(0, 0, w * 0.43, 0, 2 * Math.PI);
          ctx.fillStyle = "#fff7ae";
          ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = this.bubbleAlpha;
        this._drawRoundedRect(ctx, -w / 2, -h / 2, w, h, this._cachedRadius);
        ctx.fillStyle = "#19182e";
        ctx.fill();
        ctx.strokeStyle = "#e0e0e9";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.font = `bold ${w * CONFIG.letterScale}px 'Satoshi', sans-serif`;
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.letter, 0, 0);
      }
    } else if (this.iconImage) {
      ctx.globalAlpha = this.iconAlpha;
      const cr = 4;
      ctx.fillStyle = "rgba(255,255,255,0.93)";
      this._drawRoundedRect(ctx, -w / 2, -h / 2, w, h, cr);
      ctx.fill();
      const iconSize = w * CONFIG.iconScale;
      ctx.drawImage(this.iconImage, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
    }
    ctx.restore();
  }

  _drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

// -------- WORD PLACER --------
// Prevent word overlaps: track all cells occupied by already placed words
class WordPlacer {
  static placeWords(grid, words, protectedZone, maxWords = CONFIG.revealWordCount) {
    const rows = grid.length, cols = grid[0].length, placed = [], used = new Set();
    let attempts = 0, shuffled = Utils.shuffle(words);
    const occupied = new Set(); // <--- store "r,c" strings for all word blocks used
    for (const w of shuffled) {
      if (placed.length >= maxWords || attempts >= CONFIG.maxPlacementAttempts) break;
      if (used.has(w)) continue;
      const result = this._tryPlaceWord(grid, w.toUpperCase(), placed.length, rows, cols, protectedZone, occupied);
      if (result) {
        placed.push(result);
        used.add(w);
        result.positions.forEach(({ r, c }) => occupied.add(`${r},${c}`));
      }
      attempts++;
    }
    return placed;
  }
  static _tryPlaceWord(grid, word, idx, rows, cols, zone, occupied) {
    const len = word.length, canH = len <= cols, canV = len <= rows;
    if (!canH && !canV) return null;
    const dirs = this._getDirections(canH, canV);
    for (const d of dirs) {
      const placement = this._attemptPlacement(grid, word, idx, d, rows, cols, zone, occupied);
      if (placement) return placement;
    }
    return null;
  }
  static _getDirections(h, v) {
    if (h && v) return Math.random() < 0.5 ? ["h", "v"] : ["v", "h"];
    return h ? ["h"] : ["v"];
  }
  static _attemptPlacement(grid, word, idx, dir, rows, cols, zone, occupied) {
    const len = word.length;
    let tries = 0;
    while (tries < CONFIG.maxDirectionAttempts) {
      const { r0, c0 } = this._getRandomStartPosition(dir, len, rows, cols);
      const pos = this._getWordPositions(r0, c0, dir, len);
      // --- prevent overlaps with other placed words in this cycle:
      if (this._canPlaceWord(grid, word, pos, zone, occupied)) {
        this._placeWordInGrid(grid, word, pos, idx);
        return { word, positions: pos };
      }
      tries++;
    }
    return null;
  }
  static _getRandomStartPosition(dir, len, rows, cols) {
    const r0 = Math.floor(Math.random() * (dir === 'h' ? rows : rows - len + 1));
    const c0 = Math.floor(Math.random() * (dir === 'v' ? cols : cols - len + 1));
    return { r0, c0 };
  }
  static _getWordPositions(r0, c0, dir, len) {
    const arr = [];
    for (let i = 0; i < len; i++) arr.push({ r: dir === 'h' ? r0 : r0 + i, c: dir === 'h' ? c0 + i : c0 });
    return arr;
  }
  static _canPlaceWord(grid, word, pos, zone, occupied) {
    return pos.every(({ r, c }, i) => {
      if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) return false;
      if (this._isInProtectedZone(r, c, zone)) return false;
      // --- prevent block collision with any already-placed word
      if (occupied && occupied.has(`${r},${c}`)) return false;
      const cell = grid[r][c];
      return !cell || cell.letter === word[i];
    });
  }
  static _isInProtectedZone(r, c, zone) {
    const { centerRow, protectedCols, expandedProtectedRows } = zone;
    if (r === centerRow && protectedCols.includes(c)) return true;
    if (expandedProtectedRows.includes(r) && protectedCols.includes(c)) return true;
    return false;
  }
  static _placeWordInGrid(grid, word, pos, idx) {
    pos.forEach(({ r, c }, i) => { grid[r][c] = { letter: word[i], wordKey: idx }; });
  }
}

// -------- VIEWPORT-BASED ANIMATION CONTROL --------
function createSectionVisibilityObserver(canvas, onVisible, onHidden) {
  if (!window.IntersectionObserver) {
    onVisible();
    return { disconnect: () => {} };
  }
  let visible = false;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting && entry.intersectionRatio > CONFIG.scrollPauseThreshold) {
        if (!visible) { visible = true; onVisible(); }
      } else {
        if (visible) { visible = false; onHidden(); }
      }
    }
  }, { threshold: [CONFIG.scrollPauseThreshold] });
  observer.observe(canvas);
  return observer;
}

// -------- MAIN GRID CLASS --------
export class Grid {
  constructor() {
    this.blocks = [];
    this.iconImages = [];
    this.iconReady = false;
    this.catIndex = 0; // single source of truth for category/phrase
    this._usedWords = new Set();
    this._currentPlacedWords = [];
    this.currentTimeline = null;
    this._drawScheduled = false;
    this._isActive = true;
    this._introPlayed = false;

    this._onResize = Utils.debounce(() => this._resizeAndResetBlocks(), 70);
    window.addEventListener('resize', this._onResize);
    this._initResizeObserver();
    this._loadIcons();
    this._sectionObserver = null;
    this._canvas = null;
    this._ctx = null;
  }

  _initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this._onResize());
    requestAnimationFrame(() => {
      const canvas = document.querySelector('.hero_canvas');
      if (canvas) this.resizeObserver.observe(canvas);
    });
  }

  _loadIcons() {
    let loaded = 0, total = ICON_URLS.length;
    ICON_URLS.forEach((url, i) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      img.onload = img.onerror = () => {
        this.iconImages[i] = img;
        if (++loaded === total) {
          this.iconReady = true;
          this._resizeAndResetBlocks();
        }
      };
    });
  }

  _resizeAndResetBlocks() {
    if (!this.iconReady) return;
    const canvas = document.querySelector('.hero_canvas');
    if (!canvas) return;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._setupCanvas(canvas);
    this._calculateGridDimensions();
    this._createBlocks();
    this._introPlayed = false;
    this._initializeAnimation();
    if (!this._sectionObserver) {
      this._sectionObserver = createSectionVisibilityObserver(
        canvas,
        () => this._resumeAnimation(),
        () => this._pauseAnimation()
      );
    }
  }

  _setupCanvas(canvas) {
    const scale = window.devicePixelRatio || 1;
    this.cssW = canvas.offsetWidth;
    this.cssH = canvas.offsetHeight;
    canvas.width = this.cssW * scale;
    canvas.height = this.cssH * scale;
    this._ctx.setTransform(scale, 0, 0, scale, 0, 0);
  }

  _calculateGridDimensions() {
    let size = Math.max(CONFIG.blockSizeMin, Math.min(CONFIG.blockSizeMax, Math.floor(Math.min(this.cssW, this.cssH) / 11)));
    let cols = Math.floor(this.cssW / size);
    let rows = Math.floor(this.cssH / size);
    size = Math.min(this.cssW / cols, this.cssH / rows);
    this._cols = cols;
    this._rows = rows;
    this._blockSize = size;
  }

  _createBlocks() {
    const category = CATEGORIES[this.catIndex];
    const grid = Array.from({ length: this._rows }, () => Array(this._cols).fill(null));
    const zone = this._getProtectedZone();
    const avail = category.words.filter(w => !this._usedWords.has(w.toUpperCase()));
    if (avail.length < CONFIG.revealWordCount) this._usedWords.clear();
    this._currentPlacedWords = WordPlacer.placeWords(grid, category.words, zone, CONFIG.revealWordCount);
    this._currentPlacedWords.forEach(w => this._usedWords.add(w.word));
    this.blocks = [];
    const count = this.iconImages.length;
    for (let r = 0; r < this._rows; r++) {
      for (let c = 0; c < this._cols; c++) {
        const cell = grid[r][c] || { letter: Utils.randomLetter(), wordKey: null };
        const icon = this.iconImages[(r * this._cols + c) % count];
        const x = c * this._blockSize, y = r * this._blockSize;
        this.blocks.push(new Block(x, y, this._blockSize, cell.letter, cell.wordKey, icon, false));
      }
    }
  }

  _getProtectedZone() {
    const centerRow = Math.floor(this._rows / 2);
    const maxTitle = Math.max(...CATEGORIES.map(c => c.title.length));
    const centerCol = Math.floor(this._cols / 2);
    const protectedCols = [];
    const left = Math.max(0, centerCol - Math.ceil(maxTitle / 2) - CONFIG.titleMargin);
    const right = Math.min(this._cols - 1, centerCol + Math.floor(maxTitle / 2) + CONFIG.titleMargin);
    for (let c = left; c <= right; c++) protectedCols.push(c);
    const expandedRows = [];
    for (let r = Math.max(0, centerRow - CONFIG.titleMargin); r <= Math.min(this._rows - 1, centerRow + CONFIG.titleMargin); r++) {
      if (r !== centerRow) expandedRows.push(r);
    }
    return { protectedCols, centerRow, expandedProtectedRows: expandedRows };
  }

  _initializeAnimation() {
    if (!this._isActive) return;
    if (!this._introPlayed) {
      setTimeout(() => {
        if (this._isActive) this._runPulseIntro();
        this._introPlayed = true;
      }, 1000);
    } else {
      setTimeout(() => this._autoReveal(), 250);
    }
  }

  _runPulseIntro() {
    this._killTimeline();
    this.blocks.forEach(b => {
      b.bubbleAlpha = 0; b.scale = 0.93; b.iconAlpha = 0; b.rotationY = 0; b.revealed = true; b.empty = false; b.isBlankSpace = false;
    });
    const centerX = this.cssW / 2, centerY = this.cssH / 2;
    const sorted = this.blocks.slice().sort((a, b) =>
      Utils.distance(a.x + a.width / 2, a.y + a.height / 2, centerX, centerY) -
      Utils.distance(b.x + b.width / 2, b.y + b.height / 2, centerX, centerY)
    );
    this.currentTimeline = gsap.timeline({
      onComplete: () => setTimeout(() => this._autoReveal(), 320)
    });
    this.currentTimeline.to(sorted, {
      bubbleAlpha: 1, scale: 1,
      duration: CONFIG.introDuration,
      ease: "expo.out",
      stagger: { amount: CONFIG.pulseStaggerAmount, from: CONFIG.pulseFromCenter ? "center" : 0 },
      onUpdate: () => this._drawOnce()
    }, 0);
    this.currentTimeline.to(sorted, {
      iconAlpha: 1,
      duration: CONFIG.iconRevealDelay * 2,
      ease: "expo.inOut",
      stagger: { amount: CONFIG.pulseStaggerAmount * 0.8, from: CONFIG.pulseFromCenter ? "center" : 0 },
      onUpdate: () => this._drawOnce()
    }, CONFIG.iconRevealDelay);
    this._drawOnce();
  }

  _autoReveal() {
    if (!this._isActive) return;
    this._killTimeline();

    // Step 1: Increment catIndex (loop)
    this.catIndex = (this.catIndex + 1) % CATEGORIES.length;

    // Step 2: Clear usedWords when needed
    const currentCategory = CATEGORIES[this.catIndex];
    const avail = currentCategory.words.filter(w => !this._usedWords.has(w.toUpperCase()));
    if (avail.length < CONFIG.revealWordCount) {
      this._usedWords.clear();
    }

    // Step 3: Recreate blocks and update currentPlacedWords for this category
    this._createBlocks();

    // Step 4: Prepare and animate the phrase/words together
    const { titleBlocks, titleLetters } = this._prepareTitleBlocks();
    const blankBlocks = titleBlocks.filter(b => b.isBlankSpace && b.spaceActive);

    if (blankBlocks.length) {
      this._animateBlankFade(blankBlocks, false, () => setTimeout(() => this._revealCategory(titleBlocks, titleLetters), 60));
    } else {
      this._revealCategory(titleBlocks, titleLetters);
    }
  }

  _prepareTitleBlocks() {
    const cat = CATEGORIES[this.catIndex];
    const title = cat.title.toUpperCase().split("");
    const mid = Math.floor(this._rows / 2);
    let row = this.blocks.filter(b => Math.round(b.y / this._blockSize) === mid);
    row.sort((a, b) => a.x - b.x);
    const start = Math.floor((row.length - title.length) / 2);
    const tb = row.slice(start, start + title.length);
    return { titleBlocks: tb, titleLetters: title };
  }

  _animateBlankFade(blankBlocks, fadeIn, onComplete) {
    blankBlocks.forEach(b => { b.bubbleAlpha = fadeIn ? 0 : 1; b.scale = fadeIn ? 0.8 : 1; });
    this.currentTimeline = gsap.timeline({ onComplete });
    this.currentTimeline.to(blankBlocks, {
      bubbleAlpha: fadeIn ? 1 : 0,
      scale: fadeIn ? 1 : 0.8,
      duration: CONFIG.blankTransitionDuration,
      ease: fadeIn ? "power2.out" : "power2.in",
      stagger: { amount: 0.14, from: "center" },
      onUpdate: () => this._drawOnce()
    });
  }

  _revealCategory(titleBlocks, titleLetters) {
    this._resetBlocks();
    this._setupTitleBlocks(titleBlocks, titleLetters);
    const newBlanks = titleBlocks.filter((b, i) => titleLetters[i] === " ");
    if (newBlanks.length) {
      this._animateBlankFade(newBlanks, true, () => this._categoryTimeline(titleBlocks, titleLetters));
    } else {
      this._categoryTimeline(titleBlocks, titleLetters);
    }
  }

  _resetBlocks() {
    this.blocks.forEach(b => {
      if (b.isBlankSpace) { b.isBlankSpace = false; b.empty = false; b.revealed = true; b.rotationY = 0; b.bubbleAlpha = 1; b.scale = 1; }
      b.isTitle = false; b.highlight = false;
    });
  }

  _setupTitleBlocks(titleBlocks, titleLetters) {
    titleBlocks.forEach((b, i) => {
      const c = titleLetters[i];
      if (c === ' ') { b.isBlankSpace = true; b.revealed = false; b.bubbleAlpha = 0; b.scale = 1; }
      else { b.isTitle = true; b.setLetter(c); b.rotationY = 0; b.bubbleAlpha = 0; b.scale = 1; b.isBlankSpace = false; }
    });
  }

  _getClearZoneBlocks(titleBlocks) {
    const coords = titleBlocks.map(b => ({ row: Math.round(b.y / this._blockSize), col: Math.round(b.x / this._blockSize) }));
    return this.blocks.filter(b => {
      if (titleBlocks.includes(b)) return false;
      const r = Math.round(b.y / this._blockSize), c = Math.round(b.x / this._blockSize);
      return coords.some(q => Math.abs(q.row - r) <= CONFIG.titleMargin && Math.abs(q.col - c) <= CONFIG.titleMargin);
    });
  }

  _getHighlightBlocks() {
    return this._currentPlacedWords.flatMap(w =>
      w.positions.map(p => this.blocks.find(b =>
        Math.round(b.x / this._blockSize) === p.c && Math.round(b.y / this._blockSize) === p.r
      ))
    ).filter(Boolean);
  }

  _categoryTimeline(titleBlocks, titleLetters) {
    const clearZone = this._getClearZoneBlocks(titleBlocks);
    const highlight = this._getHighlightBlocks();
    this.currentTimeline = gsap.timeline({ onComplete: () => this._onCategoryRevealEnd() });
    this.currentTimeline.to(clearZone, {
      rotationY: 180, bubbleAlpha: 0,
      duration: CONFIG.flipDuration, ease: "power1.inOut",
      stagger: { amount: 0.18, from: "random" },
      onUpdate: () => this._drawOnce()
    }, 0);

    const nonBlankTitle = titleBlocks.filter((b, i) => !b.isBlankSpace && titleLetters[i] !== " ");
    this.currentTimeline.to(nonBlankTitle, {
      rotationY: 180, bubbleAlpha: 1, scale: CONFIG.popScale,
      duration: CONFIG.flipDuration + 0.09, ease: "power2.inOut",
      stagger: { amount: 0.11 },
      onUpdate: () => this._drawOnce()
    }, 0.09);
    this.currentTimeline.to(nonBlankTitle, {
      scale: 1, duration: 0.12, ease: "power1.out", onUpdate: () => this._drawOnce()
    }, 0.19 + CONFIG.flipDuration);

    this.currentTimeline.to(highlight, {
      rotationY: 180, bubbleAlpha: 1, scale: CONFIG.popScale,
      duration: CONFIG.flipDuration + 0.12, ease: "power2.inOut",
      stagger: { amount: 0.12 },
      onUpdate: () => this._drawOnce()
    }, 0.12);
    this.currentTimeline.to(highlight, {
      highlight: true, duration: 0.01, onUpdate: () => this._drawOnce()
    }, 0.23);

    this.currentTimeline.to(highlight, {
      scale: 1, duration: 0.10, ease: "power1.out", onUpdate: () => this._drawOnce()
    }, 0.33);

    this.currentTimeline.to({}, { duration: CONFIG.phraseHold });

    this.currentTimeline.to(highlight, {
      rotationY: 0, bubbleAlpha: 0, highlight: false,
      duration: CONFIG.flipDuration, ease: "power2.inOut",
      stagger: { amount: 0.13 }, onUpdate: () => this._drawOnce()
    }, ">");
    this.currentTimeline.to(nonBlankTitle, {
      rotationY: 0, bubbleAlpha: 0,
      duration: CONFIG.flipDuration, ease: "power2.inOut",
      stagger: { amount: 0.11 }, onUpdate: () => this._drawOnce()
    }, "-=0.33");
    this.currentTimeline.call(() => {
      titleBlocks.filter((b, i) => titleLetters[i] === " ").forEach(b => {
        b.isBlankSpace = true; b.bubbleAlpha = 0; b.scale = 1;
      });
    }, [], "-=0.16");
    this.currentTimeline.to(clearZone, {
      rotationY: 0, bubbleAlpha: 1,
      duration: 0.16, ease: "power1.inOut", onUpdate: () => this._drawOnce()
    }, "-=0.18");
  }

  _onCategoryRevealEnd() {
    setTimeout(() => this._autoReveal(), 250);
  }

  _drawOnce() {
    if (!this._isActive) return;
    if (!this._ctx) return;
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.save();
    for (let i = 0, n = this.blocks.length; i < n; ++i) {
      try { this.blocks[i].draw(this._ctx); } catch { }
    }
    this._ctx.restore();
      this._applyDitherEffect();
  }

  _applyDitherEffect() {
    if (!this._ctx) return;
    const w = this._canvas.width;
    const h = this._canvas.height;
    const img = this._ctx.getImageData(0, 0, w, h);
    const data = img.data;
    const map = [0, 8, 2, 10,
                 12, 4, 14, 6,
                 3, 11, 1, 9,
                 15, 7, 13, 5];
    const mapSize = 4;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const idx = (y * w + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        const threshold = map[(x % mapSize) + (y % mapSize) * mapSize] * 16;
        const val = gray > threshold ? 255 : 0;
        data[idx] = data[idx + 1] = data[idx + 2] = val;
      }
    }
    this._ctx.putImageData(img, 0, 0);
  }

  _killTimeline() { if (this.currentTimeline) this.currentTimeline.kill(); }

  _resumeAnimation() {
    this._isActive = true;
    if (this.currentTimeline && this.currentTimeline.paused()) {
      this.currentTimeline.resume();
    } else {
      this._autoReveal();
    }
    this._drawOnce();
  }

  _pauseAnimation() {
    this._isActive = false;
    if (this.currentTimeline && !this.currentTimeline.paused()) this.currentTimeline.pause();
  }

  destroy() {
    if (this._sectionObserver) this._sectionObserver.disconnect();
    this._killTimeline();
    if (this.resizeObserver) { this.resizeObserver.disconnect(); this.resizeObserver = null; }
    window.removeEventListener('resize', this._onResize);
    this.blocks = [];
    this.iconImages = [];
    this._canvas = null;
    this._ctx = null;
  }
}

// ------- USAGE -------
// After DOM is loaded, run:
//   new Grid();
// Canvas element should have class "hero_canvas"
// new update
