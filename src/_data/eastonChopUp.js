/**
 * Mixcloud Playlist Data: easton-chop-up
 *
 * Fetches cloudcasts from the "easton-chop-up" playlist
 * at build time via Mixcloud API
 */

export default async function() {
  const MIXCLOUD_USERNAME = "legendarymusic";
  const PLAYLIST_SLUG = "easton-chop-up";
  const API_BASE_URL = "https://api.mixcloud.com";

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

  try {
    const cloudcasts = await fetchPlaylistCloudcasts(MIXCLOUD_USERNAME, PLAYLIST_SLUG);

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
