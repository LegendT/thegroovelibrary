/**
 * Mixcloud API Data Fetcher
 *
 * Fetches cloudcasts (mixes/shows) from Mixcloud API at build time.
 * This data becomes available globally in templates as {{ mixcloud }}.
 *
 * Rate limiting is handled with exponential backoff retry logic.
 * Pagination is supported to fetch all available cloudcasts.
 *
 * @see https://www.mixcloud.com/developers/
 */

const MIXCLOUD_USERNAME = 'legendarymusic';
const API_BASE = 'https://api.mixcloud.com';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

/**
 * Fetch with retry logic for rate limiting
 *
 * @param {string} url - The URL to fetch
 * @param {number} retryCount - Current retry attempt
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, retryCount = 0) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle rate limiting
      if (errorData.error?.type === 'RateLimited' && retryCount < MAX_RETRIES) {
        const retryAfter = errorData.error.retry_after || Math.pow(2, retryCount);
        const delay = retryAfter * 1000;

        console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));

        return fetchWithRetry(url, retryCount + 1);
      }

      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || response.statusText}`);
    }

    return response;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Fetch failed. Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, retryCount + 1);
    }
    throw error;
  }
}

/**
 * Fetch all cloudcasts with pagination support
 *
 * @param {string} username - Mixcloud username
 * @returns {Promise<Array>} Array of cloudcast objects
 */
async function fetchAllCloudcasts(username) {
  const cloudcasts = [];
  let nextUrl = `${API_BASE}/${username}/cloudcasts/?limit=100`;

  console.log(`Fetching cloudcasts for ${username}...`);

  while (nextUrl) {
    const response = await fetchWithRetry(nextUrl);
    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      cloudcasts.push(...data.data);
      console.log(`Fetched ${data.data.length} cloudcasts (total: ${cloudcasts.length})`);
    }

    // Check for next page
    nextUrl = data.paging?.next || null;
  }

  return cloudcasts;
}

/**
 * Fetch user profile information
 *
 * @param {string} username - Mixcloud username
 * @returns {Promise<Object>} User profile object
 */
async function fetchUserProfile(username) {
  const response = await fetchWithRetry(`${API_BASE}/${username}/`);
  return response.json();
}

/**
 * Main export function for Eleventy global data
 *
 * @returns {Promise<Object>} Mixcloud data object
 */
export default async function() {
  try {
    // Fetch user profile and cloudcasts in parallel
    const [profile, cloudcasts] = await Promise.all([
      fetchUserProfile(MIXCLOUD_USERNAME),
      fetchAllCloudcasts(MIXCLOUD_USERNAME)
    ]);

    console.log(`✓ Successfully fetched ${cloudcasts.length} cloudcasts from ${MIXCLOUD_USERNAME}`);

    return {
      username: MIXCLOUD_USERNAME,
      profile,
      cloudcasts,
      fetchedAt: new Date().toISOString(),
      count: cloudcasts.length
    };
  } catch (error) {
    console.error('Error fetching Mixcloud data:', error);

    // Return empty data structure on error to prevent build failure
    return {
      username: MIXCLOUD_USERNAME,
      profile: null,
      cloudcasts: [],
      error: error.message,
      fetchedAt: new Date().toISOString(),
      count: 0
    };
  }
}
