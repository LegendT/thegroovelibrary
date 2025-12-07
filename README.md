# The Groove Library

A vibrant, accessible music showcase featuring global mixes from Mixcloud. Built with modern web technologies and a commitment to foundational excellence.

## Features

- **Global Music Discovery**: Curated mixes from Mixcloud featuring music from around the world
- **WCAG 2.2 AA Compliant**: Fully accessible with proper semantic HTML, ARIA labels, and keyboard navigation
- **Modern Development Stack**: Built with Eleventy, TypeScript, and Web Awesome components
- **Design System**: CUBE CSS architecture with documented design tokens
- **Performance Optimized**: Static site generation with build-time API calls
- **Auto-updating**: Scheduled Netlify builds to keep content fresh

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
- `npm run build` - Build the site for production
- `npm start` - Alias for `npm run dev`
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

- **Colors**: WCAG AA compliant color palette with automatic dark mode support
- **Typography**: Modular scale (1.25 ratio) with accessible font sizes
- **Spacing**: 8px grid system
- **Shadows**: Elevation system for depth
- **Transitions**: Consistent animation timings

### Layout Primitives ([src/css/01-composition.css](src/css/01-composition.css))

Reusable layout components:
- `.container` - Centered content with max-width
- `.flow` - Consistent vertical rhythm
- `.grid` - Responsive auto-fit grid
- `.stack` - Vertical stacking
- `.cluster` - Horizontal grouping with wrapping
- More layout primitives available

### Component Styles ([src/css/03-blocks.css](src/css/03-blocks.css))

- `.mix-player` - Accessible Mixcloud embed
- `.button` - Interactive buttons
- `.card` - Content cards
- `.site-header` / `.site-footer` - Layout blocks

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

- [x] Playlist page generator script
- [x] Dynamic navigation system
- [x] HTML description support in front matter
- [x] PNG logo versions for PWA/favicons
- [x] Content Security Policy configured for Web Awesome and Mixcloud
- [ ] Set up Storybook for design system documentation
- [ ] Add more page templates (About, individual mix pages)
- [ ] Implement search and filtering
- [ ] Add animations and micro-interactions
- [ ] Add social sharing features
- [ ] Create custom 404 page
- [ ] Add site analytics (privacy-focused)

---

**Last Updated**: December 2024
**Status**: Active Development
