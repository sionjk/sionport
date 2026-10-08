/* A static, responsive ASCII study. Decorative: no motion or user data. */
(() => {
  const canvas = document.getElementById('about-art');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  function draw() {
    const {width, height} = canvas.getBoundingClientRect();
    if (!width || !height) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const step = width < 350 ? 14 : 16;
    const amplitude = width * .26;
    const center = width / 2;
    const inset = 24;
    const span = height - inset * 2;
    const wave = t => Math.sin(t * Math.PI * 3 - .65);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '14px Consolas, monospace';
    for (let y = inset; y <= height - inset; y += step) {
      const t = (y - inset) / span;
      const left = center + wave(t) * amplitude;
      const right = center - wave(t) * amplitude;
      for (let x = 12; x < width - 12; x += step) {
        const distance = Math.min(Math.abs(x - left), Math.abs(x - right));
        const grain = (Math.round(x / step) * 7 + Math.round(y / step) * 11) % 9;
        let mark = distance < 9 ? '#' : distance < 23 ? '*' : distance < 39 ? '+' : distance < 58 ? '·' : '';
        if (!mark && grain === 0) mark = '·';
        ctx.fillStyle = distance < 23 ? '#3c3c4c' : distance < 58 ? '#515563' : '#747986';
        if (mark) ctx.fillText(mark, x, y);
      }
    }
    // A quiet rust thread links three points through the ASCII field.
    ctx.beginPath();
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = center + wave(t) * amplitude;
      const y = inset + t * span;
      if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.strokeStyle = '#78452f';
    ctx.globalAlpha = .55;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
    [.12, .5, .88].forEach((t, i) => {
      const x = center + wave(t) * amplitude;
      const y = inset + t * span;
      ctx.fillStyle = '#9da1aa';
      ctx.beginPath();ctx.arc(x, y, 11, 0, Math.PI * 2);ctx.fill();
      ctx.strokeStyle = '#78452f';ctx.stroke();
      ctx.fillStyle = '#693820';
      ctx.font = '10px Consolas, monospace';
      ctx.fillText(String(i + 1).padStart(2, '0'), x, y);
    });
  }
  new ResizeObserver(draw).observe(canvas.parentElement);
  window.addEventListener('resize', draw, {passive:true});
  draw();
})();
