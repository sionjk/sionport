/* Responsive ASCII study with a quiet glow on its three numbered points. */
(() => {
  const canvas = document.getElementById('about-art');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let active = -1;
  let points = [];
  const numbers = [...document.querySelectorAll('.bio-details > div > span')];
  function highlight(index) {
    if (active === index) return;
    active = index;
    numbers.forEach((number, i) => number.classList.toggle('is-glowing', i === index));
    draw();
  }
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
    points = [];
    [.12, .5, .88].forEach((t, i) => {
      const x = center + wave(t) * amplitude;
      const y = inset + t * span;
      points.push({x, y});
      ctx.save();
      if (i === active) {
        const glow = ctx.createRadialGradient(x, y, 3, x, y, 26);
        glow.addColorStop(0, 'rgba(214,202,191,.24)');
        glow.addColorStop(.4, 'rgba(180,158,145,.10)');
        glow.addColorStop(1, 'rgba(166,81,50,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();ctx.arc(x, y, 26, 0, Math.PI * 2);ctx.fill();
        ctx.shadowColor = 'rgba(190,167,148,.22)';
        ctx.shadowBlur = 6;
      }
      ctx.fillStyle = i === active ? '#aaa8a7' : '#9da1aa';
      ctx.beginPath();ctx.arc(x, y, 11, 0, Math.PI * 2);ctx.fill();
      ctx.strokeStyle = '#78452f';ctx.stroke();
      ctx.fillStyle = '#693820';
      ctx.font = '10px Consolas, monospace';
      ctx.fillText(String(i + 1).padStart(2, '0'), x, y);
      ctx.restore();
    });
  }
  canvas.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch') return;
    const rect = canvas.getBoundingClientRect();
    highlight(points.findIndex(point => Math.hypot(event.clientX - rect.left - point.x, event.clientY - rect.top - point.y) <= 22));
  });
  canvas.addEventListener('pointerleave', () => highlight(-1));
  numbers.forEach((number, index) => {
    number.tabIndex = 0;
    number.setAttribute('aria-label', `${number.textContent}: ${number.nextElementSibling.textContent}`);
    number.addEventListener('pointerenter', () => highlight(index));
    number.addEventListener('pointerleave', () => highlight(-1));
    number.addEventListener('focus', () => highlight(index));
    number.addEventListener('blur', () => highlight(-1));
  });
  new ResizeObserver(draw).observe(canvas.parentElement);
  window.addEventListener('resize', draw, {passive:true});
  draw();
})();
