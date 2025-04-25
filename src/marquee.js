import gsap from "gsap";

export class Marquee {
  constructor(rootElement) {
    console.log("Marquee initialized");
    this.marquee = rootElement;
    this.marqueeInner = this.marquee.querySelector(".marquee_inner");
    this.animation = null;

    this.updateDimensions();
    this.setup();
    this.animate();

    this.resizeObserver = new ResizeObserver(this.handleResize.bind(this));
    this.resizeObserver.observe(this.marquee);
  }

  updateDimensions() {
    this.marqueeInnerWidth = this.marqueeInner.offsetWidth;
    this.marqueeWidth = this.marquee.offsetWidth;
    this.gap = parseFloat(getComputedStyle(this.marquee).gap) || 0;
  }

  setup() {
    // Clear any existing clones
    const existingClones = this.marquee.querySelectorAll(
      ".marquee_inner:not(:first-child)"
    );
    existingClones.forEach((clone) => clone.remove());

    // Calculate how many copies we need to fill the container plus one extra
    // to ensure smooth infinite scrolling
    const numCopies = Math.ceil(this.marqueeWidth / this.marqueeInnerWidth) + 1;

    // Clean up old wrapper if it exists
    if (this.wrapper) {
      this.wrapper.remove();
    }

    // Create a wrapper for all marquee inners
    this.wrapper = document.createElement("div");
    this.wrapper.style.display = "flex";
    this.wrapper.style.gap = `${this.gap}px`;

    // Check if marqueeInner needs to be moved
    if (this.marqueeInner.parentNode !== this.wrapper) {
      this.marqueeInner.remove();
      this.wrapper.appendChild(this.marqueeInner);
    }

    // Add the necessary copies
    for (let i = 0; i < numCopies; i++) {
      const clone = this.marqueeInner.cloneNode(true);
      this.wrapper.appendChild(clone);
    }

    this.marquee.appendChild(this.wrapper);
  }

  animate() {
    // Calculate the total width of one item (including gap)
    const itemWidth = this.marqueeInnerWidth + this.gap;

    // Create the animation
    this.animation = gsap.to(this.wrapper, {
      x: -itemWidth,
      duration: 2,
      ease: "none",
      repeat: -1,
      onRepeat: () => {
        // Immediately reset position when animation repeats
        gsap.set(this.wrapper, { x: 0 });
        console.log("repeat");
      },
    });
  }

  handleResize() {
    // Update dimensions
    this.updateDimensions();

    // Kill existing animation
    if (this.animation) {
      this.animation.kill();
    }

    // Rebuild the marquee
    this.setup();
    this.animate();
  }
}
