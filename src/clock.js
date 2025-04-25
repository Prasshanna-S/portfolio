export class Clock {
    constructor(selector){
        this.element = document.querySelector(selector);
        if(!this.element){
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
        const now = new Date();
        this.element.textContent = this.formatTime(now);
    }

    start() {
        this.interval = setInterval(() => this.updateTime(), 1000);
    }

    stop() {
        clearInterval(this.interval);
    }
}
