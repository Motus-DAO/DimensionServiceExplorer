# Research: Why All Fractal HTML Pages Show Black Screen in Farcaster

## 🔍 Key Findings from Research

### 1. **Critical: Farcaster SDK `ready()` Function Missing**

**Finding**: Farcaster miniapps MUST call `sdk.actions.ready()` once content is loaded. Without this, Farcaster shows a black/loading screen.

**Problem**: Our fractal HTML files are loaded via `iframe srcDoc` and have NO access to the Farcaster SDK. They're just raw HTML strings injected into an iframe.

**Impact**: ⚠️ **HIGH** - This is likely the PRIMARY cause of black screens.

**Evidence**: Multiple sources confirm:
- "Farcaster Mini Apps require the `sdk.actions.ready()` function to be called once your app is fully loaded. Failing to do so can result in the app being stuck on a loading screen or displaying a black screen."
- The SDK must be initialized in the actual page, not in an iframe.

### 2. **Iframe `srcDoc` Limitations on Mobile**

**Finding**: Using `iframe srcDoc` (injecting HTML as a string) has known limitations:
- Mobile browsers (especially iOS Safari) handle `srcDoc` differently
- Scripts in `srcDoc` may not execute properly on mobile
- Canvas operations in `srcDoc` iframes are more restricted

**Problem**: We're using `srcDoc={html}` which injects the entire HTML as a string.

**Impact**: ⚠️ **HIGH** - Mobile-specific black screens likely caused by this.

**Evidence**: 
- iOS Safari has stricter iframe sandboxing
- `srcDoc` is treated differently than `src` (actual URL)
- Mobile WebViews have additional restrictions

### 3. **Canvas/WebGL Restrictions in Iframes**

**Finding**: Canvas and WebGL operations are heavily restricted in iframes, especially:
- On mobile browsers
- In sandboxed iframes
- In Farcaster's WebView environment

**Problem**: All fractals use `<canvas>` with `getContext('2d')` or WebGL.

**Impact**: ⚠️ **MEDIUM-HIGH** - Canvas might not initialize or render.

**Evidence**: 
- Sandboxed iframes can block canvas operations
- Mobile browsers require user interaction before canvas can render
- WebGL requires specific permissions

### 4. **Script Execution in srcDoc Iframes**

**Finding**: Scripts injected via `srcDoc` may not execute properly, especially:
- On first load
- Without user interaction
- In mobile browsers

**Problem**: Fractal HTML files contain complex JavaScript that initializes canvas, animations, etc.

**Impact**: ⚠️ **MEDIUM** - Scripts might not run → no initialization → black screen.

### 5. **No Direct URL Access**

**Finding**: Using `srcDoc` means the HTML has no actual URL. This can cause:
- Relative resource paths to fail
- Base href issues
- CORS problems
- CSP violations

**Problem**: HTML files use `<base href=".">` but there's no actual base URL.

**Impact**: ⚠️ **MEDIUM** - Resources might not load correctly.

## 🎯 Root Cause Analysis

### Most Likely Primary Cause:
**The fractal HTML files are loaded in an iframe via `srcDoc`, but they have NO way to call `sdk.actions.ready()` because they're just raw HTML strings, not actual Farcaster miniapp pages.**

### Secondary Causes:
1. **Mobile iframe restrictions** - `srcDoc` doesn't work well on mobile
2. **Canvas restrictions** - Canvas operations blocked in sandboxed iframes
3. **Script execution** - Scripts in `srcDoc` may not execute properly

## 💡 Potential Solutions (Ranked by Likelihood of Success)

### Solution 1: Serve HTML Files as Actual Pages (RECOMMENDED)

**Approach**: Instead of using `srcDoc`, serve the HTML files as actual pages and use `iframe src`.

**Pros**:
- HTML files become real URLs
- Can inject Farcaster SDK into the HTML
- Better mobile compatibility
- Scripts execute properly

**Cons**:
- Need to modify how HTML is served
- Need to inject SDK into each HTML file

**Implementation**:
1. Create API route: `/api/fractales/[name]` that serves HTML
2. Inject Farcaster SDK script into HTML
3. Call `sdk.actions.ready()` when content loads
4. Use `iframe src="/api/fractales/glitchy"` instead of `srcDoc`

### Solution 2: Convert Fractals to React Components

**Approach**: Rewrite fractals as React components instead of raw HTML.

**Pros**:
- Full access to Farcaster SDK
- Better integration with Next.js
- Easier to debug
- Better mobile support

**Cons**:
- Major refactoring required
- Need to port all HTML/JS to React
- Time-consuming

### Solution 3: PostMessage Bridge to Call SDK

**Approach**: Create a bridge where the parent page calls `sdk.actions.ready()` when iframe loads.

**Pros**:
- Minimal changes to existing HTML
- Can work with current setup

**Cons**:
- Still has `srcDoc` limitations
- Mobile issues may persist
- Complex implementation

### Solution 4: Use Farcaster Embed Instead of Iframe

**Approach**: Use Farcaster's embed system instead of iframes.

**Pros**:
- Native Farcaster integration
- Better compatibility

**Cons**:
- May not support interactive content
- Limited customization
- Need to research embed capabilities

## 🔬 Testing Recommendations

### Test 1: Simple HTML with SDK
Create a test page that:
- Serves as actual URL (not srcDoc)
- Includes Farcaster SDK
- Calls `sdk.actions.ready()`
- Has simple canvas animation

**If this works**: Solution 1 (serve as pages) will work.

### Test 2: Check Console Errors
In Farcaster, open browser console and check for:
- CSP violations
- Canvas context errors
- Script execution errors
- SDK initialization errors

### Test 3: Test on Desktop vs Mobile
Compare behavior:
- Desktop: Works or black screen?
- Mobile: Always black screen?

**If desktop works but mobile doesn't**: It's mobile-specific iframe restrictions.

## 📋 Recommended Next Steps

1. **Immediate**: Check browser console in Farcaster for specific errors
2. **Short-term**: Implement Solution 1 (serve HTML as pages with SDK injection)
3. **Long-term**: Consider Solution 2 (convert to React components) for better maintainability

## 🔗 Key Research Sources

- Farcaster miniapp documentation emphasizes `sdk.actions.ready()` requirement
- Multiple sources confirm iframe `srcDoc` limitations on mobile
- Canvas restrictions in sandboxed iframes are well-documented
- Farcaster SDK must be initialized in the actual page, not iframe content

## ⚠️ Critical Insight

**The main issue is likely that Farcaster is waiting for `sdk.actions.ready()` to be called, but our fractal HTML files (loaded via `srcDoc`) have no way to access or call the SDK. Farcaster shows a black screen because it thinks the app is still loading.**

