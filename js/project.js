// project.js — renders project detail pages

let galleryImages = [];
let currentLightboxIndex = 0;

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const res = await fetch('/public/content.json');
  const data = await res.json();

  // Site meta
  document.getElementById('site-name').textContent = data.site.name;
  document.getElementById('footer-name').textContent = data.site.name;
  document.getElementById('footer-year').textContent = '© ' + new Date().getFullYear();

  const project = data.projects.find(p => p.id === id);
  if (!project) {
    document.getElementById('project-detail').innerHTML =
      '<p style="padding:80px 48px;color:var(--muted)">Project not found.</p>';
    return;
  }

  document.title = project.title + ' — ' + data.site.name;
  galleryImages = project.images || [];

  // Support both old "category" string and new "categories" array
  const cats = project.categories
    ? project.categories
    : (project.category ? [project.category] : []);

  // Fix YouTube URLs to nocookie
  const videoUrl = project.videoUrl
    ? project.videoUrl
        .replace('https://www.youtube.com/embed', 'https://www.youtube-nocookie.com/embed')
        .replace('https://youtube.com/embed', 'https://www.youtube-nocookie.com/embed')
    : null;

  const detail = document.getElementById('project-detail');

  detail.innerHTML = `
    <a class="project-back" href="/">
      <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
        <path d="M5 1L1 5L5 9M1 5H15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      All Work
    </a>

    <div class="project-header">
      <div class="project-header-left">
        <div class="project-categories">
          ${cats.map(c => `<span class="project-category-tag">${c}</span>`).join('')}
        </div>
        <h1 class="project-title">${project.title}</h1>
        <div class="project-year">${project.year}</div>
      </div>
      <div class="project-header-right">
        <p class="project-desc">${project.description}</p>
      </div>
    </div>

    ${buildGallery(project.images)}
    ${buildVideo(videoUrl)}
    ${buildAudio(project.audioUrl)}
    ${buildLinks(project.links)}
  `;

  buildLightbox();

  requestAnimationFrame(() => {
    detail.classList.add('is-visible');
  });
}

function buildGallery(images) {
  if (!images || images.length === 0) return '';

  const items = images.map((src, i) => `
    <div class="gallery-item ${i === 0 ? 'gallery-item--hero' : ''}" data-index="${i}">
      <img
        src="${src}"
        alt="Image ${i + 1}"
        loading="${i === 0 ? 'eager' : 'lazy'}"
        onclick="openLightbox(${i})"
      />
    </div>
  `).join('');

  return `<div class="project-gallery" data-count="${images.length}">${items}</div>`;
}

function buildVideo(videoUrl) {
  if (!videoUrl || videoUrl.includes('REPLACE_WITH_VIDEO_ID')) return '';
  return `
    <div class="project-media-block">
      <div class="project-media-label">Video</div>
      <div class="video-wrapper">
        <iframe
          src="${videoUrl}"
          allowfullscreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  `;
}

function buildAudio(audioUrl) {
  if (!audioUrl) return '';

  if (audioUrl.includes('soundcloud.com')) {
    const encoded = encodeURIComponent(audioUrl);
    return `
      <div class="project-media-block">
        <div class="project-media-label">Listen</div>
        <div class="audio-wrapper">
          <iframe
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=${encoded}&color=%23b8966e&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
          ></iframe>
        </div>
      </div>
    `;
  }

  return `
    <div class="project-media-block">
      <div class="project-media-label">Listen</div>
      <div class="audio-native-wrapper">
        <audio controls preload="metadata">
          <source src="${audioUrl}">
          Your browser does not support audio playback.
        </audio>
      </div>
    </div>
  `;
}

function buildLinks(links) {
  if (!links || links.length === 0) return '';
  const items = links.filter(l => l.url && l.label);
  if (!items.length) return '';
  return `
    <div class="project-media-block">
      <div class="project-media-label">Links</div>
      <div class="project-links">
        ${items.map(l => `
          <a class="project-link" href="${l.url}" target="_blank" rel="noopener">
            ${l.label}
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        `).join('')}
      </div>
    </div>
  `;
}


  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `
    <button class="lightbox-btn lightbox-close" onclick="closeLightbox()" aria-label="Close">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="lightbox-btn lightbox-prev" onclick="stepLightbox(-1)" aria-label="Previous">
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <path d="M13 2L3 12L13 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="lightbox-img-wrap">
      <img id="lightbox-img" src="" alt="">
    </div>
    <button class="lightbox-btn lightbox-next" onclick="stepLightbox(1)" aria-label="Next">
      <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
        <path d="M3 2L13 12L3 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <div class="lightbox-counter" id="lightbox-counter"></div>
  `;
  document.body.appendChild(lb);

  lb.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') stepLightbox(-1);
    if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function stepLightbox(dir) {
  currentLightboxIndex = (currentLightboxIndex + dir + galleryImages.length) % galleryImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = galleryImages[currentLightboxIndex];
    img.onload = () => { img.style.opacity = '1'; };
    if (img.complete) img.style.opacity = '1';
  }, 120);
  counter.textContent = (currentLightboxIndex + 1) + ' / ' + galleryImages.length;
  document.querySelector('.lightbox-prev').style.display = galleryImages.length > 1 ? '' : 'none';
  document.querySelector('.lightbox-next').style.display = galleryImages.length > 1 ? '' : 'none';
}

init();