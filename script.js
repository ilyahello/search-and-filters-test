const dataset = [
  {
    id: "102481",
    name: "Beta Overview",
    category: "Group 3600",
    status: "Active",
    updated: "2026-04-10",
    description: "General note about record updates, ownership changes, and follow-up items captured in a longer paragraph. The text stays intentionally extended so the interface can still exercise freeform matching and longer dropdown excerpts."
  },
  {
    id: "104223",
    name: "Client 123AM",
    category: "Group 3610",
    status: "Draft",
    updated: "2026-04-09",
    description: "Placeholder summary containing review steps, related references, and action items that still read naturally outside of any industry-specific context. This gives the dropdown more realistic mixed keyword and number suggestions."
  },
  {
    id: "107532",
    name: "Type Fault",
    category: "Group 3620",
    status: "Archived",
    updated: "2026-04-05",
    description: "Archived record snapshot with neutral commentary, grouped metadata, and context notes. It remains useful for validating chips, grouped suggestions, and table styling under the same visual system."
  },
  {
    id: "204220",
    name: "Gamma Snapshot",
    category: "Project",
    status: "Active",
    updated: "2026-04-01",
    description: "Follow-up line item with handoff notes, section references, and a paragraph-length summary to simulate denser records when we search inside long descriptive cells."
  },
  {
    id: "431900",
    name: "Echo Notes",
    category: "Location",
    status: "Review",
    updated: "2026-03-28",
    description: "Location-driven note entry covering access details, deferred tasks, and support comments. The content stays long enough to support the future richer search logic we plan to layer on top of this prototype."
  }
];

const searchPanel = document.querySelector(".search-panel");
const searchInput = document.querySelector("#search-input");
const resultsBody = document.querySelector("#results-body");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const searchDropdown = document.querySelector("#search-dropdown");
const idleState = document.querySelector("#idle-state");
const suggestionsRoot = document.querySelector("#suggestions-root");
const clearButton = document.querySelector("#clear-button");
const dropdownSelectedFilters = document.querySelector("#dropdown-selected-filters");
const externalSelectedFilters = document.querySelector("#external-selected-filters");
const filterToggle = document.querySelector("#filter-toggle");
const filterMenu = document.querySelector("#filter-menu");
const filterRootView = document.querySelector("#filter-root-view");
const filterDetailView = document.querySelector("#filter-detail-view");
const filterDetailTitle = document.querySelector("#filter-detail-title");
const filterDetailOptions = document.querySelector("#filter-detail-options");
const filterBackButton = document.querySelector("#filter-back");

const activeTokens = [];
const activeFacetFilters = {
  category: new Set(),
  status: new Set()
};

let currentFilterView = "root";

function formatDate(dateString) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeValue(value) {
  return String(value).toLowerCase();
}

function highlightMatch(text, query) {
  if (!query) {
    return escapeHtml(text);
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return escapeHtml(text);
  }

  const before = escapeHtml(text.slice(0, matchIndex));
  const match = escapeHtml(text.slice(matchIndex, matchIndex + query.length));
  const after = escapeHtml(text.slice(matchIndex + query.length));

  return `${before}<mark>${match}</mark>${after}`;
}

function excerpt(text, query) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1 || text.length <= 92) {
    return highlightMatch(text, query);
  }

  const start = Math.max(0, matchIndex - 24);
  const end = Math.min(text.length, matchIndex + query.length + 40);
  const prefix = start > 0 ? "... " : "";
  const suffix = end < text.length ? " ..." : "";

  return `${prefix}${highlightMatch(text.slice(start, end), query)}${suffix}`;
}

function highlightDescription(text, query) {
  if (!query) {
    return escapeHtml(text);
  }

  const safeQuery = query.trim();

  if (!safeQuery) {
    return escapeHtml(text);
  }

  const escapedQuery = safeQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`(${escapedQuery})`, "gi");

  return escapeHtml(text).replace(matcher, "<mark>$1</mark>");
}

function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1)}…`;
}

function getActiveHighlightQuery() {
  const liveQuery = searchInput.value.trim();

  if (liveQuery) {
    return liveQuery;
  }

  const textToken = activeTokens.find((token) => token.label === "Text");
  return textToken ? textToken.value : "";
}

function tokenMatchesItem(item, token) {
  const value = normalizeValue(token.value);

  if (token.label === "ATA") {
    return normalizeValue(item.category).includes(value) || normalizeValue(item.id).includes(value);
  }

  if (token.label === "Work Order") {
    return normalizeValue(item.id).includes(value);
  }

  const haystack = Object.values(item).join(" ").toLowerCase();
  return haystack.includes(value);
}

function matchesFilters(item) {
  const tokenMatch = activeTokens.every((token) => tokenMatchesItem(item, token));
  const categoryMatch = activeFacetFilters.category.size === 0 || activeFacetFilters.category.has(item.category);
  const statusMatch = activeFacetFilters.status.size === 0 || activeFacetFilters.status.has(item.status);

  return tokenMatch && categoryMatch && statusMatch;
}

function renderFilterChips() {
  const selectedChipMarkup = [
    ...activeTokens.map((token, index) => `
    <div class="selected-chip">
      <span><span class="chip-label">${escapeHtml(token.label)}</span> <strong>${escapeHtml(token.value)}</strong></span>
      <button type="button" data-remove-token-index="${index}" aria-label="Remove filter ${escapeHtml(token.value)}">x</button>
    </div>
  `),
    ...[...activeFacetFilters.category].map((value) => `
    <div class="selected-chip">
      <span><span class="chip-label">Category</span> <strong>${escapeHtml(value)}</strong></span>
      <button type="button" data-remove-facet-type="category" data-remove-facet-value="${escapeHtml(value)}" aria-label="Remove category ${escapeHtml(value)}">x</button>
    </div>
  `),
    ...[...activeFacetFilters.status].map((value) => `
    <div class="selected-chip">
      <span><span class="chip-label">Status</span> <strong>${escapeHtml(value)}</strong></span>
      <button type="button" data-remove-facet-type="status" data-remove-facet-value="${escapeHtml(value)}" aria-label="Remove status ${escapeHtml(value)}">x</button>
    </div>
  `)
  ].join("");

  dropdownSelectedFilters.innerHTML = selectedChipMarkup;
  externalSelectedFilters.innerHTML = selectedChipMarkup;
  const hasAnyFilter = activeTokens.length > 0 || activeFacetFilters.category.size > 0 || activeFacetFilters.status.size > 0;
  dropdownSelectedFilters.hidden = !hasAnyFilter;
  externalSelectedFilters.hidden = !hasAnyFilter;
  clearButton.hidden = !hasAnyFilter && searchInput.value.trim() === "";
}

function renderRows(rows) {
  const query = getActiveHighlightQuery();

  resultsBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${formatDate(row.updated)}</td>
      <td>${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.name)}</td>
      <td>${escapeHtml(row.category)}</td>
      <td><span class="status-pill status-${normalizeValue(row.status)}">${escapeHtml(row.status)}</span></td>
      <td class="description-cell">${highlightDescription(truncateText(row.description), query)}</td>
    </tr>
  `).join("");

  resultsCount.textContent = `${rows.length} ${rows.length === 1 ? "row" : "rows"}`;
  emptyState.hidden = rows.length > 0;
}

function buildSuggestions(query) {
  if (!query) {
    return [];
  }

  const normalizedQuery = normalizeValue(query);
  const ataMatches = dataset
    .filter((item) => normalizeValue(item.category).startsWith("group ") && normalizeValue(item.category).includes(normalizedQuery))
    .map((item) => ({
      value: item.category.replace("Group ", ""),
      secondary: item.name
    }));

  const workOrderMatches = dataset
    .filter((item) => normalizeValue(item.id).includes(normalizedQuery))
    .map((item) => ({
      value: item.id,
      secondary: item.name
    }));

  const keywordMatches = [...new Set(dataset.map((item) => item.name))]
    .filter((value) => normalizeValue(value).includes(normalizedQuery))
    .map((value) => ({
      value,
      secondary: "Apply this keyword chip"
    }));

  const statusMatches = [...new Set(dataset.map((item) => item.status))]
    .filter((value) => normalizeValue(value).includes(normalizedQuery))
    .map((value) => ({
      value,
      secondary: "Filter all rows with this status"
    }));

  const textMatches = dataset
    .filter((item) => normalizeValue(item.description).includes(normalizedQuery))
    .map((item) => ({
      value: query,
      display: excerpt(item.description, query),
      secondary: `${item.id} / ${item.name}`
    }));

  return [
    {
      title: "",
      label: "Text",
      items: [
        {
          value: query,
          display: `Show all results containing ${highlightMatch(query, query)}`,
          secondary: "",
          isPrimaryAction: true
        }
      ]
    },
    { title: "Groups", label: "ATA", items: ataMatches.slice(0, 3) },
    { title: "Records", label: "Work Order", items: workOrderMatches.slice(0, 3) },
    { title: "Keywords", label: "Keyword", items: keywordMatches.slice(0, 3) },
    { title: "Statuses", label: "Status", items: statusMatches.slice(0, 3) },
    { title: "Description Matches", label: "Text", items: textMatches.slice(0, 2) }
  ].filter((group) => group.items.length > 0);
}

function renderFacetFilters() {
  const categories = [...new Set(dataset.map((item) => item.category))];
  const statuses = [...new Set(dataset.map((item) => item.status))];
  const isCategoryView = currentFilterView === "category";
  const items = isCategoryView ? categories : statuses;
  const type = isCategoryView ? "category" : "status";

  filterDetailTitle.textContent = isCategoryView ? "Category" : "Status";
  filterDetailOptions.innerHTML = items.map((value) => `
    <label
      class="filter-option"
      data-filter-type="${type}"
      data-filter-value="${escapeHtml(value)}"
    >
      <input
        type="checkbox"
        data-filter-type="${type}"
        data-filter-value="${escapeHtml(value)}"
        ${activeFacetFilters[type].has(value) ? "checked" : ""}
      >
      <span class="filter-option-label">${escapeHtml(value)}</span>
    </label>
  `).join("");
}

function showFilterRoot() {
  currentFilterView = "root";
  filterRootView.hidden = false;
  filterDetailView.hidden = true;
}

function showFilterDetail(type) {
  currentFilterView = type;
  filterRootView.hidden = true;
  filterDetailView.hidden = false;
  renderFacetFilters();
}

function renderSuggestions(query) {
  const groups = buildSuggestions(query);

  idleState.hidden = query.length > 0;
  suggestionsRoot.hidden = groups.length === 0;

  if (groups.length === 0) {
    suggestionsRoot.innerHTML = query
      ? `<div class="suggestion-group"><h2>No direct matches</h2><div class="suggestion-list"><div class="suggestion-item"><span>Try a broader keyword or pick a shorter fragment from the long description field.</span></div></div></div>`
      : "";
    suggestionsRoot.hidden = !query;
    return;
  }

  suggestionsRoot.innerHTML = groups.map((group) => `
    <section class="suggestion-group">
      ${group.title ? `<h2>${escapeHtml(group.title)}</h2>` : ""}
      <div class="suggestion-list">
        ${group.items.map((item) => `
          <button
            class="suggestion-item${item.isPrimaryAction ? " is-primary-action" : ""}"
            type="button"
            data-label="${escapeHtml(group.label)}"
            data-value="${escapeHtml(item.value)}"
          >
            <strong>${item.display ? item.display : highlightMatch(item.value, query)}</strong>
            ${item.isPrimaryAction
              ? `<span class="suggestion-enter">↵</span>`
              : `<span>${escapeHtml(item.secondary)}</span>`}
          </button>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function updateResults() {
  const query = searchInput.value.trim();
  const filteredRows = dataset.filter((item) => matchesFilters(item));
  renderRows(filteredRows);
  renderSuggestions(query);
  renderFilterChips();
  renderFacetFilters();
}

function openDropdown() {
  searchPanel.dataset.open = "true";
  renderFilterChips();
}

function closeDropdown() {
  searchPanel.dataset.open = "false";
  renderFilterChips();
}

function openFilterMenu() {
  searchPanel.dataset.filterOpen = "true";
  filterMenu.hidden = false;
  filterToggle.setAttribute("aria-expanded", "true");
  showFilterRoot();
}

function closeFilterMenu() {
  searchPanel.dataset.filterOpen = "false";
  filterMenu.hidden = true;
  filterToggle.setAttribute("aria-expanded", "false");
}

function addToken(label, value) {
  const exists = activeTokens.some((token) => token.label === label && token.value === value);

  if (!exists) {
    activeTokens.push({ label, value });
  }

  searchInput.value = "";
  updateResults();
  openDropdown();
}

function handleChipRemoval(event) {
  const tokenButton = event.target.closest("[data-remove-token-index]");
  const facetButton = event.target.closest("[data-remove-facet-type]");

  if (!tokenButton && !facetButton) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (tokenButton) {
    activeTokens.splice(Number(tokenButton.dataset.removeTokenIndex), 1);
    updateResults();
    return;
  }

  if (facetButton) {
    activeFacetFilters[facetButton.dataset.removeFacetType].delete(facetButton.dataset.removeFacetValue);
    updateResults();
  }
}

searchInput.addEventListener("input", updateResults);
searchInput.addEventListener("focus", () => {
  openDropdown();
  updateResults();
});

document.addEventListener("click", (event) => {
  if (!searchPanel.contains(event.target)) {
    closeDropdown();
    closeFilterMenu();
  }
});

filterToggle.addEventListener("click", (event) => {
  event.stopPropagation();

  if (filterMenu.hidden) {
    openFilterMenu();
  } else {
    closeFilterMenu();
  }
});

filterRootView.addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter-view]");

  if (!button) {
    return;
  }

  showFilterDetail(button.dataset.filterView);
});

filterBackButton.addEventListener("click", () => {
  showFilterRoot();
});

suggestionsRoot.addEventListener("click", (event) => {
  const button = event.target.closest(".suggestion-item");

  if (!button) {
    return;
  }

  addToken(button.dataset.label, button.dataset.value);
});

dropdownSelectedFilters.addEventListener("click", handleChipRemoval);
externalSelectedFilters.addEventListener("click", handleChipRemoval);

filterMenu.addEventListener("change", (event) => {
  const input = event.target.closest('input[data-filter-type]');

  if (!input) {
    return;
  }

  const { filterType, filterValue } = input.dataset;
  const targetSet = activeFacetFilters[filterType];

  if (input.checked) {
    targetSet.add(filterValue);
  } else {
    targetSet.delete(filterValue);
  }

  updateResults();
});

clearButton.addEventListener("click", () => {
  activeTokens.length = 0;
  activeFacetFilters.category.clear();
  activeFacetFilters.status.clear();
  searchInput.value = "";
  updateResults();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDropdown();
    searchInput.blur();
  }
});

renderRows(dataset);
renderFilterChips();
renderFacetFilters();
