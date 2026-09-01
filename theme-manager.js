/**
 * Theme Manager
 * Handles dark mode and light mode switching
 */

const ThemeManager = {
  THEME_KEY: "siteTheme",
  DARK_THEME: "dark",
  LIGHT_THEME: "light",

  /**
   * Initialize theme on page load
   */
  init() {
    try {
      const savedTheme = this.getSavedTheme();
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const theme = savedTheme || (prefersDark ? this.DARK_THEME : this.LIGHT_THEME) || this.DARK_THEME;
      
      console.log(`[ThemeManager] Initializing theme: savedTheme="${savedTheme}", prefersDark=${prefersDark}, finalTheme="${theme}"`);
      this.setTheme(theme);
    } catch (error) {
      console.error("[ThemeManager] Initialization error:", error);
      this.setTheme(this.DARK_THEME);
    }
  },

  /**
   * Get saved theme preference
   */
  getSavedTheme() {
    try {
      return localStorage.getItem(this.THEME_KEY);
    } catch {
      return null;
    }
  },

  /**
   * Get current theme
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || this.DARK_THEME;
  },

  /**
   * Set theme and save preference
   */
  setTheme(theme) {
    if (!theme) theme = this.DARK_THEME;
    console.log(`[ThemeManager] Setting theme to "${theme}"`);
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (error) {
      console.warn("[ThemeManager] Could not save theme preference:", error);
    }
    this.updateThemeToggle();
  },

  /**
   * Toggle between dark and light mode
   */
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === this.DARK_THEME ? this.LIGHT_THEME : this.DARK_THEME;
    console.log(`[ThemeManager] Toggling theme from "${currentTheme}" to "${newTheme}"`);
    this.setTheme(newTheme);
    // Dispatch event for any other listeners
    window.dispatchEvent(new CustomEvent("themeChanged", { detail: { theme: newTheme } }));
  },

  /**
   * Update toggle button state
   */
  updateThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) {
      console.warn("[ThemeManager] Theme toggle button not found");
      return;
    }

    const currentTheme = this.getCurrentTheme();
    const icon = toggle.querySelector("i");

    if (currentTheme === this.DARK_THEME) {
      toggle.setAttribute("title", "Switch to Light Mode");
      toggle.setAttribute("aria-label", "Switch to Light Mode");
      if (icon) {
        icon.className = "ri-sun-line";
      }
    } else {
      toggle.setAttribute("title", "Switch to Dark Mode");
      toggle.setAttribute("aria-label", "Switch to Dark Mode");
      if (icon) {
        icon.className = "ri-moon-line";
      }
    }
  },
};

console.log("[ThemeManager] Script loaded");

// Initialize theme immediately and also on DOMContentLoaded as fallback
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    console.log("[ThemeManager] DOMContentLoaded event fired");
    ThemeManager.init();
  });
} else {
  // DOM already loaded
  console.log("[ThemeManager] DOM already loaded, initializing immediately");
  ThemeManager.init();
}
