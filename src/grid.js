import gsap from "gsap";

// Single block in the grid
class Block {
  constructor(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;

    this.scale = 0;
    this.rotation = 0;

    this.centerX = x + width / 2;
    this.centerY = y + width / 2;

    this.quickToScale = gsap.quickTo(this, "scale", { duration: 0.3 });
    this.quickToRotation = gsap.quickTo(this, "rotation", { duration: 0.3 });
  }

  resize(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width;
  
    this.centerX = x + width / 2;
    this.centerY = y + width / 2;
  
    // Recreate quickTo accessors since scale/rotation have changed
    this.quickToScale = gsap.quickTo(this, "scale", { duration: 0.3 });
    this.quickToRotation = gsap.quickTo(this, "rotation", { duration: 0.3 });
  }

  handleMouse(mouseX, mouseY) {
    const relX = mouseX - this.centerX;
    const relY = mouseY - this.centerY;
    const maxDistance = 60;

    if (Math.abs(relX) <= maxDistance && Math.abs(relY) <= maxDistance) {
      this.quickToScale(0.1);
      this.quickToRotation(this.rotation + 45);
    } else {
      this.quickToScale(1);
      this.quickToRotation(0);
    }
  }

  draw(ctx, image) {
    ctx.save();
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.scale(this.scale, this.scale);
    ctx.drawImage(image, -this.width / 2, -this.height / 2, this.width, this.height);
    ctx.restore();
  }
}

export class Grid {
  constructor() {
    console.log("Grid constructor");
//added location of image
    this.sakuraImage = new Image();
    this.sakuraImage.src = "https://cdn.prod.website-files.com/6722c9846b76c67b67acccff/680ee87386b03978885bd842_Cherry%20Blossom.png"; // or adjust path as per final location
    this.sakuraImage.onload = () => {
      this.setup();
    };

    this.initResizeObserver();
  }

  setup() {
    this.canvas = document.querySelector(".hero_canvas");
    if (!this.canvas) {
      console.error("Canvas element not found");
      return;
    }
  
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * scale;
    this.canvas.height = this.canvas.offsetHeight * scale;
    this.ctx = this.canvas.getContext("2d");
    this.ctx.scale(scale, scale);
  
    // 🌸 Dynamic block size
    this.blockWidth = Math.max(20, Math.floor(this.canvas.width / scale / 50)); // Tweak divisor for density
    this.blockGap = 8;
    this.blocks = [];
  
    this.createBlocks();
    this.setupEvents();
    this.loadingAnimation();
  }

  initResizeObserver() {
    if (!this.canvas) {
      console.error("Canvas not available for ResizeObserver");
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });

    this.resizeObserver.observe(this.canvas);
  }

  createBlocks() {
    const blockCount =
      Math.floor(this.canvas.width / (this.blockWidth + this.blockGap)) + 1;
    const rowCount =
      Math.floor(this.canvas.height / (this.blockWidth + this.blockGap)) + 1;

    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < blockCount; col++) {
        const xPos = Math.floor(col * (this.blockWidth + this.blockGap));
        const yPos = Math.floor(row * (this.blockWidth + this.blockGap));
        this.blocks.push(new Block(xPos, yPos, this.blockWidth));
      }
    }
  }

  setupEvents() {
    this.mouseMoveHandler = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      this.blocks.forEach((block) => block.handleMouse(mouseX, mouseY));
    };

    this.mouseOutHandler = () => {
      this.blocks.forEach((block) => block.handleMouse(-100, -100));
    };

    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.addEventListener("mouseout", this.mouseOutHandler);

    gsap.ticker.add(() => this.draw());
  }

  loadingAnimation() {
    gsap.to(this.blocks, {
      scale: 1,
      rotation: 360,
      stagger: {
        amount: 1,
        from: "random",
      },
      ease: "power2.out",
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.blocks.forEach((block) => block.draw(this.ctx, this.sakuraImage)); // <-- pass the image
  }

  handleResize() {
    console.log("Resizing grid...");
  
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * scale;
    this.canvas.height = this.canvas.offsetHeight * scale;
    this.ctx.scale(scale, scale);
  
    this.blockWidth = Math.max(20, Math.floor(this.canvas.width / scale / 50));
    this.blockGap = 8;
  
    const blockCount =
      Math.floor(this.canvas.width / scale / (this.blockWidth + this.blockGap)) + 1;
    const rowCount =
      Math.floor(this.canvas.height / scale / (this.blockWidth + this.blockGap)) + 1;
  
    const newBlocks = [];
  
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < blockCount; col++) {
        const xPos = Math.floor(col * (this.blockWidth + this.blockGap));
        const yPos = Math.floor(row * (this.blockWidth + this.blockGap));
  
        const existingBlock = this.blocks[newBlocks.length];
        if (existingBlock) {
          existingBlock.resize(xPos, yPos, this.blockWidth);
          newBlocks.push(existingBlock);
        } else {
          newBlocks.push(new Block(xPos, yPos, this.blockWidth));
        }
      }
    }
  
    this.blocks = newBlocks;
  
    this.loadingAnimation();
    this.draw();
  }
  

  destroy() {
    console.log("Destroying Grid...");
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
    this.canvas.removeEventListener("mouseout", this.mouseOutHandler);
    gsap.ticker.remove(() => this.draw());
    this.blocks = [];
  }
}
