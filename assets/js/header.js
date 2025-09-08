function initHeaderScrollEffect() {
  const header = document.querySelector('header');

  if (!header) {
    console.warn('Header element not found');
    return;
  }

  // Set initial state - transparent at top
  header.classList.add('transparent');
  header.classList.remove('solid');

  // Scroll event handler
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 100) { // scroll threshold
      header.classList.add('solid');
      header.classList.remove('transparent');
      header.classList.add('shrink'); // shrink header, logo, text
    } else {
      header.classList.remove('solid');
      header.classList.add('transparent');
      header.classList.remove('shrink'); // restore original size
    }
  }

  // Add scroll listener
  window.addEventListener('scroll', handleScroll);

  // Set initial state
  handleScroll();

  console.log('Header scroll effect initialized'); // for debugging
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Small delay in case header is loaded dynamically
  setTimeout(initHeaderScrollEffect, 100);
});
