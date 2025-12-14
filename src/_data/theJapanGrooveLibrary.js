/**
 * Mixcloud Playlist Data: theJapanGrooveLibrary
 *
 * Fetches cloudcasts from the "the-japan-groove-library" playlist
 * at build time via Mixcloud API and merges with manual tracklist data
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function() {
  const MIXCLOUD_USERNAME = "legendarymusic";
  const PLAYLIST_SLUG = "the-japan-groove-library";
  const API_BASE_URL = "https://api.mixcloud.com";

  // Load manual tracklists
  let manualTracklists = {};
  try {
    const tracklistsPath = resolve(__dirname, 'tracklists.json');
    const tracklistsData = readFileSync(tracklistsPath, 'utf-8');
    manualTracklists = JSON.parse(tracklistsData);
  } catch (error) {
    console.warn('No manual tracklists file found or error reading it:', error.message);
  }

  /**
   * Fetch with retry logic
   */
  async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url);

        if (response.status === 429) {
          console.warn(`Rate limited, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (i === retries - 1) throw error;
        console.warn(`Fetch failed, retrying... (${i + 1}/${retries})`);
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
    let url = `${API_BASE_URL}/${username}/playlists/${playlistSlug}/cloudcasts/`;
    let pageCount = 0;

    console.log(`Fetching cloudcasts from playlist: ${playlistSlug}...`);

    while (url && pageCount < 100) { // Safety limit
      const data = await fetchWithRetry(url);

      if (data.data) {
        cloudcasts.push(...data.data);
        console.log(`Fetched ${data.data.length} cloudcasts (total: ${cloudcasts.length})`);
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

  /**
   * Merge manual tracklist data with cloudcasts
   */
  function mergeTracklists(cloudcasts) {
    return cloudcasts.map(cloudcast => {
      // Extract the slug from the cloudcast key (e.g., "/username/slug/" -> "username/slug")
      const slug = cloudcast.key.replace(/^\//, '').replace(/\/$/, '');

      // Check if we have manual tracklist data for this cloudcast
      if (manualTracklists[slug]) {
        console.log(`  ✓ Adding manual tracklist for: ${cloudcast.name} (${manualTracklists[slug].length} tracks)`);

        // Convert manual format to API format
        const sections = manualTracklists[slug].map(track => ({
          section_type: 'track',
          position: track.position,
          track: {
            artist: track.artist,
            name: track.track
          },
          start_time: track.start_time || null
        }));

        return {
          ...cloudcast,
          sections
        };
      }

      return cloudcast;
    });
  }

  try {
    let cloudcasts = await fetchPlaylistCloudcasts(MIXCLOUD_USERNAME, PLAYLIST_SLUG);

    // Merge manual tracklists
    cloudcasts = mergeTracklists(cloudcasts);

    console.log(`✓ Successfully fetched ${cloudcasts.length} cloudcasts from ${PLAYLIST_SLUG}`);

    return {
      playlistSlug: PLAYLIST_SLUG,
      cloudcasts,
      count: cloudcasts.length,
      fetchedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error fetching playlist data for ${PLAYLIST_SLUG}:`, error);
    return {
      playlistSlug: PLAYLIST_SLUG,
      cloudcasts: [],
      count: 0,
      error: error.message,
      fetchedAt: new Date().toISOString()
    };
  }
}
