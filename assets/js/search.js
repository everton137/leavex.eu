console.log("search.js loaded");

(function () {
  const searchInput = document.getElementById("politician-search");
  const listEl = document.getElementById("politician-list");
  const levelSelect = document.getElementById("filter-level");
  const countrySelect = document.getElementById("filter-country");

  if (!listEl || !searchInput || !levelSelect || !countrySelect) {
    console.warn("One or more filter elements not found.");
    return;
  }

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

  console.log(raw)
  console.log("Loaded politicians:", allPoliticians.length, allPoliticians);

  // ---- Build country dropdown options from data ----
  const countryMap = new Map(); // code -> label

  allPoliticians.forEach((p) => {
    if (p.countryCode && p.country) {
      countryMap.set(p.countryCode, p.country);
    } else if (p.country) {
      // fallback if no countryCode
      countryMap.set(p.country, p.country);
    }
  });

  const sortedCountries = Array.from(countryMap.entries())
    .sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: "base" }));

  sortedCountries.forEach(([code, label]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = label;
    countrySelect.appendChild(opt);
  });

  // ---- Filtering logic ----

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
      p.email
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

  function renderList(items) {
    if (!items.length) {
      listEl.innerHTML = "<p>No politicians match your filters.</p>";
      return;
    }

    const html = items.map((p) => {
      const usesXText = p.usesX
        ? `Yes (${p.xHandle || "no handle"})`
        : "No";

      const countryText = p.country || p.countryCode || "";
      const levelText = p.level === "eu"
        ? "EU level"
        : p.level === "national"
        ? "National"
        : p.level || "";

      return `
        <article class="politician-card">
          <h2>${p.name}</h2>
          <ul>
            ${countryText ? `<li><strong>Country:</strong> ${countryText}</li>` : ""}
            ${levelText ? `<li><strong>Level:</strong> ${levelText}</li>` : ""}
            ${p.institution ? `<li><strong>Institution:</strong> ${p.institution}</li>` : ""}
            ${p.role ? `<li><strong>Role:</strong> ${p.role}</li>` : ""}
            ${p.party ? `<li><strong>Party:</strong> ${p.party}</li>` : ""}
            ${p.email ? `<li><strong>Email:</strong> <a href="mailto:${p.email}">${p.email}</a></li>` : ""}
            <li><strong>On X/Twitter:</strong> ${usesXText}</li>
          </ul>
        </article>
      `;
    }).join("");

    listEl.innerHTML = html;
  }

  function applyFilters() {
    const term = searchInput.value.trim();
    const levelValue = levelSelect.value;
    const countryValue = countrySelect.value;

    const filtered = allPoliticians.filter((p) => {
      return (
        matchesSearch(p, term) &&
        matchesLevel(p, levelValue) &&
        matchesCountry(p, countryValue)
      );
    });

    renderList(filtered);
  }

  // Initial render with all items
  renderList(allPoliticians);

  // Wire events
  searchInput.addEventListener("input", applyFilters);
  levelSelect.addEventListener("change", applyFilters);
  countrySelect.addEventListener("change", applyFilters);
})();
