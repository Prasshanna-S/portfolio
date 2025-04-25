(() => {
  // src/clock.js
  var Clock = class {
    constructor(selector) {
      this.element = document.querySelector(selector);
      if (!this.element) {
        throw new Error(`Element with selector "${selector}" not found.`);
      }
      this.updateTime();
      this.start();
    }
    formatTime(date) {
      const pad = (num) => String(num).padStart(2, "0");
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      const seconds = pad(date.getSeconds());
      return `${hours}:${minutes}:${seconds}`;
    }
    updateTime() {
      const now = /* @__PURE__ */ new Date();
      this.element.textContent = this.formatTime(now);
    }
    start() {
      this.interval = setInterval(() => this.updateTime(), 1e3);
    }
    stop() {
      clearInterval(this.interval);
    }
  };

  // src/marquee.js
  var Marquee = class {
    constructor(rootElement) {
      console.log("Marquee initialized");
      this.marquee = rootElement;
      this.marqueeInner = this.marquee.querySelector(".marquee_inner");
      this.marqueeInnerWidth = this.marqueeInner.offsetWidth;
      this.marqueeWidth = this.marquee.offsetWidth;
      this.gap = parseFloat(getComputedStyle(this.marquee).gap) || 0;
    }
    setup() {
      const existingClones = this.marquee.querySelectorAll(
        ".marquee_inner:not(:first-child)"
      );
      existingClones.forEach((clone) => clone.remove());
      const numCopies = Math.ceil(this.marqueeWidth / this.marqueeInnerWidth) + 1;
      this.wrapper = document.createElement("div");
      this.wrapper.style.display = "flex";
      this.wrapper.style.gap = `${this.gap}px`;
      this.marqueeInner.remove();
      this.wrapper.appendChild(this.marqueeInner);
      for (let i = 0; i < numCopies; i++) {
        const clone = this.marqueeInner.cloneNode(true);
        this.wrapper.appendChild(clone);
      }
      this.marquee.appendChild(this.wrapper);
    }
    animate() {
    }
  };

  // src/helpers/reveal.js
  function reveal() {
    const startHiddenAttributeName = "start-hidden";
    const elements = document.querySelectorAll(`[${startHiddenAttributeName}]`);
    elements.forEach((element) => {
      element.removeAttribute(startHiddenAttributeName);
    });
  }

  // src/index.js
  var clock = new Clock(".hero_clock");
  var marqueeElements = document.querySelectorAll("textmarquee");
  marqueeElements.forEach((marqueeElement) => new Marquee(marqueeElement));
  reveal();
})();
