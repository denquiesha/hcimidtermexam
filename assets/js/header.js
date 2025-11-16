function initHeaderScrollEffect() {
  const header = document.querySelector('header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');

  if (!header) {
    console.warn('Header element not found');
    return;
  }

  // === YOUR ORIGINAL SCROLL + SHRINK LOGIC (KEEPT INTACK) ===
  header.classList.add('transparent');
  header.classList.remove('solid');

  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) {
      header.classList.add('solid', 'shrink');
      header.classList.remove('transparent');
    } else {
      header.classList.remove('solid', 'shrink');
      header.classList.add('transparent');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // === NEW: MOBILE MENU TOGGLE (Hamburger) ===
  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : ''; // Prevent background scroll
    });

    // Close menu when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        mobileBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // === AUTO-ACTIVE CURRENT PAGE (Works on both desktop & mobile nav) ===
  const currentPage = location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll('nav a').forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });

  console.log('Header scroll + mobile menu + active page initialized!');
}

// Run after DOM is ready (compatible sa dynamic header loading mo)
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initHeaderScrollEffect, 100);
});