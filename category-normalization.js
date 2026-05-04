const categoryAliases = {
  "People Ops": "Operations",
  Compliance: "Finance",
  Sales: "Customer Success",
  Procurement: "Finance",
  "IT Support": "Operations"
};

dataset.forEach((item) => {
  item.category = categoryAliases[item.category] ?? item.category;
});

resetAllFilters();
