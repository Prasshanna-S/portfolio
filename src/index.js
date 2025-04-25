import {Clock} from "./clock";
import { Marquee } from "./marquee";

import {reveal} from "./helpers/reveal";

const clock = new Clock(".hero_clock");

const marqueeElements = document.querySelectorAll("textmarquee");
marqueeElements.forEach((marqueeElement) => new Marquee(marqueeElement));
reveal();