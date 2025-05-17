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

// 3) Categories → subsets of WORDS
const CATEGORIES = [
  {
    title: "JOB ROLES I FILL",
    words: ["Accessibility","Prototyping","Typography","Interaction","Wireframing","DesignSystem"]
  },
  {
    title: "SKILLS I USE",
    words: ["UsabilityTest","Information","Storytelling","VisualDesign","Microinteractions"]
  },
  {
    title: "TOPICS I LOVE",
    words: ["UserJourney","EmpathyDriven","SystemThinking","BehaviorModel","ExperienceMap"]
  }
];

// 4) Shuffle helper
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 5) Block class handles flip & draw, including question highlighting
class Block {
  constructor(x, y, size, letter = "", wordId = null, iconImage = null, isQuestion = false) {
    this.origX = x; this.origY = y;
    this.x = x; this.y = y;
    this.width = size; this.height = size;
    this.letter = letter;
    this.wordId = wordId;
    this.iconImage = iconImage;
    this.isQuestion = isQuestion;
    this.rotationY = 180;    // letter side by default
    this.bubbleAlpha = isQuestion ? 0 : 1;
    this.revealed = true;
  }

  setLetter(letter) {
    this.letter = letter;
  }

  setReveal(visible) {
    this.revealed = true;
    gsap.to(this, {
      bubbleAlpha: visible ? 1 : 0,
      duration: 0.8,
      ease: "power2.inOut"
    });
  }

  draw(ctx) {
    const rad = this.rotationY * Math.PI / 180;
    const scaleX = Math.abs(Math.cos(rad));
    const isText = (rad % (2 * Math.PI)) > Math.PI/2 && (rad % (2 * Math.PI)) < 3 * Math.PI/2;
    const cx = this.x + this.width/2;
    const cy = this.y + this.height/2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scaleX, 1);

    if (isText && this.revealed) {
      // choose styles for question vs regular word
      ctx.globalAlpha = this.bubbleAlpha;
      if (this.isQuestion) {
        ctx.fillStyle = "#ffeb3b";
        ctx.strokeStyle = "#fbc02d";
      } else {
        ctx.fillStyle = "#111";
        ctx.strokeStyle = "#888";
      }
      ctx.lineWidth = 1;

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
      ctx.fill();
      ctx.stroke();

      ctx.font = `${w * 0.55}px 'Satoshi', sans-serif`;
      ctx.fillStyle = this.isQuestion ? "#111" : "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.letter, 0, 0);

    } else if (this.iconImage) {
      // icon side
      const bg = this.width * 0.9, ic = this.width * 0.6, cr = 4;
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath();
      ctx.moveTo(-bg/2 + cr, -bg/2);
      ctx.lineTo(bg/2 - cr, -bg/2);
      ctx.quadraticCurveTo(bg/2, -bg/2, bg/2, -bg/2 + cr);
      ctx.lineTo(bg/2, bg/2 - cr);
      ctx.quadraticCurveTo(bg/2, bg/2, bg/2 - cr, bg/2);
      ctx.lineTo(-bg/2 + cr, bg/2);
      ctx.quadraticCurveTo(-bg/2, bg/2, -bg/2, bg/2 - cr);
      ctx.lineTo(-bg/2, -bg/2 + cr);
      ctx.quadraticCurveTo(-bg/2, -bg/2, -bg/2 + cr, -bg/2);
      ctx.closePath();
      ctx.fill();
      ctx.drawImage(this.iconImage, -ic/2, -ic/2, ic, ic);
    }

    ctx.restore();
  }
}

// 6) Grid class orchestrates everything
export class Grid {
  constructor() {
    this.blocks = [];
    this.iconImages = [];
    this.iconReady = false;
    this.categories = CATEGORIES;
    this.catIndex = 0;

    this._draw = this.draw.bind(this);
    this._onResize = this.setup.bind(this);

    this.loadIcons();
    this.initResizeObserver();
    window.addEventListener("resize", this._onResize);
  }

  loadIcons() {
    let loaded = 0;
    ICON_URLS.forEach((url,i) => {
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
    this.cssW = this.canvas.offsetWidth;
    this.cssH = this.canvas.offsetHeight;
    this.canvas.width = this.cssW * scale;
    this.canvas.height = this.cssH * scale;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.setTransform(scale,0,0,scale,0,0);

    this.blockWidth = Math.max(20, Math.floor(this.cssW/50));
    this.blockGap = 0;
    this.blocks = [];

    this.createBlocks();
    gsap.ticker.add(this._draw);
    this.loadingAnimation();
  }

  createBlocks() {
    const cols = Math.floor(this.cssW/(this.blockWidth+this.blockGap));
    const rows = Math.floor(this.cssH/(this.blockWidth+this.blockGap));
    const grid = Array.from({length:rows},()=>Array(cols).fill(null));

    let wid=0, tries=0;
    while (wid < WORDS.length && tries < 1000) {
      const w = WORDS[wid].toUpperCase();
      const dir = Math.random()<0.5?"h":"v";
      const L = w.length;
      const r0 = Math.floor(Math.random()*(dir==="h"?rows:rows-L+1));
      const c0 = Math.floor(Math.random()*(dir==="v"?cols:cols-L+1));
      let ok = true;
      for (let i=0; i<L; i++) {
        const r = (dir==="h"?r0 : r0+i);
        const c = (dir==="h"?c0+i : c0);
        if (grid[r][c] && grid[r][c].letter !== w[i]) { ok = false; break; }
      }
      if (ok) {
        for (let i=0; i<L; i++) {
          const r = (dir==="h"?r0 : r0+i);
          const c = (dir==="h"?c0+i : c0);
          grid[r][c] = { letter: w[i], wordId: wid };
        }
        wid++;
      }
      tries++;
    }

    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols; c++) {
        const cell = grid[r][c] || {
          letter: String.fromCharCode(65 + Math.floor(Math.random()*26)),
          wordId: null
        };
        const icon = this.iconImages[Math.floor(Math.random()*this.iconImages.length)];
        const x = c*(this.blockWidth+this.blockGap);
        const y = r*(this.blockWidth+this.blockGap);
        this.blocks.push(new Block(x,y,this.blockWidth,cell.letter,cell.wordId,icon,false));
      }
    }
  }

  loadingAnimation() {
    gsap.to(this.blocks, {
      rotationY: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: { amount: 0.6, from: "random" },
      onComplete: () => this.startAutoReveal()
    });
  }

  startAutoReveal() {
    const category = this.categories[this.catIndex];
    const question = category.title; // uppercase
    // choose up to 10 words
    const wordsToShow = shuffle(category.words)
      .slice(0, Math.min(category.words.length, 10));
    const wordIds = wordsToShow
      .map(w => WORDS.indexOf(w))
      .filter(id => id >= 0);

    // pick center-row blocks for question
    const rowDist = this.blockWidth + this.blockGap;
    const centerKey = Math.round((this.cssH/2)/rowDist);
    const rowsMap = {};
    this.blocks.forEach(b=>{
      const key = Math.round(b.y/rowDist);
      (rowsMap[key]||(rowsMap[key]=[])).push(b);
    });
    let rowBlocks = (rowsMap[centerKey]||[]).sort((a,b)=>a.x - b.x);

    // assign question letters to a contiguous window
    const L = question.length;
    const startIdx = Math.max(0, Math.floor((rowBlocks.length - L)/2));
    const qb = rowBlocks.slice(startIdx, startIdx + L);
    qb.forEach((b,i)=>{
      b.isQuestion = true;
      b.setLetter(question[i]);
      b.rotationY = 0;
      b.bubbleAlpha = 0;
    });

    // compute padded bbox
    const qxMin = Math.min(...qb.map(b=>b.x));
    const qxMax = Math.max(...qb.map(b=>b.x + b.width));
    const qyMin = Math.min(...qb.map(b=>b.y));
    const qyMax = Math.max(...qb.map(b=>b.y + b.height));
    const pad = this.blockWidth * 1.2;

    // select word blocks that don't overlap question region
    const bsAll = shuffle(this.blocks.filter(b=>wordIds.includes(b.wordId)));
    const bs = bsAll.filter(b=>{
      return (
        b.x + b.width < qxMin - pad ||
        b.x > qxMax + pad ||
        b.y + b.height < qyMin - pad ||
        b.y > qyMax + pad
      );
    });
    bs.forEach(b=>{
      b.isQuestion = false;
      b.rotationY = 0;
      b.bubbleAlpha = 0;
    });

    const tl = gsap.timeline({
      onComplete: () => {
        this.catIndex = (this.catIndex + 1) % this.categories.length;
        this.startAutoReveal();
      }
    });

    // 1) reveal question letters
    tl.to(qb, {
      rotationY: 180,
      bubbleAlpha: 1,
      duration: 0.8,
      ease: "power2.inOut",
      stagger: { amount: 0.4, from: 0 }
    }, 0);

    // 2) reveal words
    tl.to(bs, {
      rotationY: 180,
      bubbleAlpha: 1,
      duration: 0.8,
      ease: "power2.inOut",
      stagger: { amount: 0.8, from: 0 }
    }, 0.3);

    // hold
    tl.to({}, { duration: 1.5 });

    // hide words
    tl.to(bs, {
      rotationY: 0,
      bubbleAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
      stagger: { amount: 0.8, from: 0 }
    }, ">");

    // hide question
    tl.to(qb, {
      rotationY: 0,
      bubbleAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
      stagger: { amount: 0.4, from: 0 }
    }, "-=0.8");
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.blocks.forEach(b=>b.draw(this.ctx));
  }

  handleResize() { this.setup(); }
  destroy() {
    gsap.ticker.remove(this._draw);
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this._onResize);
    this.blocks = [];
  }
}
