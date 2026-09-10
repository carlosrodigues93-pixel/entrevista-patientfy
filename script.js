(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const track = document.querySelector('.track');
  const previous = document.querySelector('.nav-prev');
  const next = document.querySelector('.nav-next');
  const counter = document.querySelector('.slide-counter b');
  const progress = document.querySelector('.progress-track');
  const progressBar = progress.querySelector('i');
  const slideName = document.querySelector('.slide-name');
  let current = 0;
  let wheelLocked = false;
  let touchStartX = 0;
  let touchStartY = 0;

  function goTo(index, updateHash = true) {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    slides[current].classList.remove('is-active');
    current = target;
    track.style.transform = `translate3d(-${current * 100}vw, 0, 0)`;
    slides[current].classList.add('is-active');

    const humanIndex = current + 1;
    counter.textContent = String(humanIndex).padStart(2, '0');
    progressBar.style.width = `${(humanIndex / slides.length) * 100}%`;
    progress.setAttribute('aria-valuenow', humanIndex);
    slideName.textContent = slides[current].dataset.title.toUpperCase();
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    document.title = `${slides[current].dataset.title} — Carlos Daniel × Patientfy.ai`;
    if (updateHash) history.replaceState(null, '', `#slide-${humanIndex}`);
  }

  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));

  window.addEventListener('keydown', (event) => {
    if (['ArrowRight', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); goTo(current + 1); }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) { event.preventDefault(); goTo(current - 1); }
    if (event.key === 'Home') goTo(0);
    if (event.key === 'End') goTo(slides.length - 1);
  });

  window.addEventListener('wheel', (event) => {
    if (wheelLocked || Math.abs(event.deltaY) < 16) return;
    wheelLocked = true;
    goTo(current + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLocked = false; }, 900);
  }, { passive: true });

  window.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (event) => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    const dy = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx < 0 ? 1 : -1));
  }, { passive: true });

  document.querySelector('.brand').addEventListener('click', (event) => { event.preventDefault(); goTo(0); });

  const hashIndex = Number(location.hash.replace('#slide-', '')) - 1;
  current = Number.isInteger(hashIndex) && hashIndex >= 0 && hashIndex < slides.length ? hashIndex : 0;
  slides.forEach((slide, index) => slide.classList.toggle('is-active', index === current));
  track.style.transform = `translate3d(-${current * 100}vw, 0, 0)`;
  goTo(current, false);
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
})();
