import Script from "next/script";

export const initPreferencesScript = `
(function() {
  try {
    var storedTheme = localStorage.getItem('theme_v2');
    var theme = (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    var storedLocale = localStorage.getItem('locale') || localStorage.getItem('gauntlet_lang');
    var locale = (storedLocale === 'tr' || storedLocale === 'en') ? storedLocale : 'tr';
    document.documentElement.lang = locale;
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('light');
    document.documentElement.lang = 'tr';
  }
})();
`;

export function PreferencesScript() {
  return (
    <Script
      id="init-preferences"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: initPreferencesScript }}
    />
  );
}
