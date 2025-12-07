/**
 * Generate Open Graph Images for Social Media
 * Creates default OG images with vintage warm aesthetic
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Design tokens from 00-config.css
const colors = {
  primary: '#f27916',      // Warm Orange
  secondary: '#a8723f',    // Deep Brown/Rust
  accent: '#3aa49b',       // Teal/Turquoise
  dark: '#1a1a1a',        // Deep charcoal
  light: '#f5f5f5',       // Off-white
};

// OG Image dimensions
const sizes = {
  facebook: { width: 1200, height: 630 },
  instagram: { width: 1080, height: 1080 },
};

/**
 * Create SVG text overlay
 * @param {string} title - Page title
 * @param {string} subtitle - Subtitle text
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {string} SVG string
 */
function createTextOverlay(title, subtitle, width, height) {
  // Calculate responsive font sizes based on canvas dimensions
  const titleSize = Math.floor(width / 15);
  const subtitleSize = Math.floor(width / 30);
  const padding = Math.floor(width / 20);

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&amp;family=Inter:wght@600&amp;display=swap');
        </style>
      </defs>

      <!-- Text container -->
      <g>
        <!-- Title -->
        <text
          x="${width / 2}"
          y="${height / 2 - 40}"
          font-family="'Playfair Display', serif"
          font-size="${titleSize}"
          font-weight="700"
          fill="${colors.light}"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          ${escapeXml(title)}
        </text>

        <!-- Subtitle -->
        <text
          x="${width / 2}"
          y="${height / 2 + 40}"
          font-family="'Inter', sans-serif"
          font-size="${subtitleSize}"
          font-weight="600"
          fill="${colors.light}"
          text-anchor="middle"
          dominant-baseline="middle"
          opacity="0.9"
        >
          ${escapeXml(subtitle)}
        </text>
      </g>
    </svg>
  `;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
    }
  });
}

/**
 * Generate gradient background
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {Buffer} SVG buffer
 */
function createGradientBackground(width, height) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors.primary};stop-opacity:1" />
          <stop offset="50%" style="stop-color:${colors.secondary};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:1" />
        </linearGradient>

        <!-- Texture overlay pattern -->
        <pattern id="texture" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.05)"/>
          <circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.05)"/>
          <circle cx="50" cy="50" r="0.5" fill="rgba(0,0,0,0.1)"/>
        </pattern>
      </defs>

      <!-- Gradient background -->
      <rect width="${width}" height="${height}" fill="url(#grad1)"/>

      <!-- Texture overlay -->
      <rect width="${width}" height="${height}" fill="url(#texture)" opacity="0.3"/>
    </svg>
  `;

  return Buffer.from(svg);
}

/**
 * Generate default OG image
 * @param {object} options - Generation options
 * @param {string} options.title - Page title
 * @param {string} options.subtitle - Subtitle text
 * @param {string} options.size - 'facebook' or 'instagram'
 * @param {string} options.output - Output file path
 */
async function generateOGImage(options) {
  const { title, subtitle, size = 'facebook', output } = options;
  const dimensions = sizes[size];

  console.log(`Generating ${size} OG image (${dimensions.width}x${dimensions.height}): ${output}`);

  try {
    // Create gradient background
    const background = createGradientBackground(dimensions.width, dimensions.height);

    // Create text overlay
    const textOverlay = createTextOverlay(
      title,
      subtitle,
      dimensions.width,
      dimensions.height
    );

    // Composite layers
    await sharp(background)
      .composite([
        {
          input: Buffer.from(textOverlay),
          top: 0,
          left: 0,
        }
      ])
      .jpeg({ quality: 90 })
      .toFile(output);

    console.log(`✓ Generated: ${output}`);
  } catch (error) {
    console.error(`✗ Error generating ${output}:`, error);
    throw error;
  }
}

/**
 * Generate default site OG images
 */
async function generateDefaultImages() {
  const outputDir = join(projectRoot, 'src', 'assets');

  // Default Facebook OG image (1200x630)
  await generateOGImage({
    title: 'The Groove Library',
    subtitle: 'Global Music Discovery - Curated Mixes from Mixcloud',
    size: 'facebook',
    output: join(outputDir, 'og-default.jpg'),
  });

  // Default Instagram OG image (1080x1080)
  await generateOGImage({
    title: 'The Groove Library',
    subtitle: 'Global Music Discovery',
    size: 'instagram',
    output: join(outputDir, 'og-default-square.jpg'),
  });

  console.log('\n✓ All default OG images generated successfully!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDefaultImages().catch(console.error);
}

export { generateOGImage, generateDefaultImages };
