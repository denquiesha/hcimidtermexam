// assets/js/liquid-ether.js
document.addEventListener("DOMContentLoaded", () => {
  // Header & Footer
  fetch("header.html").then(r => r.text()).then(d => document.getElementById("header").innerHTML = d);
  fetch("footer.html").then(r => r.text()).then(d => document.getElementById("footer").innerHTML = d);
  feather.replace();

  // Form
  const form = document.getElementById("contactForm");
  const success = document.getElementById("successMessage");
  if (form && success) {
    form.addEventListener("submit", () => {
      setTimeout(() => { form.style.display = "none"; success.style.display = "block"; }, 800);
    });
  }

  // === TRUE LIQUID ETHER (FIXED) ===
  const canvas = document.getElementById('liquid-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  const mouse = { x: 0, y: 0 };
  const blobs = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Mouse & Touch
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('touchmove', e => {
    if (e.touches.length > 0) { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }
  });

  // Blob Class
  class Blob {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = 80 + Math.random() * 100;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.hue = 200 + Math.random() * 60; // Blue-purple
    }
  }

  // Create 5 blobs
  for (let i = 0; i < 5; i++) blobs.push(new Blob());

  // HSL to RGB (for smooth colors)
  const hslToRgb = (h, s, l) => {
    h /= 360;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const animate = () => {
    // Clear with fade
    ctx.fillStyle = 'rgba(10, 10, 35, 0.08)';
    ctx.fillRect(0, 0, width, height);

    // Update blobs
    blobs.forEach(blob => {
      const dx = mouse.x - blob.x;
      const dy = mouse.y - blob.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 400) {
        blob.vx += dx * 0.00008;
        blob.vy += dy * 0.00008;
      }
      blob.vx += (Math.random() - 0.5) * 0.3;
      blob.vy += (Math.random() - 0.5) * 0.3;
      blob.vx *= 0.95;
      blob.vy *= 0.95;
      blob.x += blob.vx;
      blob.y += blob.vy;

      // Bounce
      if (blob.x < 0 || blob.x > width) blob.vx *= -1;
      if (blob.y < 0 || blob.y > height) blob.vy *= -1;
      blob.x = Math.max(0, Math.min(width, blob.x));
      blob.y = Math.max(0, Math.min(height, blob.y));
    });

    // Draw metaballs (pixel by pixel)
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        let sum = 0;
        blobs.forEach(blob => {
          const dx = x - blob.x;
          const dy = y - blob.y;
          const d2 = dx * dx + dy * dy;
          sum += (blob.radius * blob.radius) / (d2 + 100);
        });

        const intensity = Math.min(sum * 0.8, 1);
        const idx = (y * width + x) * 4;

        // Dynamic color (blue-purple gradient)
        const hue = (200 + x * 0.03 + y * 0.02) % 360;
        const rgb = hslToRgb(hue, 0.7, 0.4 + intensity * 0.5);

        data[idx] = rgb.r;
        data[idx + 1] = rgb.g;
        data[idx + 2] = rgb.b;
        data[idx + 3] = 255 * intensity;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    requestAnimationFrame(animate);
  };

  animate();
});