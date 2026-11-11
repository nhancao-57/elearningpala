/* Apply the theme before the stylesheet loads, then load shared markup. */
(() => {
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const readPreference = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const savePreference = (key, value) => {
    try { localStorage.setItem(key, value); } catch { /* Session still works. */ }
  };
  let theme = readPreference('theme');
  const isDark = () => theme === 'dark' || (theme !== 'light' && systemTheme.matches);

  function applyTheme() {
    const dark = isDark();
    document.documentElement.classList.toggle('dark', dark);
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', 'Chế độ tối');
    });
    document.querySelectorAll('[id^="theme-toggle-dark-icon"]').forEach((icon) => icon.classList.toggle('hidden', dark));
    document.querySelectorAll('[id^="theme-toggle-light-icon"]').forEach((icon) => icon.classList.toggle('hidden', !dark));
  }

  applyTheme();
  systemTheme.addEventListener('change', applyTheme);
  const baseURL = new URL('.', document.currentScript.src);

  function updateNavigation() {
    const section = window.location.hash || '#exercises';
    document.querySelectorAll('.app-links a').forEach((link) => {
      if (new URL(link.href).hash === section) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  window.addEventListener('hashchange', updateNavigation);

  async function loadPartial(id, file) {
    const placeholder = document.getElementById(id);
    if (!placeholder) return;
    try {
      const response = await fetch(new URL(file, baseURL));
      if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
      const markup = await response.text();
      placeholder.innerHTML = markup;
    } catch (error) {
      // Keep the fallback header/footer visible if a request fails.
      console.error('Unable to load shared page content:', error);
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
      loadPartial('header-placeholder', '_header-nav.html'),
      loadPartial('footer-placeholder', '_footer-content.html'),
    ]);
    applyTheme();
    updateNavigation();
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((button) => {
      button.addEventListener('click', () => {
        theme = isDark() ? 'light' : 'dark';
        savePreference('theme', theme);
        applyTheme();
      });
    });
    const menuButton = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    if (menuButton && menu) {
      const closeMenu = () => {
        menu.classList.add('hidden');
        menuButton.setAttribute('aria-expanded', 'false');
      };
      menuButton.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        menuButton.setAttribute('aria-expanded', String(open));
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !menu.classList.contains('hidden')) {
          closeMenu();
          menuButton.focus();
        }
      });
      document.addEventListener('click', (event) => {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
        if (menu.contains(event.target) && event.target.closest('a')) closeMenu();
      });
    }
  });
})();
