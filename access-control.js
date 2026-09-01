/**
 * Access Control System
 * Manages user authentication and page/content access restrictions
 */

const AccessControl = {
  // Storage keys
  CURRENT_USER_KEY: "currentUser",
  RESTRICTION_KEY: "siteRestrictions",

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    try {
      const user = JSON.parse(sessionStorage.getItem(this.CURRENT_USER_KEY));
      return user && user.username;
    } catch {
      return false;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem(this.CURRENT_USER_KEY)) || null;
    } catch {
      return null;
    }
  },

  /**
   * Set user as logged in
   */
  setLoggedIn(username) {
    const user = { username, loginTime: new Date().toISOString() };
    sessionStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  },

  /**
   * Logout user
   */
  logout() {
    sessionStorage.removeItem(this.CURRENT_USER_KEY);
  },

  /**
   * Get current page filename
   */
  getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf("/") + 1) || "Menu.html";
  },

  /**
   * Check if page is publicly accessible
   * Only Menu.html and login page are accessible without login
   */
  isPublicPage(page = this.getCurrentPage()) {
    const publicPages = ["Menu.html", "PT.html", "ForgotPass.html", "Register.html"];
    return publicPages.includes(page);
  },

  /**
   * Check if page is restricted but partially accessible
   * RA.html and REPUBLICACTS.html show only first article without login
   */
  isPartiallyRestricted(page = this.getCurrentPage()) {
    const restrictedPages = ["RA.html", "REPUBLICACTS.html"];
    return restrictedPages.includes(page);
  },

  /**
   * Enforce access restrictions - redirect if necessary
   */
  enforceAccess() {
    const currentPage = this.getCurrentPage();
    const isLoggedIn = this.isLoggedIn();

    // If public page, allow access
    if (this.isPublicPage(currentPage)) {
      return true;
    }

    // If partially restricted page, allow access (articles will be filtered)
    if (this.isPartiallyRestricted(currentPage)) {
      return true;
    }

    // For all other pages, require login
    if (!isLoggedIn) {
      window.location.href = "PT.html";
      return false;
    }

    return true;
  },

  /**
   * Get maximum visible articles based on login status
   * Non-logged-in users see only first article on restricted pages
   */
  getMaxVisibleArticles() {
    return this.isLoggedIn() ? Infinity : 1;
  },
};

// Auto-enforce access on page load
document.addEventListener("DOMContentLoaded", () => {
  // Only enforce if we're not already on a public page
  if (!AccessControl.isPublicPage() && !AccessControl.isPartiallyRestricted()) {
    AccessControl.enforceAccess();
  }
});
