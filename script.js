const GITHUB_USER = "AaryanSuwal";
const GITHUB_REPO = "projects-hub";
const JSON_FILE = "projects.json";
const TAG_COLORS = ["", "purple", "red"];

const grid = document.getElementById("grid");
const searchEl = document.getElementById("search");
const countEl = document.getElementById("project-count");
const filterEl = document.getElementById("filter-btns");
const totalEl = document.getElementById("total-count");
const liveEl = document.getElementById("live-count");

let allProjects = [];
let activeFilter = "all";

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
    buildFilters();
    renderGrid();
    return;
  } catch {
    grid.innerHTML = `<div class="state-msg"><p>// failed to load projects.</p></div>`;
  }
}

function buildFilters() {
  const tags = [...new Set(allProjects.flatMap((p) => p.tags))];
  filterEl.innerHTML = `<button class="filter-btn active" data-filter="all">All</button>`;
  tags.forEach((tag) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = tag.toLowerCase();
    btn.textContent = tag;
    filterEl.appendChild(btn);
  });
  filterEl.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      filterEl
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderGrid();
    });
  });
}

function renderGrid() {
  const q = searchEl.value.toLowerCase();
  const filtered = allProjects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q);
    const matchFilter =
      activeFilter === "all" ||
      p.tags.map((t) => t.toLowerCase()).includes(activeFilter);
    return matchSearch && matchFilter;
  });
  totalEl.textContent = allProjects.length;
  liveEl.textContent = allProjects.filter((p) => p.status === "live").length;
  countEl.textContent = filtered.length + " showing";
  if (!filtered.length) {
    grid.innerHTML = `<div class="state-msg"><p>// no projects match your search.</p></div>`;
    return;
  }
  grid.innerHTML = filtered
    .map(
      (p) => `
      <a class="card" href="${p.link}" target="_blank">
        <div class="card-top">
          <div class="card-icon">${p.icon || "📁"}</div>
          <span class="card-status status-${p.status}">${p.status}</span>
        </div>
        <div class="card-title">${p.title}</div>
        <div class="card-desc">${p.description}</div>
        <div class="card-tags">${p.tags.map((t, i) => `<span class="tag ${TAG_COLORS[i % TAG_COLORS.length]}">${t}</span>`).join("")}</div>
        <div class="card-footer">
          <span class="card-date">${p.year}</span>
          <span class="launch-btn">launch →</span>
        </div>
      </a>`,
    )
    .join("");
}

searchEl.addEventListener("input", renderGrid);
loadProjects();
