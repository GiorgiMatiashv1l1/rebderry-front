let current = 0;
const total = 3;
const slidesEl = document.getElementById('slides');
const dotsEl = document.getElementById('dots').children;

function goTo(n) {
  current = (n + total) % total;
  slidesEl.style.transform = `translateX(-${current * 100}%)`;
  Array.from(dotsEl).forEach((d, i) => d.classList.toggle('active', i === current));
}
function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

setInterval(() => next(), 15000);