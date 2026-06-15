// main.js — renders the homepage grid

async function init() {
  const res = await fetch('/public/content.json');
  const data = await res.json();

  // Site meta
  document.title = data.site.name + ' — Portfolio';
  document.getElementById('site-name').textContent = data.site.name;
  document.getElementById('hero-title').innerHTML = data.site.tagline;
  document.getElementById('hero-bio').textContent = data.site.bio;
  document.getElementById('about-bio').textContent = data.site.bio;
  document.getElementById('about-email').textContent = data.site.email;
  document.getElementById('about-email').href = 'mailto:' + data.site.email;
  document.getElementById('footer-name').textContent = data.site.name;
  document.getElementById('footer-year').textContent = '© ' + new Date().getFullYear();

  // Grid
  const grid = document.getElementById('project-grid');
  grid.innerHTML = data.projects.map(project => cardHTML(project)).join('');

  // Touch swipe-to-reveal — must run AFTER grid is built
  if ('ontouchstart' in window) {
    document.querySelectorAll('.card').forEach(card => {
      let startX = 0;
      let startY = 0;
      let didSwipe = false;

      card.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        didSwipe = false;
      }, { passive: true });

      card.addEventListener('touchmove', e => {
        const dx = e.touches[0].clientX - startX;
        const dy = e.touches[0].clientY - startY;
        // Only count horizontal swipe, ignore vertical scroll
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 20) {
          didSwipe = true;
          card.classList.toggle('tapped', dx < 0); // swipe left = reveal, swipe right = hide
        }
      }, { passive: true });

      card.addEventListener('click', e => {
        if (didSwipe) {
          e.preventDefault();
          didSwipe = false;
        }
      });
    });
  }
}

function cardHTML(p) {
  const hasHover = !!p.hoverImage;
  const hasVideo = !!p.videoUrl;

  const cats = p.categories
    ? p.categories
    : (p.category ? [p.category] : []);

  const categoryLabel = cats.join(', ');
  const href = p.url ? p.url : '/project.html?id=' + p.id;

  return `
    <a class="card ${hasHover ? '' : 'no-hover'}" href="${href}">
      <img class="card-img primary-img" src="${p.thumbnail}" alt="${p.title}" loading="lazy">
      ${hasHover ? `<img class="card-img hover-img" src="${p.hoverImage}" alt="${p.title}" loading="lazy">` : ''}
      <div class="card-overlay">
        <div class="card-category">${categoryLabel}</div>
        <div class="card-title">${p.title}</div>
        <div class="card-year">${p.year}</div>
      </div>
      ${hasVideo ? `
        <div class="card-video-badge">
          <svg viewBox="0 0 10 10"><polygon points="2,1 9,5 2,9"/></svg>
        </div>` : ''}
    </a>
  `;
}

init();