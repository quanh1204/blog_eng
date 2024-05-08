"use strict";

/**
 * Add event listener on multiple elements
 */

const addEventOnElements = function (elements, eventType, callback) {
  for (let i = 0, len = elements.length; i < len; i++) {
    elements[i].addEventListener(eventType, callback);
  }
};

/**
 * MOBILE NAVBAR TOGGLER
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");

const toggleNav = () => {
  navbar.classList.toggle("active");
  document.body.classList.toggle("nav-active");
};

addEventOnElements(navTogglers, "click", toggleNav);

/**
 * HEADER ANIMATION
 * When scrolled donw to 100px header will be active
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**
 * SLIDER
 */

const slider = document.querySelector("[data-slider]");
const sliderContainer = document.querySelector("[data-slider-container]");
const sliderPrevBtn = document.querySelector("[data-slider-prev]");
const sliderNextBtn = document.querySelector("[data-slider-next]");

let totalSliderVisibleItems = Number(
  getComputedStyle(slider).getPropertyValue("--slider-items")
);
let totalSlidableItems =
  sliderContainer.childElementCount - totalSliderVisibleItems;

let currentSlidePos = 0;

const moveSliderItem = function () {
  sliderContainer.style.transform = `translateX(-${sliderContainer.children[currentSlidePos].offsetLeft}px)`;
};

/**
 * NEXT SLIDE
 */

const slideNext = function () {
  const slideEnd = currentSlidePos >= totalSlidableItems;

  if (slideEnd) {
    currentSlidePos = 0;
  } else {
    currentSlidePos++;
  }

  moveSliderItem();
};

sliderNextBtn.addEventListener("click", slideNext);

/**
 * PREVIOUS SLIDE
 */

const slidePrev = function () {
  if (currentSlidePos <= 0) {
    currentSlidePos = totalSlidableItems;
  } else {
    currentSlidePos--;
  }

  moveSliderItem();
};

sliderPrevBtn.addEventListener("click", slidePrev);

/**
 * RESPONSIVE
 */
window.addEventListener("resize", function () {
  totalSliderVisibleItems = Number(
    getComputedStyle(slider).getPropertyValue("--slider-items")
  );
  totalSlidableItems =
    sliderContainer.childElementCount - totalSliderVisibleItems;

  moveSliderItem();
});
var w = (c.width = window.innerWidth),
  h = (c.height = window.innerHeight),
  ctx = c.getContext("2d"),
  minDist = 10,
  maxDist = 30,
  initialWidth = 10,
  maxLines = 100,
  initialLines = 4,
  speed = 5,
  lines = [],
  frame = 0,
  timeSinceLast = 0,
  dirs = [
    // straight x, y velocity
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    // diagonals, 0.7 = sin(PI/4) = cos(PI/4)
    [0.7, 0.7],
    [0.7, -0.7],
    [-0.7, 0.7],
    [-0.7, -0.7],
  ],
  starter = {
    // starting parent line, just a pseudo line

    x: w / 2,
    y: h / 2,
    vx: 0,
    vy: 0,
    width: initialWidth,
  };

function init() {
  lines.length = 0;

  for (var i = 0; i < initialLines; ++i) lines.push(new Line(starter));

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, w, h);

  // if you want a cookie ;)
  // ctx.lineCap = 'round';
}
function getColor(x) {
  return "hsl( hue, 80%, 50% )".replace("hue", (x / w) * 360 + frame);
}
function anim() {
  window.requestAnimationFrame(anim);

  ++frame;

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0,0,0,.02)";
  ctx.fillRect(0, 0, w, h);
  ctx.shadowBlur = 0.5;

  for (var i = 0; i < lines.length; ++i)
    if (lines[i].step()) {
      // if true it's dead

      lines.splice(i, 1);
      --i;
    }

  // spawn new

  ++timeSinceLast;

  if (lines.length < maxLines && timeSinceLast > 10 && Math.random() < 0.5) {
    timeSinceLast = 0;

    lines.push(new Line(starter));

    // cover the middle;
    ctx.fillStyle = ctx.shadowColor = getColor(starter.x);
    ctx.beginPath();
    ctx.arc(starter.x, starter.y, initialWidth, 0, Math.PI * 2);
    ctx.fill();
  }
}

function Line(parent) {
  this.x = parent.x | 0;
  this.y = parent.y | 0;
  this.width = parent.width / 1.25;

  do {
    var dir = dirs[(Math.random() * dirs.length) | 0];
    this.vx = dir[0];
    this.vy = dir[1];
  } while (
    (this.vx === -parent.vx && this.vy === -parent.vy) ||
    (this.vx === parent.vx && this.vy === parent.vy)
  );

  this.vx *= speed;
  this.vy *= speed;

  this.dist = Math.random() * (maxDist - minDist) + minDist;
}
Line.prototype.step = function () {
  var dead = false;

  var prevX = this.x,
    prevY = this.y;

  this.x += this.vx;
  this.y += this.vy;

  --this.dist;

  // kill if out of screen
  if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) dead = true;

  // make children :D
  if (this.dist <= 0 && this.width > 1) {
    // keep yo self, sometimes
    this.dist = Math.random() * (maxDist - minDist) + minDist;

    // add 2 children
    if (lines.length < maxLines) lines.push(new Line(this));
    if (lines.length < maxLines && Math.random() < 0.5)
      lines.push(new Line(this));

    // kill the poor thing
    if (Math.random() < 0.2) dead = true;
  }

  ctx.strokeStyle = ctx.shadowColor = getColor(this.x);
  ctx.beginPath();
  ctx.lineWidth = this.width;
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(prevX, prevY);
  ctx.stroke();

  if (dead) return true;
};

init();
anim();

window.addEventListener("resize", function () {
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  starter.x = w / 2;
  starter.y = h / 2;

  init();
  console.log(process.env.API_KEY);
});
