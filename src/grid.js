import gsap from "gsap";

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
    this.rotationY = 0;


    this.scale = 0;
    this.rotation = 0;
    this.shouldHide = false;
    this.revealed = false;
    this.bubbleAlpha = 0;
    this.letterAlpha = 0;
    this.bubbleColor = "rgba(255,255,255,0.8)";
    this.bubbleStrokeColor = "#ccc";

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

  draw(ctx) {
    const radians = (this.rotationY * Math.PI) / 180;
    const cos = Math.cos(radians);
    const scaleX = cos;
  
    // The text should be on the front, icon on the back
    const isTextSide = this.rotationY < 90;
  
    if (Math.abs(scaleX) < 0.01) return;
  
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.scale(scaleX, 1);
  
    const w = this.width;
    const h = this.height;
    const radius = 6;
  
    if (!isTextSide && scaleX < 0) ctx.scale(-1, 1); // correct flipped icons
  
    if (isTextSide) {
      // 💬 Text Side
      ctx.globalAlpha = this.bubbleAlpha;
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "#888";
      ctx.lineWidth = 1;
  
      ctx.beginPath();
      ctx.moveTo(-w / 2 + radius, -h / 2);
      ctx.lineTo(w / 2 - radius, -h / 2);
      ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
      ctx.lineTo(w / 2, h / 2 - radius);
      ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
      ctx.lineTo(-w / 2 + radius, h / 2);
      ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
      ctx.lineTo(-w / 2, -h / 2 + radius);
      ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
  
      ctx.font = `${this.width * 0.55}px 'Satoshi', sans-serif`;
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.letter || "•", 0, 0);
    } else {
      // 🖼️ Icon Side
      if (!this.shouldHide && this.iconImage) {
        const bgSize = this.width * 0.9;
        const iconSize = this.width * 0.6;
        const cornerRadius = 4;
  
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.moveTo(-bgSize / 2 + cornerRadius, -bgSize / 2);
        ctx.lineTo(bgSize / 2 - cornerRadius, -bgSize / 2);
        ctx.quadraticCurveTo(bgSize / 2, -bgSize / 2, bgSize / 2, -bgSize / 2 + cornerRadius);
        ctx.lineTo(bgSize / 2, bgSize / 2 - cornerRadius);
        ctx.quadraticCurveTo(bgSize / 2, bgSize / 2, bgSize / 2 - cornerRadius, bgSize / 2);
        ctx.lineTo(-bgSize / 2 + cornerRadius, bgSize / 2);
        ctx.quadraticCurveTo(-bgSize / 2, bgSize / 2, -bgSize / 2, bgSize / 2 - cornerRadius);
        ctx.lineTo(-bgSize / 2, -bgSize / 2 + cornerRadius);
        ctx.quadraticCurveTo(-bgSize / 2, -bgSize / 2, -bgSize / 2 + cornerRadius, -bgSize / 2);
        ctx.closePath();
        ctx.fill();
  
        ctx.drawImage(this.iconImage, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
      }
    }
  
    ctx.restore();
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

    this.iconURLs = [
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
    
    this.loadedIcons = [];
    this.iconReady = false;
    this.loadIcons();

    this.initResizeObserver();
    window.addEventListener("resize", () => this.handleResize());
  }

  loadIcons() {
    let loadedCount = 0;
    this.iconURLs.forEach((url, index) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        this.loadedIcons[index] = img;
        loadedCount++;
        if (loadedCount === this.iconURLs.length) {
          this.iconReady = true;
          this.setup(); // Start setup after icons are ready
        }
      };
    });
    window.gridInstance = this;

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
    const maxAttempts = 1000;
    let attempts = 0;
  
    while (wordId < WORDS.length && attempts < maxAttempts) {
      const word = WORDS[wordId % WORDS.length].toUpperCase();
      const direction = Math.random() < 0.5 ? "horizontal" : "vertical";
      const wordLength = word.length;
  
      let startRow, startCol;
  
      if (direction === "horizontal") {
        startRow = Math.floor(Math.random() * rows);
        startCol = Math.floor(Math.random() * (cols - wordLength + 1));
      } else {
        startRow = Math.floor(Math.random() * (rows - wordLength + 1));
        startCol = Math.floor(Math.random() * cols);
      }
  
      let canPlace = true;
      for (let i = 0; i < wordLength; i++) {
        const r = direction === "horizontal" ? startRow : startRow + i;
        const c = direction === "horizontal" ? startCol + i : startCol;
        const cell = grid[r][c];
        if (cell && cell.letter !== word[i]) {
          canPlace = false;
          break;
        }
      }
  
      if (canPlace) {
        for (let i = 0; i < wordLength; i++) {
          const r = direction === "horizontal" ? startRow : startRow + i;
          const c = direction === "horizontal" ? startCol + i : startCol;
          grid[r][c] = { letter: word[i], wordId };
        }
        wordId++;
      }
  
      attempts++;
    }
  
    // Fill empty cells with random letters
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === null) {
          const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
          grid[r][c] = { letter: randomLetter, wordId: null };
        }
      }
    }
  
    // Create blocks with unique icon assignments
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const { letter, wordId } = grid[r][c];
        const x = c * (this.blockWidth + this.blockGap);
        const y = r * (this.blockWidth + this.blockGap);
  
        // Avoid same icon in 8 directions
        const neighbors = [
          grid[r - 1]?.[c], grid[r + 1]?.[c], grid[r]?.[c - 1], grid[r]?.[c + 1],
          grid[r - 1]?.[c - 1], grid[r - 1]?.[c + 1], grid[r + 1]?.[c - 1], grid[r + 1]?.[c + 1]
        ];
        const usedIcons = neighbors.map(n => n?.iconIndex).filter(i => i !== undefined);
  
        let iconIndex;
        do {
          iconIndex = Math.floor(Math.random() * this.loadedIcons.length);
        } while (usedIcons.includes(iconIndex) && usedIcons.length < this.loadedIcons.length);
  
        grid[r][c].iconIndex = iconIndex;
  
        const block = new Block(x, y, this.blockWidth, letter, wordId);
        block.iconIndex = iconIndex;
        block.iconImage = this.loadedIcons[iconIndex]; // ✅ Assign image directly here
  
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
      this.cancelHoverAnimations();
      this.resetAllBlocks(() => {
        if (!this.userInteracted) this.startAutoReveal();
      });
    };

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseout", this.mouseOutHandler);
    gsap.ticker.add(() => this.draw());
  }

  cancelHoverAnimations() {
    this.blocks.forEach((block) => {
      if (block.revealed && block.shouldHide) {
        gsap.to(block, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
          onStart: () => {
            block.shouldHide = false;
            block.setReveal(false);
            block.revealed = false;
          }
        });
      }
    });
  }

  loadingAnimation() {
    console.log("🌀 Starting preloading stage...");
    
    // Step 1: Hide sakuras and reveal glows
    this.blocks.forEach((block) => {
      block.rotationY = 0;
      block.setReveal(false);
      block.shouldHide = false;
    });

  
    // Step 2: Glow animation (subtle pulse)
    gsap.fromTo(this.blocks, 
      { bubbleAlpha: 0.2 },
      {
        bubbleAlpha: 1,
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
        onComplete: () => {
          console.log("🌸 Starting sakura loading animation...");
  
          // Step 3: Sakura animation with random bloom
          gsap.to(this.blocks, {
            rotationY: 180,
            stagger: { amount: 2, from: "random" },
            ease: "power2.out",
            duration: 1.2,
            onUpdate: () => {
              this.blocks.forEach((block) => {
if (block.rotationY < 90) block.setReveal(true);
              });
            },
            onComplete: () => {
              this.blocks.forEach((block) => {
                block.quickToRotation = gsap.quickTo(block, "rotation", { duration: 0.3 });
              });
              this.loadingDone = true;
              this.startAutoReveal();
            }
          });
        }
      }
    );
  }
  

  revealWord(wordId, fromHover = false) {
    if (this.wordTimelineMap.has(wordId)) return;

    const blocks = this.blocks.filter(b => b.wordId === wordId && b.wordId !== null);

    if (fromHover && this.hoveredWordIds.size >= this.maxHoverWords) {
      const first = this.hoveredWordIds.values().next().value;
      this.hoveredWordIds.delete(first);
      this.hideWord(first, true);
    }

    if (fromHover) this.hoveredWordIds.add(wordId);

    const tl = gsap.timeline({ onComplete: () => this.wordTimelineMap.delete(wordId) });

    blocks.forEach((block, i) => {
      tl.to(block, {
        rotationY: 180,
        ease: "power2.inOut",
        duration: 0.6,
        delay: i * 0.05,
        onUpdate: () => {
          if (block.rotationY >= 90) block.setReveal(true);
        }      }, 0);
    });

    if (!fromHover) {
      tl.to({}, { duration: 1.5 });
      tl.add(() => this.hideWord(wordId), "+=0.2");
    }

    this.wordTimelineMap.set(wordId, tl);
  }

  hideWord(wordId, fast = false) {
    const blocks = this.blocks.filter(b => b.wordId === wordId && b.wordId !== null);

    blocks.forEach((block, i) => {
      gsap.to(block, {
        rotationY: 0,
        ease: "power2.inOut",
        duration: fast ? 0.3 : 0.6,
        delay: i * 0.04,
        onStart: () => block.setReveal(false)
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
    };

    loop();
  }

  resetAllBlocks(callback) {
    let tl = gsap.timeline();
    this.blocks.forEach((block, i) => {
      if (block.revealed || block.shouldHide) {
        tl.to(block, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
          onStart: () => {
            block.shouldHide = false;
            block.setReveal(false);
          }
        }, i * 0.003);
      }
    });

    tl.call(() => {
      this.wordTimelineMap.clear();
      if (callback) callback();
    });
  }

  healBrokenBlocks() {
    this.blocks.forEach((block) => {
      if (block.revealed && !block.shouldHide) {
        if (Math.abs(block.scale - 1) > 0.01 || Math.abs(block.rotation) > 1) {
          gsap.to(block, {
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
            onStart: () => {
              block.shouldHide = false;
              block.setReveal(false);
            }
          });
        }
      }
    });
  }

  draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.blocks.forEach((block) => block.draw(this.ctx));
    this.healBrokenBlocks();
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
