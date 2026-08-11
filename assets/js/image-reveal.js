// How close (in px) the mouse needs to be to a callout before it lights up.
// Roughly matches the reveal spotlight's fully-open radius (100px) defined in image-reveal.css.
const CALLOUT_ACTIVATION_RADIUS = 120;

document.addEventListener('mousemove', (e) => {
  const containers = document.querySelectorAll('.reveal-container');
  containers.forEach(container => {
    const rect = container.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate position as percentage relative to the container
    const x = (mouseX / rect.width) * 100;
    const y = (mouseY / rect.height) * 100;

    // Clamp values between 0 and 100 for better edge behavior
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    container.style.setProperty('--mouse-x', `${clampedX}%`);
    container.style.setProperty('--mouse-y', `${clampedY}%`);

    // Light up the single organelle callout closest to the mouse (i.e. under
    // the peek-hole), rather than every callout within range, so nearby
    // labels (e.g. the nucleus and a neighbouring ribosome) don't stack up.
    const insideContainer = mouseX >= 0 && mouseX <= rect.width && mouseY >= 0 && mouseY <= rect.height;
    const callouts = container.querySelectorAll('.cell-callout');

    let nearest = null;
    let nearestDistance = Infinity;

    callouts.forEach(callout => {
      const calloutRect = callout.getBoundingClientRect();
      const calloutX = calloutRect.left + calloutRect.width / 2 - rect.left;
      const calloutY = calloutRect.top + calloutRect.height / 2 - rect.top;
      const distance = Math.hypot(mouseX - calloutX, mouseY - calloutY);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = callout;
      }
    });

    callouts.forEach(callout => {
      const isActive = insideContainer && callout === nearest && nearestDistance < CALLOUT_ACTIVATION_RADIUS;
      callout.classList.toggle('active', isActive);
    });
  });
});