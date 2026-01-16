(function () {
  const searchInput = document.getElementById("politician-search");
  const listEl = document.getElementById("politician-list");
  const levelSelect = document.getElementById("filter-level");
  const countrySelect = document.getElementById("filter-country");
  const xStatusSelect = document.getElementById("filter-xstatus");
  const statsEl = document.getElementById("politician-stats");

  // Required elements
  if (!listEl || !searchInput || !xStatusSelect || !statsEl) {
    console.warn("Required elements not found (list/search/status/stats).");
    return;
  }

  // Optional elements (can be null if hidden by Hugo)
  const hasLevel = !!levelSelect;
  const hasCountry = !!countrySelect;

  const raw = window.POLITICIANS || [];
  let allPoliticians = [];

  if (Array.isArray(raw)) {
    allPoliticians = raw;
  } else if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        allPoliticians = parsed;
      }
    } catch (e) {
      console.warn("Failed to parse POLITICIANS JSON string:", e);
    }
  }

  // ---- Helpers for X/Twitter status ----------------------------------------

  // Derive a normalized status string from data
  function getDerivedStatus(p) {
    const s = (p.xStatus || "").toLowerCase();

    if (s === "active" || s === "inactive" || s === "none" || s === "unknown") {
      return s;
    }

    // Fallbacks based on usesX
    if (p.usesX === true) return "active";
    if (p.usesX === false) return "none";

    return "unknown";
  }

  // Class for card coloring
  function getStatusClass(p) {
    const status = getDerivedStatus(p);
    if (status === "inactive") return "x-inactive";
    if (status === "active") return "x-active";
    if (status === "none") return "x-none";
    return "x-unknown";
  }

  // Filter by status dropdown
  function matchesXStatus(p, statusValue) {
    if (!statusValue) return true; // "All"
    const derived = getDerivedStatus(p);

    // New values like "active" | "inactive" | "none" | "unknown"
    if (
      statusValue === "active" ||
      statusValue === "inactive" ||
      statusValue === "none"
    ) {
      return derived === statusValue;
    }

    // Backwards-compatible: "on" / "off"
    if (statusValue === "on") {
      return derived === "active";
    }
    if (statusValue === "off") {
      return derived === "none";
    }

    return true;
  }

  // Human-readable status line + optional archive link
  function renderXStatus(p) {
    const status = getDerivedStatus(p);
    const handle = p.xHandle ? ` (${p.xHandle})` : "";

    let label = "Status unknown";
    if (status === "active") {
      label = "Still active on X";
    } else if (status === "inactive") {
      label = "Has X, but is inactive";
    } else if (status === "none") {
      label = "Not on X";
    }

    // Append archived exit tweet link if available
    if (status === "inactive" && p.xLastArchiveUrl) {
      label += ` - <a href="${p.xLastArchiveUrl}" target="_blank" rel="noopener noreferrer">see exit post</a>`;
    }

    const profileLink =
      p.xHandle && (status === "active" || status === "inactive")
        ? `<a href="https://x.com/${p.xHandle.replace(
            "@",
            ""
          )}" target="_blank" rel="noopener noreferrer">${p.xHandle}</a>`
        : "";

    const handlePart = profileLink || handle;

    return `
      <li>
        <strong>X status:</strong> ${label}
        ${handlePart ? ` ${handlePart}` : ""}
      </li>
    `;
  }

  // ---- Build country dropdown options from data -----------------------------

  const countryMap = new Map(); // code -> label

  allPoliticians.forEach((p) => {
    if (p.countryCode && p.country) {
      countryMap.set(p.countryCode, p.country);
    } else if (p.country) {
      countryMap.set(p.country, p.country);
    }
  });

  if (countrySelect) {
    const sortedCountries = Array.from(countryMap.entries()).sort((a, b) =>
      a[1].localeCompare(b[1], undefined, { sensitivity: "base" })
    );

    sortedCountries.forEach(([code, label]) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = label;
      countrySelect.appendChild(opt);
    });
  }


  // ---- Stats ----------------------------------------------------------------

  function renderStats(items, countryValue) {
    if (!statsEl) return;

    const total = items.length;

    if (total === 0) {
      statsEl.innerHTML =
        '<p class="politician-stats-text">No politicians match the current filters.</p>';
      return;
    }

    let active = 0;
    let inactive = 0;
    let none = 0;
    let unknown = 0;

    items.forEach((p) => {
      const s = getDerivedStatus(p);
      if (s === "active") active += 1;
      else if (s === "inactive") inactive += 1;
      else if (s === "none") none += 1;
      else unknown += 1;
    });

    const onX = active + inactive;
    const offX = none;
    const percentOn = Math.round((onX / total) * 100);

    let label = "All countries";
    if (countryValue) {
      const fromMap = countryMap.get(countryValue);
      label = fromMap || countryValue;
    }

    const prefix = countryValue ? `${label}: ` : "";

    statsEl.innerHTML = `
      <p class="politician-stats-text">
        ${prefix}
        <strong>Still active on X:</strong> ${active} /
        <strong>Inactive but on X:</strong> ${inactive} /
        <strong>Not on X:</strong> ${none}
        ${unknown ? `/ <strong>Unknown:</strong> ${unknown}` : ""}
        <span class="politician-stats-percent">
          (${percentOn}% <strong><em>still have an X account</em></strong>)
        </span>
      </p>
    `;
  }

  // ---- Other filters --------------------------------------------------------

  function matchesSearch(p, term) {
    if (!term) return true;
    const t = term.toLowerCase();

    const fields = [
      p.name,
      p.country,
      p.level,
      p.institution,
      p.role,
      p.party,
      p.xHandle,
      p.email,
    ];

    return fields
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(t));
  }

  function matchesLevel(p, levelValue) {
    if (!levelValue) return true;
    return (p.level || "").toLowerCase() === levelValue.toLowerCase();
  }

  function matchesCountry(p, countryValue) {
    if (!countryValue) return true;
    const code = (p.countryCode || p.country || "").toString().toLowerCase();
    return code === countryValue.toLowerCase();
  }

  // ---- Render list ----------------------------------------------------------

  function renderList(items) {
    if (!items.length) {
      listEl.innerHTML = "<p>No politicians match your filters.</p>";
      return;
    }

    const html = items
      .map((p) => {
        const countryText = p.country || p.countryCode || "";
        const levelText =
          p.level === "eu"
            ? "EU level"
            : p.level === "national"
            ? "National"
            : p.level || "";

        const statusClass = getStatusClass(p);

        return `
          <article class="politician-card ${statusClass}">
            <h2>${p.name}</h2>
            <ul>
              ${
                countryText
                  ? `<li><strong>Country:</strong> ${countryText}</li>`
                  : ""
              }
              ${
                levelText ? `<li><strong>Level:</strong> ${levelText}</li>` : ""
              }
              ${
                p.institution
                  ? `<li><strong>Institution:</strong> ${p.institution}</li>`
                  : ""
              }
              ${p.role ? `<li><strong>Role:</strong> ${p.role}</li>` : ""}
              ${p.party ? `<li><strong>Party:</strong> ${p.party}</li>` : ""}
              ${
                p.email
                  ? `<li><strong>Email:</strong> <a href="mailto:${p.email}">${p.email}</a></li>`
                  : ""
              }
              ${renderXStatus(p)}
            </ul>
          </article>
        `;
      })
      .join("");

    listEl.innerHTML = html;
  }

  // ---- Apply filters --------------------------------------------------------

  function applyFilters() {
    const term = searchInput.value.trim();
    const levelValue = hasLevel ? levelSelect.value : "";
    const countryValue = hasCountry ? countrySelect.value : "";
    const xStatusValue = xStatusSelect.value;

    const filtered = allPoliticians.filter((p) => {
      return (
        matchesSearch(p, term) &&
        matchesLevel(p, levelValue) &&
        matchesCountry(p, countryValue) &&
        matchesXStatus(p, xStatusValue)
      );
    });

    renderList(filtered);
    renderStats(filtered, countryValue);
  }

  // Initial render with all items
  renderList(allPoliticians);
  renderStats(allPoliticians, "");

  // Wire events
  searchInput.addEventListener("input", applyFilters);
  xStatusSelect.addEventListener("change", applyFilters);
  if (hasLevel) levelSelect.addEventListener("change", applyFilters);
  if (hasCountry) countrySelect.addEventListener("change", applyFilters);
})();
