# Analysis: Why HTML Fractals Show Black Screen in Farcaster

## ❓ The Question: Is it fonts or the raw HTML approach?

**Short answer:** It's likely **BOTH** - but we can test to find out which is the main culprit.

## 🔍 Root Causes Identified

### 1. **External Resource Blocking (HIGH PRIORITY)**
- **Issue**: HTML files import Google Fonts via `@import`:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  ```
- **Problem**: Farcaster's Content Security Policy (CSP) likely blocks external font imports
- **Impact**: Fonts fail to load → fallback fonts may cause layout issues → black screen

### 2. **Iframe Sandbox Restrictions (HIGH PRIORITY)**
- **Issue**: Current iframe has no sandbox attributes:
  ```tsx
  <iframe ref={ref} srcDoc={html} style={{ width: '100%', height: '100vh', border: 'none' }} />
  ```
- **Problem**: Farcaster may apply default iframe restrictions that block:
  - Script execution
  - Canvas/WebGL access
  - External resource loading
- **Impact**: Scripts don't run → canvas doesn't render → black screen

### 3. **Canvas/WebGL Restrictions (MEDIUM PRIORITY)**
- **Issue**: HTML files use `<canvas>` elements with `getContext('2d')`
- **Problem**: Farcaster's security model may restrict canvas operations
- **Impact**: Canvas rendering fails → no visual output → black screen

### 4. **External Scripts Blocked (MEDIUM PRIORITY)**
- **Issue**: HTML may load external scripts (e.g., SoundCloud embed)
- **Problem**: CSP blocks external scripts
- **Impact**: Critical functionality breaks → black screen

### 5. **Complex Animations (LOW PRIORITY)**
- **Issue**: Heavy CSS animations, transforms, and 3D effects
- **Problem**: Performance issues in Farcaster's WebView
- **Impact**: Rendering fails or is too slow → appears as black screen

### 6. **No Error Handling**
- **Issue**: No fallback or error detection in the iframe
- **Problem**: Failures are silent
- **Impact**: Can't diagnose what's failing

## 🛠️ Recommended Fixes

### Fix 1: Add Iframe Sandbox Permissions
```tsx
<iframe 
  ref={ref} 
  srcDoc={html} 
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
  style={{ width: '100%', height: '100vh', border: 'none' }} 
/>
```

### Fix 2: Inline Fonts or Use System Fonts
- Replace Google Fonts with system fonts or inline font data
- Or preload fonts and serve them from your domain

### Fix 3: Add Error Detection
```tsx
<iframe 
  onError={(e) => console.error('Iframe error:', e)}
  onLoad={() => {
    // Check if content loaded
    const iframe = ref.current;
    if (iframe?.contentDocument?.body) {
      console.log('Iframe loaded successfully');
    }
  }}
/>
```

### Fix 4: Add Fallback Content
```tsx
{iframeError && (
  <div className="flex items-center justify-center h-screen bg-black text-white">
    <p>Fractal failed to load. This may be due to Farcaster restrictions.</p>
  </div>
)}
```

### Fix 5: Simplify HTML for Farcaster
- Create a simplified version that doesn't rely on external resources
- Use inline styles instead of external CSS
- Remove or replace external scripts

## 🧪 Testing Strategy

1. **Test in Farcaster's embed tool** first
2. **Check browser console** for CSP errors
3. **Test with simplified HTML** to isolate issues
4. **Gradually add complexity** to find breaking point

## 📋 Next Steps

1. ✅ Add iframe sandbox permissions
2. ✅ Add error handling and logging
3. ✅ **Strip external fonts** - Code added to automatically remove Google Fonts imports
4. ✅ **Test page created** - Visit `/fractales/test-simple` to diagnose issues
5. ⚠️ Test in Farcaster to see if removing fonts fixes it
6. ⚠️ If still broken, it's likely the raw HTML/iframe approach itself

## 🧪 How to Test

1. **Test the fix**: Visit a fractal page in Farcaster - external fonts are now automatically stripped
2. **Use diagnostic page**: Visit `/fractales/test-simple` to test different scenarios:
   - Simple HTML (no external resources)
   - Canvas operations
   - External fonts (should fail)

## 💡 What We've Done

- **Auto-remove external fonts**: The code now strips `@import` statements for Google Fonts
- **Replace with system fonts**: Google Fonts are replaced with `'Courier New', Courier, monospace`
- **Added error detection**: You'll see error messages if content fails to load

## 🎯 Expected Results

**If removing fonts fixes it:**
- ✅ Fractals will display (with different fonts)
- ✅ The issue was external resource blocking
- ✅ Solution: Use system fonts or host fonts yourself

**If it's still black:**
- ❌ The issue is deeper (canvas restrictions, CSP, or iframe limitations)
- ❌ May need to convert fractals to React components instead of raw HTML

