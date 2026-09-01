/**
 * Menu Management Script
 * Updates navigation and enforces access control
 */

let menuHandlersSetup = false;

function setupMenuHandlers() {
  if (menuHandlersSetup) {
    console.log("[MenuScript] Handlers already set up, skipping...");
    return;
  }

  menuHandlersSetup = true;
  console.log("[MenuScript] Setting up handlers...");

  // Handle theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    console.log("[MenuScript] Theme toggle button found, adding click handler");
    themeToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("[MenuScript] Theme toggle clicked");
      if (typeof ThemeManager !== "undefined") {
        console.log("[MenuScript] ThemeManager is defined, calling toggleTheme()");
        ThemeManager.toggleTheme();
      } else {
        console.error("[MenuScript] ThemeManager is not defined");
      }
    });
  } else {
    console.warn("[MenuScript] Theme toggle button not found");
  }

  const menuLinks = document.querySelector(".menu-links");
  if (!menuLinks) {
    console.warn("[MenuScript] menu-links element not found");
    return;
  }

  // Verify access control is available
  if (typeof AccessControl === "undefined") {
    console.warn("[MenuScript] AccessControl is not defined");
    return;
  }

  const isLoggedIn = AccessControl.isLoggedIn();
  const currentUser = AccessControl.getCurrentUser();
  console.log(`[MenuScript] Access control initialized: isLoggedIn=${isLoggedIn}, user=${currentUser?.username || "none"}`);

  // Find existing links
  const aboutLink = Array.from(menuLinks.querySelectorAll("a")).find(
    (a) => a.textContent === "About"
  );
  const cartLink = Array.from(menuLinks.querySelectorAll("a")).find(
    (a) => a.textContent === "Cart"
  );
  const loginLink = Array.from(menuLinks.querySelectorAll("a")).find(
    (a) => a.textContent === "Log in"
  );

  if (isLoggedIn && currentUser) {
    // User is logged in - show logout and hide login
    if (loginLink) {
      loginLink.textContent = `Log out (${currentUser.username})`;
      loginLink.href = "#";
      loginLink.onclick = (e) => {
        e.preventDefault();
        AccessControl.logout();
        window.location.href = "Menu.html";
      };
    }

    // Enable About and Cart links
    if (aboutLink) {
      aboutLink.style.pointerEvents = "auto";
      aboutLink.style.opacity = "1";
    }
    if (cartLink) {
      cartLink.style.pointerEvents = "auto";
      cartLink.style.opacity = "1";
    }
  } else {
    // User is not logged in - disable restricted pages
    if (aboutLink) {
      aboutLink.href = "#";
      aboutLink.onclick = (e) => {
        e.preventDefault();
        alert("Please log in to access this page.");
        window.location.href = "PT.html";
      };
      aboutLink.style.opacity = "0.5";
      aboutLink.style.cursor = "not-allowed";
    }

    if (cartLink) {
      cartLink.href = "#";
      cartLink.onclick = (e) => {
        e.preventDefault();
        alert("Please log in to access your cart.");
        window.location.href = "PT.html";
      };
      cartLink.style.opacity = "0.5";
      cartLink.style.cursor = "not-allowed";
    }

    if (loginLink) {
      loginLink.textContent = "Log in";
      loginLink.href = "PT.html";
    }
  }

  console.log("[MenuScript] Setup complete");
}

console.log("[MenuScript] Script loaded");

// Set up handlers when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupMenuHandlers);
} else {
  // DOM already loaded
  setupMenuHandlers();
}

// Also try to set up on next tick to ensure all scripts are loaded
setTimeout(() => {
  console.log("[MenuScript] Running deferred setup...");
  setupMenuHandlers();
}, 100);
