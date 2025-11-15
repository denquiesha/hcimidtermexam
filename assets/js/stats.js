document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('.text-content');

  const startCount = (el) => {
    const target = +el.dataset.target;
    let current = 0;
    const increment = target / 120; // adjust speed (lower = slower)

    const step = () => {
      if (current < target) {
        current += increment;
        el.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    step();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
});