# Project Hub

A modern, self-hosted portfolio hub for showcasing your projects. Features a sleek dark terminal aesthetic, GitHub API integration, and a PIN-protected admin portal for managing your project collection.

**Live Demo:** [projects.aaryansuwal.com.np](https://projects.aaryansuwal.com.np)

---

## Features

- **Project Grid Display** — Masonry-style responsive grid with smooth hover effects
- **Search & Filter** — Real-time search and multi-filter by status (completed, in-progress, archived) and technology tags
- **GitHub Integration** — Fetch project data directly from a `projects.json` file in your repository
- **Admin Portal** — Token-authenticated dashboard to add, edit, and delete projects
- **Dark Terminal Aesthetic** — Monospace typography with accent colors and grid backdrop
- **Zero Dependencies** — Pure vanilla HTML/CSS/JavaScript (except Lucide icons CDN)
- **Responsive Design** — Mobile-first, works on all screen sizes
- **Fast & Lightweight** — No build step required, deploy anywhere

---

## Tech Stack

- **Frontend:** HTML5, CSS3, vanilla JavaScript
- **Icons:** Lucide Icons (CDN)
- **Fonts:** JetBrains Mono, Syne (Google Fonts)
- **Data Storage:** `projects.json` (GitHub repository file)
- **API:** GitHub REST API v3
- **Hosting:** Any static host (Vercel, Netlify, GitHub Pages, etc.)

---

## Quick Start

### 1. Fork/Clone This Repository

```bash
git clone https://github.com/YOUR_USERNAME/projects-hub.git
cd projects-hub
```

### 2. Add Your Projects

Edit `projects.json` to add your projects:

```json
[
  {
    "id": "my-app",
    "title": "My Awesome App",
    "role": "Lead Developer",
    "description": "A short description of what this project does.",
    "tags": ["React", "Node.js", "TailwindCSS"],
    "version": "v1.0.0",
    "status": "completed",
    "link": "https://github.com/YOUR_USERNAME/my-app",
    "liveLink": "https://my-app.com",
    "image": "https://github.com/YOUR_USERNAME/my-app/blob/main/preview.png",
    "icon": "terminal"
  }
]
```

### 3. Deploy

Deploy to your preferred platform:

- **GitHub Pages:** Push to `gh-pages` branch
- **Vercel:** Connect repository, no config needed
- **Netlify:** Drag and drop or connect Git
- **Traditional Hosting:** Upload files via FTP/SSH

---

## Project Structure

```
.
├── index.html          # Main project hub page
├── style.css           # Hub styling
├── script.js           # Hub functionality (fetch, filter, search)
├── projects.json       # Your projects data
├── admin/
│   ├── index.html      # Admin portal page
│   ├── admin.css       # Admin styling
│   └── admin.js        # Admin functionality (CRUD operations)
└── README.md           # This file
```

---

## Usage

### Public Hub

Navigate to the hub to:
- **Search** projects by title or description
- **Filter** by status or technology using the dropdown
- **View** project cards with live preview button (if configured)
- **Access** GitHub and download links for each project

### Admin Portal

Access the admin panel at `/admin/` to:

1. **Enter Token** — Paste a GitHub Personal Access Token on first visit
   - Token is stored locally in your browser only
   - Never logged or sent anywhere except GitHub API

2. **Manage Projects** — Add, edit, or delete projects from the UI

3. **Project Fields:**
   - **Title** (required) — Project name
   - **Role** (optional) — Your role in the project
   - **Description** (required) — Short description
   - **Technologies** (required) — Select one or more tags
   - **Version** (required) — Semantic version
   - **Status** (required) — completed, in-progress, or archived
   - **GitHub Link** (required) — Repository URL
   - **Live Link** (optional) — Deployed project URL
   - **Image** (optional) — Preview image URL

---

## GitHub API Token Setup

### Create a Personal Access Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click **Generate new token**
3. Give it a name like `projects-hub`
4. Select scopes:
   - `public_repo` (or `repo` for private repositories)
   - `contents` (to read/write file contents)
5. Copy the token and paste it in the admin portal

> ⚠️ **Security Note:** The token is stored in your browser's localStorage and is never sent anywhere except to the GitHub API. Keep your token private; don't share it or commit it to the repository.

---

## Configuration

### Customize Styling

Edit the CSS variables in `style.css` and `admin.css`:

```css
:root {
  --bg: #0a0f1a;                    /* Background */
  --surface: #111827;               /* Card background */
  --accent: #3b82f6;                /* Primary color */
  --accent2: #60a5fa;               /* Secondary accent */
  --text: #e2e8f0;                  /* Text color */
  --muted: #64748b;                 /* Muted text */
  --danger: #f87171;                /* Danger state */
}
```

### Update Project Tags

Edit `AVAILABLE_TAGS` in `admin.js` to add your technology tags:

```javascript
const AVAILABLE_TAGS = [
  "HTML", "CSS", "JS", "React", "Vue", "Svelte", 
  "Node.js", "Python", "Go", "Docker", "AWS", "UI/UX"
];
```

### Update Repository Info

Replace these constants in `script.js` and `admin.js`:

```javascript
const GITHUB_USER = "YOUR_USERNAME";
const GITHUB_REPO = "projects-hub";
const JSON_FILE = "projects.json";
```

---

## Customization Examples

### Change Colors to Cyan/Purple

```css
:root {
  --accent: #06b6d4;      /* Cyan */
  --accent2: #0891b2;     /* Darker cyan */
  /* Update tag/status colors accordingly */
}
```

### Add Custom Fonts

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=YOUR_FONT:wght@400;600;800&display=swap">
```

Then update CSS:

```css
body {
  font-family: "Your Font", sans-serif;
}
```

### Modify Grid Layout

In `style.css`, adjust columns:

```css
.grid {
  column-count: 4;    /* Change from 3 */
  column-gap: 20px;   /* Adjust spacing */
}
```

---

## Deployment Guide

### Vercel (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. No configuration needed — deploy

### Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) and sign in with GitHub
3. Click "New site from Git"
4. Select your repository
5. Deploy

### GitHub Pages

```bash
# Create gh-pages branch
git checkout --orphan gh-pages
git reset --hard
git commit --allow-empty -m "init"
git push origin gh-pages

# Push your code to main, GitHub Actions will deploy
```

### Custom Domain

Add a `CNAME` file (already included):

```
projects.yourdomain.com
```

---

## Project Card Schema

Each project in `projects.json` requires:

| Field | Type | Required | Example |
|-------|------|----------|---------|
| `id` | string | Yes | `"my-project"` |
| `title` | string | Yes | `"My Project"` |
| `description` | string | Yes | `"A cool app"` |
| `tags` | array | Yes | `["React", "Node.js"]` |
| `status` | string | Yes | `"completed"` \| `"in-progress"` \| `"archived"` |
| `version` | string | Yes | `"v1.0.0"` |
| `link` | string | Yes | GitHub repo URL |
| `role` | string | No | `"Lead Developer"` |
| `liveLink` | string | No | `"https://project.com"` |
| `image` | string | No | Preview image URL |
| `icon` | string | No | Lucide icon name (default: `"terminal"`) |

---

## Troubleshooting

### Admin Portal Shows "Failed to Load"

- Verify your GitHub token is valid and has `repo` scope
- Check that `GITHUB_USER`, `GITHUB_REPO`, and `JSON_FILE` constants match your setup
- Ensure the repository is not private (or token has private repo access)

### Images Not Loading

- Use absolute URLs (not relative paths)
- For GitHub raw images, use the jsdelivr CDN format:
  ```
  https://cdn.jsdelivr.net/gh/USERNAME/REPO@main/path/to/image.png
  ```

### Token Not Saving

- Check if localStorage is enabled in your browser
- Verify you're not in private/incognito mode
- Check browser console for errors

### Filter Not Working

- Ensure tag values in `projects.json` match `AVAILABLE_TAGS` in `admin.js`
- Tags are case-sensitive

---

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (15+)
- Mobile browsers: ✅ Fully responsive

---

## License

MIT License — feel free to use this for your own projects.

---

## Contributing

Found a bug or want to add a feature? Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Author

Built by [Aaryan Suwal](https://www.aaryansuwal.com.np)

- Portfolio: [aaryansuwal.com.np](https://www.aaryansuwal.com.np)
- GitHub: [@AaryanSuwal](https://github.com/AaryanSuwal)

---

## Changelog

### v1.0.0
- Initial release
- Project hub with search and filters
- Admin portal with token auth
- GitHub API integration
- Responsive design
- Dark terminal aesthetic
