// Loads content.json and renders the homepage

async function init() {
  const res = await fetch('/content.json');
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
}

function cardHTML(p) {
  const hasHover = !!p.hoverImage;
  const hasVideo = !!p.videoUrl;

  return `
    <a class="card ${hasHover ? '' : 'no-hover'}" href="/project.html?id=${p.id}">
      <img class="card-img primary-img" src="${p.thumbnail}" alt="${p.title}" loading="lazy">
      ${hasHover ? `<img class="card-img hover-img" src="${p.hoverImage}" alt="${p.title}" loading="lazy">` : ''}
      <div class="card-overlay">
        <div class="card-category">${p.category}</div>
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
