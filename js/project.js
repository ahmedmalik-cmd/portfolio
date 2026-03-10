// Reads ?id= from URL, loads content.json, renders project detail

async function init() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const res = await fetch('/content.json');
  const data = await res.json();

  // Site meta
  document.getElementById('site-name').textContent = data.site.name;
  document.getElementById('footer-name').textContent = data.site.name;
  document.getElementById('footer-year').textContent = '© ' + new Date().getFullYear();

  const project = data.projects.find(p => p.id === id);
  if (!project) {
    document.getElementById('project-detail').innerHTML = '<p style="padding:40px;color:#5a5650">Project not found.</p>';
    return;
  }

  document.title = project.title + ' — ' + data.site.name;

  const detail = document.getElementById('project-detail');
  detail.innerHTML = `
    <a class="project-back" href="/">← Back</a>

    <div class="project-header">
      <div>
        <div class="project-category">${project.category}</div>
        <h1 class="project-title">${project.title}</h1>
      </div>
      <div class="project-meta">
        <div class="project-year">${project.year}</div>
        <p class="project-desc">${project.description}</p>
      </div>
    </div>

    ${project.images && project.images.length > 0 ? `
      <div class="project-gallery">
        ${project.images.map((src, i) => `
          <img src="${src}" alt="${project.title} ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" onclick="openLightbox('${src}')">
        `).join('')}
      </div>
    ` : ''}

    ${project.videoUrl ? `
      <div class="project-video">
        <div class="project-video-label">Video</div>
        <div class="video-wrapper">
          <iframe src="${project.videoUrl}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
        </div>
      </div>
    ` : ''}
  `;

  // Lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <button id="lightbox-close" onclick="closeLightbox()">✕ Close</button>
    <img id="lightbox-img" src="" alt="">
  `;
  document.body.appendChild(lb);

  lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

init();
