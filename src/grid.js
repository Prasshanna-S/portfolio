import gsap from "gsap";

// ✨ Extended keyword set for UX/Product Design
const WORDS = [
  "Accessibility", "Prototyping", "Typography", "Interaction",
  "UsabilityTest", "Information", "Wireframing", "Storytelling",
  "UserJourney", "VisualDesign", "EmpathyDriven", "DesignSystem",
  "SystemThinking", "BehaviorModel", "ExperienceMap", "HumanFactors",
  "CognitiveLoad", "Microinteractions", "NavigationFlow", "DesignResearch"
];

class Block {
  constructor(x, y, width, letter = "", wordId = null) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;
    this.centerX = x + width / 2;
    this.centerY = y + width / 2;
    this.letter = letter;
    this.wordId = wordId;

    this.scale = 0;
    this.rotation = 0;
    this.shouldHide = false;
    this.revealed = false;
    this.bubbleAlpha = 0;
    this.letterAlpha = 0; // ✨ Added to animate text fade-in separately

    this.quickToScale = gsap.quickTo(this, "scale", { duration: 0.3 });
    this.quickToRotation = gsap.quickTo(this, "rotation", { duration: 0.3 });
  }

  setReveal(state) {
    this.revealed = state;
    gsap.to(this, {
      bubbleAlpha: state ? 1 : 0,
      duration: 0.3,
      ease: "power2.out"
    });
  }

  draw(ctx, image) {
    // ✨ Draw background bubble if revealed
    if (this.revealed && this.letter) {
      ctx.save();
      ctx.globalAlpha = this.bubbleAlpha;
      ctx.fillStyle = "rgba(137, 196, 244, 0.15)";
      ctx.strokeStyle = "rgba(137, 196, 244, 0.4)";
      ctx.lineWidth = 1;
      const radius = 6;
      ctx.beginPath();
      ctx.moveTo(this.x + radius, this.y);
      ctx.lineTo(this.x + this.width - radius, this.y);
      ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
      ctx.lineTo(this.x + this.width, this.y + this.height - radius);
      ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
      ctx.lineTo(this.x + radius, this.y + this.height);
      ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
      ctx.lineTo(this.x, this.y + radius);
      ctx.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // ✨ Draw the text with animated opacity
    ctx.save();
    ctx.globalAlpha = this.letterAlpha;
    ctx.font = `${this.width * 0.5}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000";
    ctx.fillText(this.letter || "•", this.centerX, this.centerY);
    ctx.restore();

    // ✨ Draw sakura petals if not hidden
    if (!this.shouldHide) {
      ctx.save();
      ctx.translate(this.centerX, this.centerY);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.scale(this.scale, this.scale);
      ctx.drawImage(image, -this.width / 2, -this.height / 2, this.width, this.height);
      ctx.restore();
    }
  }
}

export class Grid {
  constructor() {
    this.blocks = [];
    this.wordTimelineMap = new Map();
    this.autoRevealTimeline = null;
    this.hoveredWordIds = new Set();
    this.maxHoverWords = 4;
    this.userInteracted = false;
    this.loadingDone = false;

    this.sakuraImage = new Image();
    this.sakuraImage.src = "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/680ee87386b03978885bd842_Cherry%20Blossom.png";
    this.sakuraImage.onload = () => this.setup();

    this.initResizeObserver();
    window.addEventListener("resize", () => this.handleResize());
  }

  setup() {
    this.canvas = document.querySelector(".hero_canvas");
    if (!this.canvas) return;

    const scale = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * scale;
    this.canvas.height = this.canvas.offsetHeight * scale;
    this.ctx = this.canvas.getContext("2d");
    if (!this.ctx) return;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(scale, scale);

    this.blockWidth = Math.max(20, Math.floor(this.canvas.width / scale / 50));
    this.blockGap = 0;
    this.blocks = [];

    this.createBlocks();
    this.setupEvents();
    this.loadingAnimation();
  }

  initResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.canvas) this.handleResize();
    });

    requestAnimationFrame(() => {
      const canvas = document.querySelector(".hero_canvas");
      if (canvas) {
        this.canvas = canvas;
        this.resizeObserver.observe(canvas);
      }
    });
  }

  createBlocks() {
    const cols = Math.floor(this.canvas.offsetWidth / (this.blockWidth + this.blockGap));
    const rows = Math.floor(this.canvas.offsetHeight / (this.blockWidth + this.blockGap));
    const grid = Array.from({ length: rows }, () => Array(cols).fill(null));

    let wordId = 0;

    for (let r = 0; r < rows; r++) {
      let c = Math.floor(Math.random() * 4);
      while (c < cols) {
        const word = WORDS[wordId % WORDS.length].toUpperCase();
        const spaceNeeded = word.length + 1;
        if (c + spaceNeeded > cols) break;

        for (let i = 0; i < word.length; i++) {
          grid[r][c + i] = { letter: word[i], wordId };
        }
        c += word.length;

        grid[r][c] = { letter: "", wordId: null };
        c++;
        wordId++;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const { letter, wordId } = grid[r][c] || { letter: "", wordId: null };
        const x = c * (this.blockWidth + this.blockGap);
        const y = r * (this.blockWidth + this.blockGap);
        const block = new Block(x, y, this.blockWidth, letter, wordId);
        this.blocks.push(block);
      }
    }
  }

  setupEvents() {
    this.mouseMoveHandler = (e) => {
      this.userInteracted = true;
      if (this.autoRevealTimeline) this.autoRevealTimeline.kill();

      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const block = this.blocks.find(
        (b) =>
          mouseX >= b.x &&
          mouseX <= b.x + b.width &&
          mouseY >= b.y &&
          mouseY <= b.y + b.height
      );

      if (block && block.wordId !== null) {
        this.revealWord(block.wordId, true);
      }
    };

    this.mouseOutHandler = () => {
      this.userInteracted = false;
      this.resetAllBlocks(() => {
        if (!this.userInteracted) this.startAutoReveal();
      });
    };

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseout", this.mouseOutHandler);
    gsap.ticker.add(() => this.draw());
  }

  loadingAnimation() {
    console.log("🌀 Starting preloading stage...");

    // 1) Make sakuras hidden and letters invisible
    this.blocks.forEach((block) => {
        block.shouldHide = true;
        block.setReveal(false);  // ❗ don't reveal yet
        block.scale = 0;
        block.rotation = 0;
        block.letterAlpha = 0; // start invisible
      });

    // 2) Animate letter opacity first
    gsap.to(this.blocks, {
        letterAlpha: 1,
        stagger: { amount: 1, from: "random" },
        duration: 0.8,
        ease: "power1.inOut",
        onComplete: () => {
          console.log("🌸 Starting sakura loading animation...");
      
          gsap.fromTo(this.blocks, { bubbleAlpha: 0.2 }, {
            bubbleAlpha: 1,
            duration: 0.6,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
            onStart: () => {
              this.blocks.forEach((block) => {
                block.setReveal(true); // ✅ only now start reveal
              });
            },
            onComplete: () => {
              gsap.to(this.blocks, {
                scale: 1,
                rotation: 360,
                stagger: { amount: 2, from: "random" },
                ease: "back.out(1.7)",
                duration: 1.4,
                onStart: () => {
                  this.blocks.forEach((block) => {
                    block.shouldHide = false;
                  });
                },
                onComplete: () => {
                  this.blocks.forEach((block) => {
                    block.quickToScale = gsap.quickTo(block, "scale", { duration: 0.3 });
                    block.quickToRotation = gsap.quickTo(block, "rotation", { duration: 0.3 });
                  });
                  this.loadingDone = true;
                  console.log("🎯 Loading animation complete");
                  this.startAutoReveal();
                },
              });
            }
          });
        }
      });
      
  }
  

  revealWord(wordId, fromHover = false) {
    if (this.wordTimelineMap.has(wordId)) return;

    const blocks = this.blocks
      .filter(b => b.wordId === wordId && b.wordId !== null)
      .sort((a, b) => a.x - b.x);

    if (fromHover && this.hoveredWordIds.size >= this.maxHoverWords) {
      const first = this.hoveredWordIds.values().next().value;
      this.hoveredWordIds.delete(first);
      this.hideWord(first, true);
    }

    if (fromHover) this.hoveredWordIds.add(wordId);

    const tl = gsap.timeline({ onComplete: () => this.wordTimelineMap.delete(wordId) });

    blocks.forEach((block, i) => {
      tl.to(block, {
        scale: 0.1,
        rotation: block.rotation + 45,
        duration: 0.3,
        delay: i * 0.05,
        ease: "power2.out",
        onStart: () => {
          block.shouldHide = true;
          block.setReveal(true);
        }
      }, 0);
    });

    if (!fromHover) {
      tl.to({}, { duration: 1.5 });
      tl.add(() => this.hideWord(wordId), "+=0.2");
    }

    this.wordTimelineMap.set(wordId, tl);
  }

  hideWord(wordId, fast = false) {
    const blocks = this.blocks
      .filter(b => b.wordId === wordId && b.wordId !== null)
      .sort((a, b) => a.x - b.x);

    blocks.forEach((block, i) => {
      gsap.to(block, {
        scale: 1,
        rotation: 0,
        duration: fast ? 0.2 : 0.3,
        delay: i * 0.04,
        ease: "power1.out",
        onStart: () => {
            block.revealed = false;
            block.shouldHide = false;
            block.setReveal(false);
        }
      });
    });

    this.wordTimelineMap.delete(wordId);
  }

  startAutoReveal() {
    const allWordIds = [...new Set(this.blocks.map(b => b.wordId).filter(Boolean))];

    const loop = () => {
      if (this.userInteracted) return;

      const wordSet = [...allWordIds].sort(() => 0.5 - Math.random()).slice(0, 6);
      let tl = gsap.timeline();

      this.resetAllBlocks(() => {
        wordSet.forEach((id, i) => {
          tl.add(() => this.revealWord(id), i * 0.2);
        });

        tl.to({}, { duration: 1.5 });
        wordSet.forEach((id, i) => {
          tl.add(() => this.hideWord(id), i * 0.2);
        });

        tl.call(() => {
          if (!this.userInteracted) loop();
        });

        this.autoRevealTimeline = tl;
      });
    };

    loop();
  }

  resetAllBlocks(callback) {
    // First immediately clean up everything
    this.blocks.forEach((block) => {
      block.shouldHide = false;
      block.setReveal(false);
      block.revealed = false;
    });
  
    // Then properly hide animated words
    const activeWordIds = new Set(this.blocks.map(b => b.wordId).filter(id => id !== null));
    activeWordIds.forEach((id) => this.hideWord(id, true));
  
    gsap.delayedCall(0.3, callback);
  }

  handleResize() {
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * scale;
    this.canvas.height = this.canvas.offsetHeight * scale;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(scale, scale);

    this.blockWidth = Math.max(20, Math.floor(this.canvas.width / scale / 50));
    this.blockGap = 0;
    this.blocks = [];

    this.createBlocks();
    this.loadingAnimation();
    this.draw();
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.blocks.forEach((block) => block.draw(this.ctx, this.sakuraImage));
  }

  destroy() {
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseout", this.mouseOutHandler);
    gsap.ticker.remove(() => this.draw());
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.autoRevealTimeline) this.autoRevealTimeline.kill();
    this.blocks = [];
  }
}