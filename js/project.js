// project.js — renders project detail pages

let galleryImages = [];
let currentLightboxIndex = 0;

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const res = await fetch('/public/content.json');
  const data = await res.json();

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
  galleryImages = (project.images || []).filter(item => typeof item === 'string');

  const cats = project.categories
    ? project.categories
    : (project.category ? [project.category] : []);

  const videoUrl = project.videoUrl
    ? project.videoUrl
        .replace('https://www.youtube.com/embed', 'https://www.youtube-nocookie.com/embed')
        .replace('https://youtube.com/embed', 'https://www.youtube-nocookie.com/embed')
        .replace('https://youtu.be/embed', 'https://www.youtube-nocookie.com/embed')
    : null;

  const mediaFirst = project.mediaFirst === true;

  const detail = document.getElementById('project-detail');

  const galleryHTML = buildGallery(project.images, mediaFirst);
  const videoHTML = buildVideo(videoUrl);
  const audioHTML = buildAudio(project.audioUrl, project.extraAudio);

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

    ${mediaFirst
      ? videoHTML + audioHTML + galleryHTML
      : galleryHTML + videoHTML + audioHTML
    }
  `;

  buildLightbox();

  requestAnimationFrame(() => {
    detail.classList.add('is-visible');
  });
}

function buildGallery(images, mediaFirst = false) {
  if (!images || images.length === 0) return '';

  function renderMedia(item, index) {
    if (typeof item === 'string') {
      const imageIndex = galleryImages.indexOf(item);
      return `
        <div class="gallery-item" data-index="${imageIndex}">
          <img src="${item}" alt="Image ${imageIndex + 1}" loading="lazy" onclick="openLightbox(${imageIndex})" />
        </div>
      `;
    }

    if (item && item.type === 'video') {
      return `
        <div class="gallery-item gallery-item--video">
          <video controls playsinline preload="metadata" style="display:block; width:100%; height:auto;">
            <source src="${item.src}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      `;
    }

    return '';
  }

  function makeRow(a, b) {
    if (b !== undefined) {
      return `
        <div class="gallery-row">
          ${renderMedia(a)}
          ${renderMedia(b)}
        </div>
      `;
    }

    return `
      <div class="gallery-row gallery-row--single">
        ${renderMedia(a)}
      </div>
    `;
  }

  if (mediaFirst) {
    let rowsHTML = '';
    for (let i = 0; i < images.length; i += 2) {
      rowsHTML += makeRow(images[i], images[i + 1]);
    }
    return `<div class="project-gallery"><div class="gallery-rows">${rowsHTML}</div></div>`;
  }

  const [hero, ...rest] = images;

  const heroHTML = `
    <div class="gallery-item gallery-item--hero">
      ${typeof hero === 'string'
        ? `<img src="${hero}" alt="Image 1" loading="eager" onclick="openLightbox(${galleryImages.indexOf(hero)})" />`
        : hero && hero.type === 'video'
          ? `<video controls playsinline preload="metadata" style="display:block; width:100%; height:auto;">
               <source src="${hero.src}" type="video/mp4">
               Your browser does not support the video tag.
             </video>`
          : ''
      }
    </div>`;

  if (rest.length === 0) {
    return `<div class="project-gallery project-gallery--single">${heroHTML}</div>`;
  }

  let rowsHTML = '';
  for (let i = 0; i < rest.length; i += 2) {
    rowsHTML += makeRow(rest[i], rest[i + 1]);
  }

  return `<div class="project-gallery">${heroHTML}<div class="gallery-rows">${rowsHTML}</div></div>`;
}
  if (!images || images.length === 0) return '';

  function makeRow(a, indexA, b, indexB) {
    if (b !== undefined) {
      return `
        <div class="gallery-row">
          <div class="gallery-item" data-index="${indexA}">
            <img src="${a}" alt="Image ${indexA + 1}" loading="lazy" onclick="openLightbox(${indexA})" />
          </div>
          <div class="gallery-item" data-index="${indexB}">
            <img src="${b}" alt="Image ${indexB + 1}" loading="lazy" onclick="openLightbox(${indexB})" />
          </div>
        </div>`;
    } else {
      return `
        <div class="gallery-row gallery-row--single">
          <div class="gallery-item" data-index="${indexA}">
            <img src="${a}" alt="Image ${indexA + 1}" loading="lazy" onclick="openLightbox(${indexA})" />
          </div>
        </div>`;
    }
  }

  if (mediaFirst) {
    let rowsHTML = '';
    for (let i = 0; i < images.length; i += 2) {
      rowsHTML += makeRow(images[i], i, images[i + 1], i + 1);
    }
    return `<div class="project-gallery"><div class="gallery-rows">${rowsHTML}</div></div>`;
  }

  const [hero, ...rest] = images;
  const heroHTML = `
    <div class="gallery-item gallery-item--hero" data-index="0">
      <img src="${hero}" alt="Image 1" loading="eager" onclick="openLightbox(0)" />
    </div>`;

  if (rest.length === 0) {
    return `<div class="project-gallery project-gallery--single">${heroHTML}</div>`;
  }

  let rowsHTML = '';
  for (let i = 0; i < rest.length; i += 2) {
    const indexA = i + 1;
    const indexB = i + 2;
    rowsHTML += makeRow(rest[i], indexA, rest[i + 1], indexB);
  }

  return `<div class="project-gallery">${heroHTML}<div class="gallery-rows">${rowsHTML}</div></div>`;


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

function buildAudio(audioUrl, extraAudio) {
  const allUrls = [audioUrl, ...(extraAudio || [])].filter(Boolean);
  if (allUrls.length === 0) return '';

  function playerHTML(url) {
    if (url.includes('soundcloud.com')) {
      const encoded = encodeURIComponent(url);
      return `
        <div class="audio-wrapper">
          <iframe
            scrolling="no"
            frameborder="no"
            allow="autoplay"
            src="https://w.soundcloud.com/player/?url=${encoded}&color=%23b8966e&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true"
          ></iframe>
        </div>`;
    }
    return `
      <div class="audio-native-wrapper">
        <audio controls preload="metadata">
          <source src="${url}">
          Your browser does not support audio playback.
        </audio>
      </div>`;
  }

  return `
    <div class="project-media-block">
      <div class="project-media-label">Listen</div>
      ${allUrls.map(playerHTML).join('')}
    </div>
  `;
}

function buildLightbox() {
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