const GITHUB_USER = "AaryanSuwal";
const GITHUB_REPO = "projects-hub";
const JSON_FILE = "projects.json";
const ICONS = [
  "📁",
  "✅",
  "🛠️",
  "🎮",
  "📊",
  "🌐",
  "🔐",
  "⚡",
  "🤖",
  "📱",
  "🎨",
  "🔧",
  "📝",
  "🚀",
  "💡",
  "🧪",
];

let selectedIcon = "📁";
let currentProjects = [];
let currentSHA = "";

// ── Token management ──────────────────────────────────
function getToken() {
  return localStorage.getItem("ph_token") || "";
}

function saveToken() {
  const val = document.getElementById("token-input").value.trim();
  if (!val) {
    showToast("// enter a valid token", "error");
    return;
  }
  localStorage.setItem("ph_token", val);
  init();
}

function clearToken() {
  if (!confirm("Clear saved token?")) return;
  localStorage.removeItem("ph_token");
  document.getElementById("main-panel").classList.remove("show");
  document.getElementById("token-screen").classList.add("show");
}

// ── UI init ───────────────────────────────────────────
function init() {
  const token = getToken();
  if (!token) {
    document.getElementById("token-screen").classList.add("show");
    document.getElementById("main-panel").classList.remove("show");
  } else {
    document.getElementById("token-screen").classList.remove("show");
    document.getElementById("main-panel").classList.add("show");
    fetchProjects();
  }
}

// ── Icon picker ───────────────────────────────────────
const picker = document.getElementById("icon-picker");
ICONS.forEach((icon) => {
  const el = document.createElement("div");
  el.className = "icon-opt" + (icon === selectedIcon ? " selected" : "");
  el.textContent = icon;
  el.onclick = () => {
    document
      .querySelectorAll(".icon-opt")
      .forEach((e) => e.classList.remove("selected"));
    el.classList.add("selected");
    selectedIcon = icon;
  };
  picker.appendChild(el);
});

// ── Toast ─────────────────────────────────────────────
function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove("show"), 3500);
}

// ── GitHub API ────────────────────────────────────────
function headers() {
  return {
    Authorization: `token ${getToken()}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

async function fetchProjects() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${JSON_FILE}`,
      { headers: headers() },
    );
    if (!res.ok) throw new Error();
    const data = await res.json();
    currentSHA = data.sha;
    currentProjects = JSON.parse(
      decodeURIComponent(escape(atob(data.content.replace(/\n/g, "")))),
    );
    renderList();
  } catch {
    document.getElementById("project-list").innerHTML =
      '<div class="empty-list">// could not load. check your token.</div>';
  }
}

function renderList() {
  const list = document.getElementById("project-list");
  if (!currentProjects.length) {
    list.innerHTML =
      '<div class="empty-list">// no projects yet. add one below.</div>';
    return;
  }
  list.innerHTML = currentProjects
    .map(
      (p, i) => `
      <div class="project-item">
        <div class="project-item-left">
          <div class="project-item-icon">${p.icon || "📁"}</div>
          <div>
            <div class="project-item-title">${p.title}</div>
            <div class="project-item-meta">${p.tags.join(", ")} · ${p.year}</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="project-item-status status-${p.status}">${p.status}</span>
          <button class="delete-btn" onclick="deleteProject(${i})">delete</button>
        </div>
      </div>`,
    )
    .join("");
}

async function saveProjects(projects, message) {
  const content = btoa(
    unescape(encodeURIComponent(JSON.stringify(projects, null, 2))),
  );
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${JSON_FILE}`,
    {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ message, content, sha: currentSHA }),
    },
  );
  if (!res.ok) throw new Error();
  const data = await res.json();
  currentSHA = data.content.sha;
}

async function addProject() {
  const title = document.getElementById("f-title").value.trim();
  const desc = document.getElementById("f-desc").value.trim();
  const tags = document
    .getElementById("f-tags")
    .value.split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const year = document.getElementById("f-year").value.trim();
  const status = document.getElementById("f-status").value;
  const link = document.getElementById("f-link").value.trim();

  if (!title || !desc || !tags.length || !link) {
    showToast("// fill in all required fields", "error");
    return;
  }

  const btn = document.getElementById("submit-btn");
  btn.disabled = true;
  btn.textContent = "// publishing...";

  try {
    const newProject = {
      id: title.toLowerCase().replace(/\s+/g, "-"),
      title,
      description: desc,
      tags,
      year,
      status,
      link,
      icon: selectedIcon,
    };
    const updated = [...currentProjects, newProject];
    await saveProjects(updated, `add project: ${title}`);
    currentProjects = updated;
    renderList();
    ["f-title", "f-desc", "f-tags", "f-link"].forEach(
      (id) => (document.getElementById(id).value = ""),
    );
    document.getElementById("f-year").value = "2025";
    showToast(`// "${title}" published ✓`, "success");
  } catch {
    showToast("// failed to publish. token may be invalid.", "error");
  }

  btn.disabled = false;
  btn.textContent = "// publish project →";
}

async function deleteProject(index) {
  const p = currentProjects[index];
  if (!confirm(`Delete "${p.title}"?`)) return;
  try {
    const updated = currentProjects.filter((_, i) => i !== index);
    await saveProjects(updated, `remove project: ${p.title}`);
    currentProjects = updated;
    renderList();
    showToast(`// "${p.title}" deleted`, "success");
  } catch {
    showToast("// failed to delete", "error");
  }
}

init();
