const dataset = [
  { id: "102481", name: "Q2 Budget Summary", category: "Finance", score1: 84, score2: 23, status: "Active", updated: "2026-04-10", description: "General update covering ownership changes, approvals, and next steps for this item." },
  { id: "104223", name: "Enterprise Account Profile", category: "Customer Success", score1: 41, score2: 68, status: "Draft", updated: "2026-04-09", description: "Short review summary with references, open questions, and a reusable action list." },
  { id: "107532", name: "Brand Guidelines Archive", category: "Marketing", score1: 67, score2: 55, status: "Archived", updated: "2026-04-05", description: "Archived entry with final notes, grouped details, and compact publishing context." },
  { id: "204220", name: "Website Refresh Plan", category: "Product", score1: 92, score2: 81, status: "Active", updated: "2026-04-01", description: "Follow-up item with review notes, planning references, and a concise delivery summary." },
  { id: "431900", name: "Office Policy Note", category: "Operations", score1: 53, score2: 37, status: "Review", updated: "2026-03-28", description: "Short policy note covering pending items, ownership, and a brief internal comment." },
  { id: "442018", name: "Roadmap Status Memo", category: "Product", score1: 76, score2: 64, status: "Active", updated: "2026-03-24", description: "Summary note with scope updates, alignment remarks, and clearly stated next actions." },
  { id: "442019", name: "Onboarding Checklist Draft", category: "People Ops", score1: 28, score2: 49, status: "Draft", updated: "2026-03-21", description: "New entry describing baseline assumptions, owner notes, and initial review context." },
  { id: "442020", name: "Quarterly Audit Review", category: "Compliance", score1: 61, score2: 72, status: "Review", updated: "2026-03-19", description: "Review item with comments on completeness, checkpoints, and a short validation note." },
  { id: "442021", name: "Workspace Closure Brief", category: "Operations", score1: 35, score2: 18, status: "Archived", updated: "2026-03-17", description: "Archived summary with closure context, final notes, and a short publication remark." },
  { id: "442022", name: "Proposal Formatting Draft", category: "Sales", score1: 18, score2: 44, status: "Draft", updated: "2026-03-15", description: "Draft document entry with formatting notes, placeholders, and pending approval." },
  { id: "442023", name: "Pricing Page Update", category: "Marketing", score1: 73, score2: 86, status: "Active", updated: "2026-03-12", description: "Active entry showing updated checkpoints, review comments, and a clear status note." },
  { id: "442024", name: "Internal Process Notes", category: "Operations", score1: 47, score2: 33, status: "Review", updated: "2026-03-10", description: "Internal notes with pending items, owner comments, and concise process context." },
  { id: "442025", name: "Executive Summary Pack", category: "Finance", score1: 88, score2: 91, status: "Active", updated: "2026-03-08", description: "Published summary with cleaned details, final comments, and ready-to-share content." },
  { id: "442026", name: "Regional Launch Plan", category: "Sales", score1: 39, score2: 52, status: "Draft", updated: "2026-03-05", description: "Planning item with review feedback, scoped tasks, and lightweight implementation notes." },
  { id: "442027", name: "Vendor Contract Archive", category: "Procurement", score1: 24, score2: 29, status: "Archived", updated: "2026-03-03", description: "Archived entry containing final notes, publication state, and a short summary." },
  { id: "442028", name: "Policy Layer Review", category: "Compliance", score1: 58, score2: 62, status: "Review", updated: "2026-03-01", description: "Review entry with recent changes, linked comments, and one-line stakeholder feedback." },
  { id: "442029", name: "Service Desk Summary", category: "Customer Success", score1: 81, score2: 74, status: "Active", updated: "2026-02-26", description: "Active summary with brief notes on timing, ownership, and open follow-up questions." },
  { id: "442030", name: "Hiring Process Draft", category: "People Ops", score1: 14, score2: 26, status: "Draft", updated: "2026-02-22", description: "Draft record describing setup assumptions, dependencies, and a short summary." },
  { id: "442031", name: "Incident Response Review", category: "IT Support", score1: 64, score2: 57, status: "Review", updated: "2026-02-19", description: "Review-oriented entry with comments on completeness, references, and decision status." },
  { id: "442032", name: "Retention Note", category: "Customer Success", score1: 95, score2: 88, status: "Active", updated: "2026-02-15", description: "Active note with final output, clear ownership, and a compact descriptive summary." }
];

const FIELD_DEFS = {
  keyword: { label: "Keyword", type: "text", icon: "KW" },
  updated: { label: "Date", type: "date", icon: "DT" },
  id: { label: "ID", type: "number", icon: "ID" },
  name: { label: "Name", type: "text", icon: "Aa" },
  category: { label: "Category", type: "enum", icon: "CT" },
  score1: { label: "Score 1", type: "number", icon: "01" },
  score2: { label: "Score 2", type: "number", icon: "02" },
  status: { label: "Status", type: "enum", icon: "ST" },
  description: { label: "Description", type: "text", icon: "TX" }
};

const OPERATOR_DEFS = {
  text: [
    { value: "is", label: "=" },
    { value: "isNot", label: "≠" },
    { value: "contains", label: "≥" }
  ],
  enum: [
    { value: "is", label: "=" },
    { value: "isNot", label: "≠" }
  ],
  number: [
    { value: "is", label: "=" },
    { value: "isNot", label: "≠" },
    { value: "gt", label: "≥" },
    { value: "lt", label: "≤" }
  ],
  date: [
    { value: "is", label: "=" },
    { value: "isNot", label: "≠" },
    { value: "after", label: "≥" },
    { value: "before", label: "≤" }
  ]
};

const searchPanel = document.querySelector(".search-panel");
const filterPanel = document.querySelector(".filter-panel");
const searchInput = document.querySelector("#search-input");
const resultsBody = document.querySelector("#results-body");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const idleState = document.querySelector("#idle-state");
const suggestionsRoot = document.querySelector("#suggestions-root");
const dropdownSelectedFilters = document.querySelector("#dropdown-selected-filters");
const externalSelectedFilters = document.querySelector("#external-selected-filters");
const resetAllButton = document.querySelector("#reset-all-button");
const applyButton = document.querySelector("#apply-button");
const resetButton = document.querySelector("#reset-button");
const filterToggle = document.querySelector("#filter-toggle");
const filterMenu = document.querySelector("#filter-menu");
const filterGroupsRoot = document.querySelector("#filter-groups");
const filterAddButton = document.querySelector("#filter-add-button");
const filterResetButton = document.querySelector("#filter-reset-button");
const filterApplyButton = document.querySelector("#filter-apply-button");

const activeTokens = [];
const draftTokens = [];
const activeGroups = [];
const draftGroups = [];

let nextGroupId = 1;
let nextConditionId = 1;
let openFieldPickerId = null;
let fieldPickerQuery = "";
let activeSuggestionIndex = -1;
let currentSuggestionEntries = [];

function getChevronIcon(direction = "down") {
  const rotation = direction === "up" ? "rotate(180 8 8)" : "";
  return `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <g transform="${rotation}">
        <path d="M4 6.5L8 10L12 6.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
      </g>
    </svg>
  `;
}

function getCloseIcon() {
  return `
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 5L11 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
      <path d="M11 5L5 11" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
    </svg>
  `;
}

function createCondition(overrides = {}) {
  return {
    id: nextConditionId++,
    join: "AND",
    field: "",
    operator: "",
    value: "",
    ...overrides
  };
}

function createGroup(overrides = {}) {
  return {
    id: nextGroupId++,
    join: "AND",
    conditions: [createCondition()],
    ...overrides
  };
}

function cloneCondition(condition) {
  return createCondition({
    join: condition.join,
    field: condition.field,
    operator: condition.operator,
    value: condition.value
  });
}

function cloneGroup(group) {
  return createGroup({
    join: group.join,
    conditions: group.conditions.map((condition) => cloneCondition(condition))
  });
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

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

function getOperators(fieldKey) {
  if (!fieldKey) {
    return [];
  }

  return OPERATOR_DEFS[FIELD_DEFS[fieldKey].type];
}

function getDefaultOperator(fieldKey) {
  return getOperators(fieldKey)[0]?.value ?? "";
}

function getEnumOptions(fieldKey) {
  return [...new Set(dataset.map((item) => item[fieldKey]))].sort((left, right) => left.localeCompare(right));
}

function getOperatorLabel(fieldKey, operatorValue) {
  return getOperators(fieldKey).find((item) => item.value === operatorValue)?.label ?? operatorValue;
}

function getDisplayValue(fieldKey, value) {
  if (fieldKey === "updated" && value) {
    return formatDate(value);
  }

  return String(value);
}

function highlightMatch(text, query) {
  if (!query) {
    return escapeHtml(text);
  }

  const source = String(text);
  const lowerSource = source.toLowerCase();
  const lowerQuery = String(query).toLowerCase();
  const index = lowerSource.indexOf(lowerQuery);

  if (index === -1) {
    return escapeHtml(text);
  }

  return `${escapeHtml(source.slice(0, index))}<mark>${escapeHtml(source.slice(index, index + query.length))}</mark>${escapeHtml(source.slice(index + query.length))}`;
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
  if (!query || !query.trim()) {
    return escapeHtml(text);
  }

  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matcher = new RegExp(`(${escapedQuery})`, "gi");
  return escapeHtml(text).replace(matcher, "<mark>$1</mark>");
}

function isConditionComplete(condition) {
  if (!condition.field || !condition.operator) {
    return false;
  }

  if (FIELD_DEFS[condition.field].type === "number") {
    return condition.value !== "" && !Number.isNaN(Number(condition.value));
  }

  return String(condition.value).trim() !== "";
}

function getCompleteConditions(groups) {
  return groups.flatMap((group) => group.conditions.filter(isConditionComplete));
}

function getFieldValue(item, fieldKey) {
  return item[fieldKey];
}

function matchesCondition(item, condition) {
  const fieldDef = FIELD_DEFS[condition.field];
  const itemValue = condition.field === "keyword"
    ? Object.values(item).join(" ")
    : getFieldValue(item, condition.field);

  if (fieldDef.type === "text") {
    const itemText = normalizeValue(itemValue);
    const conditionText = normalizeValue(condition.value);

    if (condition.operator === "is") {
      return itemText === conditionText;
    }

    if (condition.operator === "isNot") {
      return itemText !== conditionText;
    }

    return itemText.includes(conditionText);
  }

  if (fieldDef.type === "enum") {
    const itemText = normalizeValue(itemValue);
    const conditionText = normalizeValue(condition.value);
    return condition.operator === "isNot" ? itemText !== conditionText : itemText === conditionText;
  }

  if (fieldDef.type === "number") {
    const itemNumber = Number(itemValue);
    const conditionNumber = Number(condition.value);

    if (condition.operator === "gt") {
      return itemNumber >= conditionNumber;
    }

    if (condition.operator === "lt") {
      return itemNumber <= conditionNumber;
    }

    if (condition.operator === "isNot") {
      return itemNumber !== conditionNumber;
    }

    return itemNumber === conditionNumber;
  }

  const itemDate = String(itemValue);
  const conditionDate = String(condition.value);

  if (condition.operator === "after") {
    return itemDate >= conditionDate;
  }

  if (condition.operator === "before") {
    return itemDate <= conditionDate;
  }

  if (condition.operator === "isNot") {
    return itemDate !== conditionDate;
  }

  return itemDate === conditionDate;
}

function matchesConditionList(item, conditions) {
  const completeConditions = conditions.filter(isConditionComplete);

  if (completeConditions.length === 0) {
    return true;
  }

  return completeConditions.reduce((result, condition, index) => {
    const currentMatch = matchesCondition(item, condition);

    if (index === 0) {
      return currentMatch;
    }

    return condition.join === "OR" ? result || currentMatch : result && currentMatch;
  }, true);
}

function matchesGroupSet(item, groups) {
  const completeGroups = groups.filter((group) => group.conditions.some(isConditionComplete));

  if (completeGroups.length === 0) {
    return true;
  }

  return completeGroups.reduce((result, group, index) => {
    const currentMatch = matchesConditionList(item, group.conditions);

    if (index === 0) {
      return currentMatch;
    }

    return group.join === "OR" ? result || currentMatch : result && currentMatch;
  }, true);
}

function tokenMatchesItem(item, token) {
  const value = normalizeValue(token.value);

  if (token.label === "Category") {
    return normalizeValue(item.category).includes(value);
  }

  if (token.label === "Record") {
    return normalizeValue(item.id).includes(value);
  }

  if (token.label === "Name") {
    return normalizeValue(item.name).includes(value);
  }

  if (token.label === "Status") {
    return normalizeValue(item.status).includes(value);
  }

  return Object.values(item).join(" ").toLowerCase().includes(value);
}

function matchesTokenGroup(item, tokens) {
  return tokens.length === 0 || tokens.some((token) => tokenMatchesItem(item, token));
}

function matchesActiveFilters(item) {
  const tokenGroups = activeTokens.reduce((groups, token) => {
    if (!groups[token.label]) {
      groups[token.label] = [];
    }

    groups[token.label].push(token);
    return groups;
  }, {});

  return Object.values(tokenGroups).every((tokens) => matchesTokenGroup(item, tokens)) && matchesGroupSet(item, activeGroups);
}

function getDraftSuggestionRows() {
  return dataset.filter((item) => matchesGroupSet(item, draftGroups));
}

function getActiveHighlightQuery() {
  return activeTokens.find((token) => token.label === "Text")?.value ?? "";
}

function syncDraftWithApplied() {
  draftTokens.length = 0;
  activeTokens.forEach((token) => draftTokens.push({ ...token }));

  draftGroups.length = 0;
  if (activeGroups.length > 0) {
    activeGroups.forEach((group) => draftGroups.push(cloneGroup(group)));
  } else {
    draftGroups.push(createGroup());
  }

  openFieldPickerId = null;
  fieldPickerQuery = "";
}

function ensureAtLeastOneGroup() {
  if (draftGroups.length === 0) {
    draftGroups.push(createGroup());
  }

  draftGroups.forEach((group) => {
    if (!group.conditions || group.conditions.length === 0) {
      group.conditions = [createCondition()];
    }
  });
}

function isDraftTokenSelected(label, value) {
  return draftTokens.some((token) => token.label === label && token.value === value);
}

function isPristineEmptyGroup(group) {
  return Boolean(
    group
    && group.conditions
    && group.conditions.length === 1
    && !group.conditions[0].field
    && !isConditionComplete(group.conditions[0])
  );
}

function buildConditionChip(condition, dataAttribute) {
  return `
    <div class="selected-chip">
      <span><span class="chip-label">${escapeHtml(FIELD_DEFS[condition.field].label)}</span> <strong>${escapeHtml(`${getOperatorLabel(condition.field, condition.operator)} ${getDisplayValue(condition.field, condition.value)}`)}</strong></span>
      <button type="button" ${dataAttribute}="${condition.id}" aria-label="Remove filter ${escapeHtml(FIELD_DEFS[condition.field].label)}">${getCloseIcon()}</button>
    </div>
  `;
}

function buildReadOnlyChipMarkup(tokens, groups) {
  return [
    ...tokens.map((token) => `
      <div class="selected-chip is-readonly-chip">
        <span><span class="chip-label">${escapeHtml(token.label)}</span> <strong>${escapeHtml(token.value)}</strong></span>
      </div>
    `),
    ...getCompleteConditions(groups).map((condition) => `
      <div class="selected-chip is-readonly-chip">
        <span><span class="chip-label">${escapeHtml(FIELD_DEFS[condition.field].label)}</span> <strong>${escapeHtml(`${getOperatorLabel(condition.field, condition.operator)} ${getDisplayValue(condition.field, condition.value)}`)}</strong></span>
      </div>
    `)
  ].join("");
}

function buildChipMarkup(tokens, groups, tokenAttribute, conditionAttribute) {
  return [
    ...tokens.map((token, index) => `
      <div class="selected-chip">
        <span><span class="chip-label">${escapeHtml(token.label)}</span> <strong>${escapeHtml(token.value)}</strong></span>
        <button type="button" ${tokenAttribute}="${index}" aria-label="Remove filter ${escapeHtml(token.value)}">${getCloseIcon()}</button>
      </div>
    `),
    ...getCompleteConditions(groups).map((condition) => buildConditionChip(condition, conditionAttribute))
  ].join("");
}

function getMirroredFieldKey(label) {
  if (label === "Text") {
    return "keyword";
  }

  if (label === "Category") {
    return "category";
  }

  if (label === "Record") {
    return "id";
  }

  if (label === "Name") {
    return "name";
  }

  if (label === "Status") {
    return "status";
  }

  return "";
}

function getManualConditionSignature(condition) {
  return `${condition.field}::${condition.operator}::${normalizeValue(condition.value)}`;
}

function getMirroredOperator(field) {
  return field === "keyword" ? "contains" : "is";
}

function getMirroredTokenGroups(tokens, groups) {
  const manualConditionSignatures = new Set(
    getCompleteConditions(groups).map((condition) => getManualConditionSignature(condition))
  );
  const groupedTokens = [];

  tokens.forEach((token) => {
    const field = getMirroredFieldKey(token.label);

    if (!field) {
      return;
    }

    const signature = `${field}::${getMirroredOperator(field)}::${normalizeValue(token.value)}`;

    if (manualConditionSignatures.has(signature)) {
      return;
    }

    let tokenGroup = groupedTokens.find((item) => item.label === token.label);
    if (!tokenGroup) {
      tokenGroup = { label: token.label, field, items: [] };
      groupedTokens.push(tokenGroup);
    }

    if (!tokenGroup.items.some((item) => normalizeValue(item.value) === normalizeValue(token.value))) {
      tokenGroup.items.push({ value: token.value });
    }
  });

  return groupedTokens.filter((group) => group.items.length > 0);
}

function createConditionFromToken(label, value, overrides = {}) {
  const field = getMirroredFieldKey(label);
  if (!field) {
    return null;
  }

  return createCondition({
    join: "AND",
    field,
    operator: getMirroredOperator(field),
    value,
    ...overrides
  });
}

function createGroupFromTokenGroup(tokenGroup, groupOverrides = {}) {
  const conditions = tokenGroup.items.map((item, index) => createCondition({
    join: index === 0 ? "AND" : "OR",
    field: tokenGroup.field,
    operator: getMirroredOperator(tokenGroup.field),
    value: item.value
  }));

  return createGroup({
    join: "AND",
    conditions,
    ...groupOverrides
  });
}

function getFieldOptionsMarkup(selectedField) {
  return Object.entries(FIELD_DEFS).map(([fieldKey, fieldDef]) => `
    <option value="${fieldKey}" ${selectedField === fieldKey ? "selected" : ""}>${escapeHtml(fieldDef.label)}</option>
  `).join("");
}

function renderFilterChips() {
  const hasDraft = draftTokens.length > 0 || getCompleteConditions(draftGroups).length > 0 || searchInput.value.trim() !== "";
  const hasApplied = activeTokens.length > 0 || getCompleteConditions(activeGroups).length > 0;
  const isAnyDropdownOpen = searchPanel.dataset.open === "true" || filterPanel.dataset.open === "true";
  const hasAppliedFilters = activeTokens.length > 0 || getCompleteConditions(activeGroups).length > 0;

  dropdownSelectedFilters.innerHTML = buildChipMarkup(draftTokens, draftGroups, "data-remove-token-index", "data-remove-condition-id");
  externalSelectedFilters.innerHTML = isAnyDropdownOpen
    ? buildChipMarkup(activeTokens, activeGroups, "data-remove-applied-token-index", "data-remove-applied-condition-id")
    : buildReadOnlyChipMarkup(activeTokens, activeGroups);
  dropdownSelectedFilters.hidden = !hasDraft;
  externalSelectedFilters.hidden = !hasApplied;
  resetAllButton.hidden = !hasApplied;
  filterToggle.dataset.filtered = hasAppliedFilters ? "true" : "false";
}

function renderRows(rows) {
  const query = getActiveHighlightQuery();

  resultsBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${formatDate(row.updated)}</td>
      <td>${escapeHtml(row.id)}</td>
      <td>${escapeHtml(row.name)}</td>
      <td>${escapeHtml(row.category)}</td>
      <td>${escapeHtml(row.score1)}</td>
      <td>${escapeHtml(row.score2)}</td>
      <td><span class="status-pill status-${normalizeValue(row.status)}">${escapeHtml(row.status)}</span></td>
      <td class="description-cell">${highlightDescription(row.description, query)}</td>
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
  const sourceRows = getDraftSuggestionRows();

  const categoryMatches = [...new Set(sourceRows.map((item) => item.category))]
    .filter((value) => normalizeValue(value).includes(normalizedQuery))
    .map((value) => ({ value, secondary: "Filter matching categories" }));

  const recordMatches = sourceRows
    .filter((item) => normalizeValue(item.id).includes(normalizedQuery))
    .map((item) => ({ value: item.id, secondary: item.name }));

  const nameMatches = [...new Set(sourceRows.map((item) => item.name))]
    .filter((value) => normalizeValue(value).includes(normalizedQuery))
    .map((value) => ({ value, secondary: "Apply this name chip" }));

  const statusMatches = [...new Set(sourceRows.map((item) => item.status))]
    .filter((value) => normalizeValue(value).includes(normalizedQuery))
    .map((value) => ({ value, secondary: "Filter rows with this status" }));

  const textMatches = sourceRows
    .filter((item) => normalizeValue(item.description).includes(normalizedQuery))
    .map((item) => ({ value: query, display: excerpt(item.description, query), secondary: `${item.id} / ${item.name}` }));

  return [
    {
      title: "",
      label: "Text",
      items: [{ value: query, display: `Show all results containing ${highlightMatch(query, query)}`, secondary: "", isPrimaryAction: true }]
    },
    { title: "Categories", label: "Category", items: categoryMatches.slice(0, 4) },
    { title: "Records", label: "Record", items: recordMatches.slice(0, 4) },
    { title: "Names", label: "Name", items: nameMatches.slice(0, 4) },
    { title: "Statuses", label: "Status", items: statusMatches.slice(0, 4) },
    { title: "Description Matches", label: "Text", items: textMatches.slice(0, 3) }
  ].filter((group) => group.items.length > 0);
}

function renderSuggestions(query) {
  const groups = buildSuggestions(query);
  currentSuggestionEntries = groups.flatMap((group) => group.items.map((item) => ({
    label: group.label,
    value: item.value
  })));

  idleState.hidden = query.length > 0;
  suggestionsRoot.hidden = groups.length === 0;

  if (groups.length === 0) {
    activeSuggestionIndex = -1;
    suggestionsRoot.innerHTML = query
      ? `<div class="suggestion-group"><h2>No direct matches</h2><div class="suggestion-list"><div class="suggestion-item"><span></span><span class="suggestion-body"><span>Try a broader keyword or loosen one of the filter conditions.</span></span><span></span></div></div></div>`
      : "";
    suggestionsRoot.hidden = !query;
    return;
  }

  if (activeSuggestionIndex < 0 || activeSuggestionIndex >= currentSuggestionEntries.length) {
    activeSuggestionIndex = currentSuggestionEntries.length > 0 ? 0 : -1;
  }

  let suggestionIndex = 0;

  suggestionsRoot.innerHTML = groups.map((group) => `
    <section class="suggestion-group">
      ${group.title ? `<h2>${escapeHtml(group.title)}</h2>` : ""}
      <div class="suggestion-list">
        ${group.items.map((item) => `
          <label class="suggestion-item${item.isPrimaryAction ? " is-primary-action" : ""}${isDraftTokenSelected(group.label, item.value) ? " is-selected" : ""}">
            <input class="suggestion-check" type="checkbox" data-label="${escapeHtml(group.label)}" data-value="${escapeHtml(item.value)}" ${isDraftTokenSelected(group.label, item.value) ? "checked" : ""}>
            <span class="suggestion-body">
              <strong>${item.display ? item.display : highlightMatch(item.value, query)}</strong>
              <span>${escapeHtml(item.secondary)}</span>
            </span>
            ${item.isPrimaryAction ? `<span class="suggestion-enter">↵</span>` : `<span></span>`}
          </label>
        `).join("")}
      </div>
    </section>
  `).join("");
}

function renderSuggestions(query) {
  const groups = buildSuggestions(query);
  currentSuggestionEntries = groups.flatMap((group) => group.items.map((item) => ({
    label: group.label,
    value: item.value
  })));

  idleState.hidden = query.length > 0;
  suggestionsRoot.hidden = groups.length === 0;

  if (groups.length === 0) {
    activeSuggestionIndex = -1;
    suggestionsRoot.innerHTML = query
      ? `<div class="suggestion-group"><h2>No direct matches</h2><div class="suggestion-list"><div class="suggestion-item"><span></span><span class="suggestion-body"><span>Try a broader keyword or loosen one of the filter conditions.</span></span><span></span></div></div></div>`
      : "";
    suggestionsRoot.hidden = !query;
    return;
  }

  if (activeSuggestionIndex < 0 || activeSuggestionIndex >= currentSuggestionEntries.length) {
    activeSuggestionIndex = currentSuggestionEntries.length > 0 ? 0 : -1;
  }

  let suggestionIndex = 0;

  suggestionsRoot.innerHTML = groups.map((group) => `
    <section class="suggestion-group">
      ${group.title ? `<h2>${escapeHtml(group.title)}</h2>` : ""}
      <div class="suggestion-list">
        ${group.items.map((item) => {
          const itemIndex = suggestionIndex++;
          return `
            <label class="suggestion-item${item.isPrimaryAction ? " is-primary-action" : ""}${isDraftTokenSelected(group.label, item.value) ? " is-selected" : ""}${itemIndex === activeSuggestionIndex ? " is-active" : ""}" data-suggestion-index="${itemIndex}">
              <input class="suggestion-check" type="checkbox" data-label="${escapeHtml(group.label)}" data-value="${escapeHtml(item.value)}" ${isDraftTokenSelected(group.label, item.value) ? "checked" : ""}>
              <span class="suggestion-body">
                <strong>${item.display ? item.display : highlightMatch(item.value, query)}</strong>
                <span>${escapeHtml(item.secondary)}</span>
              </span>
              ${item.isPrimaryAction ? `<span class="suggestion-enter">↵</span>` : `<span></span>`}
            </label>
          `;
        }).join("")}
      </div>
    </section>
  `).join("");

  const activeSuggestion = suggestionsRoot.querySelector(`[data-suggestion-index="${activeSuggestionIndex}"]`);
  if (activeSuggestion) {
    activeSuggestion.scrollIntoView({ block: "nearest" });
  }
}

function moveActiveSuggestion(direction) {
  if (currentSuggestionEntries.length === 0) {
    return;
  }

  if (activeSuggestionIndex === -1) {
    activeSuggestionIndex = 0;
  } else {
    activeSuggestionIndex = (activeSuggestionIndex + direction + currentSuggestionEntries.length) % currentSuggestionEntries.length;
  }

  renderSuggestions(searchInput.value.trim());
}

function selectActiveSuggestion() {
  if (activeSuggestionIndex < 0 || activeSuggestionIndex >= currentSuggestionEntries.length) {
    return;
  }

  const activeEntry = currentSuggestionEntries[activeSuggestionIndex];
  toggleDraftToken(activeEntry.label, activeEntry.value);
  renderFilterChips();
  renderSuggestions(searchInput.value.trim());
}

function renderValueControl(condition, groupIndex, conditionIndex) {
  if (!condition.field) {
    return "";
  }

  const fieldDef = FIELD_DEFS[condition.field];

  if (fieldDef.type === "enum") {
    return `
      <select class="condition-select" data-condition-prop="value" data-group-index="${groupIndex}" data-condition-index="${conditionIndex}">
        <option value="">Value</option>
        ${getEnumOptions(condition.field).map((option) => `
          <option value="${escapeHtml(option)}" ${condition.value === option ? "selected" : ""}>${escapeHtml(option)}</option>
        `).join("")}
      </select>
    `;
  }

  if (fieldDef.type === "number") {
    return `<input class="condition-input" type="number" data-condition-prop="value" data-group-index="${groupIndex}" data-condition-index="${conditionIndex}" value="${escapeHtml(condition.value)}" placeholder="Enter value">`;
  }

  if (fieldDef.type === "date") {
    return `<input class="condition-input" type="date" data-condition-prop="value" data-group-index="${groupIndex}" data-condition-index="${conditionIndex}" value="${escapeHtml(condition.value)}">`;
  }

  return `<input class="condition-input" type="text" data-condition-prop="value" data-group-index="${groupIndex}" data-condition-index="${conditionIndex}" value="${escapeHtml(condition.value)}" placeholder="Enter value">`;
}

function renderFieldPicker(groupIndex, conditionIndex, condition) {
  const filteredFields = Object.entries(FIELD_DEFS)
    .filter(([, fieldDef]) => normalizeValue(fieldDef.label).includes(normalizeValue(fieldPickerQuery)));

  return `
    <div class="field-picker" data-picker-id="${condition.id}">
      <input class="field-picker-search" type="text" value="${escapeHtml(fieldPickerQuery)}" placeholder="Search..." data-field-picker-search="${condition.id}">
      <div class="field-picker-list">
        ${filteredFields.map(([fieldKey, fieldDef], index) => `
          <button class="field-picker-option${index === 0 ? " is-active" : ""}" type="button" data-select-field="${fieldKey}" data-group-index="${groupIndex}" data-condition-index="${conditionIndex}">
            <span class="field-picker-option-icon">${escapeHtml(fieldDef.icon)}</span>
            <span>${escapeHtml(fieldDef.label)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderConditionRow(groupIndex, conditionIndex, condition) {
  const hasField = Boolean(condition.field);
  const group = draftGroups[groupIndex];
  const nestedJoinValue = group.conditions[1]?.join ?? condition.join;
  const isJoinLocked = conditionIndex > 1;
  const isEmptyFirstRow = conditionIndex === 0 && !hasField && group.conditions.length === 1;

  if (isEmptyFirstRow) {
    return `
      <div class="group-condition-row is-empty-filter-row">
        <div class="filter-select-shell">
          <button class="filter-field-button" type="button" data-open-field-picker="${condition.id}">
            <span>Select filter</span>
            <span class="filter-field-caret">${getChevronIcon(openFieldPickerId === condition.id ? "up" : "down")}</span>
          </button>
          ${openFieldPickerId === condition.id ? renderFieldPicker(groupIndex, conditionIndex, condition) : ""}
        </div>
      </div>
    `;
  }

  return `
    <div class="group-condition-row">
      ${conditionIndex === 0
        ? `<span class="group-condition-prefix">Where</span>`
        : `<button class="condition-select group-condition-link group-join-toggle${isJoinLocked ? " is-disabled" : ""}" type="button" data-toggle-condition-join data-group-index="${groupIndex}" data-condition-index="${conditionIndex}" ${isJoinLocked ? "disabled" : ""}>${nestedJoinValue}</button>`}
      <div class="filter-select-shell">
        <button class="filter-field-button${hasField ? " has-value" : ""}" type="button" data-open-field-picker="${condition.id}">
          <span>${escapeHtml(hasField ? FIELD_DEFS[condition.field].label : "Select filter")}</span>
          <span class="filter-field-caret">${getChevronIcon(openFieldPickerId === condition.id ? "up" : "down")}</span>
        </button>
        ${openFieldPickerId === condition.id ? renderFieldPicker(groupIndex, conditionIndex, condition) : ""}
      </div>
      ${hasField ? `
        <select class="condition-select no-caret" data-condition-prop="operator" data-group-index="${groupIndex}" data-condition-index="${conditionIndex}">
          ${getOperators(condition.field).map((operator) => `
            <option value="${operator.value}" ${condition.operator === operator.value ? "selected" : ""}>${operator.label}</option>
          `).join("")}
        </select>
      ` : `<span></span>`}
      ${hasField ? renderValueControl(condition, groupIndex, conditionIndex) : `<span></span>`}
      ${conditionIndex === 0
        ? `<span></span>`
        : `<button class="group-condition-remove" type="button" data-remove-nested-condition data-group-index="${groupIndex}" data-condition-index="${conditionIndex}" aria-label="Remove nested filter">${getCloseIcon()}</button>`}
    </div>
  `;
}

function renderMirroredConditionRow(tokenGroup, tokenIndex, tokenValue) {
  const defaultOperator = getMirroredOperator(tokenGroup.field);
  const operatorOptions = getOperators(tokenGroup.field).map((operator) => `
    <option value="${operator.value}" ${operator.value === defaultOperator ? "selected" : ""}>${operator.label}</option>
  `).join("");
  const valueControl = FIELD_DEFS[tokenGroup.field].type === "enum"
    ? `
      <select class="condition-select" data-mirrored-prop="value" data-mirrored-label="${escapeHtml(tokenGroup.label)}" data-mirrored-value="${escapeHtml(tokenValue)}">
        ${getEnumOptions(tokenGroup.field).map((option) => `
          <option value="${escapeHtml(option)}" ${option === tokenValue ? "selected" : ""}>${escapeHtml(option)}</option>
        `).join("")}
      </select>
    `
    : `<input class="condition-input" type="${FIELD_DEFS[tokenGroup.field].type === "number" ? "number" : "text"}" data-mirrored-prop="value" data-mirrored-label="${escapeHtml(tokenGroup.label)}" data-mirrored-value="${escapeHtml(tokenValue)}" value="${escapeHtml(tokenValue)}" placeholder="Enter value">`;

  return `
    <div class="group-condition-row is-derived-row">
      ${tokenIndex === 0
        ? `<span class="group-condition-prefix">Where</span>`
        : `<span class="group-condition-link derived-link-label">OR</span>`}
      <select class="condition-select" data-mirrored-prop="field" data-mirrored-label="${escapeHtml(tokenGroup.label)}" data-mirrored-value="${escapeHtml(tokenValue)}">
        ${getFieldOptionsMarkup(tokenGroup.field)}
      </select>
      <select class="condition-select no-caret" data-mirrored-prop="operator" data-mirrored-label="${escapeHtml(tokenGroup.label)}" data-mirrored-value="${escapeHtml(tokenValue)}">
        ${operatorOptions}
      </select>
      ${valueControl}
      <button class="group-condition-remove" type="button" data-remove-mirrored-token="${escapeHtml(tokenGroup.label)}::${escapeHtml(tokenValue)}" aria-label="Remove mirrored filter">${getCloseIcon()}</button>
    </div>
  `;
}

function renderGroup(group, groupIndex) {
  return `
    <div class="filter-group">
      ${groupIndex > 0
        ? `<button class="condition-select filter-group-link group-join-toggle" type="button" data-toggle-group-join data-group-index="${groupIndex}">${group.join}</button>`
        : ""}
      <div class="filter-group-card">
        <button class="filter-group-remove" type="button" data-remove-group="${groupIndex}" aria-label="Remove filter group">${getCloseIcon()}</button>
        <div class="group-conditions">
          ${group.conditions.map((condition, conditionIndex) => renderConditionRow(groupIndex, conditionIndex, condition)).join("")}
        </div>
        <div class="group-actions">
          <button class="group-nested-button" type="button" data-add-nested="${groupIndex}">Add nested filter</button>
        </div>
      </div>
    </div>
  `;
}

function renderMirroredGroup(tokenGroup, tokenGroupIndex, hasManualGroups) {
  return `
    <div class="filter-group is-derived-group">
      ${tokenGroupIndex > 0 || hasManualGroups
        ? `<div class="condition-select filter-group-link is-readonly">${tokenGroupIndex === 0 && hasManualGroups ? "AND" : "AND"}</div>`
        : ""}
      <div class="filter-group-card is-derived">
        <div class="group-conditions">
          ${tokenGroup.items.map((item, tokenIndex) => renderMirroredConditionRow(tokenGroup, tokenIndex, item.value)).join("")}
        </div>
        <div class="group-actions">
          <button class="group-nested-button" type="button" data-add-mirrored-nested="${escapeHtml(tokenGroup.label)}">Add nested filter</button>
        </div>
      </div>
    </div>
  `;
}

function renderFilterGroups() {
  ensureAtLeastOneGroup();

  const mirroredGroups = getMirroredTokenGroups(draftTokens, draftGroups);
  const visibleDraftGroups = mirroredGroups.length > 0
    ? draftGroups.filter((group) => !isPristineEmptyGroup(group))
    : draftGroups;
  const manualMarkup = visibleDraftGroups.map((group, groupIndex) => renderGroup(group, groupIndex)).join("");
  const mirroredMarkup = mirroredGroups
    .map((group, groupIndex) => renderMirroredGroup(group, groupIndex, visibleDraftGroups.length > 0))
    .join("");

  filterGroupsRoot.innerHTML = `${manualMarkup}${mirroredMarkup}`;

  if (openFieldPickerId !== null) {
    const activeInput = filterGroupsRoot.querySelector(`[data-field-picker-search="${openFieldPickerId}"]`);
    if (activeInput) {
      activeInput.focus();
      activeInput.setSelectionRange(activeInput.value.length, activeInput.value.length);
    }
  }
}

function updateResults() {
  renderRows(dataset.filter((item) => matchesActiveFilters(item)));
  renderFilterChips();
  renderFilterGroups();
}

function toggleJoinValue(value) {
  return value === "AND" ? "OR" : "AND";
}

function promoteDraftTokenToEditableFilter(label, value, overrides = {}) {
  const condition = createConditionFromToken(label, value, overrides);

  if (!condition) {
    return null;
  }

  removeDraftTokenByLabelAndValue(label, value);

  const hasOnlyPlaceholderGroup = draftGroups.length === 1
    && draftGroups[0].conditions.length === 1
    && !isConditionComplete(draftGroups[0].conditions[0])
    && !draftGroups[0].conditions[0].field;

  if (hasOnlyPlaceholderGroup) {
    draftGroups[0].conditions[0] = condition;
  } else {
    draftGroups.push(createGroup({
      join: "AND",
      conditions: [condition]
    }));
  }

  return condition;
}

function promoteMirroredGroupToEditableFilter(label, options = {}) {
  const mirroredGroup = getMirroredTokenGroups(draftTokens, draftGroups).find((group) => group.label === label);

  if (!mirroredGroup) {
    return null;
  }

  mirroredGroup.items.forEach((item) => removeDraftTokenByLabelAndValue(label, item.value));

  const group = createGroupFromTokenGroup(mirroredGroup, { join: options.join ?? "AND" });

  if (options.addNested) {
    group.conditions.push(createCondition({
      join: group.conditions[1]?.join ?? "AND",
      field: group.conditions[0]?.field ?? "",
      operator: group.conditions[0]?.field ? getDefaultOperator(group.conditions[0].field) : "",
      value: ""
    }));
  }

  draftGroups.push(group);
  return group;
}

function openSearchDropdown({ syncDraft = false } = {}) {
  if (syncDraft) {
    syncDraftWithApplied();
  }

  closeFilterMenu();
  searchPanel.dataset.open = "true";
  renderFilterChips();
  renderSuggestions(searchInput.value.trim());
}

function closeSearchDropdown() {
  searchPanel.dataset.open = "false";
  renderFilterChips();
}

function openFilterMenu({ syncDraft = false } = {}) {
  if (syncDraft) {
    syncDraftWithApplied();
  }

  closeSearchDropdown();
  filterPanel.dataset.open = "true";
  filterMenu.hidden = false;
  filterToggle.setAttribute("aria-expanded", "true");

  const hasSearchDrivenState = draftTokens.length > 0 || searchInput.value.trim() !== "";
  const hasAnyCompleteConditions = getCompleteConditions(draftGroups).length > 0;
  const isPristineFilterState = draftGroups.length === 1
    && draftGroups[0].conditions.length === 1
    && !draftGroups[0].conditions[0].field
    && !hasAnyCompleteConditions
    && !hasSearchDrivenState;

  const firstEmptyCondition = draftGroups.flatMap((group) => group.conditions).find((condition) => !condition.field);
  if (isPristineFilterState && firstEmptyCondition) {
    openFieldPickerId = firstEmptyCondition.id;
  } else {
    openFieldPickerId = null;
  }

  renderFilterGroups();
}

function closeFilterMenu() {
  filterPanel.dataset.open = "false";
  filterMenu.hidden = true;
  filterToggle.setAttribute("aria-expanded", "false");
  openFieldPickerId = null;
  fieldPickerQuery = "";
}

function toggleDraftToken(label, value) {
  const index = draftTokens.findIndex((token) => token.label === label && token.value === value);

  if (index >= 0) {
    draftTokens.splice(index, 1);
  } else {
    draftTokens.push({ label, value });
  }
}

function applyDraftFilters() {
  ensureAtLeastOneGroup();

  activeTokens.length = 0;
  draftTokens.forEach((token) => activeTokens.push({ ...token }));

  activeGroups.length = 0;
  draftGroups.forEach((group) => activeGroups.push(cloneGroup(group)));

  updateResults();
  closeSearchDropdown();
  closeFilterMenu();
}

function resetAllFilters() {
  activeTokens.length = 0;
  draftTokens.length = 0;
  activeGroups.length = 0;
  draftGroups.length = 0;
  draftGroups.push(createGroup());
  ensureAtLeastOneGroup();
  openFieldPickerId = null;
  fieldPickerQuery = "";
  searchInput.value = "";
  updateResults();
  renderSuggestions("");
}

function handleDraftChipRemoval(event) {
  const tokenButton = event.target.closest("[data-remove-token-index]");
  const conditionButton = event.target.closest("[data-remove-condition-id]");

  if (!tokenButton && !conditionButton) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (tokenButton) {
    draftTokens.splice(Number(tokenButton.dataset.removeTokenIndex), 1);
  }

  if (conditionButton) {
    const conditionId = Number(conditionButton.dataset.removeConditionId);
    draftGroups.forEach((group) => {
      group.conditions = group.conditions.filter((condition) => condition.id !== conditionId);
      if (group.conditions.length === 0) {
        group.conditions.push(createCondition());
      }
    });
  }

  renderFilterChips();
  renderFilterGroups();
  renderSuggestions(searchInput.value.trim());
}

function removeDraftTokenByLabelAndValue(label, value) {
  const index = draftTokens.findIndex((token) => token.label === label && token.value === value);
  if (index >= 0) {
    draftTokens.splice(index, 1);
  }
}

function handleAppliedChipRemoval(event) {
  const tokenButton = event.target.closest("[data-remove-applied-token-index]");
  const conditionButton = event.target.closest("[data-remove-applied-condition-id]");

  if (!tokenButton && !conditionButton) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (tokenButton) {
    activeTokens.splice(Number(tokenButton.dataset.removeAppliedTokenIndex), 1);
  }

  if (conditionButton) {
    const conditionId = Number(conditionButton.dataset.removeAppliedConditionId);
    activeGroups.forEach((group) => {
      group.conditions = group.conditions.filter((condition) => condition.id !== conditionId);
    });
  }

  syncDraftWithApplied();
  updateResults();
  renderSuggestions(searchInput.value.trim());
}

searchInput.addEventListener("focus", () => {
  openSearchDropdown({ syncDraft: searchPanel.dataset.open !== "true" && filterPanel.dataset.open !== "true" });
});

searchInput.addEventListener("input", () => {
  activeSuggestionIndex = 0;
  renderSuggestions(searchInput.value.trim());
  renderFilterChips();
});

filterToggle.addEventListener("click", (event) => {
  event.stopPropagation();

  if (filterPanel.dataset.open === "true") {
    closeFilterMenu();
    return;
  }

  openFilterMenu({ syncDraft: searchPanel.dataset.open !== "true" && filterPanel.dataset.open !== "true" });
});

suggestionsRoot.addEventListener("change", (event) => {
  const input = event.target.closest(".suggestion-check");

  if (!input) {
    return;
  }

  toggleDraftToken(input.dataset.label, input.dataset.value);
  renderFilterChips();
  renderSuggestions(searchInput.value.trim());
});

dropdownSelectedFilters.addEventListener("click", handleDraftChipRemoval);
externalSelectedFilters.addEventListener("click", handleAppliedChipRemoval);

filterGroupsRoot.addEventListener("click", (event) => {
  const removeGroupButton = event.target.closest("[data-remove-group]");
  const removeNestedButton = event.target.closest("[data-remove-nested-condition]");
  const addNestedButton = event.target.closest("[data-add-nested]");
  const addMirroredNestedButton = event.target.closest("[data-add-mirrored-nested]");
  const fieldButton = event.target.closest("[data-open-field-picker]");
  const fieldOption = event.target.closest("[data-select-field]");
  const removeMirroredTokenButton = event.target.closest("[data-remove-mirrored-token]");
  const toggleGroupJoinButton = event.target.closest("[data-toggle-group-join]");
  const toggleConditionJoinButton = event.target.closest("[data-toggle-condition-join]");

  if (toggleGroupJoinButton) {
    const group = draftGroups[Number(toggleGroupJoinButton.dataset.groupIndex)];
    group.join = toggleJoinValue(group.join);
    renderFilterChips();
    renderFilterGroups();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (toggleConditionJoinButton) {
    const group = draftGroups[Number(toggleConditionJoinButton.dataset.groupIndex)];
    const conditionIndex = Number(toggleConditionJoinButton.dataset.conditionIndex);
    const nextJoin = toggleJoinValue(group.conditions[conditionIndex].join);
    group.conditions[conditionIndex].join = nextJoin;

    group.conditions.forEach((nestedCondition, nestedIndex) => {
      if (nestedIndex > 1) {
        nestedCondition.join = nextJoin;
      }
    });

    renderFilterChips();
    renderFilterGroups();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (removeMirroredTokenButton) {
    const [label, value] = removeMirroredTokenButton.dataset.removeMirroredToken.split("::");
    removeDraftTokenByLabelAndValue(label, value);
    renderFilterChips();
    renderFilterGroups();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (addMirroredNestedButton) {
    const group = promoteMirroredGroupToEditableFilter(addMirroredNestedButton.dataset.addMirroredNested, { addNested: true });
    if (group) {
      openFieldPickerId = group.conditions[group.conditions.length - 1].id;
      fieldPickerQuery = "";
    }
    renderFilterChips();
    renderFilterGroups();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (removeGroupButton) {
    draftGroups.splice(Number(removeGroupButton.dataset.removeGroup), 1);
    ensureAtLeastOneGroup();
    renderFilterGroups();
    renderFilterChips();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (removeNestedButton) {
    const group = draftGroups[Number(removeNestedButton.dataset.groupIndex)];
    group.conditions.splice(Number(removeNestedButton.dataset.conditionIndex), 1);
    if (group.conditions.length === 0) {
      group.conditions.push(createCondition());
    }
    renderFilterGroups();
    renderFilterChips();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (addNestedButton) {
    const group = draftGroups[Number(addNestedButton.dataset.addNested)];
    const baseField = group.conditions[0]?.field || "";
    const nestedJoin = group.conditions[1]?.join ?? "AND";
    group.conditions.push(createCondition({
      join: nestedJoin,
      field: baseField,
      operator: baseField ? getDefaultOperator(baseField) : "",
      value: ""
    }));
    renderFilterGroups();
    return;
  }

  if (fieldButton) {
    event.stopPropagation();
    const nextId = Number(fieldButton.dataset.openFieldPicker);
    openFieldPickerId = openFieldPickerId === nextId ? null : nextId;
    fieldPickerQuery = "";
    renderFilterGroups();
    return;
  }

  if (fieldOption) {
    event.stopPropagation();
    const group = draftGroups[Number(fieldOption.dataset.groupIndex)];
    const condition = group.conditions[Number(fieldOption.dataset.conditionIndex)];
    condition.field = fieldOption.dataset.selectField;
    condition.operator = getDefaultOperator(condition.field);
    condition.value = "";
    openFieldPickerId = null;
    fieldPickerQuery = "";
    renderFilterGroups();
    renderFilterChips();
    renderSuggestions(searchInput.value.trim());
  }
});

filterGroupsRoot.addEventListener("input", (event) => {
  const pickerSearch = event.target.closest("[data-field-picker-search]");
  const valueInput = event.target.closest("[data-condition-prop='value']");

  if (pickerSearch) {
    fieldPickerQuery = pickerSearch.value;
    renderFilterGroups();
    return;
  }

  if (!valueInput) {
    return;
  }

  const group = draftGroups[Number(valueInput.dataset.groupIndex)];
  const condition = group.conditions[Number(valueInput.dataset.conditionIndex)];
  condition.value = valueInput.value;
  renderFilterChips();
  renderSuggestions(searchInput.value.trim());
});

filterGroupsRoot.addEventListener("change", (event) => {
  const mirroredTarget = event.target.closest("[data-mirrored-prop]");
  const conditionTarget = event.target.closest("[data-condition-prop]");

  if (mirroredTarget) {
    const label = mirroredTarget.dataset.mirroredLabel;
    const value = mirroredTarget.dataset.mirroredValue;
    const mirroredField = getMirroredFieldKey(label);
    const prop = mirroredTarget.dataset.mirroredProp;
    const overrides = {
      field: mirroredField,
      operator: getMirroredOperator(mirroredField),
      value
    };

    if (prop === "field") {
      overrides.field = mirroredTarget.value;
      overrides.operator = getDefaultOperator(mirroredTarget.value);
      overrides.value = "";
    }

    if (prop === "operator") {
      overrides.operator = mirroredTarget.value;
    }

    if (prop === "value") {
      overrides.value = mirroredTarget.value;
    }

    promoteDraftTokenToEditableFilter(label, value, overrides);
    renderFilterChips();
    renderFilterGroups();
    renderSuggestions(searchInput.value.trim());
    return;
  }

  if (!conditionTarget) {
    return;
  }

  const group = draftGroups[Number(conditionTarget.dataset.groupIndex)];
  const condition = group.conditions[Number(conditionTarget.dataset.conditionIndex)];
  condition[conditionTarget.dataset.conditionProp] = conditionTarget.value;

  renderFilterChips();
  renderFilterGroups();
  renderSuggestions(searchInput.value.trim());
});

filterAddButton.addEventListener("click", () => {
  const newGroup = createGroup({ join: "AND" });
  draftGroups.push(newGroup);
  openFieldPickerId = newGroup.conditions[0].id;
  fieldPickerQuery = "";
  renderFilterGroups();
});

resetAllButton.addEventListener("click", resetAllFilters);
applyButton.addEventListener("click", applyDraftFilters);
filterResetButton.addEventListener("click", resetAllFilters);
filterApplyButton.addEventListener("click", applyDraftFilters);
resetButton.addEventListener("click", resetAllFilters);

document.addEventListener("click", (event) => {
  const clickPath = event.composedPath();

  if (!clickPath.includes(searchPanel)) {
    closeSearchDropdown();
  }

  if (!clickPath.includes(filterPanel)) {
    closeFilterMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (document.activeElement === searchInput && searchPanel.dataset.open === "true") {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActiveSuggestion(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActiveSuggestion(-1);
      return;
    }

    if (event.key === "Enter" && currentSuggestionEntries.length > 0) {
      event.preventDefault();
      selectActiveSuggestion();
      return;
    }
  }

  if (event.key === "Escape") {
    closeSearchDropdown();
    closeFilterMenu();
    searchInput.blur();
  }
});

draftGroups.push(createGroup());
renderRows(dataset);
renderFilterGroups();
renderFilterChips();
