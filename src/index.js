import { Clock } from "./clock";
import { Marquee } from "./marquee";

import { reveal } from "./helpers/reveal";

const clock = new Clock(".hero_clock");

const marqueeElements = document.querySelectorAll(".textmarquee");
marqueeElements.forEach(
  (marqueeElement, index) => new Marquee(marqueeElement, index + 1 * 20)
);
reveal();
