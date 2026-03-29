const GITHUB_USER = "AaryanSuwal";
const GITHUB_REPO = "projects-hub";
const JSON_FILE = "projects.json";
const TAG_COLORS = ["", "purple", "red"];

const grid = document.getElementById("grid");
const searchEl = document.getElementById("search");
const countEl = document.getElementById("project-count");
const filterToggleBtn = document.getElementById("filter-toggle-btn");
const filterDropdownMenu = document.getElementById("filter-dropdown-menu");
const filterOptBtns = document.querySelectorAll(".filter-opt-btn");
const activeFilterIndicator = document.getElementById("active-filter-indicator");
const clearFiltersBtn = document.getElementById("clear-filters-btn");

let allProjects = [];
let activeFilters = {
  status: [],
  tech: []
};

// Toggle dropdown
if (filterToggleBtn) {
  filterToggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterDropdownMenu.classList.toggle("show");
    filterToggleBtn.classList.toggle("active", filterDropdownMenu.classList.contains("show"));
  });
}

// Close when clicking outside
document.addEventListener("click", (e) => {
  if (filterDropdownMenu && !filterDropdownMenu.contains(e.target) && e.target !== filterToggleBtn) {
    filterDropdownMenu.classList.remove("show");
    if(filterToggleBtn) filterToggleBtn.classList.remove("active");
  }
});

// Filter selection
filterOptBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Keep dropdown open
    btn.classList.toggle("selected");
    
    // Custom mapping for Github's live/wip status if needed
    const type = btn.dataset.type;
    const val = btn.dataset.val.toLowerCase();
    
    if (btn.classList.contains("selected")) {
      activeFilters[type].push(val);
    } else {
      activeFilters[type] = activeFilters[type].filter(v => v !== val);
    }
    
    updateFilterIndicator();
    renderGrid();
  });
});

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Keep dropdown open (or we can close it, but usually keep open)
    activeFilters = { status: [], tech: [] };
    filterOptBtns.forEach(b => b.classList.remove("selected"));
    updateFilterIndicator();
    renderGrid();
  });
}

function updateFilterIndicator() {
  const totalActive = activeFilters.status.length + activeFilters.tech.length;
  if (totalActive > 0 && activeFilterIndicator) {
    activeFilterIndicator.textContent = totalActive;
    activeFilterIndicator.classList.add("has-filters");
  } else if (activeFilterIndicator) {
    activeFilterIndicator.classList.remove("has-filters");
  }
}

async function loadProjects() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${JSON_FILE}`;
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    const data = await res.json();
    allProjects = JSON.parse(
      decodeURIComponent(escape(atob(data.content.replace(/\n/g, "")))),
    );
    renderGrid();
    return;
  } catch {
    grid.innerHTML = `<div class="state-msg"><p>// failed to load projects.</p></div>`;
  }
}

function fixImageUrl(url) {
  if (!url) return '';
  return url
    .replace('https://github.com/', 'https://cdn.jsdelivr.net/gh/')
    .replace('/blob/main/', '@main/')
    .replace('/blob/master/', '@master/')
    .replace('raw.githubusercontent.com/', 'cdn.jsdelivr.net/gh/')
    .replace('/main/', '@main/');
}

function renderGrid() {
  const q = searchEl.value.toLowerCase();
  const filtered = allProjects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    
    const pStatus = (p.status || "").toLowerCase();

    const matchStatus = activeFilters.status.length === 0 ||
                        activeFilters.status.includes(pStatus);
                        
    const pTags = p.tags ? p.tags.map(t => t.toLowerCase()) : [];
    const matchTech = activeFilters.tech.length === 0 || activeFilters.tech.some(t => pTags.includes(t));

    return matchSearch && matchStatus && matchTech;
  });
  
  if (countEl) countEl.textContent = filtered.length + " showing";
  
  if (!filtered.length) {
    grid.innerHTML = `<div class="state-msg"><p>// no projects match your search.</p></div>`;
    return;
  }
  
  grid.innerHTML = filtered
    .map(
      (p) => `
      <div class="card">
        ${p.liveLink ? `
        <a href="${p.liveLink}" target="_blank" class="live-preview-btn">
          <i data-lucide="external-link"></i>
          <span>Live Preview</span>
        </a>` : ''}
        <div class="card-header-row">
          <div class="card-icon"><i data-lucide="terminal"></i></div>
          <div class="card-title-group">
            <h3 class="card-title">${p.title}</h3>
            ${p.role ? `<div class="card-role">${p.role}</div>` : ''}
          </div>
        </div>
        ${p.image ? `<div class="card-image-wrap"><img src="${fixImageUrl(p.image)}" class="card-image" alt="${p.title}" /></div>` : ''}
        <div class="card-desc">${p.description}</div>
        <div class="card-tags">${p.tags.map((t, i) => `<span class="tag ${TAG_COLORS[i % TAG_COLORS.length]}">${t}</span>`).join("")}</div>
        <div class="card-actions">
          <a href="${p.link || '#'}" target="_blank" class="action-btn github-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            GitHub
          </a>
          <a href="${p.downloadLink ? p.downloadLink : (p.link ? p.link + '/archive/refs/heads/main.zip' : '#')}" target="_blank" class="action-btn download-btn">
            <i data-lucide="download"></i>
            Download
          </a>
        </div>
        <div class="card-divider"></div>
        <div class="card-footer">
          <span class="card-status status-${p.status}">${p.status}</span>
          <span class="card-version">${p.version || "v1.0.0"}</span>
        </div>
      </div>`,
    )
    .join("");

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

if (searchEl) searchEl.addEventListener("input", renderGrid);
loadProjects();

// Setup static icons
if (window.lucide) {
  window.lucide.createIcons();
}
