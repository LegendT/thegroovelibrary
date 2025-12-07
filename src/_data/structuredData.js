/**
 * Structured Data (Schema.org JSON-LD) Generator
 * Provides structured data for search engines and LLMs
 * @see https://schema.org/
 */

/**
 * Generate WebSite schema
 * @param {string} url - Site URL
 * @returns {object} WebSite schema
 */
function generateWebSiteSchema(url = 'https://thegroovelibrary.net') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url: url,
    name: 'The Groove Library',
    description: 'A vibrant showcase of global music from Mixcloud - featuring legendary mixes from around the world.',
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      '@id': `${url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Organization schema
 * @param {string} url - Site URL
 * @returns {object} Organization schema
 */
function generateOrganizationSchema(url = 'https://thegroovelibrary.net') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name: 'The Groove Library',
    url: url,
    logo: {
      '@type': 'ImageObject',
      url: `${url}/assets/logo.svg`,
      width: '512',
      height: '512',
    },
    image: {
      '@type': 'ImageObject',
      url: `${url}/assets/og-default.jpg`,
      width: '1200',
      height: '630',
    },
    description: 'The Groove Library exists to explore rhythm as a global language. Curating music from around the world through DJ mixes, live streams, and communal listening parties.',
    email: 'legendarytone@gmail.com',
    sameAs: [
      'https://www.mixcloud.com/legendarymusic/',
    ],
    founder: {
      '@type': 'Person',
      name: 'Anthony George',
    },
  };
}

/**
 * Generate BreadcrumbList schema
 * @param {Array} breadcrumbs - Array of breadcrumb items
 * @param {string} baseUrl - Base URL
 * @returns {object} BreadcrumbList schema
 */
function generateBreadcrumbSchema(breadcrumbs, baseUrl = 'https://thegroovelibrary.net') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${baseUrl}${crumb.url}`,
    })),
  };
}

/**
 * Generate MusicPlaylist schema
 * @param {object} playlist - Playlist data
 * @param {string} pageUrl - Page URL
 * @returns {object} MusicPlaylist schema
 */
function generateMusicPlaylistSchema(playlist, pageUrl) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MusicPlaylist',
    '@id': pageUrl,
    name: playlist.name,
    description: playlist.description,
    url: pageUrl,
    numTracks: playlist.cloudcasts?.length || 0,
  };

  // Add tracks if available
  if (playlist.cloudcasts && playlist.cloudcasts.length > 0) {
    schema.track = playlist.cloudcasts.slice(0, 20).map((cloudcast) => {
      const trackSchema = {
        '@type': 'MusicRecording',
        name: cloudcast.name,
        url: cloudcast.url,
        datePublished: cloudcast.created_time,
        duration: cloudcast.audio_length ? `PT${cloudcast.audio_length}S` : undefined,
        image: cloudcast.pictures?.large || cloudcast.pictures?.['640wx640h'],
      };

      // Add creator/artist if available
      if (cloudcast.owner) {
        trackSchema.byArtist = {
          '@type': 'MusicGroup',
          name: cloudcast.owner.name,
          url: cloudcast.owner.url,
        };
      }

      // Add genre tags if available
      if (cloudcast.tags && cloudcast.tags.length > 0) {
        trackSchema.genre = cloudcast.tags.map(tag => tag.name);
      }

      return trackSchema;
    });
  }

  return schema;
}

/**
 * Generate CollectionPage schema for homepage
 * @param {object} data - Homepage data
 * @param {string} pageUrl - Page URL
 * @returns {object} CollectionPage schema
 */
function generateCollectionPageSchema(data, pageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': pageUrl,
    name: 'The Groove Library - Home',
    description: 'The Groove Library exists to explore rhythm as a global language.',
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: data.cloudcasts?.length || 0,
      itemListElement: (data.cloudcasts || []).slice(0, 10).map((cloudcast, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: cloudcast.url,
        name: cloudcast.name,
      })),
    },
  };
}

/**
 * Get all schemas for a page
 * @param {object} options - Page options
 * @returns {Array} Array of schemas
 */
function getSchemasForPage(options) {
  const {
    pageType = 'default',
    pageUrl = 'https://thegroovelibrary.net/',
    pageTitle,
    breadcrumbs,
    playlistData,
    collectionData,
  } = options;

  const schemas = [];

  // Always include WebSite and Organization on all pages
  schemas.push(generateWebSiteSchema());
  schemas.push(generateOrganizationSchema());

  // Add BreadcrumbList if breadcrumbs provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  // Add page-specific schemas
  switch (pageType) {
    case 'home':
      if (collectionData) {
        schemas.push(generateCollectionPageSchema(collectionData, pageUrl));
      }
      break;

    case 'playlist':
      if (playlistData) {
        schemas.push(generateMusicPlaylistSchema(playlistData, pageUrl));
      }
      break;

    default:
      // No additional schemas for default pages
      break;
  }

  return schemas;
}

/**
 * Convert schemas to JSON-LD script tags
 * @param {Array} schemas - Array of schema objects
 * @returns {string} HTML script tags
 */
function toJSONLD(schemas) {
  if (!Array.isArray(schemas)) {
    schemas = [schemas];
  }

  return schemas
    .map(schema => {
      const jsonString = JSON.stringify(schema, null, 0);
      return `<script type="application/ld+json">${jsonString}</script>`;
    })
    .join('\n  ');
}

export default {
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateMusicPlaylistSchema,
  generateCollectionPageSchema,
  getSchemasForPage,
  toJSONLD,
};
