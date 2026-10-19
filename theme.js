/* Restore before styles paint; storage is optional in private/restricted contexts. */
(() => {
  let theme = 'dark';
  try { if (localStorage.getItem('sion-theme') === 'light') theme = 'light'; } catch {}
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]').content = theme === 'light' ? '#ffffff' : '#000000';
})();
