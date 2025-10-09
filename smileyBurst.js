(function () {
  const duration = 10000; // 10 seconds
  const interval = 200;   // emoji spawn rate
  const emoji = '😊';
  const startTime = Date.now();

  const spawnEmoji = () => {
    const el = document.createElement('div');
    el.textContent = emoji;
    el.style.position = 'fixed';
    el.style.left = `${Math.random() * window.innerWidth}px`;
    el.style.top = `${Math.random() * window.innerHeight}px`;
    el.style.fontSize = `${30 + Math.random() * 20}px`;
    el.style.opacity = '1';
    el.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
    el.style.zIndex = '9999';
    document.body.appendChild(el);

    // Animate and remove
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-20px)';
    }, 50);
    setTimeout(() => el.remove(), 1050);
  };

  const timer = setInterval(() => {
    if (Date.now() - startTime > duration) {
      clearInterval(timer);
    } else {
      spawnEmoji();
    }
  }, interval);
})();
