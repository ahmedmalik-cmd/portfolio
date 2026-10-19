# Portfolio — ahmedjmalik.com

Static site on Vercel (`vercel.json`: clean URLs). No build step.

## Two sides, one site
- **Art** — `/` (`index.html` + `js/main.js`) and `/project.html?id=…` (`js/project.js`), styled by `css/style.css`.
  All art content lives in **`public/content.json`**; images and videos are hosted on Cloudinary.
- **Technical** — `/tech/` (`tech/index.html`, self-contained: styles, the Three.js splat hero, the
  Capabilities list and the case files). Its media is in `tech/media/`.
- **real & rendered** — `/the-room/` (`the-room/index.html`), the thesis project page, with its own
  media, charts, thumbnails and the gallery model (`model/room.glb`, also used by the /tech case file).

The **Art | Technical** switch sits in the centre of every header. Project pages opened from /tech
carry `&from=tech`, so their back link returns to /tech.

## Editing art content
Edit `public/content.json` (GitHub → file → pencil → commit):
- `site` — name, tagline, bio, email.
- `projects` — each has `id`, `title`, `categories`, `year`, `description`, `thumbnail`, `hoverImage`,
  `images`, optional `videoUrl` (YouTube embed) and `audioUrl`. The grid follows the array order.
