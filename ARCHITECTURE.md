# Architecture Documentation

## Overview

The Groove Library is a statically generated website built with modern web development practices. This document outlines the architectural decisions, patterns, and rationale behind the implementation.

## Architectural Principles

### 1. **Foundational Excellence**
Despite being a simple site initially, every decision prioritizes long-term maintainability, scalability, and best practices.

### 2. **Accessibility First**
WCAG 2.2 AA compliance is not an afterthought but a core requirement influencing every design and implementation decision.

### 3. **Performance by Default**
Static site generation, build-time API calls, and efficient CSS architecture ensure fast load times globally.

### 4. **Progressive Enhancement**
The site works with HTML/CSS first, enhanced with JavaScript for improved user experience.

## Technology Stack

### Static Site Generator: Eleventy v3.0+

**Why Eleventy?**
- Zero client-side JavaScript by default
- Flexible data handling (perfect for Mixcloud API)
- TypeScript support in v3.0+
- No framework lock-in
- Fast build times
- Simple templating with Nunjucks

**Configuration**: [eleventy.config.ts](eleventy.config.ts)

### TypeScript

**Why TypeScript?**
- Type safety for data structures
- Better IDE support and autocomplete
- Documentation through types
- Catches errors at build time

**Configuration**: [tsconfig.json](tsconfig.json)
- ESNext target for modern JavaScript
- NodeNext module resolution for ESM
- Strict mode enabled

### Component Library: Web Awesome

**Why Web Awesome?**
- Modern web components (framework-agnostic)
- Built on Shoelace (proven foundation)
- ~98% SSR compatibility
- Accessibility built-in (WCAG AA compliant)
- Font Awesome icons included
- Cherry-picking for optimal bundle size

**Trade-offs**:
- ✅ No framework lock-in
- ✅ Future-proof web standards
- ✅ TypeScript definitions included
- ⚠️ No Hot Module Reloading (browser limitation)
- ⚠️ Beta version (3.0.0-beta.4)

**Implementation**: [src/js/web-awesome.js](src/js/web-awesome.js)

### CSS Architecture: CUBE CSS

**Why CUBE CSS?**
- Scalable methodology for growing projects
- Promotes reusability without bloat
- Clear separation of concerns
- Works excellently with design tokens
- Avoids utility-class sprawl (unlike Tailwind)

**Layers**:

1. **Config (00-config.css)**: Design tokens and CSS custom properties
   - Color system with WCAG AA compliance
   - Modular typography scale (1.25 ratio)
   - 8px spacing grid
   - Consistent transitions and shadows
   - Dark mode support via `prefers-color-scheme`

2. **Composition (01-composition.css)**: Layout primitives
   - Container, flow, stack, cluster, grid
   - Reusable skeleton layouts
   - No cosmetic styling, only structure
   - **Grid system with equal-height cards**:
     - `.grid--2` uses `align-items: stretch` for equal height cards per row
     - Responsive columns via `repeat(auto-fill, minmax(min(420px, 100%), 1fr))`
     - Cards fill grid cells with `height: 100%`

3. **Utilities (02-utilities.css)**: Single-purpose helpers
   - Spacing, text, display utilities
   - Accessibility helpers (`.sr-only`, `.skip-link`)
   - Focus management

4. **Blocks (03-blocks.css)**: Component-specific styles
   - `.mix-player`, `.button`, `.card`
   - Semantic, BEM-like naming
   - Encapsulated component logic
   - **Modern CSS features**:
     - `:has()` selector for parent-based styling (e.g., card collapse on player load)
     - `aspect-ratio` for responsive media containers
     - Flexbox with `margin-block-start: auto` for bottom-aligned content

**Benefits**:
- Easy to onboard new developers
- Clear naming conventions
- No CSS-in-JS overhead
- Excellent cascade management

## Data Architecture

### Global Data Files

**Location**: `src/_data/`

#### Playlist Data Files (e.g., theGrooveLibrary.js, eastonChopUp.js)
Each playlist has its own data file that fetches cloudcasts from a specific Mixcloud playlist at **build time**.

**Key Features**:
- Pagination support (fetches all cloudcasts from a playlist)
- Rate limiting with exponential backoff
- Retry logic (max 3 attempts)
- Error handling with graceful degradation
- Returns structured data object available globally in templates

**Data Structure**:
```javascript
{
  playlistSlug: "the-groove-library",
  cloudcasts: [ /* Array of mix objects */ ],
  count: 42,
  fetchedAt: "2024-12-07T...",
  error: null // or error message if failed
}
```

**Naming Convention**:
- File names use camelCase (e.g., `eastonChopUp.js`)
- This allows them to be used as Nunjucks variables (e.g., `{{ eastonChopUp.cloudcasts }}`)
- Page slugs can use dashes (e.g., `easton-chop-up`) and are converted to camelCase for data files

**Why Build-time Fetching?**
- No API rate limits for users
- Faster page loads (no client-side requests)
- Works without JavaScript
- Cacheable by CDN
- Scheduled rebuilds keep content fresh

#### navigation.json
Dynamic navigation configuration that's automatically updated by the playlist generator script.

**Structure**:
```json
{
  "pages": [
    {
      "title": "The Groove Library",
      "url": "/"
    },
    {
      "title": "Easton Chop Up!",
      "url": "/easton-chop-up/"
    }
  ]
}
```

#### helpers.js
Template utility functions available as `{{ helpers.functionName() }}`.

**Functions**:
- `currentYear()` - For copyright notices
- `formatDate()` - Human-readable dates
- `formatDuration()` - Seconds to "Xh Ym"
- `getMixcloudEmbedUrl()` - Generate embed URLs (uses `https://player-widget.mixcloud.com`)
- `truncate()` - Safe text truncation
- `hasItems()` - Check if array has items

## Template Architecture

### Layouts ([src/_layouts/](src/_layouts/))

**base.njk**: Base HTML template
- Semantic HTML5 structure
- Responsive navigation with hamburger menu (mobile < 960px, horizontal desktop)
- Accessible navigation with ARIA labels
- Skip to main content link
- SEO meta tags (Open Graph, Twitter Cards)
- Proper heading hierarchy
- Sticky header
- Semantic footer with copyright

### Includes ([src/_includes/](src/_includes/))

**mix-player.njk**: Reusable Mixcloud player component
- Accessible article structure with proper BEM naming
- ARIA labels for screen readers
- **Click-to-load player facade** (performance optimization):
  - Cover image with play overlay button (Unicode ▶ triangle for reliability)
  - "Click to Play" text label for clarity
  - Clicking loads Mixcloud iframe with autoplay enabled
  - Player container collapses from square to fit widget height when loaded
  - Only one player can play at a time (clicking another stops the previous)
  - Stopped players restore their cover image and play overlay
- Cover image with hover effects
- Metadata display (date, duration, plays)
- Tag badges with vintage styling
- External link indicators
- Grid-optimized card layout with flexbox structure
  - `.mix-player` - Card with `height: 100%` fills grid cell, `display: flex; flex-direction: column`
  - `.mix-player__body` - Body with `flex-grow: 1` fills remaining space
  - `.mix-player__content` - Top section (title, metadata, tags)
  - `.mix-player__bottom` - Bottom section pushed via `margin-block-start: auto` (tracklist)
  - `:has(.player-loaded)` - Allows card to shrink (`height: auto`) when player loads
- Responsive image handling with fallback states
- Scrollable tracklists with UX optimizations:
  - Max-height: 400px with smooth scrolling
  - Custom scrollbar styling (6px thin scrollbar)
  - Visual scroll indicator (gradient fade at bottom)
  - Independent card heights (opening one tracklist doesn't affect other cards in grid)

### Pages

Pages support HTML in front matter descriptions using YAML block scalar syntax:

```yaml
---
description: >
  <p>HTML content here.</p>

  <ul>
    <li>List items</li>
  </ul>
---
```

**index.njk**: Homepage
- Hero section with gradient background, white logo, and icon decorations
- Description section (HTML from front matter)
- Mix collection section with count badge
- Mix grid using `grid--2` class (responsive 2-column layout with 48px gaps)
- Error/empty states with icons and helpful messaging
- About section with brand-colored icons
- Uses `theGrooveLibrary` data

**Playlist Pages** (e.g., easton-chop-up.njk):
- Generated via `npm run create-playlist` script
- Hero section with gradient background and icon decorations
- HTML description section in dedicated region
- Mix collection section with heading and metadata badge
- Mix grid using `grid--2` class (consistent with homepage)
- Error/empty states matching homepage pattern
- Follows consistent template pattern with semantic sections

**404 Error Page** (404.njk):
- Music-themed error page with humor and personality
- Animated spinning vinyl record icon (respects `prefers-reduced-motion`)
- Witty error message: "404: Lost in the Crates"
- Helpful suggestions list with Web Awesome icons
- Navigation buttons with WCAG 2.2 AA compliant contrast
- Alternative navigation section showing all site pages
- Fun fact about the origin of 404 errors
- Fully accessible with proper ARIA labels and semantic structure
- Uses `.text-inverse` class for proper contrast on gradient backgrounds

## Accessibility Architecture

### WCAG 2.2 AA Compliance

**Semantic HTML**:
- Proper landmark roles (`banner`, `main`, `navigation`, `contentinfo`)
- Heading hierarchy (h1 → h2 → h3)
- `<article>` for mix players
- `<time>` for dates

**ARIA**:
- `aria-label` for context
- `aria-labelledby` for component identification
- `aria-current="page"` for active nav
- `aria-hidden="true"` for decorative icons
- `aria-live` regions for dynamic updates

**Keyboard Navigation**:
- Skip to main content link (`.skip-link`)
- Visible focus indicators (3px outline, 2px offset)
- Logical tab order
- No keyboard traps

**Color Contrast**:
- All text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- Focus indicators have sufficient contrast
- Tested with automated tools

**Motion**:
- `prefers-reduced-motion` media query
- Animations disabled for users who prefer reduced motion

**Screen Reader Support**:
- Descriptive link text
- Icon labels
- Form labels (when forms are added)

## Deployment Architecture

### Netlify Configuration

**Build Process**:
1. Install dependencies (`npm install`)
2. Run Eleventy build (`npm run build`)
3. Fetch Mixcloud data during build
4. Generate static HTML/CSS/JS
5. Deploy to Netlify CDN

**Scheduled Updates**:
- Netlify build hooks triggered by cron job
- Recommended: Daily rebuild at low-traffic hours
- Fetches latest Mixcloud content automatically

**Performance Optimizations**:
- CDN distribution (global edge network)
- HTTP/2 and HTTP/3 support
- Brotli compression
- Cache headers for static assets (1 year immutable)
- Preload critical resources

**Security Headers** (via `netlify.toml`):
- `X-Frame-Options: SAMEORIGIN` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `Content-Security-Policy` - Restricts resource loading
  - Configured for Web Awesome CDN domains: `kit.webawesome.com`, `ka-p.webawesome.com`
  - Configured for Mixcloud: `player-widget.mixcloud.com`, `thumbnailer.mixcloud.com`
  - Allows Mixcloud API calls for build-time data fetching
- `Referrer-Policy` - Controls referrer information

## Performance Considerations

### Build Performance
- Eleventy is fast (~100ms typical build)
- TypeScript compiled via `tsx` (no separate build step)
- CSS not processed (modern CSS features used directly)

### Runtime Performance
- Static HTML (no hydration overhead)
- Minimal JavaScript (only Web Awesome components + lazy-player.js)
- CSS custom properties (no runtime CSS-in-JS)
- **Click-to-load Mixcloud players** (facade pattern):
  - Defers ~566KB of Mixcloud JavaScript until user interaction
  - Significantly improves Lighthouse performance score
  - Uses native browser lazy loading for images
- Optimized images (when added)

### Bundle Size
- Web Awesome: ~150KB (cherry-picked components)
- Custom CSS: ~20KB (uncompressed)
- Custom JS: ~3KB (includes lazy-player.js for click-to-load players)
- **Total**: < 200KB (excellent for modern web)

## Design System

### Color System

**Vintage Warm Aesthetic**:
- Primary: Warm Orange/Gold (#f27916) - Main brand color inspired by album artwork
- Secondary: Deep Brown/Rust (#a8723f) - Vintage texture
- Accent: Teal/Turquoise (#3aa49b) - Vintage poster feel
- Neutral: Warm grays with vintage feel

**Design Philosophy**:
- Inspired by vintage album artwork and music posters
- Warm, inviting palette that evokes analog music culture
- Grid-focused layout with generous spacing
- Hero sections use gradient backgrounds (orange to brown)
- White logo on gradient backgrounds for strong contrast

**Accessibility**:
- All combinations tested for WCAG AA compliance (4.5:1 for normal text, 3:1 for large)
- Automatic dark mode with `prefers-color-scheme`
- High contrast mode support
- Logo inverted to white on colored backgrounds for optimal visibility

### Typography
- System font stack (no web fonts for performance)
- Modular scale (1.25 - Major Third)
- Line heights optimized for readability
- Max width 65ch for body text (optimal line length)

### Spacing
- 8px grid system
- Consistent rhythm throughout
- Responsive spacing via composition classes

## Future Architecture Considerations

### Potential Enhancements

**1. Storybook Integration**
- Document design system components
- Visual regression testing
- Component playground
- Currently: Documentation in comments

**2. Search & Filtering**
- Client-side search with Lunr.js or Fuse.js
- Tag filtering
- Date range filtering
- No backend needed (all data in build)

**3. Build Optimization**
- Image optimization with Eleventy Image plugin
- Critical CSS inlining
- Service worker for offline support

**4. Analytics**
- Privacy-focused analytics (Plausible, Fathom)
- No cookies or tracking
- Respect Do Not Track

**5. Progressive Web App**
- Manifest.json
- Service worker
- Offline support for browsing

## Development Workflow

### Local Development
1. `npm run dev` - Start dev server
2. Edit files in `src/`
3. Browser auto-refreshes on changes
4. Web components require full reload (no HMR)

### Creating New Playlist Pages
1. `npm run create-playlist` - Launch interactive script
2. Enter Mixcloud playlist URL
3. Specify custom page slug (or accept default)
4. Provide page description (HTML supported)
5. Script generates:
   - Page file: `src/[slug].njk`
   - Data file: `src/_data/[camelCaseSlug].js`
   - Updates: `src/_data/navigation.json`
6. Run `npm run build` to test
7. Run `npm run dev` to preview

### Testing
- Visual testing: Manual in dev server
- Accessibility: axe DevTools, Lighthouse
- Cross-browser: BrowserStack or manual testing
- Automated: (To be added) Playwright for E2E

### Version Control
- Git with semantic commit messages
- GitHub for hosting and collaboration
- Feature branch workflow (when team grows)

## Decision Log

### Why CamelCase for Data Files?
- Nunjucks template variables cannot contain dashes
- Page slugs can use dashes (SEO-friendly URLs)
- Conversion function (`slugToCamelCase`) handles transformation
- Example: `easton-chop-up` (URL) → `eastonChopUp.js` (data file)

### Why Playlist-Specific Data Files?
- Each playlist can have independent build/fetch logic
- Homepage can show only specific playlists
- Better separation of concerns
- Easier to debug and maintain
- Scales better than single data file

### Why YAML Block Scalar for Descriptions?
- Supports multi-paragraph HTML content
- Clean front matter syntax
- Proper indentation maintained
- No need for escaping or string concatenation
- Rendered safely with `{{ description | safe }}`

### Why Not React/Vue/Svelte?
- No need for client-side interactivity
- Static content doesn't benefit from virtual DOM
- Faster builds and smaller bundles
- Better SEO and performance by default

### Why Not Tailwind CSS?
- CUBE CSS provides better long-term scalability
- Avoids utility class sprawl
- Promotes reusable composition classes
- Better for design system documentation

### Why Not WordPress/CMS?
- No dynamic content management needed
- Mixcloud is the CMS (via API)
- Static sites are faster, more secure, cheaper
- Version control for everything

### Why TypeScript for Config/Data?
- Type safety for API responses
- Better IDE experience
- Self-documenting code
- Catches errors early

## Conclusion

This architecture prioritizes:
1. **Accessibility** - WCAG 2.2 AA compliance
2. **Performance** - Static generation, minimal JavaScript
3. **Maintainability** - Clear structure, documented decisions
4. **Scalability** - CUBE CSS, modular components
5. **Developer Experience** - TypeScript, modern tooling

The foundation is excellent for future growth while keeping the initial implementation simple and focused.

---

**Document Version**: 1.0
**Last Updated**: December 2024
**Author**: Anthony George
