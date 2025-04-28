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

    this.sakuraImage = new Image();
    this.sakuraImage.src = "./assets/sakura.png"; // or adjust path as per final location
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

    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.blockWidth = 16;
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
    this.blocks.forEach((block) => block.draw(this.ctx, this.sakuraImage));
  }

  handleResize() {
    console.log("Resizing grid...");
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;

    this.blocks = [];
    this.createBlocks();

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
