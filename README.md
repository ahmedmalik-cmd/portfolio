# Portfolio

## How to update content

All your content lives in **`public/content.json`**. Edit it directly in GitHub (click the file → pencil icon → commit).

### Change your name / bio / email
Edit the `site` block at the top of `content.json`.

### Edit a project title or description
Find the project by `id` and update `title`, `description`, or `year`.

### Change thumbnail or hover image
Update `thumbnail` and `hoverImage` paths. Paths are relative to `/public/images/`.

### Add a video
Set `videoUrl` to a YouTube embed URL:
```
"videoUrl": "https://www.youtube.com/embed/YOUR_VIDEO_ID"
```

### Add a new project
1. Upload your images to the right folder in `public/images/`
2. Copy an existing project block in `content.json`, change the `id`, fill in your details

### Add new images to a project
Upload to the correct folder in `public/images/` then add the path to the `images` array.

### Reorder projects
Cut and paste the project blocks in `content.json` — the grid follows that order.

## Folder structure
```
public/
  content.json       ← edit this to manage all content
  images/
    sculpture/
    projection/
    model/
    photo/
    ceramics/
    3dprint/
    cnc/
    animation/
    ar/
    vr/
css/
  style.css
js/
  main.js
  project.js
index.html
project.html
vercel.json
```
