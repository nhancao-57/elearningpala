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
  let language = readPreference('language') === 'vi' ? 'vi' : 'en';
  const isDark = () => theme === 'dark' || (theme !== 'light' && systemTheme.matches);

  function applyTheme() {
    const dark = isDark();
    document.documentElement.classList.toggle('dark', dark);
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((button) => {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', language === 'vi' ? 'Chế độ tối' : 'Dark mode');
    });
    document.querySelectorAll('[id^="theme-toggle-dark-icon"]').forEach((icon) => icon.classList.toggle('hidden', dark));
    document.querySelectorAll('[id^="theme-toggle-light-icon"]').forEach((icon) => icon.classList.toggle('hidden', !dark));
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.querySelectorAll('[data-vi][data-en]').forEach((element) => {
      element.textContent = element.getAttribute(`data-${language}`);
    });
    ['aria-label', 'title'].forEach((attribute) => {
      document.querySelectorAll(`[data-${language}-${attribute}]`).forEach((element) => {
        element.setAttribute(attribute, element.getAttribute(`data-${language}-${attribute}`));
      });
    });
    document.querySelectorAll('.lang-btn').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.lang === language));
    });
    const flag = document.getElementById('footer-lang-flag');
    if (flag) flag.textContent = language === 'vi' ? '🇻🇳' : '🇺🇸';
    applyTheme();
  }

  applyTheme();
  systemTheme.addEventListener('change', applyTheme);
  const baseURL = new URL('.', document.currentScript.src);

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
    applyLanguage();
    document.querySelectorAll('#theme-toggle, #theme-toggle-mobile').forEach((button) => {
      button.addEventListener('click', () => {
        theme = isDark() ? 'light' : 'dark';
        savePreference('theme', theme);
        applyTheme();
      });
    });
    document.querySelectorAll('.lang-btn').forEach((button) => {
      button.addEventListener('click', () => {
        language = button.lang;
        savePreference('language', language);
        applyLanguage();
      });
    });
    const footerLanguage = document.getElementById('footer-lang-btn');
    if (footerLanguage) {
      footerLanguage.removeAttribute('aria-haspopup');
      footerLanguage.removeAttribute('aria-controls');
      footerLanguage.addEventListener('click', () => {
        language = language === 'en' ? 'vi' : 'en';
        savePreference('language', language);
        applyLanguage();
      });
    }
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
