// import gsap from "gsap"

export class Marquee {
    constructor(rootElement){
        console.log("Marquee initialized")
        this.marquee = rootElement;
        this.marqueeInner = this.marquee.querySelector(".marquee_inner");
        this.marqueeInnerWidth = this.marqueeInner.offsetWidth;
        this.marqueeWidth = this.marquee.offsetWidth;
        this.gap = parseFloat(getComputedStyle(this.marquee).gap) || 0;
    }

    setup(){
        // checking clones
        const existingClones = this.marquee.querySelectorAll(
            ".marquee_inner:not(:first-child)"
        );
        existingClones.forEach((clone) => clone.remove());

        // Calculating how many copies are needed to fill the container plus the extra one to ensure infinite scrolling is possible
        const numCopies = Math.ceil(this.marqueeWidth / this.marqueeInnerWidth) + 1;

        // creating wrapper for the copies
        this.wrapper = document.createElement("div");
        this.wrapper.style.display = "flex";
        this.wrapper.style.gap = `${this.gap}px`;

        //moving marquee inner into the wrapper
        this.marqueeInner.remove();
        this.wrapper.appendChild(this.marqueeInner);

        //add the necessary copies
        for (let i=0; i< numCopies; i++) {
            const clone = this.marqueeInner.cloneNode(true);
            this.wrapper.appendChild(clone);
        }

        this.marquee.appendChild(this.wrapper);
    }

    animate() {

    }
}