import gsap from "gsap";

// 1) Word list
const WORDS = [
  "Accessibility","Prototyping","Typography","Interaction",
  "UsabilityTest","Information","Wireframing","Storytelling",
  "UserJourney","VisualDesign","EmpathyDriven","DesignSystem",
  "SystemThinking","BehaviorModel","ExperienceMap","HumanFactors",
  "CognitiveLoad","Microinteractions","NavigationFlow","DesignResearch"
];

// 2) Icon URLs
const ICON_URLS = [
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f119f669680fd75f9c4a_Apple.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f117433fc19d424f3073_Behance.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116feff8a3c4c7c9f8c_Discord.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116d3d5ffd8a9768c5b_Instagram.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116debc3ee99b6b5ac8_Figma.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116ada5d676d43545d3_Github.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116392b81886ae68cc0_Linkedin.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f116feff8a3c4c7c9f4c_Wikipedia.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f1161baf1b1bb2178719_Reddit.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f1159786590dee047512_Steam.svg",
  "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/6813f1157a99d5531416941e_Twitter.svg"
];

// 3) Simple shuffle
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 4) Block: handles flip & drawing
class Block {
  constructor(x, y, size, letter = "", wordId = null, iconImage = null) {
    this.x = x; this.y = y;
    this.width = size; this.height = size;
    this.centerX = x + size/2; this.centerY = y + size/2;
    this.letter = letter; this.wordId = wordId; this.iconImage = iconImage;
    this.rotationY = 180;     // start on letter
    this.bubbleAlpha = 1;     // letter fully visible
    this.revealed = true;
  }

  setReveal(visible) {
    this.revealed = visible;
    gsap.to(this, {
      bubbleAlpha: visible ? 1 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  draw(ctx) {
    const rad = this.rotationY * Math.PI / 180;
    const scaleX = Math.abs(Math.cos(rad));
    const isText = (this.rotationY % 360) >= 90 && (this.rotationY % 360) <= 270;

    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.scale(scaleX, 1);

    if (isText && this.revealed) {
      // draw letter bubble
      ctx.globalAlpha = this.bubbleAlpha;
      ctx.fillStyle = "#111"; ctx.strokeStyle = "#888"; ctx.lineWidth = 1;
      const r = 6, w = this.width, h = this.height;
      ctx.beginPath();
      ctx.moveTo(-w/2 + r, -h/2);
      ctx.lineTo(w/2 - r, -h/2);
      ctx.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
      ctx.lineTo(w/2, h/2 - r);
      ctx.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
      ctx.lineTo(-w/2 + r, h/2);
      ctx.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
      ctx.lineTo(-w/2, -h/2 + r);
      ctx.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      ctx.font = `${w * 0.55}px 'Satoshi', sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(this.letter, 0, 0);

    } else if (this.iconImage) {
      // draw icon card
      const bg = this.width * 0.9, ic = this.width * 0.6, cr = 4;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.moveTo(-bg/2+cr, -bg/2);
      ctx.lineTo(bg/2-cr, -bg/2);
      ctx.quadraticCurveTo(bg/2, -bg/2, bg/2, -bg/2+cr);
      ctx.lineTo(bg/2, bg/2-cr);
      ctx.quadraticCurveTo(bg/2, bg/2, bg/2-cr, bg/2);
      ctx.lineTo(-bg/2+cr, bg/2);
      ctx.quadraticCurveTo(-bg/2, bg/2, -bg/2, bg/2-cr);
      ctx.lineTo(-bg/2, -bg/2+cr);
      ctx.quadraticCurveTo(-bg/2, -bg/2, -bg/2+cr, -bg/2);
      ctx.closePath();
      ctx.fill();

      ctx.drawImage(this.iconImage, -ic/2, -ic/2, ic, ic);
    }

    ctx.restore();
  }
}

// 5) Grid class
export class Grid {
  constructor() {
    this.blocks = [];
    this.iconImages = [];
    this.iconReady = false;
    this._draw = this.draw.bind(this);
    this._onResize = this.setup.bind(this);

    this.loadIcons();
    this.initResizeObserver();
    window.addEventListener("resize", this._onResize);
  }

  loadIcons() {
    let loaded = 0;
    ICON_URLS.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.iconImages[i] = img;
        if (++loaded === ICON_URLS.length) {
          this.iconReady = true;
          this.setup();
        }
      };
    });
  }

  initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => this.setup());
    requestAnimationFrame(() => {
      const c = document.querySelector(".hero_canvas");
      if (c) this.resizeObserver.observe(c);
    });
  }

  setup() {
    if (!this.iconReady) return;
    const scale = window.devicePixelRatio || 1;
    this.canvas = document.querySelector(".hero_canvas");
    this.canvas.width  = this.canvas.offsetWidth  * scale;
    this.canvas.height = this.canvas.offsetHeight * scale;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.setTransform(scale, 0, 0, scale, 0, 0);

    this.blockWidth = Math.max(20, Math.floor(this.canvas.offsetWidth / 50));
    this.blockGap   = 0;
    this.blocks     = [];

    this.createBlocks();
    gsap.ticker.add(this._draw);
    this.loadingAnimation();
  }

  createBlocks() {
    const cols = Math.floor(this.canvas.offsetWidth  / (this.blockWidth + this.blockGap));
    const rows = Math.floor(this.canvas.offsetHeight / (this.blockWidth + this.blockGap));
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    // place words
    let wid = 0, tries = 0, maxTries = 1000;
    while (wid < WORDS.length && tries < maxTries) {
      const w = WORDS[wid].toUpperCase();
      const dir = Math.random() < 0.5 ? "h" : "v";
      const L = w.length;
      const r0 = Math.floor(Math.random() * (dir === "h" ? rows : rows - L + 1));
      const c0 = Math.floor(Math.random() * (dir === "v" ? cols : cols - L + 1));
      let ok = true;
      for (let i = 0; i < L; i++) {
        const r = dir === "h" ? r0 : r0 + i;
        const c = dir === "h" ? c0 + i : c0;
        if (grid[r][c] && grid[r][c].letter !== w[i]) { ok = false; break; }
      }
      if (ok) {
        for (let i = 0; i < L; i++) {
          const r = dir === "h" ? r0 : r0 + i;
          const c = dir === "h" ? c0 + i : c0;
          grid[r][c] = { letter: w[i], wordId: wid };
        }
        wid++;
      }
      tries++;
    }

    // fill blanks + assign icons
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = grid[r][c] || {
          letter: String.fromCharCode(65 + Math.floor(Math.random() * 26)),
          wordId: null
        };
        const icon = this.iconImages[
          Math.floor(Math.random() * this.iconImages.length)
        ];
        const x = c * (this.blockWidth + this.blockGap);
        const y = r * (this.blockWidth + this.blockGap);
        this.blocks.push(new Block(x, y, this.blockWidth, cell.letter, cell.wordId, icon));
      }
    }
  }

  loadingAnimation() {
    // much faster random coverage: 0.3s total
    gsap.to(this.blocks, {
      rotationY: 0,
      duration: 1,
      ease: "power2.out",
      stagger: { amount: 2, from: "random" },
      onComplete: () => this.startAutoReveal()
    });
  }

  startAutoReveal() {
    const allIds = [...new Set(this.blocks.map(b => b.wordId).filter(id => id != null))];

    // compute centroids for spatial separation
    const centroids = {};
    allIds.forEach(id => {
      const pts = this.blocks.filter(b => b.wordId === id);
      const avgX = pts.reduce((s, b) => s + b.centerX, 0) / pts.length;
      const avgY = pts.reduce((s, b) => s + b.centerY, 0) / pts.length;
      centroids[id] = { x: avgX, y: avgY };
    });
    const threshold = Math.min(this.canvas.width, this.canvas.height) / 4;

    // pick 6 well-separated words
    function pickSeparated(ids) {
      const shuffled = shuffle(ids);
      const sel = [];
      for (const id of shuffled) {
        if (sel.every(other => {
          const dx = centroids[id].x - centroids[other].x;
          const dy = centroids[id].y - centroids[other].y;
          return Math.hypot(dx, dy) > threshold;
        })) {
          sel.push(id);
          if (sel.length === 6) break;
        }
      }
      return sel.length === 6 ? sel : shuffled.slice(0, 6);
    }

    const loop = () => {
      const pick6 = pickSeparated(allIds);
      const bs = this.blocks.filter(b => pick6.includes(b.wordId));
      const tl = gsap.timeline({ onComplete: loop });

      // reveal all six in one smooth 0.6s sweep from first letter
      tl.to(bs, {
        rotationY: 180,
        bubbleAlpha: 1,
        duration: 1,
        ease: "power2.inOut",
        stagger: { amount: 1, from: 0 }  // start from first block in bs
      });

      // hold
      tl.to({}, { duration: 1.5 });

      // hide back in another 0.6s sweep from first letter
      tl.to(bs, {
        rotationY: 0,
        bubbleAlpha: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: { amount: 0.6, from: 0 }  // start from first block in bs
      });
    };

    loop();
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.blocks.forEach(b => b.draw(this.ctx));
  }

  handleResize() {
    this.setup();
  }

  destroy() {
    gsap.ticker.remove(this._draw);
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this._onResize);
    this.blocks = [];
  }
}
