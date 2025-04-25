export class Clock {
  constructor(selector) {
    this.element = document.querySelector(selector);
    if (!this.element) {
      throw new Error(`Element with selector "${selector}" not found.`);
    }
    this.updateTime(); // Initial update
    this.start(); // Start the clock
  }

  // Format the time to HH:MM:SS
  formatTime(date) {
    const pad = (num) => String(num).padStart(2, "0");
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${hours}:${minutes}:${seconds}`;
  }

  // Update the clock element with the current time
  updateTime() {
    const now = new Date();
    this.element.textContent = this.formatTime(now);
  }

  // Start the clock and update every second
  start() {
    this.interval = setInterval(() => this.updateTime(), 1000);
  }

  // Stop the clock
  stop() {
    clearInterval(this.interval);
  }
}
