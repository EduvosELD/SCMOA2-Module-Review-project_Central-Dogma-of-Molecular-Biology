document.addEventListener('mousemove', (e) => {
  const containers = document.querySelectorAll('.reveal-container');
  containers.forEach(container => {
    const rect = container.getBoundingClientRect();
    
    // Calculate position as percentage relative to the container
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Clamp values between 0 and 100 for better edge behavior
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    
    container.style.setProperty('--mouse-x', `${clampedX}%`);
    container.style.setProperty('--mouse-y', `${clampedY}%`);
  });
});