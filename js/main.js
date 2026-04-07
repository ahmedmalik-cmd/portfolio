// main.js — renders the homepage grid

let allProjects = [];
let activeFilter = 'All';

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

  // Social links
  const siteLinks = (data.site.links || []).filter(l => l.url);
  if (siteLinks.length) {
    const linksEl = document.getElementById('about-links');
    linksEl.innerHTML = siteLinks
      .map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`)
      .join('');
  }

  allProjects = data.projects;

  // Build category filter
  const categories = ['All'];
  allProjects.forEach(p => {
    const cats = p.categories ? p.categories : (p.category ? [p.category] : []);
    cats.forEach(c => { if (!categories.includes(c)) categories.push(c); });
  });

  const filterBar = document.getElementById('filter-bar');
  filterBar.innerHTML = categories.map(c => `
    <button class="filter-btn ${c === 'All' ? 'active' : ''}" data-cat="${c}">${c}</button>
  `).join('');

  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderGrid();
  });

  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('project-grid');
  const filtered = activeFilter === 'All'
    ? allProjects
    : allProjects.filter(p => {
        const cats = p.categories ? p.categories : (p.category ? [p.category] : []);
        return cats.includes(activeFilter);
      });
  grid.innerHTML = filtered.map(p => cardHTML(p)).join('');
}

function cardHTML(p) {
  const hasHover = !!p.hoverImage;
  const hasVideo = !!p.videoUrl;

  // Support both old "category" string and new "categories" array
  const cats = p.categories
    ? p.categories
    : (p.category ? [p.category] : []);

  const categoryLabel = cats.join(', ');

  return `
    <a class="card ${hasHover ? '' : 'no-hover'}" href="/project.html?id=${p.id}">
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