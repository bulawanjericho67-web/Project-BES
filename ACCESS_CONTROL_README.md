# Access Control System Documentation

## Overview
This access control system restricts user access to your website based on login status. Users can only access specific pages without logging in, and certain pages show limited content until they authenticate.

## Access Levels

### Public Pages (No Login Required)
- **Menu.html** - Home page
- **PT.html** - Login page
- **Register.html** - Registration page
- **ForgotPass.html** - Password reset page

### Partially Restricted Pages (Login Required for Full Content)
- **RA.html** - News Today
  - Shows: First article only (without login)
  - Hidden: Remaining articles (requires login)
  - Login prompt: Displayed if more articles are available

- **REPUBLICACTS.html** - Republic Acts
  - Shows: First act only (without login)
  - Hidden: Remaining acts (requires login)
  - Login prompt: Displayed if more acts are available

### Fully Restricted Pages (Login Required)
- **About.html** - About page
- **ecommerce.html** - Shopping cart

## System Components

### 1. access-control.js
Central access control module that manages:
- User login/logout
- Page access verification
- Maximum visible articles calculation
- Storage of user session data

**Key Functions:**
- `isLoggedIn()` - Check if user is authenticated
- `getCurrentUser()` - Get current user object
- `setLoggedIn(username)` - Set user as logged in
- `logout()` - Logout user
- `isPublicPage(page)` - Check if page is public
- `getMaxVisibleArticles()` - Returns 1 for non-logged-in, Infinity for logged-in

### 2. menu-script.js
Manages menu navigation based on login status:
- Updates navigation links visibility
- Shows "Log out" button for logged-in users
- Disables/grays out restricted links for non-logged-in users
- Redirects to login when accessing restricted pages

### 3. PTJS.js (Modified)
Existing login script that:
- Validates user credentials
- Sets `currentUser` in sessionStorage upon successful login
- Already compatible with AccessControl system

## User Experience Flow

### Non-Logged-In User
1. Opens Menu.html → Can see
2. Clicks "News Today" (RA.html) → Can see first article + login prompt
3. Clicks "About" → Redirected to PT.html (grayed out in menu)
4. Clicks "Cart" → Redirected to PT.html (grayed out in menu)
5. Clicks "Log in" → Goes to PT.html
6. Registers/Logs in → Redirected to Menu.html
7. Now "About" and "Cart" are accessible
8. Can see all articles in "News Today" and "Republic Acts"

### Logged-In User
- Can access all pages
- Menu shows "Log out (username)" button
- Can see all articles in RA.html and REPUBLICACTS.html
- Can see full content of About.html and ecommerce.html

## How to Test

### Test Scenario 1: Public Access
```
1. Open Menu.html (without logging in)
2. Verify you can see the page
3. Click "News Today" - should see 1st article only
4. Notice the login prompt at the bottom
5. Try clicking "About" - should be grayed out/disabled
```

### Test Scenario 2: Login
```
1. From Menu.html, click "Log in"
2. Enter credentials (username: test, password: test)
3. After login, return to Menu.html
4. Notice "Log out (username)" in navigation
5. Click "News Today" - should see all articles
6. "About" and "Cart" are now accessible
```

### Test Scenario 3: Logout
```
1. While logged in, click "Log out" in navigation
2. Redirected to Menu.html
3. Menu returns to showing "Log in" link
4. Restricted pages are grayed out again
```

## Storage Details

### SessionStorage (Clears on browser close)
- **Key**: `currentUser`
- **Value**: `{ username: "string", loginTime: "ISO-8601" }`
- Checked by AccessControl module

### LocalStorage (Persists)
- Used by individual pages for comments and user data
- Not affected by access control

## Integration with Existing Code

The system is designed to work with your existing code:
- No modification to PTJS.js logic was needed
- All pages already had proper structure
- Access control is injected via script tags
- Articles filtering uses existing `renderNews()` functions

## Customization Options

### Change Number of Visible Articles
In `access-control.js`, modify `getMaxVisibleArticles()`:
```javascript
getMaxVisibleArticles() {
  return this.isLoggedIn() ? 10 : 2;  // Show 2 articles to non-logged-in
}
```

### Add/Remove Restricted Pages
In `access-control.js`, modify the arrays:
```javascript
isPublicPage(page = this.getCurrentPage()) {
  const publicPages = ["Menu.html", "PT.html", "Register.html", "ForgotPass.html"];
  return publicPages.includes(page);
}
```

### Change Redirect Page
In pages like About.html, modify the redirect:
```javascript
if (!AccessControl.isLoggedIn()) {
  window.location.href = "PT.html";  // Change this
}
```

## Security Notes

- This is **client-side** access control only
- For production, implement **server-side** validation
- SessionStorage data can be viewed/edited in DevTools
- For sensitive content, use backend authentication
- Never store sensitive user data in client-side storage

## Troubleshooting

**Issue**: Access control not working
- Solution: Ensure `access-control.js` is loaded before other scripts
- Check browser console for errors

**Issue**: Articles not limiting
- Solution: Verify RA.html and REPUBLICACTS.html have `access-control.js` included
- Check that `AccessControl.getMaxVisibleArticles()` is being called

**Issue**: Menu links not updating
- Solution: Ensure `menu-script.js` is loaded on Menu.html
- Verify sessionStorage has `currentUser` after login

**Issue**: Can access restricted pages without login
- Solution: Check that About.html and ecommerce.html have the access check script
- Clear browser cache and reload

## Files Modified/Created

### Created Files
- `access-control.js` - Core access control module
- `menu-script.js` - Menu management script

### Modified Files
- `Menu.html` - Added access-control.js and menu-script.js
- `RA.html` - Added access-control.js and article limiting
- `REPUBLICACTS.html` - Added access-control.js and article limiting
- `PT.html` - Added access-control.js
- `Register.html` - Added access-control.js
- `ForgotPass.html` - Added access-control.js
- `About.html` - Added access check
- `ecommerce.html` - Added access check
