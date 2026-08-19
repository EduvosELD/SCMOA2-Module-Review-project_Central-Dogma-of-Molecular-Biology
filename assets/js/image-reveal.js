// How close (in px) the mouse needs to be to a callout before it lights up.
// Roughly matches the reveal spotlight's fully-open radius (100px) defined in image-reveal.css.
const CALLOUT_ACTIVATION_RADIUS = 120;

// Shared by mouse and touch input: moves the reveal spotlight to (clientX, clientY)
// and lights up whichever callout (if any) is nearest to it.
function updateReveal(container, clientX, clientY) {
  const rect = container.getBoundingClientRect();

  const pointerX = clientX - rect.left;
  const pointerY = clientY - rect.top;

  // Calculate position as percentage relative to the container
  const x = (pointerX / rect.width) * 100;
  const y = (pointerY / rect.height) * 100;

  // Clamp values between 0 and 100 for better edge behavior
  const clampedX = Math.max(0, Math.min(100, x));
  const clampedY = Math.max(0, Math.min(100, y));

  container.style.setProperty('--mouse-x', `${clampedX}%`);
  container.style.setProperty('--mouse-y', `${clampedY}%`);

  // Light up the single organelle callout closest to the pointer (i.e. under
  // the peek-hole), rather than every callout within range, so nearby
  // labels (e.g. the nucleus and a neighbouring ribosome) don't stack up.
  const insideContainer = pointerX >= 0 && pointerX <= rect.width && pointerY >= 0 && pointerY <= rect.height;
  const callouts = container.querySelectorAll('.cell-callout');

  let nearest = null;
  let nearestDistance = Infinity;

  callouts.forEach(callout => {
    const calloutRect = callout.getBoundingClientRect();
    const calloutX = calloutRect.left + calloutRect.width / 2 - rect.left;
    const calloutY = calloutRect.top + calloutRect.height / 2 - rect.top;
    const distance = Math.hypot(pointerX - calloutX, pointerY - calloutY);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = callout;
    }
  });

  callouts.forEach(callout => {
    const isActive = insideContainer && callout === nearest && nearestDistance < CALLOUT_ACTIVATION_RADIUS;
    callout.classList.toggle('active', isActive);
  });
}

document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.reveal-container').forEach(container => {
    updateReveal(container, e.clientX, e.clientY);
  });
});

// Touch devices have no :hover, so tapping/dragging on the image drives the
// reveal instead. touchmove calls preventDefault so dragging across the
// image doesn't also scroll the page.
document.querySelectorAll('.reveal-container').forEach(container => {
  container.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    container.classList.add('touch-active');
    updateReveal(container, touch.clientX, touch.clientY);
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    updateReveal(container, touch.clientX, touch.clientY);
    e.preventDefault();
  }, { passive: false });

  const endTouch = () => {
    container.classList.remove('touch-active');
    container.querySelectorAll('.cell-callout').forEach(callout => callout.classList.remove('active'));
  };
  container.addEventListener('touchend', endTouch);
  container.addEventListener('touchcancel', endTouch);
});
