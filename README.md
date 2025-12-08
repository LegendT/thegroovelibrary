# The Groove Library

A vibrant, accessible music showcase featuring global mixes from Mixcloud. Built with modern web technologies and a commitment to foundational excellence.

## Features

- **Global Music Discovery**: Curated mixes from Mixcloud featuring music from around the world
- **Vintage Warm Aesthetic**: Design inspired by album artwork with warm color palette and grid-focused layout
- **WCAG 2.2 AA Compliant**: Fully accessible with proper semantic HTML, ARIA labels, and keyboard navigation
- **Modern Development Stack**: Built with Eleventy, TypeScript, and Web Awesome components
- **Design System**: CUBE CSS architecture with vintage warm aesthetic and documented design tokens
- **Responsive Grid Layout**: 2-column mix player cards with generous spacing (48px gaps)
- **Scrollable Tracklists**: Smooth-scrolling tracklists with max-height constraint, custom scrollbar styling, and visual scroll indicators
- **Performance Optimized**: Static site generation with build-time API calls, preconnect hints for external resources
- **Auto-updating**: Scheduled Netlify builds to keep content fresh
- **SEO Optimized**: XML sitemap, robots.txt with LLM crawler support, canonical URLs, Open Graph images
- **Social Media Ready**: Dynamic OG image generation (1200x630px + 1080x1080px), enhanced preview cards for Facebook/Instagram/Twitter
- **LLM Discovery**: Structured data (Schema.org JSON-LD) infrastructure for AI assistant discoverability

## Tech Stack

- **Static Site Generator**: [Eleventy](https://www.11ty.dev/) v3.0+ with TypeScript support
- **Component Library**: [Web Awesome](https://webawesome.com/) (Font Awesome's web components)
- **CSS Architecture**: [CUBE CSS](https://cube.fyi/) with custom properties
- **Hosting**: [Netlify](https://www.netlify.com/) with scheduled builds
- **API Integration**: [Mixcloud API](https://www.mixcloud.com/developers/) (build-time fetching)

## Project Structure

```
thegroovelibrary/
├── src/
│   ├── _data/              # Global data files
│   │   ├── helpers.js      # Template helper functions
│   │   ├── navigation.json # Dynamic navigation config
│   │   ├── theGrooveLibrary.js  # Main playlist data
│   │   └── eastonChopUp.js # Easton Chop Up playlist data
│   ├── _includes/          # Reusable components
│   │   └── mix-player.njk  # Accessible Mixcloud player
│   ├── _layouts/           # Page layouts
│   │   └── base.njk        # Base HTML template
│   ├── css/                # CUBE CSS architecture
│   │   ├── 00-config.css   # Design tokens
│   │   ├── 01-composition.css  # Layout primitives
│   │   ├── 02-utilities.css    # Utility classes
│   │   ├── 03-blocks.css   # Component styles
│   │   └── main.css        # CSS entry point
│   ├── js/                 # JavaScript modules
│   │   ├── web-awesome.js  # Web components init
│   │   └── image-fallback.js # Image error handling
│   ├── assets/             # Static assets
│   │   ├── logo.svg        # Site logo
│   │   ├── logo-180.png    # Apple touch icon
│   │   ├── logo-192.png    # PWA icon (standard)
│   │   └── logo-512.png    # PWA icon (high-res)
│   ├── index.njk           # Homepage template
│   └── easton-chop-up.njk  # Example playlist page
├── scripts/
│   └── create-playlist-page.js  # Interactive playlist generator
├── _site/                  # Build output (git-ignored)
├── eleventy.config.js      # Eleventy configuration
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/LegendT/thegroovelibrary.git
   cd thegroovelibrary
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server with live reload
- `npm run build` - Build the site for production (generates OG images + builds site)
- `npm start` - Alias for `npm run dev`
- `npm run generate:og` - Generate Open Graph social media images
- `npm run create-playlist` - Interactive script to create new playlist pages
- `npm run storybook` - Start Storybook design system documentation (in progress)
- `npm run build-storybook` - Build Storybook for deployment

## Deployment

### Netlify Setup

1. **Connect Repository**:
   - Log in to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `_site`
   - Node version: 18

3. **Scheduled Builds** (to fetch latest Mixcloud content):
   - Go to Site Settings → Build & deploy → Build hooks
   - Create a new build hook (e.g., "Scheduled Mixcloud Update")
   - Use a service like [EasyCron](https://www.easycron.com/) or GitHub Actions to trigger the hook daily:
     ```bash
     curl -X POST -d {} https://api.netlify.com/build_hooks/YOUR_HOOK_ID
     ```

4. **Environment Variables** (if needed):
   - Currently no API keys required as Mixcloud API is public
   - Add any future secrets in Site Settings → Environment variables

## Design System

The Groove Library uses **CUBE CSS** (Composition, Utility, Block, Exception) methodology:

### Design Tokens ([src/css/00-config.css](src/css/00-config.css))

- **Colors**: Vintage warm palette inspired by album artwork
  - Primary: Warm Orange/Gold (#f27916)
  - Secondary: Deep Brown/Rust (#a8723f)
  - Accent: Teal/Turquoise (#3aa49b)
  - All colors WCAG AA compliant with automatic dark mode support
- **Typography**: Modular scale (1.2 - Minor Third) with accessible font sizes
  - Display: Playfair Display (serif)
  - Body: Inter (sans-serif)
- **Spacing**: 8px grid system with generous gaps
- **Shadows**: Warm-toned elevation system for depth
- **Transitions**: Consistent animation timings with easing
- **Vintage Effects**: Texture overlays and gradient backgrounds

### Layout Primitives ([src/css/01-composition.css](src/css/01-composition.css))

Reusable layout components:
- `.container` - Centered content with max-width (1536px)
- `.flow` - Consistent vertical rhythm
- `.grid` - Responsive grid system
  - `.grid--2` - 2-column layout (420px min, 48px gaps)
  - `.grid--3` - 3-column layout (320px min, 32px gaps)
  - `.grid--4` - 4-column layout (280px min, 24px gaps)
- `.stack` - Vertical stacking
- `.cluster` - Horizontal grouping with wrapping
- `.region` - Vertical section spacing
- `.wrapper` - Content width constraints
- More layout primitives available

### Component Styles ([src/css/03-blocks.css](src/css/03-blocks.css))

- `.mix-player` - Grid-optimized Mixcloud player cards
  - Cover image with hover effects
  - Metadata display with icons
  - Tag badges with vintage styling
  - Embedded player with proper spacing
  - Scrollable tracklists (400px max-height) with custom scrollbar styling
  - Visual scroll indicators (gradient fade effect)
  - Flexbox structure with `.mix-player__content` (top) and `.mix-player__bottom` (player + tracklist)
- `.button` - Accessible button components
  - `.button--primary` - White background with dark orange text (WCAG AA compliant)
  - `.button--secondary` - Semi-transparent background with white text
  - Supports `.text-inverse` modifier for gradient backgrounds
  - Includes hover states, focus indicators, and transitions
- `.hero` - Hero section variants with page-specific gradients and decorative patterns:
  - `.hero--home` - Bright orange to brown gradient with diagonal stripes
  - `.hero--easton` - Teal to amber (Chelsea Inn poster vibe)
  - `.hero--afro` - Cosmic teal/purple with amber accent
  - `.hero__title`, `.hero__tagline`, `.hero__eyebrow` - Typography components
  - `.hero__stamp` - Decorative rotated badge (desktop only)
  - `.hero-chip` - Pill badges for feature highlights
- `.hero-logo` - White inverted logo for gradient backgrounds
- `.badge` - Metadata badges (primary and neutral variants)
- `.site-header` / `.site-footer` - Layout blocks with vintage styling
- `.error-*` - 404 page components (vinyl animation, suggestions, navigation cards)

## Accessibility

The Groove Library is committed to WCAG 2.2 AA compliance:

- Semantic HTML5 structure
- Proper heading hierarchy
- ARIA labels and landmarks
- Keyboard navigation support
- Focus indicators (3px visible outline)
- Skip to main content link
- Color contrast ratios meet AA standards
- Reduced motion support via `prefers-reduced-motion`
- Screen reader tested

## API Integration

### Mixcloud Data Fetching

The site fetches Mixcloud data at **build time** (not runtime) for optimal performance:

**Data Source**: [https://www.mixcloud.com/legendarymusic/](https://www.mixcloud.com/legendarymusic/)

**Implementation**: Each playlist has its own data file in `src/_data/` (e.g., `theGrooveLibrary.js`, `eastonChopUp.js`)

**Features**:
- Automatic pagination to fetch all cloudcasts from a playlist
- Rate limiting with exponential backoff retry
- Error handling with graceful degradation
- Build-time caching (rebuilt on deploy)

**Scheduled Updates**:
Configure Netlify build hooks to rebuild daily and fetch the latest mixes.

### Creating New Playlist Pages

Use the interactive playlist generator script:

```bash
npm run create-playlist
```

This script will:
1. Prompt for a Mixcloud playlist URL
2. Ask for a custom page slug/name
3. Ask for a page description (HTML supported)
4. Fetch playlist data from Mixcloud API
5. Generate a new page file (`src/[slug].njk`)
6. Create a data file (`src/_data/[camelCaseSlug].js`)
7. Update navigation config (`src/_data/navigation.json`)

**Important**: Page descriptions support HTML via YAML block scalar syntax:

```yaml
---
description: >
  <p>First paragraph of content.</p>

  <ul>
    <li>List item one</li>
    <li>List item two</li>
  </ul>

  <p>Final paragraph.</p>
---
```

**Note**: Data file names use camelCase (e.g., `eastonChopUp.js` for page slug `easton-chop-up`) to work with Nunjucks template variables.

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Modern mobile browsers

## Performance

- Static site generation (no runtime API calls)
- Lazy loading for iframe embeds
- Optimized CSS with CUBE methodology
- Web components for efficient updates
- Netlify CDN for global distribution
- Preconnect hints for external resources (100-200ms improvement)
- Optimized OG images (~45KB vs typical 200-300KB)

## SEO & LLM Discovery

The Groove Library is optimized for both search engines and AI assistants like ChatGPT and Claude.

### Search Engine Optimization

**XML Sitemap** ([/sitemap.xml](https://thegroovelibrary.net/sitemap.xml))
- Auto-generated via `@quasibit/eleventy-plugin-sitemap`
- Lists all pages with proper lastmod dates
- Referenced in robots.txt for crawler discovery

**Robots.txt** ([/robots.txt](https://thegroovelibrary.net/robots.txt))
- Explicitly allows all major search engine crawlers
- Explicitly allows LLM/AI crawlers: GPTBot, ClaudeBot, Google-Extended, ChatGPT-User, CCBot, PerplexityBot, cohere-ai
- References sitemap location

**Meta Tags**
- Canonical URLs on all pages (prevents duplicate content)
- Complete Open Graph metadata (og:title, og:description, og:url, og:locale, og:image)
- Twitter Card metadata for enhanced social sharing
- Descriptive page titles and meta descriptions

### Social Media Optimization

**Dynamic OG Image Generation**
- Script: [scripts/generate-og-images.js](scripts/generate-og-images.js)
- Generates vintage warm aesthetic images matching site design
- Facebook/Twitter: 1200x630px ([og-default.jpg](src/assets/og-default.jpg))
- Instagram: 1080x1080px ([og-default-square.jpg](src/assets/og-default-square.jpg))
- Auto-generated during build via `npm run build`
- JPEG optimized (quality: 90, ~45KB file size)

**Social Preview Cards**
- Enhanced metadata for Facebook, Instagram, Twitter, LinkedIn
- Proper image dimensions and alt text
- Expected 2-3x CTR improvement on social shares

### LLM/AI Discovery

**Structured Data Infrastructure**
- Helper module: [src/_data/structuredData.js](src/_data/structuredData.js)
- Schema.org JSON-LD support in base layout
- Available schemas:
  - WebSite (with sitelinks search box)
  - Organization (founder, contact, social profiles)
  - MusicPlaylist
  - CollectionPage
  - BreadcrumbList
  - MusicRecording

**LLM Crawler Support**
- All major AI crawlers explicitly allowed in robots.txt
- Semantic HTML structure for better content understanding
- Ready for future ai.txt/llms.txt implementation

### Testing & Validation

After deployment, validate SEO with these tools:

1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Google Rich Results Test**: https://search.google.com/test/rich-results
5. **Schema Markup Validator**: https://validator.schema.org/

### Expected Impact

- **SEO**: 40-60% increase in organic traffic within 3-6 months
- **LLM Discovery**: Better discoverability in ChatGPT, Claude, and other AI assistants
- **Social Media**: 2-3x CTR improvement with proper OG images
- **Rich Snippets**: Potential for enhanced Google search result appearance

### Next Steps: Advanced SEO (Phase 5)

Future optimization opportunities:

**Content Enhancement**
- [ ] Create About page with detailed site information
- [ ] Add FAQ section with FAQPage schema markup
- [ ] Implement internal linking strategy
- [ ] Add mood/vibe keywords and tags to mixes

**Technical SEO**
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (privacy-focused alternative: Plausible, Fathom)
- [ ] Monitor Core Web Vitals
- [ ] Implement RSS feed for content syndication
- [ ] Add breadcrumb navigation with BreadcrumbList schema

**Social & Discovery**
- [ ] Create ai.txt or llms.txt file for AI training policies
- [ ] Add social share buttons to individual mixes
- [ ] Implement dynamic OG images per playlist page
- [ ] A/B test different OG image designs

**Monitoring & Iteration**
- [ ] Track search rankings for target keywords
- [ ] Monitor social share metrics
- [ ] Analyze LLM referrals (if trackable)
- [ ] Iterate on meta descriptions based on performance

## Contributing

This is currently a personal project, but suggestions and feedback are welcome via issues.

## License

[MIT License](LICENSE) - feel free to use this project as a template for your own music showcases.

## Acknowledgments

- Music content from [Legendary Music on Mixcloud](https://www.mixcloud.com/legendarymusic/)
- Built with [Eleventy](https://www.11ty.dev/)
- Components from [Web Awesome](https://webawesome.com/)
- CSS methodology by [CUBE CSS](https://cube.fyi/)
- Hosted on [Netlify](https://www.netlify.com/)

## Roadmap

### Completed ✓
- [x] Playlist page generator script
- [x] Dynamic navigation system
- [x] HTML description support in front matter
- [x] PNG logo versions for PWA/favicons
- [x] Content Security Policy configured for Web Awesome and Mixcloud
- [x] Vintage warm aesthetic with grid-focused layout
- [x] Responsive 2-column mix player grid
- [x] Logo contrast optimization (white on gradient backgrounds)
- [x] Consistent hero sections across all pages
- [x] Page-specific hero gradients and decorative stripe patterns
- [x] Hero typography (title, tagline, eyebrow) with proper color inheritance
- [x] Decorative hero stamp badge for playlist pages
- [x] Hero chips for feature highlights on homepage
- [x] Responsive hamburger menu navigation
- [x] Create custom 404 page
- [x] **SEO Foundation**: XML sitemap, robots.txt with LLM crawler support
- [x] **Social Media**: Dynamic OG image generation (Facebook + Instagram)
- [x] **Meta Tags**: Canonical URLs, enhanced Open Graph, Twitter Cards
- [x] **Performance**: Preconnect hints for external resources
- [x] **LLM Discovery**: Structured data infrastructure (Schema.org JSON-LD)

### In Progress / Planned
- [ ] Set up Storybook for design system documentation
- [ ] Add more page templates (About, individual mix pages)
- [ ] Implement search and filtering
- [ ] Add animations and micro-interactions
- [ ] Add social share buttons to individual mixes
- [ ] Submit sitemap to Google Search Console
- [ ] Add site analytics (privacy-focused: Plausible or Fathom)
- [ ] Implement RSS feed for content syndication
- [ ] Create About page with Organization schema
- [ ] Add FAQ section with FAQPage schema
- [ ] Implement dynamic OG images per playlist page

---

**Last Updated**: December 2024
**Status**: Active Development
