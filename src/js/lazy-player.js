/**
 * Lazy Player - Click-to-load Mixcloud iframes
 * Improves initial page load performance by deferring iframe loading
 * until user interaction. Converts cover image into player on click.
 * Only one player can play at a time - clicking a new one stops others.
 */

document.addEventListener('DOMContentLoaded', () => {
  const lazyPlayers = document.querySelectorAll('.mix-player__media-wrapper[data-src]');
  const activeIframes = new Map(); // Change to Map to store original HTML

  function attachClickHandler(wrapper) {
    const playButton = wrapper.querySelector('.mix-player__play-overlay');
    if (!playButton) return;

    playButton.addEventListener('click', () => {
      // Stop all other players by restoring their cover images
      activeIframes.forEach((originalHTML, activeWrapper) => {
        if (activeWrapper !== wrapper) {
          // Restore original cover with play overlay
          activeWrapper.innerHTML = originalHTML;
          activeWrapper.classList.remove('player-loaded');
          activeIframes.delete(activeWrapper);

          // Re-attach click handler to restored button
          attachClickHandler(activeWrapper);
        }
      });

      // Store original HTML before replacing
      const originalHTML = wrapper.innerHTML;

      // Add loading state
      wrapper.classList.add('loading');

      const iframe = document.createElement('iframe');
      const src = wrapper.dataset.src;

      // Add autoplay parameter to the URL
      const autoplaySrc = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';

      // Set iframe attributes
      iframe.className = 'mix-player__iframe';
      iframe.width = '100%';
      iframe.height = '640';
      iframe.src = autoplaySrc;
      iframe.frameBorder = '0';
      iframe.allow = 'autoplay; encrypted-media';
      iframe.title = wrapper.dataset.title || 'Mixcloud player';
      iframe.setAttribute('aria-label', wrapper.dataset.ariaLabel || 'Audio player');

      // Remove loading state when iframe loads
      iframe.addEventListener('load', () => {
        wrapper.classList.remove('loading');
      });

      // Replace cover with iframe in a container
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'widget-container';
      widgetContainer.appendChild(iframe);

      wrapper.innerHTML = '';
      wrapper.classList.add('player-loaded');
      wrapper.appendChild(widgetContainer);

      // Store wrapper and its original HTML in active iframes map
      activeIframes.set(wrapper, originalHTML);
    });
  }

  // Initialize all players with click handlers
  lazyPlayers.forEach((wrapper) => {
    attachClickHandler(wrapper);
  });
});
