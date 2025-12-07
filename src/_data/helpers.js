/**
 * Template Helper Functions
 *
 * Utility functions available globally in templates
 * as {{ helpers.functionName() }}
 */

export default {
  /**
   * Get current year for copyright notices
   * @returns {number}
   */
  currentYear() {
    return new Date().getFullYear();
  },

  /**
   * Format a date string to a readable format
   * @param {string} dateString - ISO date string
   * @returns {string}
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Format duration from seconds to human-readable format
   * @param {number} seconds
   * @returns {string}
   */
  formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  },

  /**
   * Truncate text to specified length
   * @param {string} text
   * @param {number} length
   * @returns {string}
   */
  truncate(text, length = 150) {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  },

  /**
   * Generate Mixcloud embed URL from cloudcast key
   * @param {string} key - Mixcloud cloudcast key
   * @returns {string}
   */
  getMixcloudEmbedUrl(key) {
    // Remove leading slash if present
    const cleanKey = key.startsWith('/') ? key.substring(1) : key;
    return `https://player.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent('/' + cleanKey)}`;
  },

  /**
   * Check if array has items
   * @param {Array} arr
   * @returns {boolean}
   */
  hasItems(arr) {
    return Array.isArray(arr) && arr.length > 0;
  }
};
