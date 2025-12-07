/**
 * Quick script to list Easton Chop Up mixes
 */

const MIXCLOUD_USERNAME = "legendarymusic";
const PLAYLIST_SLUG = "easton-chop-up";
const API_BASE_URL = "https://api.mixcloud.com";

async function fetchPlaylistCloudcasts() {
  const cloudcasts = [];
  let url = `${API_BASE_URL}/${MIXCLOUD_USERNAME}/playlists/${PLAYLIST_SLUG}/cloudcasts/`;

  while (url) {
    const response = await fetch(url);
    const data = await response.json();

    if (data.data) {
      cloudcasts.push(...data.data);
    }

    url = data.paging?.next || null;
  }

  return cloudcasts;
}

const cloudcasts = await fetchPlaylistCloudcasts();

console.log(`\n=== Easton Chop Up Mixes (${cloudcasts.length} total) ===\n`);

cloudcasts.forEach((mix, index) => {
  const slug = mix.key.replace(/^\//, '').replace(/\/$/, '');
  console.log(`${index + 1}. ${mix.name}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   URL: ${mix.url}`);
  console.log('');
});
