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

  // Page title without quotes
  const pageTitle = window.PAGE_TITLE
  ? window.PAGE_TITLE.replace(/^["“]|["”]$/g, "")
  : "";


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

  const emailToolsEl = document.getElementById("email-tools");

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function isValidEmail(email) {
    // simple, pragmatic check (no overfitting)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function getEmails(items) {
    const set = new Set();
    items.forEach((p) => {
      const e = normalizeEmail(p.email);
      if (e && isValidEmail(e)) set.add(e);
    });
    return Array.from(set);
  }

  function chunkArray(arr, chunkSize) {
    const out = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      out.push(arr.slice(i, i + chunkSize));
    }
    return out;
  }

  async function copyText(text) {
    // Prefer Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return;
    }
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }


  // ---- Helpers for X/Twitter status ----------------------------------------

  // Derive a normalized status string from data
  function getDerivedStatus(p) {
    const s = (p.xStatus || "").toLowerCase();

    if (s === "active" || s === "exited" || s === "none" || s === "unknown") {
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
    if (status === "exited") return "x-exited";
    if (status === "active") return "x-active";
    if (status === "none") return "x-none";
    return "x-unknown";
  }

  // Filter by status dropdown
  function matchesXStatus(p, statusValue) {
    if (!statusValue) return true; // "All"
    const derived = getDerivedStatus(p);

    // New values like "active" | "exited" | "none" | "unknown"
    if (
      statusValue === "active" ||
      statusValue === "exited" ||
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
    } else if (status === "exited") {
      label = "Has eXited";
    } else if (status === "none") {
      label = "Not on X";
    }

    // Append archived exit tweet link if available
    if (status === "exited" && p.xLastArchiveUrl) {
      label += ` - <a href="${p.xLastArchiveUrl}" class="link-primary" target="_blank" rel="noopener noreferrer">see exit post</a>`;
    }

    const profileLink =
      p.xHandle && (status === "active" || status === "exited")
        ? `<a href="https://x.com/${p.xHandle.replace(
            "@",
            ""
          )}" class="link-primary" target="_blank" rel="noopener noreferrer">${p.xHandle}</a>`
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
    let exited = 0;
    let none = 0;
    let unknown = 0;

    items.forEach((p) => {
      const s = getDerivedStatus(p);
      if (s === "active") active += 1;
      else if (s === "exited") exited += 1;
      else if (s === "none") none += 1;
      else unknown += 1;
    });

    const onX = active;
    const offX = exited + none;
    const percentOn = Math.round((onX / total) * 100);

    const label = getStatsLabel({
      searchTerm: searchInput.value.trim(),
      countryValue,
    });

    function getStatsLabel({ searchTerm, countryValue }) {
      // 1) Search query wins
      if (searchTerm) {
        return `Search results for “${searchTerm}”`;
      }

      // 2) If user selected a country in the filter, show that
      if (countryValue) {
        const fromMap = countryMap.get(countryValue);
        return `${fromMap || countryValue} MEPs`;
      }

      // 3) Otherwise, use the page context (e.g., /politicians-nl/)
      if (window.PAGE_TITLE) {
        return pageTitle;
      }

      // 4) Fallback
      return "All countries";
    }


    statsEl.innerHTML = `
      <div class="stats-card" role="region" aria-label="X account statistics">
        <div class="stats-title">${label} on X</div>

        <div class="stats-bar-info">
          <div class="stats-percentage">${percentOn}%</div>
          <div class="stats-total">${onX} of ${total} MPs are active on X</div>
        </div>

        <div class="stats-bar" aria-hidden="true">
          <div class="stats-bar-fill" style="width:${percentOn}%"></div>
        </div>

        <div class="stats-boxes">
          <div class="stats-box active">
            <div class="stats-box-number">${active}</div>
            <div class="stats-box-label">Active on X</div>
          </div>

          <div class="stats-box exited">
            <div class="stats-box-number">${exited}</div>
            <div class="stats-box-label">eXited</div>
          </div>

          <div class="stats-box not-on">
            <div class="stats-box-number">${none}</div>
            <div class="stats-box-label">Not on X</div>
          </div>

          ${
            unknown
              ? `
            <div class="stats-box unknown">
              <div class="stats-box-number">${unknown}</div>
              <div class="stats-box-label">Unknown</div>
            </div>
          `
              : ""
          }
        </div>
      </div>
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
                  ? `<li><strong>Email:</strong> <a href="mailto:${p.email}" class="link-primary">${p.email}</a></li>`
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

    // ---- Render list ----------------------------------------------------------


    function renderEmailTools(items) {
    if (!emailToolsEl) return;

    const emails = getEmails(items);
    const total = emails.length;

    if (total === 0) {
      emailToolsEl.innerHTML = "";
      return;
    }

    const chunkSize = 120; // tweak: 80–150 is common
    const chunks = chunkArray(emails, chunkSize);

    const buttonsHtml = chunks
      .map((chunk, idx) => {
        const part = idx + 1;
        const label = `Copy email addresses (${part}/${chunks.length})`;
        return `<button type="button" class="email-btn" data-part="${idx}">${label}</button>`;
      })
      .join("");

    emailToolsEl.innerHTML = `
      <div class="email-tools-card">
        <div class="email-tools-summary">
          <strong>${total}</strong> unique email addresses found.
          <span class="email-tools-hint">Copy in parts for mail clients.</span>
        </div>

        <div class="email-tools-buttons">
          ${buttonsHtml}
        </div>

        <div class="email-tools-note">
          Tip: paste addresses into <strong>BCC</strong> to avoid exposing recipients.
        </div>
      </div>
    `;

    // Wire click handlers
    emailToolsEl.querySelectorAll("button[data-part]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const idx = Number(btn.getAttribute("data-part"));
        const chunk = chunks[idx];

        // separator: Outlook often likes '; ' — Gmail accepts ',' too
        const text = chunk.join("; ");

        try {
          await copyText(text);
          const original = btn.textContent;
          btn.textContent = "Copied!";
          setTimeout(() => (btn.textContent = original), 1200);
        } catch (e) {
          console.warn("Copy failed:", e);
          alert("Copy failed. Try a different browser or copy manually.");
        }
      });
    });
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
    renderEmailTools(filtered);
  }

  // Initial render with all items
  renderList(allPoliticians);
  renderStats(allPoliticians, "");
  renderEmailTools(allPoliticians);

  // Wire events
  searchInput.addEventListener("input", applyFilters);
  xStatusSelect.addEventListener("change", applyFilters);
  if (hasLevel) levelSelect.addEventListener("change", applyFilters);
  if (hasCountry) countrySelect.addEventListener("change", applyFilters);
})();
