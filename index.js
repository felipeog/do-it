/* ========================================
   State
======================================== */

const state = {
  current: { x: 0, y: 0 },
  target: { x: 0, y: 0 },
};

/* ========================================
   Elements
======================================== */

const container = document.querySelector(".container");
const text = document.querySelector(".text");

/* ========================================
   Functions
======================================== */

function getTextShadowValue(xPercentage, yPercentage) {
  const shadowAmount = 50;
  const maxVw = 2;

  let result = "";

  for (let index = 0; index < shadowAmount; index++) {
    const isLast = index === shadowAmount - 1;

    const percentage = (index + 1) / shadowAmount;
    const xValue = maxVw * percentage * (xPercentage * -1);
    const yValue = maxVw * percentage * yPercentage;

    result +=
      `${xValue}vw ` +
      `${yValue}vw ` +
      `var(--foreground-color)${isLast ? "" : ","}`;
  }

  return result;
}

function getTransformValue(xPercentage, yPercentage) {
  const maxDegrees = 20;
  const rotateXValue = yPercentage * maxDegrees;
  const rotateYValue = xPercentage * maxDegrees;

  return `rotateX(${rotateXValue}deg) rotateY(${rotateYValue}deg)`;
}

function getPositionWithInertia(current, target) {
  const distance = target - current;

  if (Math.abs(distance) < 0.01) {
    return target;
  }

  return current + distance * 0.1;
}

function updateTarget(event) {
  state.target.x = event.x;
  state.target.y = event.y;
}

/* ========================================
   Rendering
======================================== */

function render() {
  if (
    state.current.x !== state.target.x ||
    state.current.y !== state.target.y
  ) {
    const x = getPositionWithInertia(state.current.x, state.target.x);
    const y = getPositionWithInertia(state.current.y, state.target.y);

    const halfWidth = window.innerWidth * 0.5;
    const halfHeight = window.innerHeight * 0.5;

    // left is negative, right is posivite
    const xPercentage = (x - halfWidth) / halfWidth;
    // bottom is negative, top is posivite
    const yPercentage = ((y - halfHeight) / halfHeight) * -1;

    // update dom
    container.style.transform = getTransformValue(xPercentage, yPercentage);
    text.style.textShadow = getTextShadowValue(xPercentage, yPercentage);

    // update state
    state.current.x = x;
    state.current.y = y;
  }

  // render loop
  requestAnimationFrame(render);
}

/* ========================================
   Handlers
======================================== */

function handleMouseMove(event) {
  updateTarget(event);
}

function handleLoad(event) {
  render();
}

/* ========================================
   Events
======================================== */

window.addEventListener("mousemove", handleMouseMove);
window.addEventListener("load", handleLoad);
