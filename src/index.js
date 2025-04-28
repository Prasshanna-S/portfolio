import { Clock } from "./clock";
import { Marquee } from "./marquee";
import { Grid } from "./grid";

import { reveal } from "./helpers/reveal";

const clock = new Clock(".hero_clock");

const marqueeElements = document.querySelectorAll(".marquee");
marqueeElements.forEach(
  (marqueeElement, index) => new Marquee(marqueeElement, index + 1 * 20)
);
const grid = new Grid();
reveal();