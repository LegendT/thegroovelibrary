#!/usr/bin/env node

/**
 * Interactive script to create new playlist pages
 *
 * Usage: npm run create-playlist
 *
 * This script will:
 * 1. Prompt for a Mixcloud playlist URL
 * 2. Prompt for a custom page name/slug
 * 3. Fetch playlist data from Mixcloud API
 * 4. Generate a new page file and data file
 * 5. Update navigation config
 */

import { createInterface } from 'readline';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Promisified readline question
 */
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

/**
 * Extract playlist slug from Mixcloud URL
 */
function extractPlaylistSlug(url) {
  // URL format: https://www.mixcloud.com/legendarymusic/playlists/the-groove-library/
  const match = url.match(/mixcloud\.com\/([^/]+)\/playlists\/([^/]+)/);
  if (!match) {
    throw new Error('Invalid Mixcloud playlist URL. Expected format: https://www.mixcloud.com/username/playlists/playlist-name/');
  }
  return {
    username: match[1],
    playlistSlug: match[2]
  };
}

/**
 * Fetch playlist data from Mixcloud API
 */
async function fetchPlaylistData(username, playlistSlug) {
  const apiUrl = `https://api.mixcloud.com/${username}/playlists/${playlistSlug}/`;

  console.log(`\nFetching playlist data from: ${apiUrl}`);

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
  }

  const playlist = await response.json();
  return playlist;
}

/**
 * Convert slug to camelCase for use as Nunjucks variable
 */
function slugToCamelCase(slug) {
  return slug.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Create page file with modern template pattern
 */
function createPageFile(pageSlug, playlistName, dataVarName, pageDescription, heroSubtitle = '') {
  // Indent description content properly for YAML block scalar
  const indentedDescription = pageDescription
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : '')
    .join('\n');

  // Generate hero subtitle if not provided
  const subtitle = heroSubtitle || 'A curated collection of global sounds.';

  const pageContent = `---
layout: base.njk
title: "${playlistName} | The Groove Library"
description: >
${indentedDescription}
playlist: "${pageSlug}"
---

{# Hero Section #}
<section class="region region--lg bg-brand" aria-labelledby="hero-heading">
  <div class="container">
    <div class="center center--intrinsic flow flow--lg text-center">
      <div class="flow flow--md">
        <h1 id="hero-heading" class="text-4xl text-inverse">
          ${playlistName}
        </h1>
        <p class="text-xl text-inverse mx-auto">
          ${subtitle}
        </p>
      </div>

      <div class="cluster cluster--md justify-center">
        <fa-icon icon="record-vinyl" size="2x" class="text-inverse" aria-hidden="true"></fa-icon>
        <fa-icon icon="music" size="2x" class="text-inverse" aria-hidden="true"></fa-icon>
        <fa-icon icon="headphones" size="2x" class="text-inverse" aria-hidden="true"></fa-icon>
      </div>
    </div>
  </div>
</section>

{# Description Section #}
{% if description %}
<section class="region region--lg" aria-labelledby="about-heading">
  <div class="container">
    <div class="wrapper wrapper--narrow flow">
      {{ description | safe }}
    </div>
  </div>
</section>
{% endif %}

{# Mix Collection Section #}
<section class="region region--xl" aria-labelledby="mixes-heading">
  <div class="container">
    <div class="flow flow--xl">
      {# Section Header #}
      <div class="flow flow--sm text-center">
        <h2 id="mixes-heading" class="text-3xl">
          The Collection
        </h2>

        {% if ${dataVarName}.count > 0 %}
          <div class="cluster cluster--sm justify-center">
            <span class="badge">
              <fa-icon icon="record-vinyl" size="sm" aria-hidden="true"></fa-icon>
              {{ ${dataVarName}.count }} mixes in this collection
            </span>
          </div>
        {% endif %}
      </div>

      {# Mix Grid #}
      {% if ${dataVarName}.cloudcasts.length > 0 %}
        <div class="grid grid--2" role="list" aria-label="${playlistName} mixes">
          {% for mix in ${dataVarName}.cloudcasts %}
            <div role="listitem">
              {% include "mix-player.njk" %}
            </div>
          {% endfor %}
        </div>
      {% elif ${dataVarName}.error %}
        {# Error State #}
        <div class="error" role="alert">
          <h3 class="error__title">
            <fa-icon icon="triangle-exclamation" aria-hidden="true"></fa-icon>
            Unable to load mixes
          </h3>
          <p>We encountered an error while fetching the music collection. Please try again later.</p>
          <details class="my-md">
            <summary class="cursor-pointer text-semibold">Technical details</summary>
            <p class="text-sm my-sm"><code>{{ ${dataVarName}.error }}</code></p>
          </details>
        </div>
      {% else %}
        {# Empty State #}
        <div class="center center--intrinsic flow flow--lg text-center py-3xl">
          <fa-icon icon="music-slash" size="4x" class="text-tertiary" aria-hidden="true"></fa-icon>
          <div class="flow flow--sm">
            <h3 class="text-xl">No mixes available</h3>
            <p class="text-secondary">Check back soon for new content!</p>
          </div>
        </div>
      {% endif %}
    </div>
  </div>
</section>
`;

  const pagePath = resolve(projectRoot, `src/${pageSlug}.njk`);
  writeFileSync(pagePath, pageContent);
  console.log(`✓ Created page file: src/${pageSlug}.njk`);
  return pagePath;
}

/**
 * Create data file for playlist
 */
function createDataFile(dataVarName, username, mixcloudPlaylistSlug) {
  const dataContent = `/**
 * Mixcloud Playlist Data: ${dataVarName}
 *
 * Fetches cloudcasts from the "${mixcloudPlaylistSlug}" playlist
 * at build time via Mixcloud API
 */

export default async function() {
  const MIXCLOUD_USERNAME = "${username}";
  const PLAYLIST_SLUG = "${mixcloudPlaylistSlug}";
  const API_BASE_URL = "https://api.mixcloud.com";

  /**
   * Fetch with retry logic
   */
  async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);

        if (response.status === 429) {
          console.warn(\`Rate limited, retrying in \${delay}ms...\`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }

        if (!response.ok) {
          throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(\`Fetch failed, retrying... (\${i + 1}/\${retries})\`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
  }

  /**
   * Fetch all cloudcasts from a playlist (with pagination)
   */
  async function fetchPlaylistCloudcasts(username, playlistSlug) {
    const cloudcasts = [];
    let url = \`\${API_BASE_URL}/\${username}/playlists/\${playlistSlug}/cloudcasts/\`;
    let pageCount = 0;

    console.log(\`Fetching cloudcasts from playlist: \${playlistSlug}...\`);

    while (url && pageCount < 100) { // Safety limit
      const data = await fetchWithRetry(url);

      if (data.data) {
        cloudcasts.push(...data.data);
        console.log(\`Fetched \${data.data.length} cloudcasts (total: \${cloudcasts.length})\`);
      }

      url = data.paging?.next || null;
      pageCount++;

      // Rate limiting: wait between requests
      if (url) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    return cloudcasts;
  }

  try {
    const cloudcasts = await fetchPlaylistCloudcasts(MIXCLOUD_USERNAME, PLAYLIST_SLUG);

    console.log(\`✓ Successfully fetched \${cloudcasts.length} cloudcasts from \${PLAYLIST_SLUG}\`);

    return {
      playlistSlug: PLAYLIST_SLUG,
      cloudcasts,
      count: cloudcasts.length,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(\`Error fetching playlist data for \${PLAYLIST_SLUG}:\`, error);
    return {
      playlistSlug: PLAYLIST_SLUG,
      cloudcasts: [],
      count: 0,
      error: error.message,
      fetchedAt: new Date().toISOString()
    };
  }
}
`;

  const dataPath = resolve(projectRoot, `src/_data/${dataVarName}.js`);
  writeFileSync(dataPath, dataContent);
  console.log(`✓ Created data file: src/_data/${dataVarName}.js`);
  return dataPath;
}

/**
 * Update navigation config
 */
function updateNavigation(pageSlug, playlistName) {
  const navConfigPath = resolve(projectRoot, 'src/_data/navigation.json');

  let navigation = { pages: [] };

  if (existsSync(navConfigPath)) {
    const content = readFileSync(navConfigPath, 'utf-8');
    navigation = JSON.parse(content);
  }

  // Add new page to navigation if not already there
  const exists = navigation.pages.some(page => page.url === `/${pageSlug}/`);

  if (!exists) {
    navigation.pages.push({
      title: playlistName,
      url: `/${pageSlug}/`
    });

    writeFileSync(navConfigPath, JSON.stringify(navigation, null, 2));
    console.log(`✓ Updated navigation config: src/_data/navigation.json`);
  } else {
    console.log(`⚠ Page already exists in navigation, skipping update`);
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n🎵 Create New Playlist Page for The Groove Library\n');

  try {
    // 1. Get playlist URL
    const playlistUrl = await question('Enter Mixcloud playlist URL: ');

    if (!playlistUrl) {
      throw new Error('Playlist URL is required');
    }

    // 2. Extract playlist info
    const { username, playlistSlug: mixcloudPlaylistSlug } = extractPlaylistSlug(playlistUrl);
    console.log(`\n✓ Detected username: ${username}`);
    console.log(`✓ Detected playlist: ${mixcloudPlaylistSlug}`);

    // 3. Fetch playlist data
    const playlistData = await fetchPlaylistData(username, mixcloudPlaylistSlug);
    console.log(`✓ Found playlist: "${playlistData.name}"`);
    console.log(`  Description: ${playlistData.description || 'No description'}`);

    // 4. Get custom page name
    const defaultSlug = mixcloudPlaylistSlug;
    const pageSlug = await question(`\nEnter page slug/name (default: ${defaultSlug}): `) || defaultSlug;

    // 5. Get page description
    const defaultDescription = playlistData.description || 'A curated collection of mixes';
    console.log(`\nEnter page description (supports HTML via YAML block scalar):`);
    const pageDescription = await question(`(default: ${defaultDescription}): `) || defaultDescription;

    // 6. Get hero subtitle
    const defaultSubtitle = 'A curated collection of global sounds.';
    const heroSubtitle = await question(`\nEnter hero subtitle (default: ${defaultSubtitle}): `) || defaultSubtitle;

    console.log(`\n✓ Creating page with slug: ${pageSlug}`);

    // 7. Convert page slug to camelCase for data variable name
    const dataVarName = slugToCamelCase(pageSlug);
    console.log(`✓ Data variable name: ${dataVarName}`);

    // 8. Create files
    createPageFile(pageSlug, playlistData.name, dataVarName, pageDescription, heroSubtitle);
    createDataFile(dataVarName, username, mixcloudPlaylistSlug);
    updateNavigation(pageSlug, playlistData.name);

    console.log(`\n✅ Success! New playlist page created.`);
    console.log(`\nNext steps:`);
    console.log(`  1. Run: npm run build`);
    console.log(`  2. Run: npm run dev`);
    console.log(`  3. Visit: http://localhost:8080/${pageSlug}/`);
    console.log('');

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main();
