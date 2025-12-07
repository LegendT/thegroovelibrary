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
 * Create page file
 */
function createPageFile(pageSlug, playlistName, dataVarName, pageDescription) {
  // Indent description content properly for YAML block scalar
  const indentedDescription = pageDescription
    .split('\n')
    .map(line => line.trim() ? `  ${line}` : '')
    .join('\n');

  const pageContent = `---
layout: base.njk
title: "${playlistName} | The Groove Library"
description: >
${indentedDescription}
playlist: "${pageSlug}"
---

<div class="hero">
  <div class="container">
    <h1 class="hero__title">${playlistName}</h1>
  </div>
</div>

<main class="container flow">
  {# Description #}
  {% if description %}
    <div class="wrapper wrapper--narrow flow">
      {{ description | safe }}
    </div>
  {% endif %}

  {# Mix Grid #}
  {% if ${dataVarName}.cloudcasts.length > 0 %}
    <div class="mix-grid">
      {% for mix in ${dataVarName}.cloudcasts %}
        {% include "mix-player.njk" %}
      {% endfor %}
    </div>
  {% else %}
    <p class="text-center">No mixes found in this playlist.</p>
  {% endif %}
</main>
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
    const pageDescription = await question(`\nEnter page description (default: ${defaultDescription}): `) || defaultDescription;

    console.log(`\n✓ Creating page with slug: ${pageSlug}`);

    // 6. Convert page slug to camelCase for data variable name
    const dataVarName = slugToCamelCase(pageSlug);
    console.log(`✓ Data variable name: ${dataVarName}`);

    // 7. Create files
    createPageFile(pageSlug, playlistData.name, dataVarName, pageDescription);
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
