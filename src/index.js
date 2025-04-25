import {Clock} from "./clock.js";
import { Marquee } from "./marquee.js";

import {reveal} from "./helpers/reveal.js";

const clock = new Clock(".hero_clock");

const marqueeElements = document.querySelectorAll("textmarquee");
marqueeElements.forEach((marqueeElement) => new Marquee(marqueeElement));
reveal();
